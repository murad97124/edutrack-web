import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from './auth.store';
import { ToastService } from './toast.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authStore = inject(AuthStore);
  const toast = inject(ToastService);
  const token = authStore.getAccessToken();

  const protectedRequest =
    token.length > 0
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : request;

  return next(protectedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !request.url.includes('/api/auth/login')) {
        authStore.logout(false);
        toast.show('Session expired', 'Please sign in again to continue.', 'warning');
      } else if (error.status >= 400) {
        const message = extractErrorMessage(error);
        toast.show('Request failed', message, 'error');
      }

      return throwError(() => error);
    })
  );
};

function extractErrorMessage(error: HttpErrorResponse): string {
  const errorBody = error.error;

  if (typeof errorBody?.message === 'string' && errorBody.message.trim().length > 0) {
    return errorBody.message;
  }

  if (Array.isArray(errorBody?.errors) && errorBody.errors.length > 0) {
    return `${errorBody.errors[0]}`;
  }

  if (typeof errorBody?.error === 'string' && errorBody.error.trim().length > 0) {
    return errorBody.error;
  }

  return 'An unexpected error occurred. Please try again later.';
}
