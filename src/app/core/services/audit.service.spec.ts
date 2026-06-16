import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuditService } from './audit.service';
import { SupabaseService } from './supabase.service';
import { AuthStateService } from '@core/auth/auth-state.service';
import { AuditLog, AuditSeverity } from '@core/models/notification.models';

const SEED_LOGS_DB = [
  { id: 'al01', action: 'LOGIN',               entity_type: 'Auth',                description: 'Successful login from Chrome 125 / Windows 11',                          created_at: '2026-06-16T17:00:00Z',    metadata: { actor_name: 'Avery Admin',      severity: 'Info',     category: 'Auth',        ip_address: '10.0.0.8',  session_id: 'sess-001' } },
  { id: 'al02', action: 'CREATE',              entity_type: 'Employee EMP-1010',   description: 'Vikas Iyer onboarded to Product department',                             created_at: '2026-06-16T16:50:00Z',   metadata: { actor_name: 'Avery Admin',      severity: 'Info',     category: 'Employee',    ip_address: '10.0.0.8',  session_id: 'sess-001' } },
  { id: 'al03', action: 'PERMISSION_CHANGE',   entity_type: 'Role: Employee',      description: 'Added permission employees:read to Employee role',                        created_at: '2026-06-16T16:00:00Z',   metadata: { actor_name: 'Avery Admin',      severity: 'Warning',  category: 'Permissions', ip_address: '10.0.0.8',  session_id: 'sess-001' } },
  { id: 'al04', action: 'LOGIN',               entity_type: 'Auth',                description: 'Successful login from Safari / macOS',                                   created_at: '2026-06-16T15:00:00Z',   metadata: { actor_name: 'Emerson Employee', severity: 'Info',     category: 'Auth',        ip_address: '192.168.1.45' } },
  { id: 'al05', action: 'UPDATE',              entity_type: 'Employee EMP-1001',   description: 'Designation changed: Senior Engineer → Frontend Lead',                   created_at: '2026-06-16T14:00:00Z',   metadata: { actor_name: 'Avery Admin',      severity: 'Info',     category: 'Employee',    ip_address: '10.0.0.8',  session_id: 'sess-001' } },
  { id: 'al06', action: 'BULK_STATUS_UPDATE',  entity_type: '3 employees',         description: 'Status updated to On Leave for EMP-1003, EMP-1009, EMP-1004',           created_at: '2026-06-16T12:00:00Z',   metadata: { actor_name: 'Avery Admin',      severity: 'Warning',  category: 'Employee',    ip_address: '10.0.0.8',  session_id: 'sess-001' } },
  { id: 'al07', action: 'LOGIN',               entity_type: 'Auth',                description: 'Failed login attempt for admin@ems.local — wrong password (attempt 3)', created_at: '2026-06-16T11:00:00Z',   metadata: { actor_name: 'System',           severity: 'Error',    category: 'Auth',        ip_address: '203.45.67.1' } },
  { id: 'al08', action: 'EXPORT',              entity_type: 'Employee list',       description: 'Exported 10 employee records as CSV',                                   created_at: '2026-06-16T09:00:00Z',   metadata: { actor_name: 'Avery Admin',      severity: 'Info',     category: 'Export',      ip_address: '10.0.0.8',  session_id: 'sess-001' } },
  { id: 'al09', action: 'ROLE_CHANGE',         entity_type: 'Role: Admin',         description: 'Added permission settings:manage to Admin role',                         created_at: '2026-06-16T07:00:00Z',   metadata: { actor_name: 'Avery Admin',      severity: 'Critical', category: 'Permissions', ip_address: '10.0.0.8',  session_id: 'sess-001' } },
  { id: 'al10', action: 'PASSWORD_CHANGE',     entity_type: 'Auth',                description: 'Password changed successfully',                                          created_at: '2026-06-16T05:00:00Z',   metadata: { actor_name: 'Emerson Employee', severity: 'Info',     category: 'Auth',        ip_address: '192.168.1.45' } },
  { id: 'al11', action: 'DELETE',              entity_type: 'Employee EMP-1008',   description: 'Employee record permanently removed',                                    created_at: '2026-06-15T17:00:00Z',    metadata: { actor_name: 'Avery Admin',      severity: 'Warning',  category: 'Employee',    ip_address: '10.0.0.8',  session_id: 'sess-000' } },
  { id: 'al12', action: 'BULK_DELETE',         entity_type: '2 employee records',  description: 'Bulk delete triggered by Avery Admin',                                   created_at: '2026-06-15T17:00:00Z',    metadata: { actor_name: 'System',           severity: 'Warning',  category: 'Employee',    ip_address: '10.0.0.8',  session_id: 'sess-000' } },
  { id: 'al13', action: 'LOGOUT',              entity_type: 'Auth',                description: 'Session ended normally',                                                 created_at: '2026-06-14T17:00:00Z',    metadata: { actor_name: 'Avery Admin',      severity: 'Info',     category: 'Auth',        ip_address: '10.0.0.8',  session_id: 'sess-000' } },
  { id: 'al14', action: 'LOGOUT',              entity_type: 'Auth',                description: 'Session ended normally',                                                 created_at: '2026-06-14T17:00:00Z',    metadata: { actor_name: 'Emerson Employee', severity: 'Info',     category: 'Auth',        ip_address: '192.168.1.45' } },
  { id: 'al15', action: 'LOGIN',               entity_type: 'Auth',                description: 'Brute-force pattern detected — IP temporarily blocked',                  created_at: '2026-06-13T17:00:00Z',    metadata: { actor_name: 'System',           severity: 'Critical', category: 'Auth',        ip_address: '91.23.104.7' } },
  { id: 'al16', action: 'PERMISSION_CHANGE',   entity_type: 'Role: Employee',      description: 'Removed permission reports:view from Employee role',                     created_at: '2026-06-12T17:00:00Z',    metadata: { actor_name: 'Avery Admin',      severity: 'Warning',  category: 'Permissions', ip_address: '10.0.0.8' } },
  { id: 'al17', action: 'CREATE',              entity_type: 'Employee EMP-1005',   description: 'Priya Sharma onboarded to Engineering department',                       created_at: '2026-06-11T17:00:00Z',    metadata: { actor_name: 'Avery Admin',      severity: 'Info',     category: 'Employee',    ip_address: '10.0.0.8' } },
  { id: 'al18', action: 'EXPORT',              entity_type: 'Audit logs',          description: 'Exported audit log as Excel',                                            created_at: '2026-06-10T17:00:00Z',    metadata: { actor_name: 'Avery Admin',      severity: 'Info',     category: 'Export',      ip_address: '10.0.0.8' } },
  { id: 'al19', action: 'VIEW',                entity_type: 'Employee EMP-1001',   description: 'Viewed Maya Patel profile',                                              created_at: '2026-06-09T17:00:00Z',    metadata: { actor_name: 'Emerson Employee', severity: 'Info',     category: 'Employee',    ip_address: '192.168.1.45' } },
  { id: 'al20', action: 'LOGIN',               entity_type: 'Auth',                description: 'Failed login for unknown@ems.local — account not found',                 created_at: '2026-06-06T17:00:00Z',   metadata: { actor_name: 'System',           severity: 'Error',    category: 'Auth',        ip_address: '34.120.8.99' } }
];

