import { Injectable, signal } from '@angular/core';
import { AuditLog } from '@core/models/notification.models';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly logsSignal = signal<AuditLog[]>([
    { id: 'a1', actor: 'Avery Admin', action: 'LOGIN', entity: 'Auth', createdAt: '2026-06-02T08:30:00Z', ipAddress: '10.0.0.8' },
    { id: 'a2', actor: 'Avery Admin', action: 'UPDATE', entity: 'Employee EMP-1001', createdAt: '2026-06-02T08:40:00Z', ipAddress: '10.0.0.8' }
  ]);

  readonly logs = this.logsSignal.asReadonly();

  record(actor: string, action: string, entity: string): void {
    const entry: AuditLog = {
      id: crypto.randomUUID(),
      actor,
      action,
      entity,
      createdAt: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    this.logsSignal.update((logs) => [entry, ...logs].slice(0, 100));
  }
}
