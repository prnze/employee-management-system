import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { TaskItem, TaskPriority, TaskRequest, TaskStatus } from '@core/models/task.models';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class TaskService implements OnDestroy {
  private readonly supabase = inject(SupabaseService);
  private readonly store = signal<TaskItem[]>([]);
  private realtimeChannel?: any;

  readonly tasks = this.store.asReadonly();

  constructor() {
    if (typeof this.supabase.client.channel === 'function') {
      this.realtimeChannel = this.supabase.client
        .channel('tasks-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          (payload: any) => this.handleRealtimeEvent(payload)
        )
        .subscribe();
    }
  }

  private handleRealtimeEvent(payload: any): void {
    if (payload.eventType === 'INSERT') {
      const newTask = this.mapDbToTask(payload.new);
      this.store.update((tasks) => {
        if (tasks.some((t) => t.id === newTask.id)) return tasks;
        return [newTask, ...tasks];
      });
    } else if (payload.eventType === 'UPDATE') {
      const updatedTask = this.mapDbToTask(payload.new);
      this.store.update((tasks) =>
        tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } else if (payload.eventType === 'DELETE') {
      const deletedId = payload.old?.id;
      if (deletedId) {
        this.store.update((tasks) => tasks.filter((t) => t.id !== deletedId));
      }
    }
  }

  ngOnDestroy(): void {
    if (this.realtimeChannel && typeof this.supabase.client.removeChannel === 'function') {
      this.supabase.client.removeChannel(this.realtimeChannel);
    }
  }

  getTasks(employeeId: string): Observable<TaskItem[]> {
    return from(
      this.supabase.client
        .from('tasks')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const tasks = (data ?? []).map((row: any) => this.mapDbToTask(row));
        this.store.set(tasks);
        return of(tasks);
      })
    );
  }

  createTask(request: TaskRequest): Observable<TaskItem> {
    return from(
      this.supabase.client
        .from('tasks')
        .insert(this.mapTaskToDb(request))
        .select()
        .single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const created = this.mapDbToTask(data);
        this.store.update((tasks) => [created, ...tasks.filter((task) => task.id !== created.id)]);
        return of(created);
      })
    );
  }

  updateTask(id: string, request: Partial<TaskRequest>): Observable<TaskItem> {
    return from(
      this.supabase.client
        .from('tasks')
        .update(this.mapTaskToDb(request))
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const updated = this.mapDbToTask(data);
        this.store.update((tasks) => tasks.map((task) => task.id === id ? updated : task));
        return of(updated);
      })
    );
  }

  deleteTask(id: string): Observable<boolean> {
    return from(
      this.supabase.client
        .from('tasks')
        .delete()
        .eq('id', id)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((tasks) => tasks.filter((task) => task.id !== id));
        return of(true);
      })
    );
  }

  bulkDelete(ids: string[]): Observable<boolean> {
    return from(
      this.supabase.client
        .from('tasks')
        .delete()
        .in('id', ids)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((tasks) => tasks.filter((task) => !ids.includes(task.id)));
        return of(true);
      })
    );
  }

  bulkStatusUpdate(ids: string[], status: TaskStatus): Observable<boolean> {
    return from(
      this.supabase.client
        .from('tasks')
        .update({ status: this.toDbStatus(status) })
        .in('id', ids)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((tasks) => tasks.map((task) => ids.includes(task.id) ? { ...task, status } : task));
        return of(true);
      })
    );
  }

  private mapDbToTask(row: any): TaskItem {
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? '',
      employeeId: row.employee_id,
      priority: this.mapPriority(row.priority),
      status: this.mapStatus(row.status),
      dueDate: row.due_date,
      category: 'General',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapTaskToDb(request: Partial<TaskRequest>): Record<string, unknown> {
    const dbFields: Record<string, unknown> = {};
    if (request.title !== undefined) dbFields['title'] = request.title;
    if (request.description !== undefined) dbFields['description'] = request.description;
    if (request.employeeId !== undefined) dbFields['employee_id'] = request.employeeId;
    if (request.priority !== undefined) dbFields['priority'] = request.priority;
    if (request.status !== undefined) dbFields['status'] = this.toDbStatus(request.status);
    if (request.dueDate !== undefined) dbFields['due_date'] = request.dueDate;
    return dbFields;
  }

  private mapPriority(priority: unknown): TaskPriority {
    const normalized = String(priority ?? '').toLowerCase();
    const priorityMap: Record<string, TaskPriority> = {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    };
    return priorityMap[normalized] ?? 'Medium';
  }

  private mapStatus(status: unknown): TaskStatus {
    const normalized = String(status ?? '').toLowerCase();
    const statusMap: Record<string, TaskStatus> = {
      todo: 'todo',
      to_do: 'todo',
      pending: 'todo',
      in_progress: 'in_progress',
      inprogress: 'in_progress',
      completed: 'completed',
      complete: 'completed',
      done: 'completed'
    };
    return statusMap[normalized] ?? 'todo';
  }

  private toDbStatus(status: TaskStatus): string {
    return status;
  }
}