function createMockSupabase() {
  let rows: any[];
  const resetRows = () => { rows = SEED_LOGS_DB.map((r) => ({ ...r, metadata: { ...r.metadata } })); };
  resetRows();

  return {
    client: {
      from: (_table: string) => ({
        select: (_cols?: string) => ({
          order: (_col: string, _opts?: any) => Promise.resolve({ data: [...rows], error: null })
        }),
        insert: (data: any) => {
          const newRow = { id: data.id || 'al-new', ...data, created_at: new Date().toISOString() };
          rows = [newRow, ...rows];
          return {
            select: () => ({
              single: () => Promise.resolve({ data: newRow, error: null })
            })
          };
        }
      })
    }
  };
}

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseService, useFactory: createMockSupabase },
        { provide: AuthStateService, useValue: { user: () => ({ id: 'u1', fullName: 'Test Admin' }) } }
      ]
    });
    service = TestBed.inject(AuditService);
    tick(); // resolve initial getAuditLogs load
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should seed 20 audit logs', () => {
    expect(service.logs().length).toBe(20);
  });

  it('should compute totalCount from signal', () => {
    expect(service.totalCount()).toBe(service.logs().length);
  });

  it('should compute unique actors', () => {
    const actors = service.actors();
    expect(actors.length).toBeGreaterThan(0);
    expect(actors).toContain('Avery Admin');
    expect(actors).toContain('Emerson Employee');
  });

  it('should compute unique actions', () => {
    const actions = service.actions();
    expect(actions).toContain('LOGIN');
    expect(actions).toContain('LOGOUT');
  });

  it('should record a new log entry at the front of the list', fakeAsync(() => {
    const before = service.logs().length;
    service.record('Test User', 'VIEW', 'Employee EMP-9999');
    tick();
    expect(service.logs().length).toBe(before + 1);
    expect(service.logs()[0].actor).toBe('Test User');
    expect(service.logs()[0].action).toBe('VIEW');
    expect(service.logs()[0].entity).toBe('Employee EMP-9999');
  }));

  it('should infer severity correctly via record', fakeAsync(() => {
    service.record('Admin', 'BULK_DELETE', 'Employee records');
    tick();
    expect(service.logs()[0].severity).toBe('Warning');

    service.record('Admin', 'LOGIN', 'Auth');
    tick();
    expect(service.logs()[0].severity).toBe('Info');
  }));

  it('should accept override severity and category via opts', fakeAsync(() => {
    service.record('Admin', 'CREATE', 'Role', { severity: 'Critical', category: 'Permissions', details: 'Test detail' });
    tick();
    const entry = service.logs()[0];
    expect(entry.severity).toBe('Critical');
    expect(entry.category).toBe('Permissions');
    expect(entry.details).toBe('Test detail');
  }));

  it('should filter by actor', () => {
    const result = service.filtered({ query: '', actor: 'Avery Admin', action: '', severity: '', category: '', dateFrom: '', dateTo: '' });
    expect(result.every((l) => l.actor === 'Avery Admin')).toBeTrue();
  });

  it('should filter by severity', () => {
    const result = service.filtered({ query: '', actor: '', action: '', severity: 'Critical', category: '', dateFrom: '', dateTo: '' });
    expect(result.every((l) => l.severity === 'Critical')).toBeTrue();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should filter by category', () => {
    const result = service.filtered({ query: '', actor: '', action: '', severity: '', category: 'Auth', dateFrom: '', dateTo: '' });
    expect(result.every((l) => l.category === 'Auth')).toBeTrue();
  });

  it('should filter by query matching actor or entity', () => {
    const result = service.filtered({ query: 'emerson', actor: '', action: '', severity: '', category: '', dateFrom: '', dateTo: '' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((l) => l.actor.toLowerCase().includes('emerson') || l.entity.toLowerCase().includes('emerson'))).toBeTrue();
  });

  it('should return severityOrder in correct order', () => {
    expect(AuditService.severityOrder('Critical')).toBe(4);
    expect(AuditService.severityOrder('Error')).toBe(3);
    expect(AuditService.severityOrder('Warning')).toBe(2);
    expect(AuditService.severityOrder('Info')).toBe(1);
  });
});
