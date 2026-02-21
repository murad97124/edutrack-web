import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AR_TRANSLATIONS } from './i18n.translations';

export type AppLanguage = 'en' | 'ar';

const LANGUAGE_KEY = 'edutrack.language';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);

  readonly language = signal<AppLanguage>(this.getInitialLanguage());
  readonly isArabic = computed(() => this.language() === 'ar');
  readonly direction = computed(() => (this.isArabic() ? 'rtl' : 'ltr'));

  constructor() {
    effect(() => {
      const lang = this.language();
      const isArabic = lang === 'ar';

      this.document.documentElement.lang = lang;
      this.document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      this.document.documentElement.classList.toggle('app-rtl', isArabic);
      this.document.body?.classList.toggle('app-rtl', isArabic);

      localStorage.setItem(LANGUAGE_KEY, lang);
    });
  }

  setLanguage(language: AppLanguage): void {
    this.language.set(language);
  }

  toggleLanguage(): void {
    this.language.update((currentLanguage) => (currentLanguage === 'en' ? 'ar' : 'en'));
  }

  translate(value: string): string {
    if (this.language() === 'en') {
      return value;
    }

    return AR_TRANSLATIONS[value] ?? value;
  }

  private getInitialLanguage(): AppLanguage {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage === 'en' || savedLanguage === 'ar') {
      return savedLanguage;
    }

    const browserLang = this.document.defaultView?.navigator.language?.toLowerCase() ?? '';
    return browserLang.startsWith('ar') ? 'ar' : 'en';
  }
}
