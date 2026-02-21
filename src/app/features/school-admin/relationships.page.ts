import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-relationships-page',
  imports: [ReactiveFormsModule],
  template: `
    <section class="stack-lg">
      <article class="card">
        <div class="panel-header">
          <h3>Parent-Student Relationships</h3>
          <p>Link parents to students and maintain primary contact records</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="createRelationship()" class="form-grid form-grid-3">
          <label>Student ID <input type="number" formControlName="studentId" /></label>
          <label>Parent User ID <input type="number" formControlName="parentUserId" /></label>
          <label>Relationship
            <select formControlName="relationship">
              <option value="FATHER">FATHER</option>
              <option value="MOTHER">MOTHER</option>
              <option value="GUARDIAN">GUARDIAN</option>
            </select>
          </label>
          <label>
            Primary Contact
            <select formControlName="isPrimaryContact">
              <option [ngValue]="true">Yes</option>
              <option [ngValue]="false">No</option>
            </select>
          </label>
          <div><button class="btn btn-primary" type="submit" [disabled]="form.invalid">Create Relationship</button></div>
        </form>
      </article>

      <article class="card">
        <div class="panel-header">
          <h3>Delete Relationship</h3>
          <p>Remove relationship by ID</p>
        </div>
        <form [formGroup]="deleteForm" (ngSubmit)="deleteRelationship()" class="form-grid form-grid-3">
          <label>Relationship ID <input type="number" formControlName="relationshipId" /></label>
          <div><button class="btn btn-muted" type="submit" [disabled]="deleteForm.invalid">Delete</button></div>
        </form>
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolRelationshipsPage {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly form = this.formBuilder.nonNullable.group({
    studentId: [1, [Validators.required]],
    parentUserId: [1, [Validators.required]],
    relationship: ['FATHER', [Validators.required]],
    isPrimaryContact: [true, [Validators.required]]
  });

  readonly deleteForm = this.formBuilder.nonNullable.group({
    relationshipId: [1, [Validators.required]]
  });

  createRelationship(): void {
    if (this.form.invalid) {
      return;
    }

    this.api.createParentStudentRelationship(this.form.getRawValue()).subscribe({
      next: () => this.toast.show('Relationship created', 'Parent linked to student successfully.', 'success')
    });
  }

  deleteRelationship(): void {
    if (this.deleteForm.invalid) {
      return;
    }

    const relationshipId = this.deleteForm.getRawValue().relationshipId;
    this.api.deleteParentStudentRelationship(relationshipId).subscribe({
      next: () => this.toast.show('Relationship deleted', 'Link removed successfully.', 'success')
    });
  }
}
