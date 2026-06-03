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
    AppDatePipe
  ],
  template: `
    <!-- ── Header ─────────────────────────────────────────────── -->
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h1 class="h3 mb-1">{{ 'ADMIN_DASHBOARD_TITLE' | translate }}</h1>
        <p class="text-body-secondary small mb-0">{{ today }}</p>
      </div>
      <div class="d-flex gap-2">
        <a class="btn btn-primary btn-sm" routerLink="/admin/employees/create">
          {{ 'ADMIN_DASHBOARD_NEW_EMP' | translate }}
        </a>
        <a class="btn btn-outline-secondary btn-sm" routerLink="/admin/reports">
          {{ 'ADMIN_DASHBOARD_REPORTS' | translate }}
        </a>
      </div>
    </div>

    <!-- ── KPI Cards ──────────────────────────────────────────── -->
    @if (stats(); as s) {
      <section class="row g-3 mb-4" aria-label="Key performance indicators">
        @for (card of kpiCards(s); track card.labelKey) {
          <div class="col-6 col-xl-3">
            <article class="surface p-3 h-100 d-flex flex-column" [style.border-left]="'4px solid ' + card.color">
              <p class="text-body-secondary mb-1 small d-flex align-items-center gap-1">
                <span>{{ card.icon }}</span> {{ card.labelKey | translate }}
              </p>
              <strong class="fs-2 lh-1 mb-1">{{ card.value }}</strong>
              @if (card.trendKey) {
                <span class="badge align-self-start mt-auto" [class]="card.trendClass">{{ card.trendKey | translate }}</span>
              }
            </article>
          </div>
        }
      </section>
    } @else {
      <section class="row g-3 mb-4" aria-label="Loading metrics">
        @for (i of [1,2,3,4]; track i) {
          <div class="col-6 col-xl-3">
            <div class="surface p-3 placeholder-glow" aria-hidden="true">
              <span class="placeholder col-6 mb-2 d-block rounded"></span>
              <span class="placeholder col-4 rounded" style="height:2rem;display:block"></span>
            </div>
          </div>
        }
      </section>
    }

    <!-- ── Charts Row 1 ───────────────────────────────────────── -->
    @if (analytics(); as a) {
      <section class="row g-3 mb-3">
        <!-- Employee Growth 12-month line -->
        <div class="col-lg-8">
          <app-chart-card
            [title]="'ADMIN_DASHBOARD_EMP_GROWTH' | translate"
            [badge]="'ADMIN_DASHBOARD_LAST_12MO' | translate"
            skeletonHeight="260px">
            <app-line-chart
              [dataPoints]="a.employeeGrowth"
              [label]="'ADMIN_DASHBOARD_TOTAL_EMP' | translate"
              color="#0f6cbd"
              [yLabel]="'ADMIN_DASHBOARD_TOTAL_EMP' | translate"
              height="260px" />
          </app-chart-card>
        </div>

        <!-- Department Distribution doughnut -->
        <div class="col-lg-4">
          <app-chart-card
            [title]="'ADMIN_DASHBOARD_DEPT_DIST' | translate"
            [badge]="'ADMIN_DASHBOARD_LIVE' | translate"
            badgeClass="text-bg-success"
            skeletonHeight="260px">
            <app-doughnut-chart [dataPoints]="a.departmentDistribution" height="200px" />
            <!-- Legend -->
            <ul slot="footer" class="list-unstyled mt-3 mb-0 small">
              @for (dept of a.departmentDistribution; track dept.label) {
                <li class="d-flex align-items-center gap-2 mb-1">
                  <span class="rounded-circle flex-shrink-0" style="width:10px;height:10px;display:inline-block" [style.background]="dept.color"></span>
                  <span class="flex-grow-1 text-body-secondary">{{ dept.label }}</span>
                  <strong>{{ dept.value }}</strong>
                </li>
              }
            </ul>
          </app-chart-card>
        </div>
      </section>

      <!-- ── Charts Row 2 ──────────────────────────────────────── -->
      <section class="row g-3 mb-3">
        <!-- Monthly Activity bar -->
        <div class="col-lg-5">
          <app-chart-card
            [title]="'ADMIN_DASHBOARD_MONTHLY_ACT' | translate"
            [badge]="'ADMIN_DASHBOARD_EVENTS' | translate"
            badgeClass="text-bg-secondary"
            skeletonHeight="220px">
            <app-bar-chart
              [dataPoints]="a.monthlyActivity"
              [label]="'ADMIN_DASHBOARD_EVENTS' | translate"
              [yLabel]="'ADMIN_DASHBOARD_EVENTS' | translate"
              height="220px" />
          </app-chart-card>
        </div>

        <!-- Employee Status doughnut -->
        <div class="col-lg-3">
          <app-chart-card
            [title]="'ADMIN_DASHBOARD_STATUS_BRK' | translate"
            [badge]="'ADMIN_DASHBOARD_LIVE' | translate"
            badgeClass="text-bg-success"
            skeletonHeight="220px">
            <app-doughnut-chart [dataPoints]="a.statusBreakdown" height="160px" />
            <div slot="footer" class="d-flex flex-wrap justify-content-center gap-2 mt-3 small">
              @for (s of a.statusBreakdown; track s.label) {
                <span class="d-flex align-items-center gap-1">
                  <span class="rounded-circle" style="width:8px;height:8px;display:inline-block" [style.background]="s.color"></span>
                  {{ s.label }}&nbsp;<strong>{{ s.value }}</strong>
                </span>
              }
            </div>
          </app-chart-card>
        </div>

        <!-- Quick Actions -->
        <div class="col-lg-4">
          <div class="surface p-3 h-100">
            <h2 class="h6 fw-semibold mb-3">{{ 'ADMIN_DASHBOARD_QUICK' | translate }}</h2>
            <div class="d-grid gap-2">
              <a class="btn btn-primary btn-sm" routerLink="/admin/employees/create">
                {{ 'ADMIN_DASHBOARD_CREATE_EMP' | translate }}
              </a>
              <a class="btn btn-outline-primary btn-sm" routerLink="/admin/employees">
                {{ 'ADMIN_DASHBOARD_EMP_LIST' | translate }}
              </a>
              <a class="btn btn-outline-secondary btn-sm" routerLink="/admin/roles">
                {{ 'ADMIN_DASHBOARD_MANAGE_ROLES' | translate }}
              </a>
              <a class="btn btn-outline-secondary btn-sm" routerLink="/admin/audit-logs">
                {{ 'ADMIN_DASHBOARD_AUDIT' | translate }}
              </a>
              <a class="btn btn-outline-secondary btn-sm" routerLink="/admin/reports">
                {{ 'ADMIN_DASHBOARD_REPORTS_BTN' | translate }}
              </a>
            </div>
          </div>
        </div>
      </section>
    } @else {
      <!-- Charts skeleton -->
      <div class="row g-3 mb-3">
        @for (i of [1,2,3]; track i) {
          <div class="col-lg-4">
            <div class="surface p-3 placeholder-glow" aria-hidden="true">
              <span class="placeholder col-5 mb-3 d-block rounded"></span>
              <div class="rounded" style="height:220px;background:var(--app-border);opacity:.3;"></div>
            </div>
          </div>
        }
      </div>
    }

    <!-- ── Recent Activity Timeline ───────────────────────────── -->
    <section class="surface p-3">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="h6 fw-semibold mb-0">{{ 'ADMIN_DASHBOARD_RECENT' | translate }}</h2>
        <a class="btn btn-link btn-sm p-0" routerLink="/admin/audit-logs">
          {{ 'ADMIN_DASHBOARD_VIEW_ALL' | translate }}
        </a>
      </div>
      @if (recentLogs().length > 0) {
        <ol class="list-unstyled mb-0 position-relative" style="padding-left:1.5rem">
          <div class="position-absolute top-0 bottom-0 start-0" style="width:2px;background:var(--app-border);margin-left:.4rem"></div>
          @for (log of recentLogs(); track log.id) {
            <li class="mb-3 position-relative">
              <span class="position-absolute" style="width:10px;height:10px;background:var(--bs-primary);border-radius:50%;left:-1.5rem;top:.3rem"></span>
              <div class="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                <div>
                  <strong class="small">{{ log.actor }}</strong>
                  <span class="text-body-secondary small"> · {{ actionLabel(log.action) }}</span>
                  <p class="mb-0 small text-body-secondary">{{ log.entity }}</p>
                </div>
                <span class="text-body-secondary small text-nowrap">{{ log.createdAt | appDate }}</span>
              </div>
            </li>
          }
        </ol>
      } @else {
        <div class="text-center py-4 text-body-secondary">
          <span class="fs-2">📋</span>
          <p class="mb-0 small mt-2">{{ 'ADMIN_DASHBOARD_NO_ACTIVITY' | translate }}</p>
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
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
      { icon: '👥', labelKey: 'ADMIN_DASHBOARD_TOTAL_EMP',  value: s.employees,       trendKey: 'ADMIN_DASHBOARD_THIS_MONTH', trendClass: 'text-bg-success', color: '#0f6cbd' },
      { icon: '✅', labelKey: 'ADMIN_DASHBOARD_ACTIVE_EMP', value: s.activeEmployees, trendKey: undefined,                   trendClass: '',                color: '#198754' },
      { icon: '🏖️', labelKey: 'ADMIN_DASHBOARD_ON_LEAVE',   value: s.onLeave,         trendKey: undefined,                   trendClass: '',                color: '#fd7e14' },
      { icon: '🏢', labelKey: 'ADMIN_DASHBOARD_DEPTS',       value: s.departments,     trendKey: undefined,                   trendClass: '',                color: '#6f42c1' }
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
