import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { TranslatePipe } from './translate.pipe';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  template: `
    <div class="language-switcher" role="group" [attr.aria-label]="'Language' | t">
      <button
        class="btn btn-muted"
        type="button"
        [class.active]="i18n.language() === 'en'"
        (click)="i18n.setLanguage('en')"
      >
        {{ 'English' | t }}
      </button>
      <button
        class="btn btn-muted"
        type="button"
        [class.active]="i18n.language() === 'ar'"
        (click)="i18n.setLanguage('ar')"
      >
        {{ 'Arabic' | t }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent {
  readonly i18n = inject(I18nService);
}
