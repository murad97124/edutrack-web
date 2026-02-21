import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toast-host',
  template: `
    <section class="toast-host" aria-live="polite" aria-atomic="true">
      @for (toast of toastService.toasts(); track toast.id) {
        <article class="toast-card" [class.toast-success]="toast.variant === 'success'" [class.toast-error]="toast.variant === 'error'" [class.toast-info]="toast.variant === 'info'" [class.toast-warning]="toast.variant === 'warning'" role="status">
          <div class="toast-header">
            <strong>{{ toast.title }}</strong>
            <button type="button" (click)="toastService.dismiss(toast.id)" aria-label="Close notification">
              ×
            </button>
          </div>
          <p>{{ toast.message }}</p>
        </article>
      }
    </section>
  `,
  styles: [
    `
      .toast-host {
        position: fixed;
        right: 1.25rem;
        bottom: 1.25rem;
        z-index: 1000;
        display: grid;
        gap: 0.75rem;
        width: min(26rem, calc(100vw - 2rem));
        pointer-events: none;
      }

      .toast-card {
        pointer-events: auto;
        border-radius: 0.9rem;
        border: 1px solid #d7dfef;
        background: linear-gradient(145deg, #ffffff 0%, #f4f7fc 100%);
        box-shadow: 0 20px 40px rgb(15 23 42 / 0.14);
        padding: 0.9rem 1rem;
        color: #1e293b;
      }

      .toast-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.25rem;
      }

      .toast-header strong {
        font-size: 0.94rem;
      }

      .toast-header button {
        width: 1.5rem;
        height: 1.5rem;
        border: none;
        border-radius: 999px;
        cursor: pointer;
        background: #e6ecf7;
        color: #334155;
      }

      .toast-card p {
        margin: 0;
        font-size: 0.86rem;
        line-height: 1.4;
      }

      .toast-success {
        border-left: 4px solid #2563eb;
      }

      .toast-error {
        border-left: 4px solid #ef4444;
      }

      .toast-info {
        border-left: 4px solid #334155;
      }

      .toast-warning {
        border-left: 4px solid #f59e0b;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastHostComponent {
  readonly toastService = inject(ToastService);
}
