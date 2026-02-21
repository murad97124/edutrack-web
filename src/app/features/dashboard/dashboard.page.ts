import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthStore } from '../../core/auth.store';
import { extractData } from '../../core/api.helpers';
import { ToastService } from '../../core/toast.service';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, TranslatePipe],
  template: `
    <section class="stack-lg">
      <div class="panel-header">
        <h3>{{ 'Overview' | t }}</h3>
        <p>{{ 'School operations at a glance' | t }}</p>
      </div>

      <div class="cards-grid">
        @for (metric of metrics(); track metric.key) {
          <article class="card metric-card">
            <h4>{{ metric.label }}</h4>
            <p>{{ metric.value }}</p>
          </article>
        }
      </div>

      <article class="card">
        <h3>{{ 'Quick Actions' | t }}</h3>
        <div class="inline-actions">
          <button class="btn btn-primary" type="button" [disabled]="!canUseAddUser()" (click)="goToUsers()">
            {{ 'Add User' | t }}
          </button>
          <button
            class="btn btn-muted"
            type="button"
            [disabled]="!canUseAddStudent()"
            (click)="goToStudents()"
          >
            {{ 'Add Student' | t }}
          </button>
          <a class="btn btn-muted" routerLink="/messages">{{ 'Send Message' | t }}</a>
        </div>
        @if (isParent() || isTeacher()) {
          <p class="panel-note">{{ (isTeacher() ? 'Add User and Add Student are unavailable for the Teacher role.' : 'Add User and Add Student are unavailable for the Parent role.') | t }}</p>
        }
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage {
  private readonly api = inject(ApiService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly dashboardData = signal<Record<string, number>>({});
  readonly isParent = computed(() => this.authStore.role() === 'PARENT');
  readonly isTeacher = computed(() => this.authStore.role() === 'TEACHER');
  readonly canUseAddUser = computed(() => !this.isParent() && !this.isTeacher());
  readonly canUseAddStudent = computed(() => !this.isParent() && !this.isTeacher());

  readonly metrics = computed(() =>
    Object.entries(this.dashboardData()).map(([key, value]) => ({
      key,
      value,
      label: formatMetricLabel(key)
    }))
  );

  constructor() {
    const role = this.authStore.role();
    const source$ = role === 'PARENT' ? this.api.parentDashboard() : this.api.schoolDashboard();
    source$.subscribe({
      next: (response) => this.dashboardData.set(extractData<Record<string, number>>(response)),
      error: () => this.dashboardData.set({})
    });
  }

  goToUsers(): void {
    if (this.isParent() || this.isTeacher()) {
      this.toast.show(
        'Not allowed',
        this.isTeacher()
          ? 'Add User is not available for Teacher role.'
          : 'Add User is not available for Parent role.',
        'warning'
      );
      return;
    }

    this.router.navigateByUrl('/users');
  }

  goToStudents(): void {
    if (this.isParent() || this.isTeacher()) {
      this.toast.show(
        'Not allowed',
        this.isTeacher()
          ? 'Add Student is not available for Teacher role.'
          : 'Add Student is not available for Parent role.',
        'warning'
      );
      return;
    }

    this.router.navigateByUrl('/students');
  }
}

function formatMetricLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (value) => value.toUpperCase())
    .trim();
}
