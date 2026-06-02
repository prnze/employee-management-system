import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminDataService } from '@core/services/admin-data.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <h1 class="h3 mb-3">Notifications</h1>
    <div class="list-group">
      @for (notification of notifications$ | async; track notification.id) {
        <article class="list-group-item"><div class="d-flex justify-content-between"><strong>{{ notification.title }}</strong><span class="badge text-bg-secondary">{{ notification.type }}</span></div><p class="mb-0">{{ notification.message }}</p></article>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNotificationsComponent {
  readonly notifications$ = inject(AdminDataService).notifications();
}
