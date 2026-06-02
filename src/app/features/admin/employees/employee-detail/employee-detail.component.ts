import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Employee } from '@core/models/employee.models';
import { EmployeeService } from '@core/services/employee.service';
import { PhoneFormatPipe } from '@shared/pipes/phone-format.pipe';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [RouterLink, PhoneFormatPipe],
  template: `
    <article class="surface p-3">
      <div class="d-flex justify-content-between gap-2 mb-3">
        <h1 class="h3">{{ employee.firstName }} {{ employee.lastName }}</h1>
        <div><a class="btn btn-outline-primary me-2" [routerLink]="['/admin/employees', employee.id, 'edit']">Edit</a><button class="btn btn-outline-danger" type="button" (click)="delete()">Delete</button></div>
      </div>
      <dl class="row">
        <dt class="col-sm-3">Code</dt><dd class="col-sm-9">{{ employee.employeeCode }}</dd>
        <dt class="col-sm-3">Email</dt><dd class="col-sm-9">{{ employee.email }}</dd>
        <dt class="col-sm-3">Phone</dt><dd class="col-sm-9">{{ employee.phone | phoneFormat }}</dd>
        <dt class="col-sm-3">Department</dt><dd class="col-sm-9">{{ employee.department }}</dd>
        <dt class="col-sm-3">Designation</dt><dd class="col-sm-9">{{ employee.designation }}</dd>
        <dt class="col-sm-3">Status</dt><dd class="col-sm-9">{{ employee.status }}</dd>
      </dl>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);
  readonly employee = this.route.snapshot.data['employee'] as Employee;

  delete(): void {
    if (window.confirm('Delete this employee?')) {
      this.employeeService.delete(this.employee.id).subscribe(() => void this.router.navigateByUrl('/admin/employees'));
    }
  }
}
