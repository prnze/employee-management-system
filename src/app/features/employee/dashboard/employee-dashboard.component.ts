import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthStateService } from '@core/auth/auth-state.service';
import { EmployeeAnalytics, UpcomingTask } from '@core/models/analytics.models';
import { LineChartComponent } from '@shared/components/charts/line-chart/line-chart.component';
import { BarChartComponent } from '@shared/components/charts/bar-chart/bar-chart.component';
import { ChartCardComponent } from '@shared/components/charts/chart-card/chart-card.component';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';

/** All sub-text is expressed as { subNum?, subKey } — the template pipes subKey through translate. */
interface KpiCard {
  icon: string;
  labelKey: string;
  value: number | string;
  color: string;
  /** Optional leading number rendered before the translated sub-key. */
  subNum?: number | string;
  /** Translation key for the sub-label. Empty string = no sub-label. */
  subKey: string;
}

interface ActivityStat {
  labelKey: string;
  value: number;
  colorClass: string;
  barClass: string;
  pct: number;
  /** Optional leading number rendered before the translated sub-key. */
  subNum?: number | string;
  subKey: string;
}

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LineChartComponent, BarChartComponent, ChartCardComponent, AppDatePipe, IconComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDashboardComponent {
  readonly APP_ICONS = APP_ICONS;
  private readonly analyticsService = inject(AnalyticsService);
  private readonly authState        = inject(AuthStateService);

  readonly today     = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  readonly firstName = computed(() => this.authState.user()?.fullName.split(' ')[0] ?? 'there');
  readonly error     = computed(() => this._error());

  private readonly _error = (() => {
    let hasError = false;
    return computed(() => hasError ? 'error' : '');
  })();

  readonly analytics = toSignal(
    this.analyticsService.employeeAnalytics().pipe(catchError(() => of(null)))
  );

  reload(): void { window.location.reload(); }

  // ── KPI cards — store keys, never translated strings ───────────
  kpiCards(s: EmployeeAnalytics['summary']): KpiCard[] {
    const attRate = this.attendanceRate(s);
    return [
      { icon: APP_ICONS.SUCCESS, labelKey: 'EMP_DASHBOARD_DAYS_PRESENT', value: s.totalPresent,   subNum: s.totalAbsent,   subKey: 'EMP_DASHBOARD_ABSENT_SUB', color: '#198754' },
      { icon: APP_ICONS.TASKS, labelKey: 'EMP_DASHBOARD_TASKS_DONE',   value: s.tasksCompleted, subNum: s.tasksPending,  subKey: 'EMP_DASHBOARD_PENDING',    color: '#0f6cbd' },
      { icon: APP_ICONS.LEAVE, labelKey: 'EMP_DASHBOARD_LEAVE_LEFT',   value: s.leaveBalance,   subNum: undefined,       subKey: 'EMP_DASHBOARD_30_DAYS',    color: '#fd7e14' },
      { icon: APP_ICONS.TRENDING_UP, labelKey: 'EMP_DASHBOARD_ATTEND_RATE',  value: attRate + '%',     subNum: undefined,       subKey: 'EMP_DASHBOARD_RATE_SUB',   color: '#6f42c1' }
    ];
  }

  // ── Activity stats — same pattern ──────────────────────────────
  activityStats(s: EmployeeAnalytics['summary']): ActivityStat[] {
    const attRate  = this.attendanceRate(s);
    const taskRate = this.taskRate(s);
    return [
      { labelKey: 'EMP_DASHBOARD_DAYS_PRESENT', value: s.totalPresent,   colorClass: 'text-success', barClass: 'bg-success', pct: attRate,  subNum: attRate,        subKey: 'EMP_DASHBOARD_RATE_SUB'  },
      { labelKey: 'EMP_DASHBOARD_TASKS_DONE',   value: s.tasksCompleted, colorClass: 'text-primary', barClass: 'bg-primary', pct: taskRate, subNum: s.tasksPending, subKey: 'EMP_DASHBOARD_PENDING'   },
      { labelKey: 'EMP_DASHBOARD_DAYS_ABSENT',  value: s.totalAbsent,    colorClass: 'text-danger',  barClass: 'bg-danger',  pct: Math.round((s.totalAbsent / (s.totalPresent + s.totalAbsent || 1)) * 100), subNum: undefined, subKey: 'EMP_DASHBOARD_RATE_SUB' },
      { labelKey: 'EMP_DASHBOARD_LEAVE_LEFT',   value: s.leaveBalance,   colorClass: 'text-warning', barClass: 'bg-warning', pct: Math.round((s.leaveBalance / 30) * 100), subNum: undefined, subKey: 'EMP_DASHBOARD_30_DAYS' }
    ];
  }

  priorityClass(priority: UpcomingTask['priority']): string {
    return { High: 'text-bg-danger', Medium: 'text-bg-warning text-dark', Low: 'text-bg-secondary' }[priority];
  }

  dueSoonClass(dueDate: string): string {
    const days = this.dueSoonDays(dueDate);
    return days <= 3 ? 'text-danger fw-semibold ms-1' : days <= 7 ? 'text-warning ms-1' : '';
  }

  /**
   * Returns a translation KEY (or empty string) — never a translated string.
   * Template pipes it through | translate so language switching works reactively.
   */
  dueSoonKey(dueDate: string): string {
    const days = this.dueSoonDays(dueDate);
    if (days < 0)  return 'EMP_DASHBOARD_OVERDUE';
    if (days === 0) return 'EMP_DASHBOARD_TODAY';
    return '';   // days 1–3: show numeric "(Nd)" via dueSoonDays(), not a key
  }

  /** Raw days until due — used both by dueSoonKey() and the Nd badge. */
  dueSoonDays(dueDate: string): number {
    return Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000);
  }

  attendanceRate(s: { totalPresent: number; totalAbsent: number }): number {
    const total = s.totalPresent + s.totalAbsent;
    return total ? Math.round((s.totalPresent / total) * 100) : 0;
  }

  taskRate(s: { tasksCompleted: number; tasksPending: number }): number {
    const total = s.tasksCompleted + s.tasksPending;
    return total ? Math.round((s.tasksCompleted / total) * 100) : 0;
  }
}
