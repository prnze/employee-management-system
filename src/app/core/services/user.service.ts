import { computed, inject, Injectable, signal, OnDestroy } from '@angular/core';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { User, UserFilter, UserRequest, UserSortEntry, UserStatus } from '@core/models/user.models';
import { AppRole } from '@core/constants/roles.constant';
import { NotificationService } from './notification.service';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  private readonly store     = signal<User[]>([]);
  private realtimeChannel?: any;
  private readonly notif     = inject(NotificationService);
  private readonly supabase  = inject(SupabaseService);

  // ── Read signals ───────────────────────────────────────────────────────────
  readonly users       = this.store.asReadonly();
  readonly totalCount  = computed(() => this.store().length);
  readonly activeCount = computed(() => this.store().filter((u) => u.status === 'Active').length);
  readonly lockedCount = computed(() => this.store().filter((u) => u.status === 'Locked').length);
  readonly adminCount  = computed(() => this.store().filter((u) => u.role === 'Admin').length);

  constructor() {
    this.loadUsers();

    if (typeof this.supabase.client.channel === 'function') {
      this.realtimeChannel = this.supabase.client
        .channel('users-realtime')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'users' },
          (payload: any) => this.handleRealtimeEvent(payload)
        )
        .subscribe();
    }
  }

  private handleRealtimeEvent(payload: any): void {
    if (payload.eventType === 'UPDATE') {
      const updatedUser = this.mapDbToUser(payload.new);
      this.store.update((users) =>
        users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    }
  }

  ngOnDestroy(): void {
    if (this.realtimeChannel && typeof this.supabase.client.removeChannel === 'function') {
      this.supabase.client.removeChannel(this.realtimeChannel);
    }
  }

  private loadUsers(): void {
    from(
      this.supabase.client
        .from('users')
        .select('*')
    ).subscribe({
      next: ({ data, error }) => {
        if (error) {
          console.error('Failed to load users from Supabase:', error);
        } else if (data) {
          this.store.set(data.map((u: any) => this.mapDbToUser(u)));
        }
      },
      error: (err) => {
        console.error('Failed to load users:', err);
      }
    });
  }

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
    const parts = (req.fullName || '').trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    return from(
      this.supabase.client.functions.invoke('create-user', {
        body: {
          email: req.email,
          first_name: firstName,
          last_name: lastName,
          role: req.role === 'Admin' ? 'ADMIN' : 'EMPLOYEE',
          status: req.status === 'Active' ? 'ACTIVE' : (req.status === 'Locked' ? 'LOCKED' : 'INACTIVE'),
          phone: req.phone || null,
          department: req.department || null,
          extra_permissions: req.extraPermissions || []
        }
      })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message || 'Failed to invoke create-user edge function'));
        }
        const createdUser = this.mapDbToUser(data);
        this.store.update((users) => [createdUser, ...users]);
        return of(createdUser);
      })
    );
  }

  update(id: string, req: Partial<UserRequest>): Observable<User> {
    const dbFields: any = {};
    if (req.fullName !== undefined) {
      const parts = (req.fullName || '').trim().split(/\s+/);
      dbFields.first_name = parts[0] || '';
      dbFields.last_name = parts.slice(1).join(' ') || '';
    }
    if (req.email !== undefined) {
      dbFields.email = req.email;
    }
    if (req.role !== undefined) {
      dbFields.role = req.role === 'Admin' ? 'ADMIN' : 'EMPLOYEE';
    }
    if (req.status !== undefined) {
      dbFields.status = req.status === 'Active' ? 'ACTIVE' : (req.status === 'Locked' ? 'LOCKED' : 'INACTIVE');
    }
    if (req.extraPermissions !== undefined) {
      dbFields.extra_permissions = req.extraPermissions;
    }
    if (req.forcePasswordReset !== undefined) {
      dbFields.force_password_reset = req.forcePasswordReset;
    }
    if (req.phone !== undefined) {
      dbFields.phone = req.phone || null;
    }
    if (req.department !== undefined) {
      dbFields.department = req.department || null;
    }
    if (req.avatarUrl !== undefined) {
      dbFields.avatar_url = req.avatarUrl || null;
    }

    return from(
      this.supabase.client
        .from('users')
        .update(dbFields)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const updatedUser = this.mapDbToUser(data);
        this.store.update((users) => users.map((u) => u.id === id ? updatedUser : u));
        return of(updatedUser);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    const user = this.store().find((u) => u.id === id);
    return from(
      this.supabase.client
        .from('users')
        .delete()
        .eq('id', id)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((u) => u.filter((x) => x.id !== id));
        this.notif.push({ title: 'User deleted', message: `Account for ${user?.fullName ?? id} was permanently removed.`, type: 'Warning', category: 'Security', priority: 'High' });
        return of(true);
      })
    );
  }

  bulkDelete(ids: string[]): Observable<boolean> {
    return from(
      this.supabase.client
        .from('users')
        .delete()
        .in('id', ids)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((u) => u.filter((x) => !ids.includes(x.id)));
        return of(true);
      })
    );
  }

  // ── Status transitions ────────────────────────────────────────────────────
  setStatus(id: string, status: UserStatus): Observable<User> {
    return this.update(id, { status });
  }

  bulkSetStatus(ids: string[], status: UserStatus): Observable<boolean> {
    const dbStatus = status === 'Active' ? 'ACTIVE' : (status === 'Locked' ? 'LOCKED' : 'INACTIVE');
    return from(
      this.supabase.client
        .from('users')
        .update({ status: dbStatus })
        .in('id', ids)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.store.update((users) => users.map((x) => ids.includes(x.id) ? { ...x, status } : x));
        return of(true);
      })
    );
  }

  lock(id: string): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    this.notif.push({ title: 'Account locked', message: `${user?.fullName ?? id}'s account has been locked.`, type: 'Warning', category: 'Security', priority: 'High' });
    return this.update(id, { status: 'Locked' });
  }

  unlock(id: string): Observable<User> {
    return this.update(id, { status: 'Active' });
  }

  forcePasswordReset(id: string): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    this.notif.push({ title: 'Password reset required', message: `${user?.fullName ?? id} will be prompted to reset password on next login.`, type: 'Warning', category: 'Security', priority: 'Medium' });
    return this.update(id, { forcePasswordReset: true });
  }

  // ── Permissions ───────────────────────────────────────────────────────────
  addPermission(id: string, permission: string): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    if (!user) return throwError(() => new Error('User not found'));
    const extra = Array.from(new Set([...(user.extraPermissions ?? []), permission]));
    return this.update(id, { extraPermissions: extra });
  }

  removePermission(id: string, permission: string): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    if (!user) return throwError(() => new Error('User not found'));
    const extra = (user.extraPermissions ?? []).filter((p) => p !== permission);
    return this.update(id, { extraPermissions: extra });
  }

  assignRole(id: string, role: AppRole): Observable<User> {
    const user = this.store().find((u) => u.id === id);
    if (!user) return throwError(() => new Error('User not found'));
    return this.update(id, { role });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  private mapDbToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      fullName: `${dbUser.first_name || ''} ${dbUser.last_name || ''}`.trim() || dbUser.email,
      email: dbUser.email,
      role: dbUser.role === 'ADMIN' ? 'Admin' : 'Employee',
      status: dbUser.status === 'ACTIVE' ? 'Active' : (dbUser.status === 'LOCKED' ? 'Locked' : 'Inactive'),
      lastLoginAt: dbUser.last_login_at || undefined,
      createdAt: dbUser.created_at || undefined,
      extraPermissions: dbUser.extra_permissions || [],
      forcePasswordReset: dbUser.force_password_reset || false,
      phone: dbUser.phone || undefined,
      department: dbUser.department || undefined,
      avatarUrl: dbUser.avatar_url || undefined
    };
  }

}
