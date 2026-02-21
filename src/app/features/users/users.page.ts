import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { extractList } from '../../core/api.helpers';
import { Role, User } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  selector: 'app-users-page',
  imports: [ReactiveFormsModule, TranslatePipe],
  template: `
    <section class="stack-lg">
      <article class="card">
        <div class="panel-header">
          <h3>{{ 'User Management' | t }}</h3>
          <p>{{ 'Create and monitor school users by role' | t }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="createUser()" class="form-grid form-grid-3">
          <label>
            {{ 'Username' | t }}
            <input type="text" formControlName="username" />
          </label>
          <label>
            {{ 'Email' | t }}
            <input type="email" formControlName="email" />
          </label>
          <label>
            {{ 'Role' | t }}
            <select formControlName="role">
              <option value="TEACHER">{{ 'Teacher' | t }}</option>
              <option value="PARENT">{{ 'Parent' | t }}</option>
              <option value="STAFF">{{ 'Staff' | t }}</option>
              <option value="ASSISTANT_PRINCIPAL">{{ 'Assistant Principal' | t }}</option>
            </select>
          </label>
          <label>
            {{ 'First Name' | t }}
            <input type="text" formControlName="firstName" />
          </label>
          <label>
            {{ 'Last Name' | t }}
            <input type="text" formControlName="lastName" />
          </label>
          <label>
            {{ 'Password' | t }}
            <input type="password" formControlName="password" />
          </label>
          <div>
            <button class="btn btn-primary" type="submit" [disabled]="form.invalid">{{ 'Create User' | t }}</button>
          </div>
        </form>
      </article>

      <article class="card">
        <div class="table-header">
          <h3>{{ 'Users' | t }}</h3>
          <button class="btn btn-muted" type="button" (click)="loadUsers()">{{ 'Refresh' | t }}</button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ 'Name' | t }}</th>
                <th>{{ 'Email' | t }}</th>
                <th>{{ 'Role' | t }}</th>
                <th>{{ 'Status' | t }}</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr>
                  <td>{{ user.firstName }} {{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role | t }}</td>
                  <td>{{ (user.status ?? 'ACTIVE') | t }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4">{{ 'No users found.' | t }}</td>
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
export class UsersPage {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly users = signal<User[]>([]);

  readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['TEACHER', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.api.listUsers({ page: 0, size: 20 }).subscribe({
      next: (response) => this.users.set(extractList<User>(response)),
      error: () => this.users.set([])
    });
  }

  createUser(): void {
    if (this.form.invalid) {
      return;
    }

    const payload = this.form.getRawValue();
    this.api.createUser({ ...payload, role: payload.role as Role }).subscribe({
      next: () => {
        this.toast.show('User created', 'The new account is ready.', 'success');
        this.form.reset({ role: 'TEACHER', username: '', email: '', firstName: '', lastName: '', password: '' });
        this.loadUsers();
      }
    });
  }
}
