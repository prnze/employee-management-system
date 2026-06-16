import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { SupabaseService } from './supabase.service';
import { AuthStateService } from '@core/auth/auth-state.service';

// ── Mock DB rows ────────────────────────────────────────────────────────────
const MOCK_ROWS_SEED = [
  { id: 'n1', title: 'Payroll approved', message: 'May payroll approved.', type: 'success', is_read: false, created_at: '2026-06-02T09:00:00Z' },
  { id: 'n2', title: 'Profile update',   message: 'Sara updated contacts.', type: 'info',    is_read: true,  created_at: '2026-06-01T10:30:00Z' },
  { id: 'n3', title: 'Failed login',     message: 'Multiple failed attempts.', type: 'error', is_read: false, created_at: '2026-06-03T11:00:00Z' },
  { id: 'n4', title: 'Backup warning',   message: 'Disk usage 90%.',        type: 'warning', is_read: false, created_at: '2026-06-03T12:00:00Z' }
];

// ── Supabase mock builder ───────────────────────────────────────────────────
function createMockSupabase() {
  let rows: any[];

  // Deep-copy seed on every fresh call so tests are isolated
  const resetRows = () => { rows = MOCK_ROWS_SEED.map((r) => ({ ...r })); };
  resetRows();

  return {
    client: {
      from: (_table: string) => ({
        // getNotifications: select('*').order(...)
        select: (_cols?: string) => ({
          order: (_col: string, _opts?: any) => Promise.resolve({ data: [...rows], error: null }),
          eq: (_col: string, val: any) => ({
            single: () => Promise.resolve({
              data: rows.find((r) => r.id === val) ?? null,
              error: rows.find((r) => r.id === val) ? null : { message: 'Not found' }
            })
          })
        }),
        insert: (data: any) => {
          const newRow = { id: 'n-new', ...data, is_read: data.is_read ?? false, created_at: new Date().toISOString() };
          rows = [newRow, ...rows];
          return {
            select: () => ({
              single: () => Promise.resolve({ data: newRow, error: null })
            })
          };
        },
        update: (data: any) => ({
          eq: (_col: string, val: any) => {
            const row = rows.find((r) => r.id === val);
            if (row) Object.assign(row, data);
            return {
              select: () => ({
                single: () => Promise.resolve({ data: row ? { ...row } : null, error: row ? null : { message: 'Not found' } })
              })
            };
          },
          in: (_col: string, ids: string[]) => {
            rows.forEach((r) => { if (ids.includes(r.id)) Object.assign(r, data); });
            return Promise.resolve({ error: null });
          }
        }),
        delete: () => ({
          eq: (_col: string, val: any) => {
            rows = rows.filter((r) => r.id !== val);
            return Promise.resolve({ error: null });
          },
          in: (_col: string, ids: string[]) => {
            rows = rows.filter((r) => !ids.includes(r.id));
            return Promise.resolve({ error: null });
          }
        })
      })
    }
  };
}

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseService, useFactory: createMockSupabase },
        { provide: AuthStateService, useValue: { user: () => ({ id: 'u1', fullName: 'Test Admin' }) } }
      ]
    });
    service = TestBed.inject(NotificationService);
    tick();
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load notifications from Supabase on construction', fakeAsync(() => {
    tick();
    expect(service.all().length).toBe(4);
  }));

  it('should compute unreadCount correctly', fakeAsync(() => {
    tick();
    const unread = service.all().filter((n) => !n.read).length;
    expect(service.unreadCount()).toBe(unread);
    expect(unread).toBe(3); // n1, n3, n4
  }));

  it('should mark a notification as read', fakeAsync(() => {
    tick();
    const target = service.all().find((n) => !n.read)!;
    expect(target).toBeTruthy();
    service.markAsRead(target.id).subscribe();
    tick();
    expect(service.all().find((n) => n.id === target.id)?.read).toBeTrue();
  }));

  it('should mark all notifications as read', fakeAsync(() => {
    tick();
    service.markAllAsRead().subscribe();
    tick();
    expect(service.unreadCount()).toBe(0);
    expect(service.all().every((n) => n.read)).toBeTrue();
  }));

  it('should delete a notification by id', fakeAsync(() => {
    tick();
    const first = service.all()[0];
    const before = service.all().length;
    service.deleteNotification(first.id).subscribe();
    tick();
    expect(service.all().length).toBe(before - 1);
    expect(service.all().find((n) => n.id === first.id)).toBeUndefined();
  }));

  it('should create a notification', fakeAsync(() => {
    tick();
    const before = service.all().length;
    service.createNotification({
      title: 'Test notification',
      message: 'Test message',
      type: 'Info',
      category: 'System',
      priority: 'Low'
    }).subscribe();
    tick();
    expect(service.all().length).toBe(before + 1);
    expect(service.all()[0].title).toBe('Test notification');
    expect(service.all()[0].read).toBeFalse();
  }));

  it('should filter by category', fakeAsync(() => {
    tick();
    const result = service.filtered({ query: '', category: 'Security', priority: '', status: 'all' });
    expect(result.every((n) => n.category === 'Security')).toBeTrue();
  }));

  it('should filter by status unread', fakeAsync(() => {
    tick();
    const result = service.filtered({ query: '', category: '', priority: '', status: 'unread' });
    expect(result.every((n) => !n.read)).toBeTrue();
  }));

  it('should filter by query string', fakeAsync(() => {
    tick();
    const result = service.filtered({ query: 'payroll', category: '', priority: '', status: 'all' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((n) => n.title.toLowerCase().includes('payroll') || n.message.toLowerCase().includes('payroll'))).toBeTrue();
  }));

  it('priorityOrder should return correct ordering', () => {
    expect(NotificationService.priorityOrder('Critical')).toBe(4);
    expect(NotificationService.priorityOrder('High')).toBe(3);
    expect(NotificationService.priorityOrder('Medium')).toBe(2);
    expect(NotificationService.priorityOrder('Low')).toBe(1);
  });

  it('should derive category=Security for type=Error', fakeAsync(() => {
    tick();
    const errorNotif = service.all().find((n) => n.type === 'Error');
    expect(errorNotif).toBeTruthy();
    expect(errorNotif!.category).toBe('Security');
  }));

  it('should derive priority=Critical for type=Error', fakeAsync(() => {
    tick();
    const errorNotif = service.all().find((n) => n.type === 'Error');
    expect(errorNotif).toBeTruthy();
    expect(errorNotif!.priority).toBe('Critical');
  }));

  it('should bulk delete notifications', fakeAsync(() => {
    tick();
    const before = service.all().length;
    const ids = service.all().slice(0, 2).map((n) => n.id);
    service.bulkDelete(ids).subscribe();
    tick();
    expect(service.all().length).toBe(before - 2);
  }));
});
