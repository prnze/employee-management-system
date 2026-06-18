import { computed, inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MonthlyDataPoint } from '@core/models/analytics.models';
import { AttendanceRecord, AttendanceRequest, CalendarDay } from '@core/models/attendance.models';
import { AttendanceService } from '@core/services/attendance.service';
import { CurrentEmployeeService } from '@core/services/current-employee.service';
import { ToastService } from '@core/services/toast.service';
import { switchMap } from 'rxjs';

interface LeaveBalance {
  name: string;
  used: number;
  total: number;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class AttendanceStore {
  private readonly attendanceService = inject(AttendanceService);
  private readonly currentEmployee = inject(CurrentEmployeeService);
  private readonly toast = inject(ToastService);
  private hasLoaded = false;

  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly currentYear = signal<number>(new Date().getFullYear());
  readonly currentMonth = signal<number>(new Date().getMonth());
  readonly isSubmittingLeave = signal<boolean>(false);

  readonly attendanceRecords = this.attendanceService.records;

  readonly leaveBalances = signal<LeaveBalance[]>([
    { name: 'Annual Leave', used: 6, total: 20, color: 'var(--app-brand)' },
    { name: 'Sick Leave', used: 2, total: 10, color: '#f59e0b' },
    { name: 'Personal Leave', used: 1, total: 5, color: '#6f42c1' }
  ]);

  readonly hoursTrendData = signal<MonthlyDataPoint[]>([
    { label: 'Jan 2026', value: 95.8 },
    { label: 'Feb 2026', value: 96.2 },
    { label: 'Mar 2026', value: 94.5 },
    { label: 'Apr 2026', value: 97.0 },
    { label: 'May 2026', value: 96.1 },
    { label: 'Jun 2026', value: 97.4 }
  ]);

  readonly todayDate = computed(() => this.toDateString(new Date()));

  readonly todayRecord = computed(() => {
    const today = this.todayDate();
    return this.attendanceRecords().find((record) => record.date === today) ?? null;
  });

  readonly isCheckedIn = computed(() => {
    const today = this.todayRecord();
    return today !== null && today.in !== null && today.out === null;
  });

  readonly isCheckedOut = computed(() => {
    const today = this.todayRecord();
    return today !== null && today.out !== null;
  });

  readonly selectedMonthRecords = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return [...this.attendanceRecords()]
      .filter((record) => record.date.startsWith(monthStr))
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  readonly statsPresentCount = computed(() => this.selectedMonthRecords().filter((record) => record.status === 'Present').length);
  readonly statsLateCount = computed(() => this.selectedMonthRecords().filter((record) => record.status === 'Late').length);
  readonly statsLeaveCount = computed(() => this.selectedMonthRecords().filter((record) => record.status === 'Leave').length);

  readonly statsAvgHours = computed(() => {
    const activeRecords = this.selectedMonthRecords().filter((record) => record.workHours !== undefined);
    if (activeRecords.length === 0) return 0;
    const total = activeRecords.reduce((acc, curr) => acc + (curr.workHours ?? 0), 0);
    return Math.round((total / activeRecords.length) * 10) / 10;
  });

  readonly statsAbsentCount = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const today = this.todayDate();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const endDay = today.startsWith(monthPrefix)
      ? new Date(today).getDate()
      : new Date(year, month + 1, 0).getDate();

    let absents = 0;
    for (let day = 1; day <= endDay; day++) {
      const dateStr = this.buildDateString(year, month, day);
      const record = this.attendanceRecords().find((item) => item.date === dateStr);
      if (record?.status === 'Absent') {
        absents++;
      } else if (!record && !this.isWeekend(year, month, day)) {
        absents++;
      }
    }
    return absents;
  });

  readonly calendarDays = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const today = this.todayDate();
    const days: CalendarDay[] = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateString: null, record: null, isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = this.buildDateString(year, month, day);
      const record = this.attendanceRecords().find((item) => item.date === dateStr) ?? null;
      const isToday = dateStr === today;

      let finalRecord = record;
      if (!finalRecord) {
        if (this.isWeekend(year, month, day)) {
          finalRecord = { date: dateStr, in: null, out: null, status: 'Weekend' };
        } else if (dateStr < today) {
          finalRecord = { date: dateStr, in: null, out: null, status: 'Absent' };
        }
      }

      days.push({ dayNumber: day, dateString: dateStr, record: finalRecord, isToday });
    }

    return days;
  });

  loadAttendance(force = false): void {
    if (this.hasLoaded && !force) return;
    this.loading.set(true);
    this.error.set('');
    this.currentEmployee.resolve().pipe(
      switchMap((employeeId) => this.attendanceService.getAttendance(employeeId))
    ).subscribe({
      next: () => {
        this.hasLoaded = true;
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  isWeekend(year: number, month: number, day: number): boolean {
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  prevMonth(): void {
    const month = this.currentMonth();
    if (month === 0) {
      this.currentMonth.set(11);
      this.currentYear.update((year) => year - 1);
    } else {
      this.currentMonth.update((current) => current - 1);
    }
  }

  nextMonth(): void {
    const month = this.currentMonth();
    if (month === 11) {
      this.currentMonth.set(0);
      this.currentYear.update((year) => year + 1);
    } else {
      this.currentMonth.update((current) => current + 1);
    }
  }

  checkIn(): void {
    const today = this.todayDate();
    this.currentEmployee.resolve().pipe(
      switchMap((employeeId) => {
        const request: AttendanceRequest = {
          employeeId,
          date: today,
          in: this.currentTime(),
          out: null,
          status: 'Present'
        };
        const existing = this.todayRecord();
        return existing?.id
          ? this.attendanceService.updateAttendance(existing.id, request)
          : this.attendanceService.createAttendance(request);
      })
    ).subscribe({
      next: (record) => this.toast.showToast('Successfully checked in today at ' + record.in, 'success'),
      error: (err: Error) => this.toast.showToast(err.message, 'error')
    });
  }

  checkOut(): void {
    const today = this.todayRecord();
    if (!today?.id) {
      this.toast.showToast('Please check in before checking out.', 'warning');
      return;
    }

    const timeOut = this.currentTime();
    this.attendanceService.updateAttendance(today.id, {
      out: timeOut,
      status: today.status === 'Late' ? 'Late' : 'Present'
    }).subscribe({
      next: (record) => this.toast.showToast('Successfully checked out today at ' + record.out, 'success'),
      error: (err: Error) => this.toast.showToast(err.message, 'error')
    });
  }

  submitLeave(leaveForm: FormGroup): void {
    if (leaveForm.invalid) {
      leaveForm.markAllAsTouched();
      return;
    }

    this.isSubmittingLeave.set(true);
    const formVal = leaveForm.getRawValue();
    this.currentEmployee.resolve().subscribe({
      next: (employeeId) => {
        const requests = this.buildLeaveRequests(formVal.startDate, formVal.endDate, employeeId);
        if (!requests.length) {
          this.isSubmittingLeave.set(false);
          this.toast.showToast('No work days found in the selected leave range.', 'warning');
          return;
        }
        this.saveLeaveRequests(requests, formVal.leaveType, leaveForm);
      },
      error: (err: Error) => {
        this.toast.showToast(err.message, 'error');
        this.isSubmittingLeave.set(false);
      }
    });
  }

  private buildLeaveRequests(startDate: string, endDate: string, employeeId: string): AttendanceRequest[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const requests: AttendanceRequest[] = [];

    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      const dayOfWeek = day.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        requests.push({
          employeeId,
          date: this.toDateString(day),
          in: null,
          out: null,
          status: 'Leave'
        });
      }
    }

    return requests;
  }

  private saveLeaveRequests(requests: AttendanceRequest[], leaveType: string, leaveForm: FormGroup): void {
    let remaining = requests.length;
    let failed = false;

    requests.forEach((request) => {
      const existing = this.attendanceRecords().find((record) => record.date === request.date);
      const action = existing?.id
        ? this.attendanceService.updateAttendance(existing.id, request)
        : this.attendanceService.createAttendance(request);

      action.subscribe({
        next: () => {
          remaining--;
          if (remaining === 0 && !failed) {
            this.incrementLeaveBalance(leaveType);
            this.toast.showToast('Leave request submitted and saved.', 'success');
            leaveForm.reset({ leaveType: 'Annual', startDate: '', endDate: '', reason: '' });
            this.isSubmittingLeave.set(false);
          }
        },
        error: (err: Error) => {
          if (!failed) {
            failed = true;
            this.toast.showToast(err.message, 'error');
            this.isSubmittingLeave.set(false);
          }
        }
      });
    });
  }

  private incrementLeaveBalance(leaveType: string): void {
    const leaveNameMap: Record<string, string> = {
      Annual: 'Annual Leave',
      Sick: 'Sick Leave',
      Personal: 'Personal Leave'
    };
    const typeLabel = leaveNameMap[leaveType] ?? 'Annual Leave';

    this.leaveBalances.update((balances) =>
      balances.map((balance) => balance.name === typeLabel
        ? { ...balance, used: Math.min(balance.used + 1, balance.total) }
        : balance
      )
    );
  }

  private currentTime(): string {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  private buildDateString(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  private toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
