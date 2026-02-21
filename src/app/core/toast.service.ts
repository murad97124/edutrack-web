import { Injectable, computed, inject, signal } from '@angular/core';
import { I18nService } from './i18n.service';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  variant: ToastVariant;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly i18n = inject(I18nService);
  private readonly items = signal<ToastMessage[]>([]);
  readonly toasts = computed(() => this.items());

  show(title: string, message: string, variant: ToastVariant = 'info', durationMs = 4200): void {
    const id = crypto.randomUUID();
    this.items.update((current) => [
      ...current,
      {
        id,
        title: this.i18n.translate(title),
        message: this.i18n.translate(message),
        variant
      }
    ]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  dismiss(id: string): void {
    this.items.update((current) => current.filter((item) => item.id !== id));
  }
}
