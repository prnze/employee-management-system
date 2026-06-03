import { computed, Injectable, signal } from '@angular/core';
import { AuditFilter, AuditLog, AuditSeverity } from '@core/models/notification.models';

const NOW = Date.now();
const mins  = (n: number) => new Date(NOW - n * 60000).toISOString();
const hours = (n: number) => new Date(NOW - n * 3600000).toISOString();
const days  = (n: number) => new Date(NOW - n * 86400000).toISOString();

const SEED_LOGS: AuditLog[] = [
  { id: 'al01', actor: 'Avery Admin',      action: 'LOGIN',               entity: 'Auth',                severity: 'Info',     category: 'Auth',        details: 'Successful login from Chrome 125 / Windows 11',                          createdAt: mins(5),    ipAddress: '10.0.0.8',  sessionId: 'sess-001' },
  { id: 'al02', actor: 'Avery Admin',      action: 'CREATE',              entity: 'Employee EMP-1010',   severity: 'Info',     category: 'Employee',    details: 'Vikas Iyer onboarded to Product department',                             createdAt: mins(22),   ipAddress: '10.0.0.8',  sessionId: 'sess-001' },
  { id: 'al03', actor: 'Avery Admin',      action: 'PERMISSION_CHANGE',   entity: 'Role: Employee',      severity: 'Warning',  category: 'Permissions', details: 'Added permission employees:read to Employee role',                        createdAt: hours(1),   ipAddress: '10.0.0.8',  sessionId: 'sess-001' },
  { id: 'al04', actor: 'Emerson Employee', action: 'LOGIN',               entity: 'Auth',                severity: 'Info',     category: 'Auth',        details: 'Successful login from Safari / macOS',                                   createdAt: hours(2),   ipAddress: '192.168.1.45' },
  { id: 'al05', actor: 'Avery Admin',      action: 'UPDATE',              entity: 'Employee EMP-1001',   severity: 'Info',     category: 'Employee',    details: 'Designation changed: Senior Engineer → Frontend Lead',                   createdAt: hours(3),   ipAddress: '10.0.0.8',  sessionId: 'sess-001' },
  { id: 'al06', actor: 'Avery Admin',      action: 'BULK_STATUS_UPDATE',  entity: '3 employees',         severity: 'Warning',  category: 'Employee',    details: 'Status updated to On Leave for EMP-1003, EMP-1009, EMP-1004',           createdAt: hours(5),   ipAddress: '10.0.0.8',  sessionId: 'sess-001' },
  { id: 'al07', actor: 'System',           action: 'LOGIN',               entity: 'Auth',                severity: 'Error',    category: 'Auth',        details: 'Failed login attempt for admin@ems.local — wrong password (attempt 3)', createdAt: hours(6),   ipAddress: '203.45.67.1' },
  { id: 'al08', actor: 'Avery Admin',      action: 'EXPORT',              entity: 'Employee list',       severity: 'Info',     category: 'Export',      details: 'Exported 10 employee records as CSV',                                   createdAt: hours(8),   ipAddress: '10.0.0.8',  sessionId: 'sess-001' },
  { id: 'al09', actor: 'Avery Admin',      action: 'ROLE_CHANGE',         entity: 'Role: Admin',         severity: 'Critical', category: 'Permissions', details: 'Added permission settings:manage to Admin role',                         createdAt: hours(10),  ipAddress: '10.0.0.8',  sessionId: 'sess-001' },
  { id: 'al10', actor: 'Emerson Employee', action: 'PASSWORD_CHANGE',     entity: 'Auth',                severity: 'Info',     category: 'Auth',        details: 'Password changed successfully',                                          createdAt: hours(12),  ipAddress: '192.168.1.45' },
  { id: 'al11', actor: 'Avery Admin',      action: 'DELETE',              entity: 'Employee EMP-1008',   severity: 'Warning',  category: 'Employee',    details: 'Employee record permanently removed',                                    createdAt: days(1),    ipAddress: '10.0.0.8',  sessionId: 'sess-000' },
  { id: 'al12', actor: 'System',           action: 'BULK_DELETE',         entity: '2 employee records',  severity: 'Warning',  category: 'Employee',    details: 'Bulk delete triggered by Avery Admin',                                   createdAt: days(1),    ipAddress: '10.0.0.8',  sessionId: 'sess-000' },
  { id: 'al13', actor: 'Avery Admin',      action: 'LOGOUT',              entity: 'Auth',                severity: 'Info',     category: 'Auth',        details: 'Session ended normally',                                                 createdAt: days(2),    ipAddress: '10.0.0.8',  sessionId: 'sess-000' },
  { id: 'al14', actor: 'Emerson Employee', action: 'LOGOUT',              entity: 'Auth',                severity: 'Info',     category: 'Auth',        details: 'Session ended normally',                                                 createdAt: days(2),    ipAddress: '192.168.1.45' },
  { id: 'al15', actor: 'System',           action: 'LOGIN',               entity: 'Auth',                severity: 'Critical', category: 'Auth',        details: 'Brute-force pattern detected — IP temporarily blocked',                  createdAt: days(3),    ipAddress: '91.23.104.7' },
  { id: 'al16', actor: 'Avery Admin',      action: 'PERMISSION_CHANGE',   entity: 'Role: Employee',      severity: 'Warning',  category: 'Permissions', details: 'Removed permission reports:view from Employee role',                     createdAt: days(4),    ipAddress: '10.0.0.8' },
  { id: 'al17', actor: 'Avery Admin',      action: 'CREATE',              entity: 'Employee EMP-1005',   severity: 'Info',     category: 'Employee',    details: 'Priya Sharma onboarded to Engineering department',                       createdAt: days(5),    ipAddress: '10.0.0.8' },
  { id: 'al18', actor: 'Avery Admin',      action: 'EXPORT',              entity: 'Audit logs',          severity: 'Info',     category: 'Export',      details: 'Exported audit log as Excel',                                            createdAt: days(6),    ipAddress: '10.0.0.8' },
  { id: 'al19', actor: 'Emerson Employee', action: 'VIEW',                entity: 'Employee EMP-1001',   severity: 'Info',     category: 'Employee',    details: 'Viewed Maya Patel profile',                                              createdAt: days(7),    ipAddress: '192.168.1.45' },
  { id: 'al20', actor: 'System',           action: 'LOGIN',               entity: 'Auth',                severity: 'Error',    category: 'Auth',        details: 'Failed login for unknown@ems.local — account not found',                 createdAt: days(10),   ipAddress: '34.120.8.99' }
];

