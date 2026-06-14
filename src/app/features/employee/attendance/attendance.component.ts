import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { ToastService } from '@core/services/toast.service';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { LineChartComponent } from '@shared/components/charts/line-chart/line-chart.component';
import { MonthlyDataPoint } from '@core/models/analytics.models';
import { TranslatePipe } from '@ngx-translate/core';

interface AttendanceRecord {
  date: string; // 'YYYY-MM-DD'
  in: string | null;
  out: string | null;
  status: 'Present' | 'Absent' | 'Late' | 'Leave' | 'Holiday' | 'Weekend';
  workHours?: number;
}

interface CalendarDay {
  dayNumber: number | null;
  dateString: string | null;
  record: AttendanceRecord | null;
  isToday: boolean;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    AppDatePipe,
    LineChartComponent,
    TranslatePipe
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceComponent {
  readonly APP_ICONS = APP_ICONS;
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  // Month names for display
  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar State signals
  readonly currentYear = signal<number>(2026);
  readonly currentMonth = signal<number>(5); // 0-indexed (June = 5)

  // Leave Form group
  readonly leaveForm: FormGroup;
  readonly isSubmittingLeave = signal<boolean>(false);

  // Mock Database of Attendance Records
  readonly attendanceRecords = signal<AttendanceRecord[]>([
    // June 2026
    { date: '2026-06-07', in: null, out: null, status: 'Weekend' },
    { date: '2026-06-06', in: null, out: null, status: 'Weekend' },
    { date: '2026-06-05', in: '09:02', out: '18:05', status: 'Present', workHours: 9.05 },
    { date: '2026-06-04', in: '09:12', out: '18:00', status: 'Present', workHours: 8.8 },
    { date: '2026-06-03', in: '08:55', out: '18:15', status: 'Present', workHours: 9.33 },
    { date: '2026-06-02', in: '09:04', out: '18:12', status: 'Present', workHours: 9.13 },
    { date: '2026-06-01', in: '09:18', out: '18:01', status: 'Late', workHours: 8.72 },
    // May 2026
    { date: '2026-05-31', in: null, out: null, status: 'Weekend' },
    { date: '2026-05-30', in: null, out: null, status: 'Weekend' },
    { date: '2026-05-29', in: '08:58', out: '18:02', status: 'Present', workHours: 9.07 },
    { date: '2026-05-28', in: '09:01', out: '17:59', status: 'Present', workHours: 8.97 },
    { date: '2026-05-27', in: '09:05', out: '18:10', status: 'Present', workHours: 9.08 },
    { date: '2026-05-26', in: '09:25', out: '18:00', status: 'Late', workHours: 8.58 },
    { date: '2026-05-25', in: '08:59', out: '18:05', status: 'Present', workHours: 9.1 },
    { date: '2026-05-24', in: null, out: null, status: 'Weekend' },
    { date: '2026-05-23', in: null, out: null, status: 'Weekend' },
    { date: '2026-05-22', in: '09:03', out: '18:02', status: 'Present', workHours: 8.98 },
    { date: '2026-05-21', in: '09:00', out: '18:00', status: 'Present', workHours: 9.0 },
    { date: '2026-05-20', in: '09:05', out: '18:05', status: 'Present', workHours: 9.0 },
    { date: '2026-05-19', in: '08:50', out: '18:02', status: 'Present', workHours: 9.2 },
    { date: '2026-05-18', in: '08:55', out: '18:00', status: 'Present', workHours: 9.08 },
    { date: '2026-05-17', in: null, out: null, status: 'Weekend' },
    { date: '2026-05-16', in: null, out: null, status: 'Weekend' },
    { date: '2026-05-15', in: null, out: null, status: 'Leave' },
    { date: '2026-05-14', in: null, out: null, status: 'Leave' },
    { date: '2026-05-13', in: '09:02', out: '18:01', status: 'Present', workHours: 8.98 },
    { date: '2026-05-12', in: '09:04', out: '18:00', status: 'Present', workHours: 8.93 },
    { date: '2026-05-11', in: '09:22', out: '18:04', status: 'Late', workHours: 8.7 },
    { date: '2026-05-10', in: null, out: null, status: 'Weekend' },
    { date: '2026-05-09', in: null, out: null, status: 'Weekend' },
    { date: '2026-05-08', in: '08:57', out: '18:00', status: 'Present', workHours: 9.05 },
    { date: '2026-05-07', in: '08:59', out: '18:02', status: 'Present', workHours: 9.05 },
    { date: '2026-05-06', in: '09:01', out: '18:05', status: 'Present', workHours: 9.07 },
    { date: '2026-05-05', in: '09:04', out: '18:00', status: 'Present', workHours: 8.93 },
    { date: '2026-05-04', in: '09:02', out: '18:11', status: 'Present', workHours: 9.15 },
    { date: '2026-05-03', in: null, out: null, status: 'Weekend' },
    { date: '2026-05-02', in: null, out: null, status: 'Weekend' },
    { date: '2026-05-01', in: null, out: null, status: 'Holiday' }
  ]);

  // Leave Balances
  readonly leaveBalances = signal([
    { name: 'Annual Leave', used: 6, total: 20, color: 'var(--app-brand)' },
    { name: 'Sick Leave', used: 2, total: 10, color: '#f59e0b' },
    { name: 'Personal Leave', used: 1, total: 5, color: '#6f42c1' }
  ]);

  // Trend data for hours worked
  readonly hoursTrendData = signal<MonthlyDataPoint[]>([
    { label: 'Jan 2026', value: 95.8 },
    { label: 'Feb 2026', value: 96.2 },
    { label: 'Mar 2026', value: 94.5 },
    { label: 'Apr 2026', value: 97.0 },
    { label: 'May 2026', value: 96.1 },
    { label: 'Jun 2026', value: 97.4 }
  ]);

  constructor() {
    this.leaveForm = this.fb.group({
      leaveType: ['Annual', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  // Today is fixed to 2026-06-08
  readonly todayRecord = computed(() => {
    return this.attendanceRecords().find(r => r.date === '2026-06-08') || null;
  });

  readonly isCheckedIn = computed(() => {
    const today = this.todayRecord();
    return today !== null && today.in !== null && today.out === null;
  });

  readonly isCheckedOut = computed(() => {
    const today = this.todayRecord();
    return today !== null && today.out !== null;
  });

  // Selected Month Records
  readonly selectedMonthRecords = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return this.attendanceRecords()
      .filter(r => r.date.startsWith(monthStr))
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  // Computed Statistics
  readonly statsPresentCount = computed(() => {
    return this.selectedMonthRecords().filter(r => r.status === 'Present').length;
  });

  readonly statsLateCount = computed(() => {
    return this.selectedMonthRecords().filter(r => r.status === 'Late').length;
  });

  readonly statsLeaveCount = computed(() => {
    return this.selectedMonthRecords().filter(r => r.status === 'Leave').length;
  });

  readonly statsAvgHours = computed(() => {
    const activeRecords = this.selectedMonthRecords().filter(r => r.workHours !== undefined);
    if (activeRecords.length === 0) return 0;
    const total = activeRecords.reduce((acc, curr) => acc + (curr.workHours || 0), 0);
    return Math.round((total / activeRecords.length) * 10) / 10;
  });

  readonly statsAbsentCount = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    
    // If selected month is future/past, determine end limit
    const isCurrentMonth = year === 2026 && month === 5;
    const endDay = isCurrentMonth ? 8 : new Date(year, month + 1, 0).getDate();
    
    let absents = 0;
    for (let d = 1; d <= endDay; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const r = this.attendanceRecords().find(rec => rec.date === dateStr);
      if (r && r.status === 'Absent') {
        absents++;
      } else if (!r && !this.isWeekend(year, month, d)) {
        absents++;
      }
    }
    return absents;
  });

  // Calendar days grid calculation
  readonly calendarDays = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday...
    
    const days: CalendarDay[] = [];
    
    // Padding slots before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateString: null, record: null, isToday: false });
    }
    
    // Actual days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const record = this.attendanceRecords().find(r => r.date === dateStr) || null;
      const isToday = dateStr === '2026-06-08';
      
      let finalRec = record;
      if (!finalRec) {
        if (this.isWeekend(year, month, d)) {
          finalRec = { date: dateStr, in: null, out: null, status: 'Weekend' };
        } else if (dateStr < '2026-06-08') {
          // Any past weekday with no record defaults to Absent
          finalRec = { date: dateStr, in: null, out: null, status: 'Absent' };
        }
      }
      
      days.push({
        dayNumber: d,
        dateString: dateStr,
        record: finalRec,
        isToday
      });
    }
    
    return days;
  });

  isWeekend(year: number, month: number, day: number): boolean {
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  // Month navigation
  prevMonth(): void {
    const m = this.currentMonth();
    if (m === 0) {
      this.currentMonth.set(11);
      this.currentYear.update(y => y - 1);
    } else {
      this.currentMonth.update(curr => curr - 1);
    }
  }

  nextMonth(): void {
    const m = this.currentMonth();
    if (m === 11) {
      this.currentMonth.set(0);
      this.currentYear.update(y => y + 1);
    } else {
      this.currentMonth.update(curr => curr + 1);
    }
  }

  // Check In action
  checkIn(): void {
    const timeNow = '09:05';
    const newRecord: AttendanceRecord = {
      date: '2026-06-08',
      in: timeNow,
      out: null,
      status: 'Present'
    };

    this.attendanceRecords.update(records => {
      const filtered = records.filter(r => r.date !== '2026-06-08');
      return [newRecord, ...filtered];
    });

    this.toast.showToast('Successfully checked in today at ' + timeNow, 'success');
  }

  // Check Out action
  checkOut(): void {
    const today = this.todayRecord();
    const inTime = today?.in || '09:05';
    const timeOut = '18:00';

    const updatedRecord: AttendanceRecord = {
      date: '2026-06-08',
      in: inTime,
      out: timeOut,
      status: 'Present',
      workHours: 8.92
    };

    this.attendanceRecords.update(records => {
      const filtered = records.filter(r => r.date !== '2026-06-08');
      return [updatedRecord, ...filtered];
    });

    this.toast.showToast('Successfully checked out today at ' + timeOut, 'success');
  }

  // Request Leave Form Submit
  submitLeave(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    this.isSubmittingLeave.set(true);

    // Simulate API delay
    setTimeout(() => {
      const formVal = this.leaveForm.value;
      
      // Update leave balance locally
      const leaveNameMap: Record<string, string> = {
        'Annual': 'Annual Leave',
        'Sick': 'Sick Leave',
        'Personal': 'Personal Leave'
      };
      const typeLabel = leaveNameMap[formVal.leaveType] || 'Annual Leave';

      this.leaveBalances.update(balances => 
        balances.map(b => {
          if (b.name === typeLabel) {
            return { ...b, used: Math.min(b.used + 1, b.total) };
          }
          return b;
        })
      );

      // Add leave days to records
      const start = new Date(formVal.startDate);
      const end = new Date(formVal.endDate);
      const newLeaveRecords: AttendanceRecord[] = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        // Only mark week days as leave
        const dayOfWeek = d.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          newLeaveRecords.push({
            date: dateStr,
            in: null,
            out: null,
            status: 'Leave'
          });
        }
      }

      this.attendanceRecords.update(records => {
        // filter out any old record for these dates
        const datesToReplace = new Set(newLeaveRecords.map(r => r.date));
        const filtered = records.filter(r => !datesToReplace.has(r.date));
        return [...newLeaveRecords, ...filtered];
      });

      this.toast.showToast('Leave request submitted and auto-approved for simulation', 'success');
      this.leaveForm.reset({ leaveType: 'Annual', startDate: '', endDate: '', reason: '' });
      this.isSubmittingLeave.set(false);
    }, 1000);
  }
}
