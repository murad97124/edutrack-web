import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-bus-assignments-page',
  imports: [ReactiveFormsModule],
  template: `
    <section class="card">
      <div class="panel-header">
        <h3>Bus Assignments</h3>
        <p>Assign students to buses with pickup/dropoff stops</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="createAssignment()" class="form-grid form-grid-3">
        <label>Student ID <input type="number" formControlName="studentId" /></label>
        <label>Bus ID <input type="number" formControlName="busId" /></label>
        <label>Pickup Stop ID <input type="number" formControlName="pickupStopId" /></label>
        <label>Dropoff Stop ID <input type="number" formControlName="dropoffStopId" /></label>
        <label>Effective From <input type="date" formControlName="effectiveFrom" /></label>
        <div><button class="btn btn-primary" type="submit" [disabled]="form.invalid">Create Assignment</button></div>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolBusAssignmentsPage {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly form = this.formBuilder.nonNullable.group({
    studentId: [1, [Validators.required]],
    busId: [1, [Validators.required]],
    pickupStopId: [1, [Validators.required]],
    dropoffStopId: [2, [Validators.required]],
    effectiveFrom: ['', [Validators.required]]
  });

  createAssignment(): void {
    if (this.form.invalid) {
      return;
    }

    this.api.createBusAssignment(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.show('Assignment created', 'Student was assigned to the bus.', 'success');
      }
    });
  }
}
