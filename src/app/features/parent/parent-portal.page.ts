import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { extractData, extractList } from '../../core/api.helpers';
import { Bus, Student } from '../../core/models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-parent-portal-page',
  template: `
    <section class="stack-lg">
      <article class="card">
        <div class="panel-header">
          <h3>Parent Portal</h3>
          <p>Children, bus assignments, route and location updates</p>
        </div>

        <div class="inline-actions" style="margin-bottom: 1rem;">
          <button class="btn btn-primary" type="button" [disabled]="true" (click)="onAddUser()">
            Add User
          </button>
          <button class="btn btn-muted" type="button" [disabled]="true" (click)="onAddStudent()">
            Add Student
          </button>
        </div>
        <p class="panel-note">Add User and Add Student are disabled for Parent role.</p>

        <div class="table-wrap">
          <table>
            <thead><tr><th>Child</th><th>Grade</th><th>Action</th></tr></thead>
            <tbody>
              @for (child of children(); track child.id) {
                <tr>
                  <td>{{ child.firstName }} {{ child.lastName }}</td>
                  <td>{{ child.gradeLevel ?? '-' }}</td>
                  <td>
                    <button class="btn btn-muted" type="button" (click)="selectChild(child)">View Bus</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="3">No linked children found.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </article>

      <article class="card">
        <h3>Selected Child Bus Details</h3>
        @if (selectedChild()) {
          <p><strong>Child:</strong> {{ selectedChild()?.firstName }} {{ selectedChild()?.lastName }}</p>
          <p><strong>Bus:</strong> {{ selectedBus()?.busNumber ?? 'Not assigned' }}</p>
          <p><strong>Driver:</strong> {{ selectedBus()?.driverName ?? '-' }}</p>
          <p><strong>Current Location:</strong> {{ locationSummary() }}</p>
          <p><strong>Route Summary:</strong> {{ routeSummary() }}</p>
        } @else {
          <p>Select a child to view assignment and live tracking details.</p>
        }
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentPortalPage {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly children = signal<Student[]>([]);
  readonly selectedChild = signal<Student | null>(null);
  readonly selectedBus = signal<Bus | null>(null);
  readonly location = signal<Record<string, unknown> | null>(null);
  readonly route = signal<Record<string, unknown> | null>(null);

  readonly locationSummary = computed(() => {
    const location = this.location();
    if (!location) {
      return 'Unavailable';
    }
    const latitude = location['latitude'];
    const longitude = location['longitude'];
    return latitude && longitude ? `${latitude}, ${longitude}` : 'Available';
  });

  readonly routeSummary = computed(() => {
    const route = this.route();
    if (!route) {
      return 'Unavailable';
    }
    return `${route['routeName'] ?? 'Route loaded'}`;
  });

  constructor() {
    this.api.parentStudents().subscribe({
      next: (response) => this.children.set(extractList<Student>(response)),
      error: () => this.children.set([])
    });
  }

  selectChild(child: Student): void {
    this.selectedChild.set(child);

    this.api.parentStudentBus(child.id).subscribe({
      next: (response) => {
        const bus = extractData<Bus>(response);
        this.selectedBus.set(bus);
        this.api.parentBusLocation(bus.id).subscribe({
          next: (locationResponse) => this.location.set(extractData<Record<string, unknown>>(locationResponse)),
          error: () => this.location.set(null)
        });
        this.api.parentBusRoute(bus.id).subscribe({
          next: (routeResponse) => this.route.set(extractData<Record<string, unknown>>(routeResponse)),
          error: () => this.route.set(null)
        });
      },
      error: () => {
        this.selectedBus.set(null);
        this.location.set(null);
        this.route.set(null);
      }
    });
  }

  onAddUser(): void {
    this.toast.show('Not allowed', 'Add User is disabled for Parent role.', 'warning');
  }

  onAddStudent(): void {
    this.toast.show('Not allowed', 'Add Student is disabled for Parent role.', 'warning');
  }
}
