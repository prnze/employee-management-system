import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminDataService } from '@core/services/admin-data.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <h1 class="h3 mb-3">User management</h1>
    <div class="surface table-responsive">
      <table class="table table-hover mb-0">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th class="text-end">Actions</th></tr></thead>
        <tbody>
          @for (user of users$ | async; track user.id) {
            <tr><td>{{ user.fullName }}</td><td>{{ user.email }}</td><td>{{ user.role }}</td><td>{{ user.status }}</td><td>{{ user.lastLoginAt }}</td><td class="text-end"><button class="btn btn-sm btn-outline-secondary me-1">Reset password</button><button class="btn btn-sm btn-outline-warning">Lock</button></td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
  readonly users$ = inject(AdminDataService).users();
}
