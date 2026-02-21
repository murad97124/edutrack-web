import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { extractData, extractList } from '../../core/api.helpers';
import { AuthUser, MessageItem, NotificationItem } from '../../core/models';

@Component({
  selector: 'app-student-portal-page',
  template: `
    <section class="stack-lg">
      <article class="card">
        <h3>Student Portal</h3>
        <p>Personal information, announcements, and inbox updates</p>
        <p><strong>Name:</strong> {{ profile()?.firstName }} {{ profile()?.lastName }}</p>
        <p><strong>Email:</strong> {{ profile()?.email }}</p>
      </article>

      <article class="card">
        <h3>Recent Notifications</h3>
        <ul>
          @for (item of notifications(); track item.id) {
            <li>{{ item.title }} - {{ item.message }}</li>
          } @empty {
            <li>No notifications yet.</li>
          }
        </ul>
      </article>

      <article class="card">
        <h3>Inbox</h3>
        <ul>
          @for (item of messages(); track item.id) {
            <li>{{ item.subject }} - {{ item.content ?? item.body ?? '-' }}</li>
          } @empty {
            <li>No inbox messages available.</li>
          }
        </ul>
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentPortalPage {
  private readonly api = inject(ApiService);

  readonly profile = signal<AuthUser | null>(null);
  readonly notifications = signal<NotificationItem[]>([]);
  readonly messages = signal<MessageItem[]>([]);

  constructor() {
    this.api.getMyProfile().subscribe({
      next: (response) => this.profile.set(extractData<AuthUser>(response)),
      error: () => this.profile.set(null)
    });

    this.api.listNotifications({ page: 0, size: 10 }).subscribe({
      next: (response) => this.notifications.set(extractList<NotificationItem>(response)),
      error: () => this.notifications.set([])
    });

    this.api.listInboxMessages({ page: 0, size: 10 }).subscribe({
      next: (response) => this.messages.set(extractList<MessageItem>(response)),
      error: () => this.messages.set([])
    });
  }
}
