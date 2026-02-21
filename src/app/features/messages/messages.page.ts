import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { AuthStore } from '../../core/auth.store';
import { extractList } from '../../core/api.helpers';
import { MessageItem } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  selector: 'app-messages-page',
  imports: [ReactiveFormsModule, TranslatePipe],
  template: `
    <section class="stack-lg">
      <article class="card">
        <div class="panel-header">
          <h3>{{ 'Compose Message' | t }}</h3>
          <p>{{ 'Send direct messages to users in your school' | t }}</p>
        </div>

        @if (canSendMessage()) {
          <form [formGroup]="form" (ngSubmit)="sendMessage()" class="form-grid form-grid-2">
            <label>
              {{ 'Subject' | t }}
              <input type="text" formControlName="subject" />
            </label>
            <label>
              {{ 'Recipient IDs (comma-separated)' | t }}
              <input type="text" formControlName="recipientUserIds" [placeholder]="'id-1,id-2'" />
            </label>
            <label class="full-width">
              {{ 'Message' | t }}
              <textarea rows="5" formControlName="content"></textarea>
            </label>
            <div>
              <button class="btn btn-primary" type="submit" [disabled]="form.invalid">
                {{ 'Send Message' | t }}
              </button>
            </div>
          </form>
        } @else {
          <p class="panel-note">{{ 'This role can receive and read messages but cannot send new messages.' | t }}</p>
        }
      </article>

      <article class="card">
        <div class="table-header">
          <h3>{{ 'Inbox' | t }}</h3>
          <button class="btn btn-muted" type="button" (click)="loadInbox()">{{ 'Refresh' | t }}</button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ 'Subject' | t }}</th>
                <th>{{ 'Message' | t }}</th>
                <th>{{ 'Date' | t }}</th>
              </tr>
            </thead>
            <tbody>
              @for (message of messages(); track message.id) {
                <tr>
                  <td>{{ message.subject }}</td>
                  <td>{{ message.content ?? message.body ?? '-' }}</td>
                  <td>{{ message.createdAt ?? '-' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="3">{{ 'No messages found.' | t }}</td>
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
export class MessagesPage {
  private readonly api = inject(ApiService);
  private readonly authStore = inject(AuthStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly messages = signal<MessageItem[]>([]);
  readonly canSendMessage = computed(() =>
    this.authStore.hasRole(['PRINCIPAL', 'ASSISTANT_PRINCIPAL', 'TEACHER'])
  );

  readonly form = this.formBuilder.nonNullable.group({
    subject: ['', [Validators.required]],
    content: ['', [Validators.required]],
    recipientUserIds: ['', [Validators.required]]
  });

  constructor() {
    this.loadInbox();
  }

  loadInbox(): void {
    this.api.listInboxMessages({ page: 0, size: 20 }).subscribe({
      next: (response) => this.messages.set(extractList<MessageItem>(response)),
      error: () => this.messages.set([])
    });
  }

  sendMessage(): void {
    if (this.form.invalid || !this.canSendMessage()) {
      return;
    }

    const formValue = this.form.getRawValue();
    const subject = formValue.subject.trim();
    const body = formValue.content.trim();
    const recipientUserIds = formValue.recipientUserIds
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) => {
        const numericValue = Number(item);
        return Number.isFinite(numericValue) && item !== '' ? numericValue : item;
      });

    if (!body || recipientUserIds.length === 0) {
      this.toast.show(
        'Invalid message',
        'Message body and at least one recipient are required.',
        'warning'
      );
      return;
    }

    this.api
      .createMessage({
        subject,
        body,
        recipientIds: recipientUserIds,
        priority: 'NORMAL',
        messageType: 'DIRECT'
      })
      .subscribe({
        next: () => {
          this.toast.show('Message sent', 'Your message was delivered to recipients.', 'success');
          this.form.reset({ subject: '', content: '', recipientUserIds: '' });
          this.loadInbox();
        }
      });
  }
}
