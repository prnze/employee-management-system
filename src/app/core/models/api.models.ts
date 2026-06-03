export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface DashboardStats {
  employees: number;
  activeEmployees: number;
  onLeave: number;
  departments: number;
  /** @deprecated use activeEmployees */
  activeUsers: number;
  pendingTasks: number;
  unreadNotifications: number;
}
