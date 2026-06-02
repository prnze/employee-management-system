import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '@core/models/employee.models';
import { EmployeeService } from '@core/services/employee.service';
import { UnsavedChangesAware } from '@core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="surface p-3">
      <h1 class="h3">{{ employee ? 'Edit' : 'Create' }} employee</h1>
      <form [formGroup]="form" (ngSubmit)="submit()" class="row g-3">
        <div class="col-md-6"><label class="form-label">First name</label><input class="form-control" formControlName="firstName" /></div>
        <div class="col-md-6"><label class="form-label">Last name</label><input class="form-control" formControlName="lastName" /></div>
        <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" type="email" formControlName="email" /></div>
        <div class="col-md-6"><label class="form-label">Phone</label><input class="form-control" formControlName="phone" /></div>
        <div class="col-md-4"><label class="form-label">Department</label><input class="form-control" formControlName="department" /></div>
        <div class="col-md-4"><label class="form-label">Designation</label><input class="form-control" formControlName="designation" /></div>
        <div class="col-md-4"><label class="form-label">Manager</label><input class="form-control" formControlName="manager" /></div>
        <div class="col-md-4"><label class="form-label">Location</label><input class="form-control" formControlName="location" /></div>
        <div class="col-md-4"><label class="form-label">Status</label><select class="form-select" formControlName="status"><option>Active</option><option>Inactive</option><option>On Leave</option></select></div>
        <div class="col-md-4"><label class="form-label">Joined</label><input class="form-control" type="date" formControlName="joinedAt" /></div>
        <div class="col-md-4"><label class="form-label">Salary</label><input class="form-control" type="number" formControlName="salary" /></div>
        <div class="col-12 d-flex justify-content-end gap-2"><button class="btn btn-outline-secondary" type="button" (click)="cancel()">Cancel</button><button class="btn btn-primary" type="submit" [disabled]="form.invalid || saving()">{{ saving() ? 'Saving...' : 'Save employee' }}</button></div>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFormComponent implements UnsavedChangesAware {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);
  readonly saving = signal(false);
  readonly employee = this.route.snapshot.data['employee'] as Employee | undefined;
  readonly form = this.fb.nonNullable.group({
    firstName: [this.employee?.firstName ?? '', Validators.required],
    lastName: [this.employee?.lastName ?? '', Validators.required],
    email: [this.employee?.email ?? '', [Validators.required, Validators.email]],
    phone: [this.employee?.phone ?? '', Validators.required],
    department: [this.employee?.department ?? '', Validators.required],
    designation: [this.employee?.designation ?? '', Validators.required],
    manager: [this.employee?.manager ?? '', Validators.required],
    location: [this.employee?.location ?? '', Validators.required],
    status: [this.employee?.status ?? 'Active' as Employee['status'], Validators.required],
    joinedAt: [this.employee?.joinedAt ?? new Date().toISOString().slice(0, 10), Validators.required],
    salary: [this.employee?.salary ?? 0, [Validators.required, Validators.min(1)]]
  });

  hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.saving();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const request = this.form.getRawValue();
    const save$ = this.employee ? this.employeeService.update(this.employee.id, request) : this.employeeService.create(request);
    save$.subscribe((employee) => {
      this.form.markAsPristine();
      void this.router.navigate(['/admin/employees', employee.id]);
    });
  }

  cancel(): void {
    void this.router.navigateByUrl('/admin/employees');
  }
}
