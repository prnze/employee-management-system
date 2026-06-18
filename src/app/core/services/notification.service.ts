import { computed, inject, Injectable, signal, OnDestroy } from '@angular/core';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import {
  AppNotification,
  NotificationCategory,
  NotificationFilter,
  NotificationPriority,
  NotificationType
} from '@core/models/notification.models';
import { AuthStateService } from '@core/auth/auth-state.service';
import { SupabaseService } from './supabase.service';

export type NotificationRequest = Omit<AppNotification, 'id' | 'createdAt' | 'updatedAt' | 'read'> & {
  userId?: string;
  read?: boolean;
};

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private readonly supabase = inject(SupabaseService);
  private readonly authState = inject(AuthStateService);
  private readonly store = signal<AppNotification[]>([]);
  private hasLoaded = false;
  private realtimeChannel?: any;

  // Read-only views
  readonly all = this.store.asReadonly();
  readonly unread = computed(() => this.store().filter((n) => !n.read));
  readonly unreadCount = computed(() => this.unread().length);

  constructor() {
    this.getNotifications().subscribe({
      error: (err) => console.error('Failed to load notifications from Supabase:', err)
    });

    if (typeof this.supabase.client.channel === 'function') {
      this.realtimeChannel = this.supabase.client
        .channel('notifications-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications' },
          (payload: any) => this.handleRealtimeEvent(payload)
        )
        .subscribe();
    }
  }

  private handleRealtimeEvent(payload: any): void {
    const currentUserId = this.authState.user()?.id;
    if (payload.new && payload.new.user_id && payload.new.user_id !== currentUserId) {
      return;
    }

    if (payload.eventType === 'INSERT') {
      const newNotif = this.mapDbToNotification(payload.new);
      this.store.update((items) => {
        if (items.some((item) => item.id === newNotif.id)) return items;
        return [newNotif, ...items];
      });
    } else if (payload.eventType === 'UPDATE') {
      const updatedNotif = this.mapDbToNotification(payload.new);
      this.store.update((items) =>
        items.map((item) => (item.id === updatedNotif.id ? updatedNotif : item))
      );
    } else if (payload.eventType === 'DELETE') {
      const deletedId = payload.old?.id;
      if (deletedId) {
        this.store.update((items) => items.filter((item) => item.id !== deletedId));
      }
    }
  }

  ngOnDestroy(): void {
    if (this.realtimeChannel && typeof this.supabase.client.removeChannel === 'function') {
      this.supabase.client.removeChannel(this.realtimeChannel);
    }
  }

  getNotifications(force = false): Observable<AppNotification[]> {
    if (this.hasLoaded && !force) {
      return of(this.store());
    }

    return from(
      this.supabase.client
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const notifications = (data ?? []).map((row: any) => this.mapDbToNotification(row));
        this.store.set(notifications);
        this.hasLoaded = true;
        return of(notifications);
      })
    );
  }

  // Filtering
  filtered(filter: NotificationFilter): AppNotification[] {
    const q = filter.query.trim().toLowerCase();
    return this.store().filter((n) => {
      if (q && !`${n.title} ${n.message}`.toLowerCase().includes(q)) return false;
      if (filter.category && n.category !== filter.category) return false;
      if (filter.priority && n.priority !== filter.priority) return false;
      if (filter.status === 'read' && !n.read) return false;
      if (filter.status === 'unread' && n.read) return false;
      return true;
    });
  }

  createNotification(notification: NotificationRequest): Observable<AppNotification> {
    return from(
      this.supabase.client
        .from('notifications')
        .insert(this.mapNotificationToDb(notification))
        .select()
        .single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const created = this.mapDbToNotification(data, notification);
        this.store.update((items) => [created, ...items.filter((item) => item.id !== created.id)]);
        return of(created);
      })
    );
  }

  updateNotification(id: string, notification: Partial<NotificationRequest>): Observable<AppNotification> {
    return from(
      this.supabase.client
        .from('notifications')
        .update(this.mapNotificationToDb(notification))
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const current = this.store().find((item) => item.id === id);
        const updated = this.mapDbToNotification(data, { ...current, ...notification });
        this.store.update((items) => items.map((item) => item.id === id ? updated : item));
        return of(updated);
      })
    );
  }

  deleteNotification(id: string): Observable<boolean> {
    return from(
      this.supabase.client
        .from('notifications')
        .delete()
        .eq('id', id)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((items) => items.filter((n) => n.id !== id));
        return of(true);
      })
    );
  }

  markAsRead(id: string): Observable<AppNotification> {
    return this.updateNotification(id, { read: true });
  }

  markAllAsRead(): Observable<boolean> {
    const unreadIds = this.unread().map((item) => item.id);
    if (unreadIds.length === 0) {
      return of(true);
    }

    return from(
      this.supabase.client
        .from('notifications')
        .update({ is_read: true })
        .in('id', unreadIds)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((items) => items.map((n) => ({ ...n, read: true })));
        return of(true);
      })
    );
  }

  bulkDelete(ids: string[]): Observable<boolean> {
    return from(
      this.supabase.client
        .from('notifications')
        .delete()
        .in('id', ids)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((items) => items.filter((n) => !ids.includes(n.id)));
        return of(true);
      })
    );
  }

  // Backwards-compatible mutation APIs used by existing components/services.
  markRead(id: string): void {
    this.markAsRead(id).subscribe({
      error: (err) => console.error('Failed to mark notification as read:', err)
    });
  }

  markAllRead(): void {
    this.markAllAsRead().subscribe({
      error: (err) => console.error('Failed to mark all notifications as read:', err)
    });
  }

  delete(id: string): void {
    this.deleteNotification(id).subscribe({
      error: (err) => console.error('Failed to delete notification:', err)
    });
  }

  deleteAll(ids: string[]): void {
    this.bulkDelete(ids).subscribe({
      error: (err) => console.error('Failed to delete notifications:', err)
    });
  }

  /** Push a new notification (used by other services to inject live events). */
  push(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): void {
    this.createNotification(notification).subscribe({
      error: (err) => console.error('Failed to create notification:', err)
    });
  }

  // Helpers
  static priorityOrder(p: NotificationPriority): number {
    return { Critical: 4, High: 3, Medium: 2, Low: 1 }[p] ?? 0;
  }

  private mapDbToNotification(row: any, fallback?: Partial<NotificationRequest | AppNotification>): AppNotification {
    const type = this.mapType(row.type ?? fallback?.type);
    const fb = fallback as any;

    return {
      id: row.id,
      title: row.title ?? fb?.title ?? '',
      message: row.message ?? fb?.message ?? '',
      type,
      category: fb?.category ?? this.categoryFromType(type),
      priority: fb?.priority ?? this.priorityFromType(type),
      read: Boolean(row.is_read ?? fb?.read),
      createdAt: row.created_at ?? fb?.createdAt ?? new Date().toISOString(),
      updatedAt: row.updated_at ?? fb?.updatedAt,
      link: fb?.link
    };
  }

  private mapNotificationToDb(notification: Partial<NotificationRequest>): Record<string, unknown> {
    const dbFields: Record<string, unknown> = {};
    if (notification.userId !== undefined) dbFields['user_id'] = notification.userId;
    if (notification.userId === undefined && this.authState.user()?.id) dbFields['user_id'] = this.authState.user()!.id;
    if (notification.title !== undefined) dbFields['title'] = notification.title;
    if (notification.message !== undefined) dbFields['message'] = notification.message;
    if (notification.type !== undefined) dbFields['type'] = notification.type;
    if (notification.read !== undefined) dbFields['is_read'] = notification.read;
    return dbFields;
  }

  private mapType(type: unknown): NotificationType {
    const normalized = String(type ?? '').toLowerCase();
    const typeMap: Record<string, NotificationType> = {
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error'
    };
    return typeMap[normalized] ?? 'Info';
  }

  private categoryFromType(type: NotificationType): NotificationCategory {
    return type === 'Error' ? 'Security' : 'System';
  }

  private priorityFromType(type: NotificationType): NotificationPriority {
    const map: Record<NotificationType, NotificationPriority> = {
      Error: 'Critical',
      Warning: 'High',
      Info: 'Medium',
      Success: 'Low'
    };
    return map[type];
  }
}
