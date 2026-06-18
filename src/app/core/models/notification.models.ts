export type NotificationCategory = 'System' | 'Security' | 'Employee' | 'Attendance' | 'Tasks';
export type NotificationPriority = 'Low' | 'Medium' | 'High' | 'Critical';
/** Legacy type alias kept for backwards compatibility with AdminDataService. */
export type NotificationType = 'Info' | 'Success' | 'Warning' | 'Error';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  /** Visual/semantic type — drives icon and color. */
  type: NotificationType;
  /** Domain category for filtering. */
  category: NotificationCategory;
  /** Urgency level. */
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
  /** Optional deep-link for the notification action. */
  link?: string;
}

export type AuditSeverity = 'Info' | 'Warning' | 'Error' | 'Critical';
export type AuditAction =
  | 'LOGIN' | 'LOGOUT'
  | 'CREATE' | 'UPDATE' | 'DELETE'
  | 'BULK_DELETE' | 'BULK_STATUS_UPDATE'
  | 'PERMISSION_CHANGE' | 'ROLE_CHANGE'
  | 'EXPORT' | 'VIEW' | 'PASSWORD_CHANGE';

export interface AuditLog {
  id: string;
  actor: string;
  action: AuditAction | string;
  entity: string;
  severity: AuditSeverity;
  /** Domain area for grouping and filtering. */
  category: 'Auth' | 'Employee' | 'Permissions' | 'System' | 'Export';
  /** Human-readable detail / diff notes. */
  details?: string;
  createdAt: string;
  ipAddress: string;
  sessionId?: string;
}

/** Filter state for the audit log page. */
export interface AuditFilter {
  query: string;
  actor: string;
  action: string;
  severity: AuditSeverity | '';
  category: AuditLog['category'] | '';
  dateFrom: string;
  dateTo: string;
}


/** Filter state for the notifications page. */
export interface NotificationFilter {
  query: string;
  category: NotificationCategory | '';
  status: 'all' | 'read' | 'unread';
  priority: NotificationPriority | '';
}
