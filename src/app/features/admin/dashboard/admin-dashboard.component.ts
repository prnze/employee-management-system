import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuditService } from '@core/services/audit.service';
import { DashboardStats } from '@core/models/api.models';
import { AdminAnalytics } from '@core/models/analytics.models';
import { AuditLog } from '@core/models/notification.models';
import { LineChartComponent } from '@shared/components/charts/line-chart/line-chart.component';
import { BarChartComponent } from '@shared/components/charts/bar-chart/bar-chart.component';
import { DoughnutChartComponent } from '@shared/components/charts/doughnut-chart/doughnut-chart.component';
import { ChartCardComponent } from '@shared/components/charts/chart-card/chart-card.component';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';

interface KpiCard {
  icon: string;
  labelKey: string;
  value: number | string;
  /** Translation key for the trend badge — undefined = no badge shown. */
  trendKey?: string;
  trendClass: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterLink, TranslatePipe,
    LineChartComponent, BarChartComponent, DoughnutChartComponent, ChartCardComponent,
    AppDatePipe, IconComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  readonly APP_ICONS = APP_ICONS;
  private readonly route            = inject(ActivatedRoute);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly auditService     = inject(AuditService);

  readonly today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  readonly stats     = toSignal(this.route.data.pipe(map((d) => d['stats'] as DashboardStats)));
  readonly analytics = toSignal(this.analyticsService.adminAnalytics().pipe(catchError(() => of(null))));

  /** Show the 8 most recent audit log entries live from the AuditService signal. */
  readonly recentLogs = computed<AuditLog[]>(() => this.auditService.logs().slice(0, 8));

  kpiCards(s: DashboardStats): KpiCard[] {
    return [
      { icon: APP_ICONS.USERS, labelKey: 'ADMIN_DASHBOARD_TOTAL_EMP',  value: s.employees,       trendKey: 'ADMIN_DASHBOARD_THIS_MONTH', trendClass: 'text-bg-success', color: '#0f6cbd' },
      { icon: APP_ICONS.SUCCESS, labelKey: 'ADMIN_DASHBOARD_ACTIVE_EMP', value: s.activeEmployees, trendKey: undefined,                   trendClass: '',                color: '#198754' },
      { icon: APP_ICONS.LEAVE, labelKey: 'ADMIN_DASHBOARD_ON_LEAVE',   value: s.onLeave,         trendKey: undefined,                   trendClass: '',                color: '#fd7e14' },
      { icon: APP_ICONS.DEPARTMENTS, labelKey: 'ADMIN_DASHBOARD_DEPTS',       value: s.departments,     trendKey: undefined,                   trendClass: '',                color: '#6f42c1' }
    ];
  }

  actionLabel(action: string): string {
    const map: Record<string, string> = {
      LOGIN: 'logged in', LOGOUT: 'logged out', CREATE: 'created a record',
      UPDATE: 'updated a record', DELETE: 'deleted a record',
      BULK_DELETE: 'bulk deleted records', BULK_STATUS_UPDATE: 'updated statuses'
    };
    return map[action] ?? action.toLowerCase();
  }
}
