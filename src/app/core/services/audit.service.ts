import { computed, inject, Injectable, signal } from '@angular/core';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { AuditFilter, AuditLog, AuditSeverity } from '@core/models/notification.models';
import { SupabaseService } from './supabase.service';
import { AuthStateService } from '@core/auth/auth-state.service';

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
  private readonly supabase = inject(SupabaseService);
  private readonly authState = inject(AuthStateService);

  private readonly logsSignal = signal<AuditLog[]>([]);
  private hasLoaded = false;

  readonly logs        = this.logsSignal.asReadonly();
  readonly totalCount  = computed(() => this.logsSignal().length);
  readonly actors      = computed(() => Array.from(new Set(this.logsSignal().map((l) => l.actor))).sort());
  readonly actions     = computed(() => Array.from(new Set(this.logsSignal().map((l) => l.action))).sort());

  constructor() {
    this.getAuditLogs().subscribe({
      error: (err) => console.error('Failed to load audit logs from Supabase:', err)
    });
  }

  getAuditLogs(force = false): Observable<AuditLog[]> {
    if (this.hasLoaded && !force) {
      return of(this.logsSignal());
    }

    return from(
      this.supabase.client
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const mapped = (data ?? []).map((row: any) => this.mapDbToAuditLog(row));
        this.logsSignal.set(mapped);
        this.hasLoaded = true;
        return of(mapped);
      })
    );
  }

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

    // Optimistic local update
    this.logsSignal.update((logs) => [entry, ...logs].slice(0, 500));

    // Persist asynchronously in the background
    from(
      this.supabase.client
        .from('audit_logs')
        .insert(this.mapAuditLogToDb(entry))
        .select()
        .single()
    ).subscribe({
      next: ({ data, error }) => {
        if (error) {
          console.error('Failed to persist audit log in Supabase:', error);
        } else if (data) {
          const created = this.mapDbToAuditLog(data);
          this.logsSignal.update((logs) =>
            logs.map((l) => (l.id === entry.id ? created : l))
          );
        }
      },
      error: (err) => console.error('Error writing audit log to Supabase:', err)
    });
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

  private mapDbToAuditLog(row: any): AuditLog {
    const meta = row.metadata ?? {};
    return {
      id: row.id,
      actor: meta.actor_name ?? 'System',
      action: row.action,
      entity: row.entity_type,
      severity: (meta.severity ?? 'Info') as AuditSeverity,
      category: (meta.category ?? 'System') as AuditLog['category'],
      details: row.description,
      createdAt: row.created_at,
      ipAddress: meta.ip_address ?? '127.0.0.1',
      sessionId: meta.session_id
    };
  }

  private mapAuditLogToDb(log: Partial<AuditLog>): Record<string, any> {
    const meta: any = {
      actor_name: log.actor ?? 'System',
      severity: log.severity ?? 'Info',
      category: log.category ?? 'System',
      ip_address: log.ipAddress ?? '127.0.0.1'
    };
    if (log.sessionId) {
      meta.session_id = log.sessionId;
    }

    return {
      id: log.id,
      user_id: this.authState.user()?.id || null,
      action: log.action,
      entity_type: log.entity,
      description: log.details,
      metadata: meta
    };
  }
}
