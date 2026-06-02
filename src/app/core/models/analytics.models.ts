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

/** Admin dashboard aggregate statistics. */
export interface AdminAnalytics {
  /** Total employee count per month for the last 6 months. */
  employeeGrowth: MonthlyDataPoint[];
  /** Distribution of employees across departments. */
  departmentDistribution: DistributionPoint[];
  /** Total activity events (logins + edits) per month. */
  monthlyActivity: MonthlyDataPoint[];
  /** Employee count per status. */
  statusBreakdown: DistributionPoint[];
}

/** Employee self-service analytics. */
export interface EmployeeAnalytics {
  /** Attendance percentage per week for the last 8 weeks. */
  attendanceTrend: MonthlyDataPoint[];
  /** Tasks completed per week for the last 8 weeks. */
  taskCompletionTrend: MonthlyDataPoint[];
  /** Summary KPI values. */
  summary: {
    totalPresent: number;
    totalAbsent: number;
    tasksCompleted: number;
    tasksPending: number;
    leaveBalance: number;
  };
}
