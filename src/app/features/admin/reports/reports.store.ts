import { inject, Injectable, signal, computed, OnDestroy } from '@angular/core';
import { forkJoin, from, of, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AnalyticsService } from '@core/services/analytics.service';
import { EmployeeService } from '@core/services/employee.service';
import { SupabaseService } from '@core/services/supabase.service';
import { AdminAnalytics } from '@core/models/analytics.models';

export interface ReportHistoryRow {
  id: string;
  name: string;
  generatedBy: string;
  createdAt: string;
  format: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsStore implements OnDestroy {
  private readonly analyticsSvc = inject(AnalyticsService);
  private readonly employeeSvc = inject(EmployeeService);
  private readonly supabase = inject(SupabaseService);
  private realtimeChannel?: any;
  private readonly refresh$ = new Subject<void>();

  constructor() {
    this.refresh$.pipe(debounceTime(300)).subscribe(() => {
      this.loadReports(true);
    });

    if (typeof this.supabase.client.channel === 'function') {
      this.realtimeChannel = this.supabase.client
        .channel('dashboard-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'employees' },
          () => this.refresh$.next()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'attendance' },
          () => this.refresh$.next()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          () => this.refresh$.next()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'audit_logs' },
          () => this.refresh$.next()
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    if (this.realtimeChannel && typeof this.supabase.client.removeChannel === 'function') {
      this.supabase.client.removeChannel(this.realtimeChannel);
    }
    this.refresh$.complete();
  }

  // Core State
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string>('');
  private readonly _analytics = signal<AdminAnalytics | null>(null);

  readonly lastRefresh = signal<string>(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  readonly exportsCount = signal<number>(8);

  readonly scheduledReports = signal([
    { name: 'Weekly Attendance Summary', frequency: 'Every Friday at 17:00', nextRun: '2026-06-12 17:00', status: 'Active' },
    { name: 'Monthly Workforce Demographics', frequency: 'First of the Month at 08:00', nextRun: '2026-07-01 08:00', status: 'Active' },
    { name: 'Quarterly Security Compliance Audit', frequency: 'First Day of Quarter at 00:00', nextRun: '2026-07-01 00:00', status: 'Paused' }
  ]);

  readonly historyRows = signal<ReportHistoryRow[]>([
    { id: 'rh1', name: 'Workforce Roster Demographics', generatedBy: 'Avery Admin', createdAt: '2026-06-07 14:23', format: 'CSV', status: 'Completed' },
    { id: 'rh2', name: 'Monthly Security & Access Audit', generatedBy: 'Avery Admin', createdAt: '2026-06-05 09:11', format: 'Excel', status: 'Completed' },
    { id: 'rh3', name: 'Employee Utilization & Attendance', generatedBy: 'System', createdAt: '2026-06-01 00:00', format: 'PDF', status: 'Completed' }
  ]);

  // Executive KPI signals
  private readonly _attendanceRate = signal<string>('96.4%');
  private readonly _taskCompletion = signal<string>('88.2%');
  private readonly _growthRate = signal<string>('+14.8%');

  // Readonly Public Signals
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly analytics = this._analytics.asReadonly();

  readonly totalEmployees = computed(() => this.employeeSvc.employees().length);
  readonly attendanceRate = this._attendanceRate.asReadonly();
  readonly taskCompletion = this._taskCompletion.asReadonly();
  readonly growthRate = this._growthRate.asReadonly();

  loadReports(force = false, showToastFn?: () => void): void {
    this._loading.set(true);
    this._error.set('');

    forkJoin({
      analytics: this.analyticsSvc.adminAnalytics(),
      attendance: from(this.supabase.client.from('attendance').select('status')),
      tasks: from(this.supabase.client.from('tasks').select('status')),
      employees: from(this.supabase.client.from('employees').select('id'))
    }).subscribe({
      next: ({ analytics, attendance, tasks }) => {
        this._analytics.set(analytics);

        // Calculate attendanceRate
        const attRecords = attendance.data ?? [];
        const present = attRecords.filter((r: any) => {
          const s = String(r.status ?? '').toUpperCase();
          return s === 'PRESENT' || s === 'LATE';
        }).length;
        const totalAtt = attRecords.length;
        const attPct = totalAtt > 0 ? (present / totalAtt) * 100 : 96.4;
        this._attendanceRate.set(`${attPct.toFixed(1)}%`);

        // Calculate taskCompletion
        const tskRecords = tasks.data ?? [];
        const completed = tskRecords.filter((t: any) => {
          const s = String(t.status ?? '').toUpperCase();
          return s === 'COMPLETED' || s === 'DONE';
        }).length;
        const totalTasks = tskRecords.length;
        const tskPct = totalTasks > 0 ? (completed / totalTasks) * 100 : 88.2;
        this._taskCompletion.set(`${tskPct.toFixed(1)}%`);

        // Calculate growthRate
        const growthCurve = analytics.employeeGrowth;
        if (growthCurve.length >= 12) {
          const startCount = growthCurve[0].value;
          const endCount = growthCurve[11].value;
          const growthDiff = endCount - startCount;
          const pct = startCount > 0 ? (growthDiff / startCount) * 100 : 14.8;
          this._growthRate.set(`${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`);
        } else {
          this._growthRate.set('+14.8%');
        }

        this.lastRefresh.set(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        this._loading.set(false);
        if (showToastFn) {
          showToastFn();
        }
      },
      error: (err: Error) => {
        this._error.set(err.message);
        this._loading.set(false);
      }
    });
  }

  addHistoryRow(row: ReportHistoryRow): void {
    this.historyRows.update(rows => [row, ...rows]);
    this.exportsCount.update(c => c + 1);
  }

  incrementExports(): void {
    this.exportsCount.update(c => c + 1);
  }
}
