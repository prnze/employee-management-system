import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Employee } from '@core/models/employee.models';
import { EmployeeService } from '@core/services/employee.service';
import { DialogService } from '@core/services/dialog.service';
import { PhoneFormatPipe } from '@shared/pipes/phone-format.pipe';
import { PermissionDirective } from '@shared/directives/permission.directive';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [RouterLink, PhoneFormatPipe, PermissionDirective],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);
  private readonly dialogService = inject(DialogService);
  readonly employee = this.route.snapshot.data['employee'] as Employee;

  delete(): void {
    this.dialogService.confirm({
      title: 'DIALOG_DELETE_EMPLOYEE_TITLE',
      message: 'DIALOG_DELETE_EMPLOYEE_MSG',
      translationParams: { name: `${this.employee.firstName} ${this.employee.lastName}` },
      variant: 'danger',
      icon: 'delete'
    }).then((confirmed) => {
      if (confirmed) {
        this.employeeService.delete(this.employee.id).subscribe(() => void this.router.navigateByUrl('/admin/employees'));
      }
    });
  }
}
