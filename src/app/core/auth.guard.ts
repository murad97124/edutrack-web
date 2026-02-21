import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './auth.store';
import { Role } from './models';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};

export function roleGuard(roles: Role[]): CanActivateFn {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
      router.navigateByUrl('/login');
      return false;
    }

    if (authStore.hasRole(roles)) {
      return true;
    }

    router.navigateByUrl(authStore.getDefaultRouteForRole());
    return false;
  };
}
