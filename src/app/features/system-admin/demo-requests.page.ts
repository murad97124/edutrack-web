import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { extractData, extractList } from '../../core/api.helpers';
import { DemoRequestItem } from '../../core/models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-demo-requests-page',
  template: `
    <section class="stack-lg">
      <article class="card">
        <div class="panel-header">
          <h3>Demo Requests</h3>
          <p>Monitor and process all inbound sales/demo requests</p>
        </div>

        <div class="cards-grid">
          @for (metric of statsList(); track metric.label) {
            <article class="metric-card card">
              <h4>{{ metric.label }}</h4>
              <p>{{ metric.value }}</p>
            </article>
          }
        </div>
      </article>

      <article class="card">
        <div class="table-header">
          <h3>Requests</h3>
          <button class="btn btn-muted" type="button" (click)="load()">Refresh</button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Request ID</th><th>School</th><th>Contact</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              @for (item of requests(); track item.id) {
                <tr>
                  <td>{{ item.requestId ?? item.id }}</td>
                  <td>{{ item.schoolName }}</td>
                  <td>{{ item.contactName }} ({{ item.email }})</td>
                  <td>{{ item.status ?? 'PENDING' }}</td>
                  <td>
                    <button class="btn btn-muted" type="button" (click)="markScheduled(item.id)">
                      Mark Scheduled
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="5">No demo requests found.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoRequestsPage {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly requests = signal<DemoRequestItem[]>([]);
  readonly stats = signal<Record<string, number>>({});

  readonly statsList = computed(() =>
    Object.entries(this.stats()).map(([key, value]) => ({
      label: key,
      value
    }))
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.api.listDemoRequests({ page: 0, size: 20 }).subscribe({
      next: (response) => this.requests.set(extractList<DemoRequestItem>(response)),
      error: () => this.requests.set([])
    });

    this.api.demoRequestStats().subscribe({
      next: (response) => this.stats.set(extractData<Record<string, number>>(response)),
      error: () => this.stats.set({})
    });
  }

  markScheduled(id: string | number): void {
    this.api.updateDemoRequestStatus(id, 'SCHEDULED').subscribe({
      next: () => {
        this.toast.show('Request updated', 'Demo request status changed to SCHEDULED.', 'success');
        this.load();
      }
    });
  }
}