/** Infer the appropriate severity for common action+context combinations. */
function inferSeverity(action: string, entity: string): AuditSeverity {
  if (action === 'PERMISSION_CHANGE' || action === 'ROLE_CHANGE') return 'Warning';
  if (action === 'BULK_DELETE')   return 'Warning';
  if (action === 'DELETE')        return 'Warning';
  if (action === 'LOGIN' && entity.toLowerCase().includes('fail')) return 'Error';
  if (action === 'LOGOUT')        return 'Info';
  return 'Info';
}

function inferCategory(action: string, entity: string): AuditLog['category'] {
  if (action === 'LOGIN' || action === 'LOGOUT' || action === 'PASSWORD_CHANGE') return 'Auth';
  if (action === 'PERMISSION_CHANGE' || action === 'ROLE_CHANGE') return 'Permissions';
  if (action === 'EXPORT') return 'Export';
  if (entity.toLowerCase().includes('employee') || entity.toLowerCase().includes('emp-')) return 'Employee';
  return 'System';
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly logsSignal = signal<AuditLog[]>(SEED_LOGS);

  readonly logs        = this.logsSignal.asReadonly();
  readonly totalCount  = computed(() => this.logsSignal().length);
  readonly actors      = computed(() => Array.from(new Set(this.logsSignal().map((l) => l.actor))).sort());
  readonly actions     = computed(() => Array.from(new Set(this.logsSignal().map((l) => l.action))).sort());

  /**
   * Record a new audit entry.
   * @param actor   User who performed the action
   * @param action  Action type (LOGIN, CREATE, etc.)
   * @param entity  What was acted on
   * @param opts    Optional severity, category, details overrides
   */
  record(
    actor: string,
    action: string,
    entity: string,
    opts: { severity?: AuditSeverity; category?: AuditLog['category']; details?: string } = {}
  ): void {
    const entry: AuditLog = {
      id: crypto.randomUUID(),
      actor,
      action,
      entity,
      severity: opts.severity ?? inferSeverity(action, entity),
      category: opts.category ?? inferCategory(action, entity),
      details:  opts.details,
      createdAt: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    this.logsSignal.update((logs) => [entry, ...logs].slice(0, 500));
  }

  /** Returns logs matching the given filter, newest-first. */
  filtered(filter: AuditFilter): AuditLog[] {
    const q = filter.query.trim().toLowerCase();
    return this.logsSignal().filter((log) => {
      if (q && !`${log.actor} ${log.action} ${log.entity} ${log.details ?? ''}`.toLowerCase().includes(q)) return false;
      if (filter.actor    && log.actor    !== filter.actor)    return false;
      if (filter.action   && log.action   !== filter.action)   return false;
      if (filter.severity && log.severity !== filter.severity) return false;
      if (filter.category && log.category !== filter.category) return false;
      if (filter.dateFrom && log.createdAt < filter.dateFrom + 'T00:00:00Z') return false;
      if (filter.dateTo   && log.createdAt > filter.dateTo   + 'T23:59:59Z') return false;
      return true;
    });
  }

  static severityOrder(s: AuditSeverity): number {
    return { Critical: 4, Error: 3, Warning: 2, Info: 1 }[s] ?? 0;
  }
}
