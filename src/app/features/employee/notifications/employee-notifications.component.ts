import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationListComponent } from '@shared/components/notification-list/notification-list.component';

@Component({
  selector: 'app-employee-notifications',
  standalone: true,
  imports: [NotificationListComponent],
  template: `<app-notification-list />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeNotificationsComponent {}
