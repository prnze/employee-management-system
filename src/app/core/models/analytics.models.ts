/** Monthly data point with a label (e.g. 'Jan') and numeric value. */
export interface MonthlyDataPoint {
  label: string;
  value: number;
}

/** Distribution across named buckets (department, status, etc.). */
export interface DistributionPoint {
  label: string;
  value: number;
  color?: string;
}

// ── Domain-named type aliases (Feature 4) ─────────────────────────────────────

/** Named metric for employee headcount per time period. */
export type EmployeeGrowthMetric = MonthlyDataPoint;

/** Named metric for attendance rate per time period. */
export type AttendanceMetric = MonthlyDataPoint;

/** Named metric for department headcount distribution. */
export type DepartmentDistribution = DistributionPoint;

/** Named metric for event/activity counts per time period. */
export type ActivityMetric = MonthlyDataPoint;

/** An upcoming task shown on the employee dashboard. */
export interface UpcomingTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
}

// ── Aggregate analytics shapes ─────────────────────────────────────────────────

/** Admin dashboard aggregate statistics. */
export interface AdminAnalytics {
  /** Total employee count per month for the last 12 months. */
  employeeGrowth: EmployeeGrowthMetric[];
  /** Distribution of employees across departments. */
  departmentDistribution: DepartmentDistribution[];
  /** Total activity events (logins + edits) per month. */
  monthlyActivity: ActivityMetric[];
  /** Employee count per status. */
  statusBreakdown: DistributionPoint[];
}

/** Employee self-service analytics. */
export interface EmployeeAnalytics {
  /** Attendance percentage per week for the last 8 weeks. */
  attendanceTrend: AttendanceMetric[];
  /** Tasks completed per week for the last 8 weeks. */
  taskCompletionTrend: ActivityMetric[];
  /** Upcoming tasks for the employee. */
  upcomingTasks: UpcomingTask[];
  /** Summary KPI values. */
  summary: {
    totalPresent: number;
    totalAbsent: number;
    tasksCompleted: number;
    tasksPending: number;
    leaveBalance: number;
  };
}
