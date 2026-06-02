import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminDataService } from '@core/services/admin-data.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <h1 class="h3 mb-3">Audit logs</h1>
    <div class="surface table-responsive">
      <table class="table mb-0">
        <thead><tr><th>Actor</th><th>Action</th><th>Entity</th><th>Time</th><th>IP</th></tr></thead>
        <tbody>@for (log of logs$ | async; track log.id) { <tr><td>{{ log.actor }}</td><td>{{ log.action }}</td><td>{{ log.entity }}</td><td>{{ log.createdAt }}</td><td>{{ log.ipAddress }}</td></tr> }</tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditLogsComponent {
  readonly logs$ = inject(AdminDataService).auditLogs();
}
