import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceComponent {
  readonly rows = [
    { date: '2026-06-02', in: '09:04', out: '18:12', status: 'Present' },
    { date: '2026-06-01', in: '09:15', out: '18:01', status: 'Present' }
  ];
}
