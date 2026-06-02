import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { AdminAnalytics, EmployeeAnalytics } from '@core/models/analytics.models';

/** Generates the last N month labels ending at the current month. */
function lastMonthLabels(n: number): string[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  return Array.from({ length: n }, (_, i) => months[(now.getMonth() - (n - 1 - i) + 12) % 12]);
}

/** Generates the last N week labels ending at the current week. */
function lastWeekLabels(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `W${i + 1}`);
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  adminAnalytics(): Observable<AdminAnalytics> {
    const labels = lastMonthLabels(6);
    return of<AdminAnalytics>({
      employeeGrowth: [
        { label: labels[0], value: 28 },
        { label: labels[1], value: 31 },
        { label: labels[2], value: 35 },
        { label: labels[3], value: 38 },
        { label: labels[4], value: 41 },
        { label: labels[5], value: 44 }
      ],
      departmentDistribution: [
        { label: 'Engineering', value: 18, color: '#0f6cbd' },
        { label: 'Product',     value: 8,  color: '#198754' },
        { label: 'People',      value: 6,  color: '#fd7e14' },
        { label: 'Finance',     value: 7,  color: '#6f42c1' },
        { label: 'Design',      value: 5,  color: '#d63384' }
      ],
      monthlyActivity: [
        { label: labels[0], value: 142 },
        { label: labels[1], value: 178 },
        { label: labels[2], value: 165 },
        { label: labels[3], value: 210 },
        { label: labels[4], value: 198 },
        { label: labels[5], value: 231 }
      ],
      statusBreakdown: [
        { label: 'Active',   value: 38, color: '#198754' },
        { label: 'On Leave', value: 4,  color: '#fd7e14' },
        { label: 'Inactive', value: 2,  color: '#dc3545' }
      ]
    }).pipe(delay(250));
  }

  employeeAnalytics(): Observable<EmployeeAnalytics> {
    const weeks = lastWeekLabels(8);
    return of<EmployeeAnalytics>({
      attendanceTrend: [
        { label: weeks[0], value: 100 },
        { label: weeks[1], value: 80 },
        { label: weeks[2], value: 100 },
        { label: weeks[3], value: 60 },
        { label: weeks[4], value: 100 },
        { label: weeks[5], value: 100 },
        { label: weeks[6], value: 80 },
        { label: weeks[7], value: 100 }
      ],
      taskCompletionTrend: [
        { label: weeks[0], value: 3 },
        { label: weeks[1], value: 5 },
        { label: weeks[2], value: 2 },
        { label: weeks[3], value: 7 },
        { label: weeks[4], value: 4 },
        { label: weeks[5], value: 6 },
        { label: weeks[6], value: 3 },
        { label: weeks[7], value: 8 }
      ],
      summary: {
        totalPresent: 19,
        totalAbsent: 3,
        tasksCompleted: 38,
        tasksPending: 5,
        leaveBalance: 12
      }
    }).pipe(delay(200));
  }
}
