import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { AnalyticsService } from '@core/services/analytics.service';
import { AdminAnalytics } from '@core/models/analytics.models';
import { LineChartComponent } from '@shared/components/charts/line-chart/line-chart.component';
import { BarChartComponent } from '@shared/components/charts/bar-chart/bar-chart.component';
import { DoughnutChartComponent } from '@shared/components/charts/doughnut-chart/doughnut-chart.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, LineChartComponent, BarChartComponent, DoughnutChartComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0">Admin Dashboard</h1>
      <span class="text-body-secondary small">{{ today }}</span>
    </div>

    <!-- KPI cards -->
    @if (stats(); as stats) {
      <section class="row g-3 mb-4" aria-label="Key metrics">
        @for (card of kpiCards(stats); track card.label) {
          <div class="col-6 col-xl-3">
            <article class="surface p-3 h-100 d-flex flex-column gap-1">
              <span class="fs-1 mb-1">{{ card.icon }}</span>
              <p class="text-body-secondary mb-1 small">{{ card.label }}</p>
              <strong class="fs-3 lh-1">{{ card.value }}</strong>
              @if (card.trend) {
                <span class="badge text-bg-success mt-auto align-self-start">{{ card.trend }}</span>
              }
            </article>
          </div>
        }
      </section>
    } @else {
      <!-- KPI skeleton -->
      <section class="row g-3 mb-4">
        @for (i of [1,2,3,4]; track i) {
          <div class="col-6 col-xl-3">
            <div class="surface p-3 placeholder-glow" aria-hidden="true">
              <span class="placeholder col-6 mb-2 d-block"></span>
              <span class="placeholder col-4 fs-3 d-block"></span>
            </div>
          </div>
        }
      </section>
    }

    <!-- Charts row 1 -->
    @if (analytics(); as a) {
      <section class="row g-3 mb-3">
        <!-- Employee Growth (Line) -->
        <div class="col-lg-8">
          <div class="surface p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 fw-semibold mb-0">Employee Growth</h2>
              <span class="badge text-bg-primary">Last 6 months</span>
            </div>
            <app-line-chart
              [dataPoints]="a.employeeGrowth"
              label="Headcount"
              color="#0f6cbd"
              yLabel="Employees"
              height="240px"
            />
          </div>
        </div>

        <!-- Department Distribution (Doughnut) -->
        <div class="col-lg-4">
          <div class="surface p-3 h-100">
            <h2 class="h6 fw-semibold mb-3">Department Split</h2>
            <app-doughnut-chart
              [dataPoints]="a.departmentDistribution"
              height="240px"
            />
            <!-- Legend -->
            <ul class="list-unstyled mt-3 mb-0 small">
              @for (dept of a.departmentDistribution; track dept.label) {
                <li class="d-flex align-items-center gap-2 mb-1">
                  <span class="rounded-circle d-inline-block flex-shrink-0" style="width:10px;height:10px" [style.background]="dept.color"></span>
                  <span class="flex-grow-1 text-body-secondary">{{ dept.label }}</span>
                  <strong>{{ dept.value }}</strong>
                </li>
              }
            </ul>
          </div>
        </div>
      </section>

      <!-- Charts row 2 -->
      <section class="row g-3">
        <!-- Monthly Activity (Bar) -->
        <div class="col-lg-7">
          <div class="surface p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 fw-semibold mb-0">Monthly Activity</h2>
              <span class="badge text-bg-secondary">Events</span>
            </div>
            <app-bar-chart
              [dataPoints]="a.monthlyActivity"
              label="Activity events"
              yLabel="Events"
              height="220px"
            />
          </div>
        </div>

        <!-- Status Breakdown (Doughnut) + Quick Actions -->
        <div class="col-lg-5">
          <div class="row g-3 h-100">
            <div class="col-12">
              <div class="surface p-3">
                <h2 class="h6 fw-semibold mb-3">Employee Status</h2>
                <app-doughnut-chart
                  [dataPoints]="a.statusBreakdown"
                  height="160px"
                />
                <div class="d-flex justify-content-center gap-3 mt-3 small">
                  @for (s of a.statusBreakdown; track s.label) {
                    <span class="d-flex align-items-center gap-1">
                      <span class="rounded-circle d-inline-block" style="width:8px;height:8px" [style.background]="s.color"></span>
                      {{ s.label }}&nbsp;<strong>{{ s.value }}</strong>
                    </span>
                  }
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="surface p-3">
                <h2 class="h6 fw-semibold mb-3">Quick Actions</h2>
                <div class="d-grid gap-2">
                  <a class="btn btn-primary btn-sm" routerLink="/admin/employees/create">+ Create Employee</a>
                  <a class="btn btn-outline-primary btn-sm" routerLink="/admin/reports">View Reports</a>
                  <a class="btn btn-outline-secondary btn-sm" routerLink="/admin/audit-logs">Audit Logs</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    } @else {
      <!-- Charts skeleton -->
      <div class="row g-3">
        @for (i of [1,2]; track i) {
          <div class="col-lg-6">
            <div class="surface p-3 placeholder-glow" aria-hidden="true">
              <span class="placeholder col-4 mb-3 d-block"></span>
              <div style="height:220px;background:var(--app-border);border-radius:0.5rem;opacity:.3;"></div>
            </div>
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  private readonly route            = inject(ActivatedRoute);
  private readonly analyticsService = inject(AnalyticsService);

  readonly today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  readonly stats     = toSignal(this.route.data.pipe(map((d) => d['stats'])));
  readonly analytics = toSignal(this.analyticsService.adminAnalytics());

  kpiCards(stats: { employees: number; activeUsers: number; pendingTasks: number; unreadNotifications: number }) {
    return [
      { icon: '👥', label: 'Total Employees',       value: stats.employees,            trend: '+3 this month' },
      { icon: '✅', label: 'Active Users',           value: stats.activeUsers,          trend: null },
      { icon: '📋', label: 'Pending Tasks',          value: stats.pendingTasks,         trend: null },
      { icon: '🔔', label: 'Unread Notifications',  value: stats.unreadNotifications,  trend: null }
    ];
  }
}
