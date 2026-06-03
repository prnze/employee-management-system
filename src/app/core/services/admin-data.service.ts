import { inject, Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ROLE_PERMISSIONS } from '@core/constants/roles.constant';
import { DashboardStats } from '@core/models/api.models';
import { AuditLog, AppNotification } from '@core/models/notification.models';
import { Role, User } from '@core/models/user.models';
import { AuditService } from './audit.service';
import { EmployeeService } from './employee.service';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly employeeService = inject(EmployeeService);
  constructor(private readonly audit: AuditService) {}

  private readonly usersSignal = signal<User[]>([
    { id: 'u1', fullName: 'Avery Admin', email: 'admin@ems.local', role: 'Admin', status: 'Active', lastLoginAt: '2026-06-02T08:30:00Z' },
    { id: 'u2', fullName: 'Emerson Employee', email: 'employee@ems.local', role: 'Employee', status: 'Active', lastLoginAt: '2026-06-01T15:45:00Z' }
  ]);

  dashboard(): Observable<DashboardStats> {
    const employees = this.employeeService.employees();
    const total         = employees.length;
    const activeCount   = employees.filter((e) => e.status === 'Active').length;
    const onLeaveCount  = employees.filter((e) => e.status === 'On Leave').length;
    const deptCount     = new Set(employees.map((e) => e.department)).size;
    return of<DashboardStats>({
      employees:           total,
      activeEmployees:     activeCount,
      onLeave:             onLeaveCount,
      departments:         deptCount,
      activeUsers:         activeCount,
      pendingTasks:        9,
      unreadNotifications: 3
    }).pipe(delay(200));
  }

  users(): Observable<User[]> {
    return of(this.usersSignal()).pipe(delay(200));
  }

  roles(): Observable<Role[]> {
    const roles: Role[] = [
      { id: 'r1', name: 'Admin', description: 'Full administrative control', permissions: ROLE_PERMISSIONS.Admin },
      { id: 'r2', name: 'Employee', description: 'Self-service employee access', permissions: ROLE_PERMISSIONS.Employee }
    ];
    return of(roles).pipe(delay(200));
  }

  notifications(): Observable<AppNotification[]> {
    const notifications: AppNotification[] = [
      { id: 'n1', title: 'Payroll approved', message: 'May payroll was approved.', type: 'Success', category: 'System', priority: 'Low', read: false, createdAt: '2026-06-02T09:00:00Z' },
      { id: 'n2', title: 'Profile update', message: 'Sara updated emergency contacts.', type: 'Info', category: 'Employee', priority: 'Low', read: true, createdAt: '2026-06-01T10:30:00Z' }
    ];
    return of(notifications).pipe(delay(200));
  }

  auditLogs(): Observable<AuditLog[]> {
    return of(this.audit.logs()).pipe(delay(200));
  }
}
