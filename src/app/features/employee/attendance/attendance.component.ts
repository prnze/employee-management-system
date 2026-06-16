import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { LineChartComponent } from '@shared/components/charts/line-chart/line-chart.component';
import { TranslatePipe } from '@ngx-translate/core';
import { AttendanceStore } from './attendance.store';

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
export class AttendanceComponent implements OnInit {
  readonly APP_ICONS = APP_ICONS;
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AttendanceStore);

  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  readonly currentYear = this.store.currentYear;
  readonly currentMonth = this.store.currentMonth;
  readonly isSubmittingLeave = this.store.isSubmittingLeave;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly attendanceRecords = this.store.attendanceRecords;
  readonly leaveBalances = this.store.leaveBalances;
  readonly hoursTrendData = this.store.hoursTrendData;
  readonly todayRecord = this.store.todayRecord;
  readonly isCheckedIn = this.store.isCheckedIn;
  readonly isCheckedOut = this.store.isCheckedOut;
  readonly selectedMonthRecords = this.store.selectedMonthRecords;
  readonly statsPresentCount = this.store.statsPresentCount;
  readonly statsLateCount = this.store.statsLateCount;
  readonly statsLeaveCount = this.store.statsLeaveCount;
  readonly statsAvgHours = this.store.statsAvgHours;
  readonly statsAbsentCount = this.store.statsAbsentCount;
  readonly calendarDays = this.store.calendarDays;

  readonly leaveForm = this.fb.group({
    leaveType: ['Annual', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    reason: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit(): void {
    this.store.loadAttendance();
  }

  isWeekend(year: number, month: number, day: number): boolean {
    return this.store.isWeekend(year, month, day);
  }

  prevMonth(): void {
    this.store.prevMonth();
  }

  nextMonth(): void {
    this.store.nextMonth();
  }

  checkIn(): void {
    this.store.checkIn();
  }

  checkOut(): void {
    this.store.checkOut();
  }

  submitLeave(): void {
    this.store.submitLeave(this.leaveForm);
  }
}
