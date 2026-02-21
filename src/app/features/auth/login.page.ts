import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../../core/auth.store';
import { LanguageSwitcherComponent } from '../../shared/language-switcher.component';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, LanguageSwitcherComponent, TranslatePipe],
  template: `
    <div class="auth-page">
      <section class="auth-card card">
        <div class="auth-header">
          <h1>{{ 'EduTrack 360' | t }}</h1>
          <app-language-switcher />
        </div>
        <p>{{ 'Sign in to continue to your school workspace' | t }}</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-grid">
          <label>
            {{ 'Username or Email' | t }}
            <input type="text" formControlName="usernameOrEmail" [placeholder]="'admin@school.com'" />
          </label>

          <label>
            {{ 'Password' | t }}
            <input type="password" formControlName="password" [placeholder]="'••••••••'" />
          </label>

          <button class="btn btn-primary" type="submit" [disabled]="form.invalid || isSubmitting()">
            {{ (isSubmitting() ? 'Signing in...' : 'Sign in') | t }}
          </button>
        </form>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    usernameOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.authStore.login(this.form.getRawValue()).subscribe({
      next: () => {
        const defaultRoute = this.authStore.getDefaultRouteForRole();
        this.router.navigateByUrl(defaultRoute);
        this.isSubmitting.set(false);

        this.authStore.hydrateProfile().subscribe({
          next: () => undefined,
          error: () => undefined
        });
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }
}
