import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { extractList } from '../../core/api.helpers';
import { NotificationItem } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  selector: 'app-notifications-page',
  imports: [TranslatePipe],
  template: `
    <section class="stack-lg">
      <article class="card">
        <div class="table-header">
          <h3>{{ 'Notifications' | t }}</h3>
          <button class="btn btn-muted" type="button" (click)="loadNotifications()">{{ 'Refresh' | t }}</button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ 'Title' | t }}</th>
                <th>{{ 'Message' | t }}</th>
                <th>{{ 'Status' | t }}</th>
                <th>{{ 'Action' | t }}</th>
              </tr>
            </thead>
            <tbody>
              @for (item of notifications(); track item.id) {
                <tr>
                  <td>{{ item.title }}</td>
                  <td>{{ item.message }}</td>
                  <td>{{ (item.read ? 'Read' : 'Unread') | t }}</td>
                  <td>
                    <button class="btn btn-muted" type="button" (click)="markRead(item.id)">
                      {{ 'Mark as Read' | t }}
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4">{{ 'No notifications found.' | t }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsPage {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly notifications = signal<NotificationItem[]>([]);

  constructor() {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.api.listNotifications({ page: 0, size: 20 }).subscribe({
      next: (response) => this.notifications.set(extractList<NotificationItem>(response)),
      error: () => this.notifications.set([])
    });
  }

  markRead(id: string): void {
    this.api.markNotificationRead(id).subscribe({
      next: () => {
        this.toast.show('Notification updated', 'Marked as read.', 'success');
        this.loadNotifications();
      }
    });
  }
}
