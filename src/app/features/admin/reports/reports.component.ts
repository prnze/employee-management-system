import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const REPORT_NAMES = ['REPORTS_HEADCOUNT', 'REPORTS_ATTENDANCE', 'REPORTS_PAYROLL', 'REPORTS_ATTRITION'] as const;

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {
  readonly reportKeys = REPORT_NAMES;
}
