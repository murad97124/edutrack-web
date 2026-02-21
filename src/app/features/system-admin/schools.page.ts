import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { extractList } from '../../core/api.helpers';
import { School } from '../../core/models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-system-admin-schools-page',
  imports: [ReactiveFormsModule],
  template: `
    <section class="stack-lg">
      <article class="card">
        <div class="panel-header">
          <h3>School Management</h3>
          <p>Create and supervise schools across the platform</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="createSchool()" class="form-grid form-grid-3">
          <label>
            School Name
            <input type="text" formControlName="name" />
          </label>
          <label>
            Subdomain
            <input type="text" formControlName="subdomain" />
          </label>
          <label>
            Email
            <input type="email" formControlName="email" />
          </label>
          <label>
            Phone Number
            <input type="text" formControlName="phoneNumber" />
          </label>
          <label class="full-width">
            Address
            <input type="text" formControlName="address" />
          </label>
          <label>
            Principal First Name
            <input type="text" formControlName="principalFirstName" />
          </label>
          <label>
            Principal Last Name
            <input type="text" formControlName="principalLastName" />
          </label>
          <label>
            Principal Email
            <input type="email" formControlName="principalEmail" />
          </label>
          <div>
            <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Create School</button>
          </div>
        </form>
      </article>

      <article class="card">
        <div class="table-header">
          <h3>Schools</h3>
          <button class="btn btn-muted" type="button" (click)="loadSchools()">Refresh</button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subdomain</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (school of schools(); track school.id) {
                <tr>
                  <td>{{ school.name }}</td>
                  <td>{{ school.subdomain }}</td>
                  <td>{{ school.email ?? '-' }}</td>
                  <td>{{ school.status ?? 'ACTIVE' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4">No schools found.</td>
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
export class SystemAdminSchoolsPage {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly schools = signal<School[]>([]);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    subdomain: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required]],
    address: ['', [Validators.required]],
    principalFirstName: ['', [Validators.required]],
    principalLastName: ['', [Validators.required]],
    principalEmail: ['', [Validators.required, Validators.email]]
  });

  constructor() {
    this.loadSchools();
  }

  loadSchools(): void {
    this.api.listSchools({ page: 0, size: 20 }).subscribe({
      next: (response) => this.schools.set(extractList<School>(response)),
      error: () => this.schools.set([])
    });
  }

  createSchool(): void {
    if (this.form.invalid) {
      return;
    }

    this.api.createSchool(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.show('School created', 'A new school tenant is now active.', 'success');
        this.form.reset({
          name: '',
          subdomain: '',
          email: '',
          phoneNumber: '',
          address: '',
          principalFirstName: '',
          principalLastName: '',
          principalEmail: ''
        });
        this.loadSchools();
      }
    });
  }
}
