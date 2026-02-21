import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { extractList } from '../../core/api.helpers';
import { SystemAdmin } from '../../core/models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-system-admins-page',
  imports: [ReactiveFormsModule],
  template: `
    <section class="stack-lg">
      <article class="card">
        <div class="panel-header">
          <h3>System Administrators</h3>
          <p>Create and manage platform-level administrator accounts</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="create()" class="form-grid form-grid-3">
          <label>Username <input type="text" formControlName="username" /></label>
          <label>Email <input type="email" formControlName="email" /></label>
          <label>Password <input type="password" formControlName="password" /></label>
          <label>First Name <input type="text" formControlName="firstName" /></label>
          <label>Last Name <input type="text" formControlName="lastName" /></label>
          <label>Phone Number <input type="text" formControlName="phoneNumber" /></label>
          <div><button class="btn btn-primary" type="submit" [disabled]="form.invalid">Create</button></div>
        </form>
      </article>

      <article class="card">
        <div class="table-header">
          <h3>Admin Accounts</h3>
          <button class="btn btn-muted" type="button" (click)="load()">Refresh</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              @for (item of admins(); track item.id) {
                <tr>
                  <td>{{ item.firstName }} {{ item.lastName }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.status ?? 'ACTIVE' }}</td>
                  <td>
                    <button class="btn btn-muted" type="button" (click)="setStatus(item.id, 'ACTIVE')">Activate</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="4">No system admins found.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemAdminsPage {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly admins = signal<SystemAdmin[]>([]);
  readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: ['']
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.api.listSystemAdmins({ page: 0, size: 20 }).subscribe({
      next: (response) => this.admins.set(extractList<SystemAdmin>(response)),
      error: () => this.admins.set([])
    });
  }

  create(): void {
    if (this.form.invalid) {
      return;
    }

    this.api.createSystemAdmin(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.show('System admin created', 'Account created successfully.', 'success');
        this.form.reset({ username: '', email: '', password: '', firstName: '', lastName: '', phoneNumber: '' });
        this.load();
      }
    });
  }

  setStatus(id: string | number, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): void {
    this.api.updateSystemAdminStatus(id, status).subscribe({
      next: () => {
        this.toast.show('Status updated', 'System admin status was updated.', 'success');
        this.load();
      }
    });
  }
}
