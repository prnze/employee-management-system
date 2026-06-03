import { TestBed } from '@angular/core/testing';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditService);
  });

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

  it('should record a new log entry at the front of the list', () => {
    const before = service.logs().length;
    service.record('Test User', 'VIEW', 'Employee EMP-9999');
    expect(service.logs().length).toBe(before + 1);
    expect(service.logs()[0].actor).toBe('Test User');
    expect(service.logs()[0].action).toBe('VIEW');
    expect(service.logs()[0].entity).toBe('Employee EMP-9999');
  });

  it('should infer severity correctly via record', () => {
    service.record('Admin', 'BULK_DELETE', 'Employee records');
    expect(service.logs()[0].severity).toBe('Warning');

    service.record('Admin', 'LOGIN', 'Auth');
    expect(service.logs()[0].severity).toBe('Info');
  });

  it('should accept override severity and category via opts', () => {
    service.record('Admin', 'CREATE', 'Role', { severity: 'Critical', category: 'Permissions', details: 'Test detail' });
    const entry = service.logs()[0];
    expect(entry.severity).toBe('Critical');
    expect(entry.category).toBe('Permissions');
    expect(entry.details).toBe('Test detail');
  });

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
