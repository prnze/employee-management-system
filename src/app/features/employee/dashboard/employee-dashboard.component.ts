import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnalyticsService } from '@core/services/analytics.service';
import { LineChartComponent } from '@shared/components/charts/line-chart/line-chart.component';
import { BarChartComponent } from '@shared/components/charts/bar-chart/bar-chart.component';
import { AuthStateService } from '@core/auth/auth-state.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [LineChartComponent, BarChartComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="h3 mb-1">Welcome back, {{ firstName() }} 👋</h1>
        <p class="text-body-secondary mb-0 small">{{ today }}</p>
      </div>
    </div>

    <!-- KPI cards -->
    @if (analytics(); as a) {
      <section class="row g-3 mb-4" aria-label="Personal metrics">
        @for (card of kpiCards(a.summary); track card.label) {
          <div class="col-6 col-xl-3">
            <article class="surface p-3 h-100 d-flex flex-column gap-1">
              <span class="fs-1 mb-1">{{ card.icon }}</span>
              <p class="text-body-secondary mb-1 small">{{ card.label }}</p>
              <strong class="fs-3 lh-1">{{ card.value }}</strong>
              @if (card.sub) {
                <span class="text-body-secondary small mt-auto">{{ card.sub }}</span>
              }
            </article>
          </div>
        }
      </section>

      <!-- Charts -->
      <section class="row g-3 mb-3">
        <!-- Attendance trend (Line) -->
        <div class="col-lg-6">
          <div class="surface p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 fw-semibold mb-0">Attendance Trend</h2>
              <span class="badge text-bg-success">Last 8 weeks</span>
            </div>
            <app-line-chart
              [dataPoints]="a.attendanceTrend"
              label="Attendance %"
              color="#198754"
              yLabel="%"
              height="220px"
            />
          </div>
        </div>

        <!-- Task Completion (Bar) -->
        <div class="col-lg-6">
          <div class="surface p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 fw-semibold mb-0">Tasks Completed</h2>
              <span class="badge text-bg-primary">Per week</span>
            </div>
            <app-bar-chart
              [dataPoints]="a.taskCompletionTrend"
              label="Tasks"
              yLabel="Tasks"
              height="220px"
            />
          </div>
        </div>
      </section>

      <!-- Activity summary -->
      <section class="surface p-3">
        <h2 class="h6 fw-semibold mb-3">Activity Summary</h2>
        <div class="row g-3">
          <div class="col-md-4">
            <div class="p-3 rounded border text-center">
              <div class="fs-2 fw-bold text-success">{{ a.summary.totalPresent }}</div>
              <div class="text-body-secondary small">Days Present</div>
              <div class="progress mt-2" style="height:6px">
                <div class="progress-bar bg-success" [style.width]="attendanceRate(a.summary) + '%'"></div>
              </div>
              <div class="text-body-secondary small mt-1">{{ attendanceRate(a.summary) }}% this month</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3 rounded border text-center">
              <div class="fs-2 fw-bold text-primary">{{ a.summary.tasksCompleted }}</div>
              <div class="text-body-secondary small">Tasks Done</div>
              <div class="progress mt-2" style="height:6px">
                <div class="progress-bar bg-primary" [style.width]="taskRate(a.summary) + '%'"></div>
              </div>
              <div class="text-body-secondary small mt-1">{{ a.summary.tasksPending }} pending</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3 rounded border text-center">
              <div class="fs-2 fw-bold text-warning">{{ a.summary.leaveBalance }}</div>
              <div class="text-body-secondary small">Leave Balance</div>
              <div class="progress mt-2" style="height:6px">
                <div class="progress-bar bg-warning" [style.width]="(a.summary.leaveBalance / 30 * 100) + '%'"></div>
              </div>
              <div class="text-body-secondary small mt-1">of 30 days total</div>
            </div>
          </div>
        </div>
      </section>
    } @else {
      <!-- Skeleton loader -->
      <section class="row g-3 mb-4">
        @for (i of [1,2,3,4]; track i) {
          <div class="col-6 col-xl-3">
            <div class="surface p-3 placeholder-glow" aria-hidden="true">
              <span class="placeholder col-8 mb-2 d-block"></span>
              <span class="placeholder col-4 fs-3 d-block"></span>
            </div>
          </div>
        }
      </section>
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
export class EmployeeDashboardComponent {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly authState        = inject(AuthStateService);

  readonly today     = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  readonly analytics = toSignal(this.analyticsService.employeeAnalytics());
  readonly firstName = computed(() => this.authState.user()?.fullName.split(' ')[0] ?? 'there');

  kpiCards(summary: { totalPresent: number; totalAbsent: number; tasksCompleted: number; tasksPending: number; leaveBalance: number }) {
    return [
      { icon: '✅', label: 'Days Present',    value: summary.totalPresent,    sub: `${summary.totalAbsent} absent` },
      { icon: '📋', label: 'Tasks Completed', value: summary.tasksCompleted,  sub: `${summary.tasksPending} pending` },
      { icon: '🏖️', label: 'Leave Balance',   value: summary.leaveBalance,    sub: 'days remaining' },
      { icon: '📈', label: 'Attendance Rate', value: this.attendanceRate(summary) + '%', sub: 'this month' }
    ];
  }

  attendanceRate(summary: { totalPresent: number; totalAbsent: number }): number {
    const total = summary.totalPresent + summary.totalAbsent;
    return total ? Math.round((summary.totalPresent / total) * 100) : 0;
  }

  taskRate(summary: { tasksCompleted: number; tasksPending: number }): number {
    const total = summary.tasksCompleted + summary.tasksPending;
    return total ? Math.round((summary.tasksCompleted / total) * 100) : 0;
  }
}
