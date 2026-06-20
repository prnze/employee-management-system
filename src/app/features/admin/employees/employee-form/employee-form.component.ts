import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Employee } from '@core/models/employee.models';
import { EmployeeService } from '@core/services/employee.service';
import { UnsavedChangesAware } from '@core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
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
      void this.router.navigate(['/ems/admin/employees', employee.id]);
    });
  }

  cancel(): void {
    void this.router.navigateByUrl('/ems/admin/employees');
  }
}
