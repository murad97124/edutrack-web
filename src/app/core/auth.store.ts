import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthUser, LoginPayload, LoginResponse, Role } from './models';
import { extractData } from './api.helpers';
import { ToastService } from './toast.service';

const ACCESS_TOKEN_KEY = 'edutrack_access_token';
const REFRESH_TOKEN_KEY = 'edutrack_refresh_token';
const USER_KEY = 'edutrack_user';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  private readonly accessToken = signal(localStorage.getItem(ACCESS_TOKEN_KEY) ?? '');
  private readonly refreshToken = signal(localStorage.getItem(REFRESH_TOKEN_KEY) ?? '');
  private readonly user = signal<AuthUser | null>(readUser());

  readonly currentUser = computed(() => this.user());
  readonly role = computed<Role | null>(() => this.user()?.role ?? null);
  readonly isAuthenticated = computed(() => this.accessToken().length > 0);

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.api.login(payload).pipe(
      map((response) => extractData<LoginResponse>(response)),
      tap((response) => {
        this.persistSession(response);
        this.toast.show('Welcome back', 'You are signed in successfully.', 'success');
      })
    );
  }

  hydrateProfile(): Observable<AuthUser> {
    return this.api.getMyProfile().pipe(
      map((response) => extractData<AuthUser>(response)),
      tap((response) => {
        this.user.set(response);
        localStorage.setItem(USER_KEY, JSON.stringify(response));
      })
    );
  }

  getAccessToken(): string {
    return this.accessToken();
  }

  logout(showMessage = true): void {
    this.api.logout().subscribe({ error: () => undefined });
    this.clearSession();
    if (showMessage) {
      this.toast.show('Logged out', 'Your session has been closed.', 'info');
    }
    this.router.navigateByUrl('/login');
  }

  hasRole(roles: Role[]): boolean {
    const userRole = this.role();
    return userRole !== null && roles.includes(userRole);
  }

  getDefaultRouteForRole(): string {
    const userRole = this.role();

    if (userRole === 'SYSTEM_ADMIN') {
      return '/admin/schools';
    }

    if (userRole === 'PARENT') {
      return '/parent/portal';
    }

    if (userRole === 'STUDENT') {
      return '/student/portal';
    }

    if (userRole === null) {
      return '/messages';
    }

    return '/dashboard';
  }

  private persistSession(response: LoginResponse): void {
    this.accessToken.set(response.accessToken);
    this.refreshToken.set(response.refreshToken);
    this.user.set(response.user ?? null);

    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
  }

  private clearSession(): void {
    this.accessToken.set('');
    this.refreshToken.set('');
    this.user.set(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

function readUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
