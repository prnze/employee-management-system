import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import {
  AdminAnalytics, ActivityMetric, AttendanceMetric, DepartmentDistribution,
  EmployeeGrowthMetric, EmployeeAnalytics, UpcomingTask
} from '@core/models/analytics.models';
import { EmployeeService } from './employee.service';

/** Generates the last N month labels ending at the current month. */
function lastMonthLabels(n: number): string[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  return Array.from({ length: n }, (_, i) => months[(now.getMonth() - (n - 1 - i) + 12) % 12]);
}

/** Generates the last N ISO week labels. */
function lastWeekLabels(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `W${i + 1}`);
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly employeeService = inject(EmployeeService);

  adminAnalytics(): Observable<AdminAnalytics> {
    const labels = lastMonthLabels(12);
    // Derive live distribution from the actual employee signal
    const employees = this.employeeService.employees();
    const deptMap = new Map<string, number>();
    employees.forEach((e) => deptMap.set(e.department, (deptMap.get(e.department) ?? 0) + 1));
    const palette = ['#0f6cbd', '#198754', '#fd7e14', '#6f42c1', '#d63384', '#0dcaf0'];
    const departmentDistribution: DepartmentDistribution[] = Array.from(deptMap.entries())
      .map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));

    const active   = employees.filter((e) => e.status === 'Active').length;
    const onLeave  = employees.filter((e) => e.status === 'On Leave').length;
    const inactive = employees.filter((e) => e.status === 'Inactive').length;

    // Realistic 12-month growth curve (starts low, grows to current headcount)
    const total = employees.length;
    const growth: EmployeeGrowthMetric[] = labels.map((label, i) => ({
      label,
      value: Math.max(1, Math.round(total * (0.55 + (i / 11) * 0.45) + (Math.sin(i) * 1.5)))
    }));
    growth[11] = { label: labels[11], value: total }; // last month = real count

    const monthlyActivity: ActivityMetric[] = [
      { label: labels[0],  value: 142 }, { label: labels[1],  value: 178 },
      { label: labels[2],  value: 165 }, { label: labels[3],  value: 210 },
      { label: labels[4],  value: 198 }, { label: labels[5],  value: 231 },
      { label: labels[6],  value: 219 }, { label: labels[7],  value: 245 },
      { label: labels[8],  value: 260 }, { label: labels[9],  value: 238 },
      { label: labels[10], value: 275 }, { label: labels[11], value: 290 }
    ];

    return of<AdminAnalytics>({
      employeeGrowth: growth,
      departmentDistribution,
      monthlyActivity,
      statusBreakdown: [
        { label: 'Active',   value: active,   color: '#198754' },
        { label: 'On Leave', value: onLeave,  color: '#fd7e14' },
        { label: 'Inactive', value: inactive, color: '#dc3545' }
      ]
    }).pipe(delay(250));
  }

  employeeAnalytics(): Observable<EmployeeAnalytics> {
    const weeks = lastWeekLabels(8);
    const attendanceTrend: AttendanceMetric[] = [
      { label: weeks[0], value: 100 }, { label: weeks[1], value: 80  },
      { label: weeks[2], value: 100 }, { label: weeks[3], value: 60  },
      { label: weeks[4], value: 100 }, { label: weeks[5], value: 100 },
      { label: weeks[6], value: 80  }, { label: weeks[7], value: 100 }
    ];
    const taskCompletionTrend: ActivityMetric[] = [
      { label: weeks[0], value: 3 }, { label: weeks[1], value: 5 },
      { label: weeks[2], value: 2 }, { label: weeks[3], value: 7 },
      { label: weeks[4], value: 4 }, { label: weeks[5], value: 6 },
      { label: weeks[6], value: 3 }, { label: weeks[7], value: 8 }
    ];
    const upcomingTasks: UpcomingTask[] = [
      { id: 't1', title: 'Submit Q2 self-review',     dueDate: '2026-06-10', priority: 'High',   category: 'HR' },
      { id: 't2', title: 'Update tax declaration',    dueDate: '2026-06-15', priority: 'High',   category: 'Finance' },
      { id: 't3', title: 'Complete safety training',  dueDate: '2026-06-20', priority: 'Medium', category: 'Compliance' },
      { id: 't4', title: 'Team retrospective prep',   dueDate: '2026-06-25', priority: 'Medium', category: 'Team' },
      { id: 't5', title: 'Update emergency contacts', dueDate: '2026-06-30', priority: 'Low',    category: 'Profile' }
    ];
    return of<EmployeeAnalytics>({
      attendanceTrend,
      taskCompletionTrend,
      upcomingTasks,
      summary: { totalPresent: 19, totalAbsent: 3, tasksCompleted: 38, tasksPending: 5, leaveBalance: 12 }
    }).pipe(delay(200));
  }
}
