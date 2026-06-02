import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-employee-notifications',
  standalone: true,
  template: `
    <h1 class="h3 mb-3">Notifications</h1>
    <div class="list-group">
      @for (item of items; track item.id) {
        <button class="list-group-item list-group-item-action" type="button"><strong>{{ item.title }}</strong><p class="mb-0">{{ item.message }}</p></button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeNotificationsComponent {
  readonly items = [
    { id: '1', title: 'Leave approved', message: 'Your leave request was approved.' },
    { id: '2', title: 'Task due', message: 'Self review is due this week.' }
  ];
}
