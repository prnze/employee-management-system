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
  imports: [RouterLink, TranslatePipe, LineChartComponent, BarChartComponent, ChartCardComponent, AppDatePipe],
  template: `
    <!-- ── Header ─────────────────────────────────────────────── -->
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h1 class="h3 mb-1">{{ 'EMP_DASHBOARD_WELCOME' | translate }}, {{ firstName() }} 👋</h1>
        <p class="text-body-secondary mb-0 small">{{ today }}</p>
      </div>
      <a class="btn btn-outline-primary btn-sm" routerLink="/employee/attendance">
        {{ 'EMP_DASHBOARD_LOG_BTN' | translate }}
      </a>
    </div>

    @if (analytics(); as a) {
      <!-- ── KPI Cards ────────────────────────────────────────── -->
      <section class="row g-3 mb-4" aria-label="Personal metrics">
        @for (card of kpiCards(a.summary); track card.labelKey) {
          <div class="col-6 col-xl-3">
            <article class="surface p-3 h-100 d-flex flex-column" [style.border-left]="'4px solid ' + card.color">
              <span class="mb-1" style="font-size:1.5rem">{{ card.icon }}</span>
              <p class="text-body-secondary mb-1 small">{{ card.labelKey | translate }}</p>
              <strong class="fs-2 lh-1 mb-1">{{ card.value }}</strong>
              @if (card.subKey) {
                <span class="text-body-secondary small mt-auto">
                  @if (card.subNum !== undefined) { {{ card.subNum }} }
                  {{ card.subKey | translate }}
                </span>
              }
            </article>
          </div>
        }
      </section>

      <!-- ── Charts Row ───────────────────────────────────────── -->
      <section class="row g-3 mb-3">
        <!-- Attendance Trend -->
        <div class="col-lg-6">
          <app-chart-card
            [title]="'EMP_DASHBOARD_ATTEND_TREND' | translate"
            [badge]="'EMP_DASHBOARD_LAST_8WK' | translate"
            badgeClass="text-bg-success"
            skeletonHeight="220px">
            <app-line-chart
              [dataPoints]="a.attendanceTrend"
              [label]="'EMP_DASHBOARD_ATTEND_RATE' | translate"
              color="#198754"
              yLabel="%"
              height="220px" />
          </app-chart-card>
        </div>

        <!-- Task Completion -->
        <div class="col-lg-6">
          <app-chart-card
            [title]="'EMP_DASHBOARD_TASKS_TREND' | translate"
            [badge]="'EMP_DASHBOARD_PER_WEEK' | translate"
            skeletonHeight="220px">
            <app-bar-chart
              [dataPoints]="a.taskCompletionTrend"
              [label]="'EMP_DASHBOARD_TASKS_DONE' | translate"
              [yLabel]="'EMP_DASHBOARD_TASKS_DONE' | translate"
              height="220px" />
          </app-chart-card>
        </div>
      </section>

      <!-- ── Personal Activity Summary + Upcoming Tasks ─────── -->
      <section class="row g-3">
        <!-- Activity Summary -->
        <div class="col-lg-6">
          <div class="surface p-3 h-100">
            <h2 class="h6 fw-semibold mb-3">{{ 'EMP_DASHBOARD_ACTIVITY_SUM' | translate }}</h2>
            <div class="row g-3">
              @for (stat of activityStats(a.summary); track stat.labelKey) {
                <div class="col-6">
                  <div class="p-3 rounded border text-center h-100">
                    <div class="fs-2 fw-bold" [class]="stat.colorClass">{{ stat.value }}</div>
                    <div class="text-body-secondary small">{{ stat.labelKey | translate }}</div>
                    <div class="progress mt-2" style="height:5px">
                      <div class="progress-bar" [class]="stat.barClass" [style.width]="stat.pct + '%'"></div>
                    </div>
                    <div class="text-body-secondary small mt-1">
                      @if (stat.subNum !== undefined) { {{ stat.subNum }} }
                      {{ stat.subKey | translate }}
                    </div>
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
              <h2 class="h6 fw-semibold mb-0">{{ 'EMP_DASHBOARD_UPCOMING' | translate }}</h2>
              <a class="btn btn-link btn-sm p-0" routerLink="/employee/tasks">
                {{ 'EMP_DASHBOARD_VIEW_TASKS' | translate }}
              </a>
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
                        {{ 'EMP_DASHBOARD_DUE' | translate }} {{ task.dueDate | appDate }}
                        <!-- dueSoonKey() returns a translation key or '' — the translate pipe handles both -->
                        @if (dueSoonKey(task.dueDate)) {
                          <span [class]="dueSoonClass(task.dueDate)">{{ dueSoonKey(task.dueDate) | translate }}</span>
                        }
                        @if (dueSoonDays(task.dueDate) > 0 && dueSoonDays(task.dueDate) <= 3) {
                          <span [class]="dueSoonClass(task.dueDate)">({{ dueSoonDays(task.dueDate) }}d)</span>
                        }
                      </p>
                    </div>
                  </li>
                }
              </ul>
            } @else {
              <div class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-body-secondary">
                <span class="fs-2">✅</span>
                <p class="mb-0 small mt-2">{{ 'EMP_DASHBOARD_ALL_CAUGHT' | translate }}</p>
              </div>
            }
          </div>
        </div>
      </section>

    } @else if (error()) {
      <!-- ── Error state ───────────────────────────────────────── -->
      <div class="surface p-5 text-center">
        <span class="fs-1 d-block mb-3">⚠️</span>
        <h2 class="h5 text-danger">{{ 'EMP_DASHBOARD_ERROR_TITLE' | translate }}</h2>
        <p class="text-body-secondary">{{ 'EMP_DASHBOARD_ERROR_MSG' | translate }}</p>
        <button class="btn btn-primary btn-sm" type="button" (click)="reload()">
          {{ 'EMP_DASHBOARD_RELOAD_BTN' | translate }}
        </button>
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
      { icon: '✅', labelKey: 'EMP_DASHBOARD_DAYS_PRESENT', value: s.totalPresent,   subNum: s.totalAbsent,   subKey: 'EMP_DASHBOARD_ABSENT_SUB', color: '#198754' },
      { icon: '📋', labelKey: 'EMP_DASHBOARD_TASKS_DONE',   value: s.tasksCompleted, subNum: s.tasksPending,  subKey: 'EMP_DASHBOARD_PENDING',    color: '#0f6cbd' },
      { icon: '🏖️', labelKey: 'EMP_DASHBOARD_LEAVE_LEFT',   value: s.leaveBalance,   subNum: undefined,       subKey: 'EMP_DASHBOARD_30_DAYS',    color: '#fd7e14' },
      { icon: '📈', labelKey: 'EMP_DASHBOARD_ATTEND_RATE',  value: attRate + '%',     subNum: undefined,       subKey: 'EMP_DASHBOARD_RATE_SUB',   color: '#6f42c1' }
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
