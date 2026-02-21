import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { AuthStore } from '../../core/auth.store';
import { extractList } from '../../core/api.helpers';
import { Bus } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  selector: 'app-buses-page',
  imports: [ReactiveFormsModule, TranslatePipe],
  template: `
    <section class="stack-lg">
      <article class="card">
        <div class="panel-header">
          <h3>{{ 'Transport Management' | t }}</h3>
          <p>{{ 'Manage buses, drivers, and transport status' | t }}</p>
        </div>
        @if (canCreateBus()) {
          <form [formGroup]="form" (ngSubmit)="createBus()" class="form-grid form-grid-3">
            <label>
              {{ 'Bus Number' | t }}
              <input type="text" formControlName="busNumber" />
            </label>
            <label>
              {{ 'License Plate' | t }}
              <input type="text" formControlName="licensePlate" />
            </label>
            <label>
              {{ 'Capacity' | t }}
              <input type="number" formControlName="capacity" />
            </label>
            <label>
              {{ 'Driver Name' | t }}
              <input type="text" formControlName="driverName" />
            </label>
            <label>
              {{ 'Driver Phone' | t }}
              <input type="text" formControlName="driverPhone" [placeholder]="'+1234567892'" />
            </label>
            <label>
              {{ 'Status' | t }}
              <select formControlName="status">
                <option value="ACTIVE">{{ 'Active' | t }}</option>
                <option value="MAINTENANCE">{{ 'Maintenance' | t }}</option>
                <option value="INACTIVE">{{ 'Inactive' | t }}</option>
              </select>
            </label>
            <div>
              <button class="btn btn-primary" type="submit" [disabled]="form.invalid">{{ 'Create Bus' | t }}</button>
            </div>
          </form>
        } @else {
          <p class="panel-note">
            {{ 'You can view buses, but only Principal and Assistant Principal can create bus records.' | t }}
          </p>
        }
      </article>

      <article class="card">
        <div class="table-header">
          <h3>{{ 'Buses' | t }}</h3>
          <button class="btn btn-muted" type="button" (click)="loadBuses()">{{ 'Refresh' | t }}</button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ 'Buses' | t }}</th>
                <th>{{ 'Driver' | t }}</th>
                <th>{{ 'Capacity' | t }}</th>
                <th>{{ 'Status' | t }}</th>
              </tr>
            </thead>
            <tbody>
              @for (bus of buses(); track bus.id) {
                <tr>
                  <td>{{ bus.busNumber }}</td>
                  <td>{{ bus.driverName ?? '-' }}</td>
                  <td>{{ bus.capacity ?? '-' }}</td>
                  <td>{{ bus.status ?? 'ACTIVE' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4">{{ 'No buses available.' | t }}</td>
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
export class BusesPage {
  private readonly phonePattern = /^\+[1-9]\d{7,14}$/;
  private readonly api = inject(ApiService);
  private readonly authStore = inject(AuthStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly buses = signal<Bus[]>([]);
  readonly canCreateBus = computed(() =>
    this.authStore.hasRole(['PRINCIPAL', 'ASSISTANT_PRINCIPAL'])
  );

  readonly form = this.formBuilder.nonNullable.group({
    busNumber: ['', [Validators.required]],
    licensePlate: ['', [Validators.required]],
    capacity: [40, [Validators.required]],
    driverName: ['', [Validators.required]],
    driverPhone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
    status: ['ACTIVE', [Validators.required]]
  });

  constructor() {
    this.loadBuses();
  }

  loadBuses(): void {
    this.api.listBuses({ page: 0, size: 20 }).subscribe({
      next: (response) => this.buses.set(extractList<Bus>(response)),
      error: () => this.buses.set([])
    });
  }

  createBus(): void {
    if (this.form.invalid || !this.canCreateBus()) {
      return;
    }

    const formValue = this.form.getRawValue();
    const normalizedPhone = this.normalizePhone(formValue.driverPhone);

    if (!this.phonePattern.test(normalizedPhone)) {
      this.toast.show(
        'Invalid phone',
        'Driver phone must be in international format like +1234567892.',
        'warning'
      );
      return;
    }

    this.api.createBus({
      ...formValue,
      busNumber: formValue.busNumber.trim(),
      licensePlate: formValue.licensePlate.trim(),
      driverName: formValue.driverName.trim(),
      driverPhone: normalizedPhone
    }).subscribe({
      next: () => {
        this.toast.show('Bus created', 'Transport record was saved successfully.', 'success');
        this.form.reset({
          busNumber: '',
          licensePlate: '',
          capacity: 40,
          driverName: '',
          driverPhone: '',
          status: 'ACTIVE'
        });
        this.loadBuses();
      }
    });
  }

  private normalizePhone(value: string): string {
    const digitsOnly = value.trim().replace(/\D/g, '');
    return digitsOnly ? `+${digitsOnly}` : '';
  }
}
