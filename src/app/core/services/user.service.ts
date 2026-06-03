import { computed, inject, Injectable, signal } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { User, UserFilter, UserRequest, UserSortEntry, UserStatus } from '@core/models/user.models';
import { AppRole } from '@core/constants/roles.constant';
import { AuditService } from './audit.service';
import { NotificationService } from './notification.service';
import { AuthStateService } from '@core/auth/auth-state.service';

const SEED_USERS: User[] = [
  {
    id: 'u1', fullName: 'Avery Admin', email: 'admin@ems.local', role: 'Admin', status: 'Active',
    phone: '+91 98765 43210', department: 'Management',
    lastLoginAt: '2026-06-03T08:30:00Z', createdAt: '2024-01-15T09:00:00Z',
    extraPermissions: [], forcePasswordReset: false
  },
  {
    id: 'u2', fullName: 'Emerson Employee', email: 'employee@ems.local', role: 'Employee', status: 'Active',
    phone: '+91 91234 56789', department: 'Engineering',
    lastLoginAt: '2026-06-02T15:45:00Z', createdAt: '2024-03-20T10:30:00Z',
    extraPermissions: [], forcePasswordReset: false
  },
  {
    id: 'u3', fullName: 'Priya Manager', email: 'priya.manager@ems.local', role: 'Admin', status: 'Active',
    phone: '+91 88001 12345', department: 'HR',
    lastLoginAt: '2026-06-01T12:00:00Z', createdAt: '2024-06-01T08:00:00Z',
    extraPermissions: ['reports:view'], forcePasswordReset: false
  },
  {
    id: 'u4', fullName: 'Raj Sharma', email: 'raj.sharma@ems.local', role: 'Employee', status: 'Inactive',
    phone: '+91 77009 98765', department: 'Finance',
    lastLoginAt: '2025-12-15T10:00:00Z', createdAt: '2023-11-10T09:00:00Z',
    extraPermissions: [], forcePasswordReset: false
  },
  {
    id: 'u5', fullName: 'Sneha Patil', email: 'sneha.patil@ems.local', role: 'Employee', status: 'Locked',
    phone: '+91 93400 11223', department: 'Design',
    lastLoginAt: '2026-05-20T14:30:00Z', createdAt: '2024-09-05T11:00:00Z',
    extraPermissions: [], forcePasswordReset: true
  }
];

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly store     = signal<User[]>(SEED_USERS);
  private readonly audit     = inject(AuditService);
  private readonly notif     = inject(NotificationService);
  private readonly authState = inject(AuthStateService);

  // ── Read signals ───────────────────────────────────────────────────────────
  readonly users       = this.store.asReadonly();
  readonly totalCount  = computed(() => this.store().length);
  readonly activeCount = computed(() => this.store().filter((u) => u.status === 'Active').length);
  readonly lockedCount = computed(() => this.store().filter((u) => u.status === 'Locked').length);
  readonly adminCount  = computed(() => this.store().filter((u) => u.role === 'Admin').length);

  // ── Filtering & sorting ───────────────────────────────────────────────────
  filtered(filter: UserFilter, sort: UserSortEntry[]): User[] {
    const q = filter.query.trim().toLowerCase();
    let rows = this.store().filter((u) => {
      if (q && !`${u.fullName} ${u.email} ${u.role} ${u.department ?? ''}`.toLowerCase().includes(q)) return false;
      if (filter.role   && u.role   !== filter.role)   return false;
      if (filter.status && u.status !== filter.status) return false;
      if (filter.createdFrom && (u.createdAt ?? '') < filter.createdFrom + 'T00:00:00Z') return false;
      if (filter.createdTo   && (u.createdAt ?? '') > filter.createdTo   + 'T23:59:59Z') return false;
      if (filter.hasExtraPermissions !== null && filter.hasExtraPermissions !== undefined) {
        const has = (u.extraPermissions?.length ?? 0) > 0;
        if (filter.hasExtraPermissions !== has) return false;
      }
      return true;
    });

    // Multi-column sort
    if (sort.length > 0) {
      rows = [...rows].sort((a, b) => {
        for (const entry of sort) {
          const av = String(a[entry.field] ?? '').toLowerCase();
          const bv = String(b[entry.field] ?? '').toLowerCase();
          const cmp = av.localeCompare(bv);
          if (cmp !== 0) return entry.direction === 'asc' ? cmp : -cmp;
        }
        return 0;
      });
    }
    return rows;
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────
  create(req: UserRequest): Observable<User> {
    if (this.store().some((u) => u.email === req.email)) {
      return throwError(() => new Error(`Email ${req.email} is already registered`));
    }
    const user: User = {
      ...req,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      extraPermissions: req.extraPermissions ?? [],
      forcePasswordReset: req.forcePasswordReset ?? false
    };
    this.store.update((u) => [user, ...u]);
    this.audit.record(this.actor(), 'CREATE', `User ${user.email}`, { category: 'Permissions', details: `Created user ${user.fullName} (${user.role})` });
    this.notif.push({ title: 'User created', message: `${user.fullName} has been added as ${user.role}.`, type: 'Success', category: 'System', priority: 'Low' });
    return of(user).pipe(delay(250));
  }

  update(id: string, req: Partial<UserRequest>): Observable<User> {
    const existing = this.store().find((u) => u.id === id);
    if (!existing) return throwError(() => new Error('User not found'));
    if (req.email && req.email !== existing.email && this.store().some((u) => u.email === req.email)) {
      return throwError(() => new Error(`Email ${req.email} is already in use`));
    }
    const updated: User = { ...existing, ...req };
    this.store.update((u) => u.map((x) => x.id === id ? updated : x));
    this.audit.record(this.actor(), 'UPDATE', `User ${updated.email}`, { category: 'Permissions', details: `Updated user ${updated.fullName}` });
    return of(updated).pipe(delay(250));
  }

  delete(id: string): Observable<boolean> {
    const user = this.store().find((u) => u.id === id);
    this.store.update((u) => u.filter((x) => x.id !== id));
    this.audit.record(this.actor(), 'DELETE', `User ${user?.email ?? id}`, { category: 'Permissions', severity: 'Warning' });
    this.notif.push({ title: 'User deleted', message: `Account for ${user?.fullName ?? id} was permanently removed.`, type: 'Warning', category: 'Security', priority: 'High' });
    return of(true).pipe(delay(200));
  }

  bulkDelete(ids: string[]): Observable<boolean> {
    this.store.update((u) => u.filter((x) => !ids.includes(x.id)));
    this.audit.record(this.actor(), 'BULK_DELETE', `${ids.length} users`, { category: 'Permissions', severity: 'Warning' });
    return of(true).pipe(delay(250));
  }

  // ── Status transitions ────────────────────────────────────────────────────
  setStatus(id: string, status: UserStatus): Observable<User> {
    return this.update(id, { status });
  }

  bulkSetStatus(ids: string[], status: UserStatus): Observable<boolean> {
    this.store.update((u) => u.map((x) => ids.includes(x.id) ? { ...x, status } : x));
    this.audit.record(this.actor(), 'BULK_STATUS_UPDATE', `${ids.length} users → ${status}`, { category: 'Permissions' });
    return of(true).pipe(delay(250));
  }

  lock(id: string): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    this.notif.push({ title: 'Account locked', message: `${user?.fullName ?? id}'s account has been locked.`, type: 'Warning', category: 'Security', priority: 'High' });
    this.audit.record(this.actor(), 'UPDATE', `User ${user?.email ?? id}`, { category: 'Auth', severity: 'Warning', details: 'Account locked by admin' });
    return this.update(id, { status: 'Locked' });
  }

  unlock(id: string): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    this.audit.record(this.actor(), 'UPDATE', `User ${user?.email ?? id}`, { category: 'Auth', details: 'Account unlocked by admin' });
    return this.update(id, { status: 'Active' });
  }

  forcePasswordReset(id: string): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    this.audit.record(this.actor(), 'PASSWORD_CHANGE', `User ${user?.email ?? id}`, { category: 'Auth', severity: 'Warning', details: 'Force password reset triggered by admin' });
    this.notif.push({ title: 'Password reset required', message: `${user?.fullName ?? id} will be prompted to reset password on next login.`, type: 'Warning', category: 'Security', priority: 'Medium' });
    return this.update(id, { forcePasswordReset: true });
  }

  // ── Permissions ───────────────────────────────────────────────────────────
  addPermission(id: string, permission: string): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    if (!user) return throwError(() => new Error('User not found'));
    const extra = Array.from(new Set([...(user.extraPermissions ?? []), permission]));
    this.audit.record(this.actor(), 'PERMISSION_CHANGE', `User ${user.email}`, { category: 'Permissions', details: `Added extra permission: ${permission}` });
    return this.update(id, { extraPermissions: extra });
  }

  removePermission(id: string, permission: string): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    if (!user) return throwError(() => new Error('User not found'));
    const extra = (user.extraPermissions ?? []).filter((p) => p !== permission);
    this.audit.record(this.actor(), 'PERMISSION_CHANGE', `User ${user.email}`, { category: 'Permissions', severity: 'Warning', details: `Removed extra permission: ${permission}` });
    return this.update(id, { extraPermissions: extra });
  }

  assignRole(id: string, role: AppRole): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    if (!user) return throwError(() => new Error('User not found'));
    this.audit.record(this.actor(), 'ROLE_CHANGE', `User ${user.email}`, { category: 'Permissions', severity: 'Warning', details: `Role changed from ${user.role} to ${role}` });
    return this.update(id, { role });
  }

  private actor(): string {
    return this.authState.user()?.fullName ?? 'System';
  }
}
