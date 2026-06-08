import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationListComponent } from '@shared/components/notification-list/notification-list.component';

@Component({
  selector: 'app-employee-notifications',
  standalone: true,
  imports: [NotificationListComponent],
  templateUrl: './employee-notifications.component.html',
  styleUrl: './employee-notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeNotificationsComponent {}
