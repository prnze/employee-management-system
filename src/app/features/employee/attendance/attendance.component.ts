import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-attendance',
  standalone: true,
  template: `
    <h1 class="h3 mb-3">Attendance</h1>
    <div class="surface table-responsive">
      <table class="table mb-0"><thead><tr><th>Date</th><th>Check in</th><th>Check out</th><th>Status</th></tr></thead><tbody>
        @for (row of rows; track row.date) { <tr><td>{{ row.date }}</td><td>{{ row.in }}</td><td>{{ row.out }}</td><td><span class="badge text-bg-success">{{ row.status }}</span></td></tr> }
      </tbody></table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceComponent {
  readonly rows = [
    { date: '2026-06-02', in: '09:04', out: '18:12', status: 'Present' },
    { date: '2026-06-01', in: '09:15', out: '18:01', status: 'Present' }
  ];
}
