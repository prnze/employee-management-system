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
  activeUsers: number;
  pendingTasks: number;
  unreadNotifications: number;
}
