export const APP_ROLES = {
  admin: 'Admin',
  employee: 'Employee'
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  Admin: [
    'dashboard:view',
    'employees:read',
    'employees:create',
    'employees:update',
    'employees:delete',
    'users:manage',
    'roles:manage',
    'reports:view',
    'audit:view',
    'settings:manage'
  ],
  Employee: ['dashboard:view', 'profile:update', 'attendance:view', 'tasks:view', 'notifications:view']
};
