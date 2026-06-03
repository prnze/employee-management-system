import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthStateService } from '@core/auth/auth-state.service';
import { EmployeeAnalytics, UpcomingTask } from '@core/models/analytics.models';
import { LineChartComponent } from '@shared/components/charts/line-chart/line-chart.component';
import { BarChartComponent } from '@shared/components/charts/bar-chart/bar-chart.component';
import { ChartCardComponent } from '@shared/components/charts/chart-card/chart-card.component';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [RouterLink, LineChartComponent, BarChartComponent, ChartCardComponent, AppDatePipe],
  template: `
    <!-- ── Header ─────────────────────────────────────────────── -->
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h1 class="h3 mb-1">Welcome back, {{ firstName() }} 👋</h1>
        <p class="text-body-secondary mb-0 small">{{ today }}</p>
      </div>
      <a class="btn btn-outline-primary btn-sm" routerLink="/employee/attendance">📅 Log Attendance</a>
    </div>

    @if (analytics(); as a) {
      <!-- ── KPI Cards ────────────────────────────────────────── -->
      <section class="row g-3 mb-4" aria-label="Personal metrics">
        @for (card of kpiCards(a.summary); track card.label) {
          <div class="col-6 col-xl-3">
            <article class="surface p-3 h-100 d-flex flex-column" [style.border-left]="'4px solid ' + card.color">
              <span class="mb-1" style="font-size:1.5rem">{{ card.icon }}</span>
              <p class="text-body-secondary mb-1 small">{{ card.label }}</p>
              <strong class="fs-2 lh-1 mb-1">{{ card.value }}</strong>
              @if (card.sub) {
                <span class="text-body-secondary small mt-auto">{{ card.sub }}</span>
              }
            </article>
          </div>
        }
      </section>

      <!-- ── Charts Row ───────────────────────────────────────── -->
      <section class="row g-3 mb-3">
        <!-- Attendance Trend -->
        <div class="col-lg-6">
          <app-chart-card title="Attendance Trend" badge="Last 8 weeks" badgeClass="text-bg-success" skeletonHeight="220px">
            <app-line-chart
              [dataPoints]="a.attendanceTrend"
              label="Attendance %"
              color="#198754"
              yLabel="%"
              height="220px" />
          </app-chart-card>
        </div>

        <!-- Task Completion -->
        <div class="col-lg-6">
          <app-chart-card title="Tasks Completed" badge="Per week" skeletonHeight="220px">
            <app-bar-chart
              [dataPoints]="a.taskCompletionTrend"
              label="Tasks"
              yLabel="Tasks"
              height="220px" />
          </app-chart-card>
        </div>
      </section>

      <!-- ── Personal Activity Summary + Upcoming Tasks ─────── -->
      <section class="row g-3">
        <!-- Activity Summary -->
        <div class="col-lg-6">
          <div class="surface p-3 h-100">
            <h2 class="h6 fw-semibold mb-3">Activity Summary</h2>
            <div class="row g-3">
              @for (stat of activityStats(a.summary); track stat.label) {
                <div class="col-6">
                  <div class="p-3 rounded border text-center h-100">
                    <div class="fs-2 fw-bold" [class]="stat.colorClass">{{ stat.value }}</div>
                    <div class="text-body-secondary small">{{ stat.label }}</div>
                    <div class="progress mt-2" style="height:5px">
                      <div class="progress-bar" [class]="stat.barClass" [style.width]="stat.pct + '%'"></div>
                    </div>
                    <div class="text-body-secondary small mt-1">{{ stat.sub }}</div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Upcoming Tasks Widget -->
        <div class="col-lg-6">
          <div class="surface p-3 h-100 d-flex flex-column">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h2 class="h6 fw-semibold mb-0">Upcoming Tasks</h2>
              <a class="btn btn-link btn-sm p-0" routerLink="/employee/tasks">View all →</a>
            </div>
            @if (a.upcomingTasks.length > 0) {
              <ul class="list-unstyled mb-0 flex-grow-1">
                @for (task of a.upcomingTasks; track task.id) {
                  <li class="d-flex align-items-start gap-2 mb-3">
                    <span class="badge mt-1 flex-shrink-0" [class]="priorityClass(task.priority)">{{ task.priority }}</span>
                    <div class="flex-grow-1 min-w-0">
                      <p class="mb-0 fw-semibold small text-truncate">{{ task.title }}</p>
                      <p class="mb-0 text-body-secondary small">
                        <span class="badge text-bg-secondary me-1">{{ task.category }}</span>
                        Due {{ task.dueDate | appDate }}
                        <span [class]="dueSoonClass(task.dueDate)">{{ dueSoonLabel(task.dueDate) }}</span>
                      </p>
                    </div>
                  </li>
                }
              </ul>
            } @else {
              <div class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-body-secondary">
                <span class="fs-2">✅</span>
                <p class="mb-0 small mt-2">All caught up!</p>
              </div>
            }
          </div>
        </div>
      </section>

    } @else if (error()) {
      <!-- ── Error state ───────────────────────────────────────── -->
      <div class="surface p-5 text-center">
        <span class="fs-1 d-block mb-3">⚠️</span>
        <h2 class="h5 text-danger">Dashboard unavailable</h2>
        <p class="text-body-secondary">Could not load your analytics. Please try refreshing.</p>
        <button class="btn btn-primary btn-sm" type="button" (click)="reload()">Reload</button>
      </div>

    } @else {
      <!-- ── Loading skeletons ──────────────────────────────────── -->
      <section class="row g-3 mb-4">
        @for (i of [1,2,3,4]; track i) {
          <div class="col-6 col-xl-3">
            <div class="surface p-3 placeholder-glow" aria-hidden="true">
              <span class="placeholder col-8 mb-2 d-block rounded"></span>
              <span class="placeholder col-4 rounded" style="height:2rem;display:block"></span>
            </div>
          </div>
        }
      </section>
      <div class="row g-3">
        @for (i of [1,2]; track i) {
          <div class="col-lg-6">
            <div class="surface p-3 placeholder-glow" aria-hidden="true">
              <span class="placeholder col-4 mb-3 d-block rounded"></span>
              <div class="rounded" style="height:220px;background:var(--app-border);opacity:.3;"></div>
            </div>
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDashboardComponent {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly authState        = inject(AuthStateService);

  readonly today     = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  readonly firstName = computed(() => this.authState.user()?.fullName.split(' ')[0] ?? 'there');
  readonly error     = computed(() => this._error());

  private readonly _error = (() => {
    let hasError = false;
    return computed(() => hasError ? 'Failed to load analytics' : '');
  })();

  readonly analytics = toSignal(
    this.analyticsService.employeeAnalytics().pipe(
      catchError(() => of(null))
    )
  );

  reload(): void { window.location.reload(); }

  kpiCards(s: EmployeeAnalytics['summary']) {
    const attRate = this.attendanceRate(s);
    return [
      { icon: '✅', label: 'Days Present',    value: s.totalPresent,    sub: `${s.totalAbsent} day(s) absent`, color: '#198754' },
      { icon: '📋', label: 'Tasks Completed', value: s.tasksCompleted,  sub: `${s.tasksPending} pending`,      color: '#0f6cbd' },
      { icon: '🏖️', label: 'Leave Balance',   value: s.leaveBalance,    sub: 'of 30 days total',              color: '#fd7e14' },
      { icon: '📈', label: 'Attendance Rate', value: attRate + '%',     sub: 'this month',                    color: '#6f42c1' }
    ];
  }

  activityStats(s: EmployeeAnalytics['summary']) {
    const attRate  = this.attendanceRate(s);
    const taskRate = this.taskRate(s);
    return [
      { label: 'Days Present', value: s.totalPresent, colorClass: 'text-success', barClass: 'bg-success', pct: attRate,  sub: `${attRate}% attendance` },
      { label: 'Tasks Done',   value: s.tasksCompleted, colorClass: 'text-primary', barClass: 'bg-primary', pct: taskRate, sub: `${s.tasksPending} pending` },
      { label: 'Days Absent',  value: s.totalAbsent,  colorClass: 'text-danger',  barClass: 'bg-danger',  pct: Math.round((s.totalAbsent / (s.totalPresent + s.totalAbsent || 1)) * 100), sub: 'this month' },
      { label: 'Leave Left',   value: s.leaveBalance, colorClass: 'text-warning', barClass: 'bg-warning', pct: Math.round((s.leaveBalance / 30) * 100), sub: 'of 30 days' }
    ];
  }

  priorityClass(priority: UpcomingTask['priority']): string {
    return { High: 'text-bg-danger', Medium: 'text-bg-warning text-dark', Low: 'text-bg-secondary' }[priority];
  }

  dueSoonClass(dueDate: string): string {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000);
    return days <= 3 ? 'text-danger fw-semibold ms-1' : days <= 7 ? 'text-warning ms-1' : '';
  }

  dueSoonLabel(dueDate: string): string {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000);
    if (days < 0)  return '(overdue)';
    if (days === 0) return '(today)';
    if (days <= 3)  return `(${days}d)`;
    return '';
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
