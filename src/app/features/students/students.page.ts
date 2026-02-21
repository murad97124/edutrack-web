import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { AuthStore } from '../../core/auth.store';
import { extractList } from '../../core/api.helpers';
import { Student } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  selector: 'app-students-page',
  imports: [ReactiveFormsModule, TranslatePipe],
  template: `
    <section class="stack-lg">
      <article class="card">
        <div class="panel-header">
          <h3>{{ 'Student Enrollment' | t }}</h3>
          <p>{{ 'Add and manage student records' | t }}</p>
        </div>
        @if (canCreateStudent()) {
          <form [formGroup]="form" (ngSubmit)="createStudent()" class="form-grid form-grid-3">
            <label>
              {{ 'First Name' | t }}
              <input type="text" formControlName="firstName" />
            </label>
            <label>
              {{ 'Last Name' | t }}
              <input type="text" formControlName="lastName" />
            </label>
            <label>
              {{ 'Gender' | t }}
              <select formControlName="gender">
                <option value="MALE">{{ 'Male' | t }}</option>
                <option value="FEMALE">{{ 'Female' | t }}</option>
                <option value="OTHER">{{ 'Other' | t }}</option>
              </select>
            </label>
            <label>
              {{ 'Date of Birth' | t }}
              <input type="date" formControlName="dateOfBirth" />
            </label>
            <label>
              {{ 'Enrollment Date' | t }}
              <input type="date" formControlName="enrollmentDate" />
            </label>
            <label>
              {{ 'Grade Level' | t }}
              <input type="text" formControlName="gradeLevel" [placeholder]="'Grade 6'" />
            </label>
            <label>
              {{ 'Class Name' | t }}
              <input type="text" formControlName="className" [placeholder]="'6-A'" />
            </label>
            <label>
              {{ 'Status' | t }}
              <select formControlName="status">
                <option value="ACTIVE">{{ 'Active' | t }}</option>
                <option value="INACTIVE">{{ 'Inactive' | t }}</option>
              </select>
            </label>
            <div>
              <button class="btn btn-primary" type="submit" [disabled]="form.invalid">
                {{ 'Create Student' | t }}
              </button>
            </div>
          </form>
        } @else {
          <p class="panel-note">
            {{ 'You can view students, but only Principal and Assistant Principal can create students.' | t }}
          </p>
        }
      </article>

      <article class="card">
        <div class="table-header">
          <h3>{{ 'Students' | t }}</h3>
          <button class="btn btn-muted" type="button" (click)="loadStudents()">{{ 'Refresh' | t }}</button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ 'Name' | t }}</th>
                <th>{{ 'Grade' | t }}</th>
                <th>{{ 'Class' | t }}</th>
                <th>{{ 'Status' | t }}</th>
              </tr>
            </thead>
            <tbody>
              @for (student of students(); track student.id) {
                <tr>
                  <td>{{ student.firstName }} {{ student.lastName }}</td>
                  <td>{{ student.gradeLevel ?? '-' }}</td>
                  <td>{{ student.className ?? '-' }}</td>
                  <td>{{ (student.status ?? 'ACTIVE') | t }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4">{{ 'No students found.' | t }}</td>
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
export class StudentsPage {
  private readonly api = inject(ApiService);
  private readonly authStore = inject(AuthStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly students = signal<Student[]>([]);
  readonly canCreateStudent = computed(() =>
    this.authStore.hasRole(['PRINCIPAL', 'ASSISTANT_PRINCIPAL'])
  );

  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    gender: ['MALE', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    enrollmentDate: ['', [Validators.required]],
    gradeLevel: ['', [Validators.required]],
    className: ['', [Validators.required]],
    status: ['ACTIVE', [Validators.required]]
  });

  constructor() {
    this.loadStudents();
  }

  loadStudents(): void {
    this.api.listStudents({ page: 0, size: 20 }).subscribe({
      next: (response) => this.students.set(extractList<Student>(response)),
      error: () => this.students.set([])
    });
  }

  createStudent(): void {
    if (this.form.invalid || !this.canCreateStudent()) {
      return;
    }

    this.api.createStudent(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.show('Student added', 'The student profile was created.', 'success');
        this.form.reset({
          firstName: '',
          lastName: '',
          gender: 'MALE',
          dateOfBirth: '',
          enrollmentDate: '',
          gradeLevel: '',
          className: '',
          status: 'ACTIVE'
        });
        this.loadStudents();
      }
    });
  }
}
