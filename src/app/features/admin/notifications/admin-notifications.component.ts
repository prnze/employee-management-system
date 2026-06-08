import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationListComponent } from '@shared/components/notification-list/notification-list.component';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [NotificationListComponent],
  templateUrl: './admin-notifications.component.html',
  styleUrl: './admin-notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNotificationsComponent {}
