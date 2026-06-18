import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { AttendanceRecord, AttendanceRequest, AttendanceStatus } from '@core/models/attendance.models';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AttendanceService implements OnDestroy {
  private readonly supabase = inject(SupabaseService);
  private readonly store = signal<AttendanceRecord[]>([]);
  private realtimeChannel?: any;

  readonly records = this.store.asReadonly();

  constructor() {
    if (typeof this.supabase.client.channel === 'function') {
      this.realtimeChannel = this.supabase.client
        .channel('attendance-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'attendance' },
          (payload: any) => this.handleRealtimeEvent(payload)
        )
        .subscribe();
    }
  }

  private handleRealtimeEvent(payload: any): void {
    if (payload.eventType === 'INSERT') {
      const newRecord = this.mapDbToAttendance(payload.new);
      this.store.update((records) => {
        if (records.some((r) => r.id === newRecord.id)) return records;
        return [newRecord, ...records];
      });
    } else if (payload.eventType === 'UPDATE') {
      const updatedRecord = this.mapDbToAttendance(payload.new);
      this.store.update((records) =>
        records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
      );
    }
  }

  ngOnDestroy(): void {
    if (this.realtimeChannel && typeof this.supabase.client.removeChannel === 'function') {
      this.supabase.client.removeChannel(this.realtimeChannel);
    }
  }

  getAttendance(): Observable<AttendanceRecord[]> {
    return from(
      this.supabase.client
        .from('attendance')
        .select('*')
        .order('date', { ascending: false })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const records = (data ?? []).map((row: any) => this.mapDbToAttendance(row));
        this.store.set(records);
        return of(records);
      })
    );
  }

  createAttendance(request: AttendanceRequest): Observable<AttendanceRecord> {
    return from(
      this.supabase.client
        .from('attendance')
        .insert(this.mapAttendanceToDb(request))
        .select()
        .single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const created = this.mapDbToAttendance(data);
        this.store.update((records) => [created, ...records.filter((record) => record.id !== created.id)]);
        return of(created);
      })
    );
  }

  updateAttendance(id: string, request: Partial<AttendanceRequest>): Observable<AttendanceRecord> {
    return from(
      this.supabase.client
        .from('attendance')
        .update(this.mapAttendanceToDb(request))
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const updated = this.mapDbToAttendance(data);
        this.store.update((records) => records.map((record) => record.id === id ? updated : record));
        return of(updated);
      })
    );
  }

  deleteAttendance(id: string): Observable<boolean> {
    return from(
      this.supabase.client
        .from('attendance')
        .delete()
        .eq('id', id)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((records) => records.filter((record) => record.id !== id));
        return of(true);
      })
    );
  }

  bulkDelete(ids: string[]): Observable<boolean> {
    return from(
      this.supabase.client
        .from('attendance')
        .delete()
        .in('id', ids)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((records) => records.filter((record) => !ids.includes(record.id ?? '')));
        return of(true);
      })
    );
  }

  bulkUpdateStatus(ids: string[], status: AttendanceStatus): Observable<boolean> {
    return from(
      this.supabase.client
        .from('attendance')
        .update({ status })
        .in('id', ids)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((records) => records.map((record) => ids.includes(record.id ?? '') ? { ...record, status } : record));
        return of(true);
      })
    );
  }

  private mapDbToAttendance(row: any): AttendanceRecord {
    const clockIn = this.toTime(row.clock_in);
    const clockOut = this.toTime(row.clock_out);
    const workHours = this.calculateWorkHours(clockIn, clockOut);

    return {
      id: row.id,
      employeeId: row.employee_id,
      date: row.date,
      in: clockIn,
      out: clockOut,
      status: this.mapStatus(row.status),
      notes: row.notes ?? null,
      workHours,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapAttendanceToDb(request: Partial<AttendanceRequest>): Record<string, unknown> {
    const dbFields: Record<string, unknown> = {};
    if (request.employeeId !== undefined) dbFields['employee_id'] = request.employeeId;
    if (request.date !== undefined) dbFields['date'] = request.date;
    if (request.in !== undefined) dbFields['clock_in'] = request.in;
    if (request.out !== undefined) dbFields['clock_out'] = request.out;
    if (request.status !== undefined) dbFields['status'] = request.status;
    if (request.notes !== undefined) dbFields['notes'] = request.notes;
    return dbFields;
  }

  private mapStatus(status: unknown): AttendanceStatus {
    const normalized = String(status ?? '').toLowerCase();
    const statusMap: Record<string, AttendanceStatus> = {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      leave: 'Leave',
      holiday: 'Holiday',
      weekend: 'Weekend'
    };
    return statusMap[normalized] ?? 'Absent';
  }

  private toTime(value: unknown): string | null {
    if (!value) return null;
    const text = String(value);
    return text.length >= 5 ? text.slice(0, 5) : text;
  }

  private calculateWorkHours(clockIn: string | null, clockOut: string | null): number | undefined {
    if (!clockIn || !clockOut) return undefined;
    const [inHour, inMinute] = clockIn.split(':').map(Number);
    const [outHour, outMinute] = clockOut.split(':').map(Number);
    if ([inHour, inMinute, outHour, outMinute].some((part) => Number.isNaN(part))) return undefined;
    const minutes = (outHour * 60 + outMinute) - (inHour * 60 + inMinute);
    if (minutes <= 0) return undefined;
    return Math.round((minutes / 60) * 100) / 100;
  }
}
