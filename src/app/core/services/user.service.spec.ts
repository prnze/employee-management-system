import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UserService } from './user.service';
import { SupabaseService } from './supabase.service';

const SEED_USERS_DB = [
  {
    id: 'u1', first_name: 'Avery', last_name: 'Admin', email: 'admin@ems.local', role: 'ADMIN', status: 'ACTIVE',
    phone: '+91 98765 43210', department: 'Management',
    last_login_at: '2026-06-03T08:30:00Z', created_at: '2024-01-15T09:00:00Z',
    extra_permissions: [], force_password_reset: false
  },
  {
    id: 'u2', first_name: 'Emerson', last_name: 'Employee', email: 'employee@ems.local', role: 'EMPLOYEE', status: 'ACTIVE',
    phone: '+91 91234 56789', department: 'Engineering',
    last_login_at: '2026-06-02T15:45:00Z', created_at: '2024-03-20T10:30:00Z',
    extra_permissions: [], force_password_reset: false
  },
  {
    id: 'u3', first_name: 'Priya', last_name: 'Manager', email: 'priya.manager@ems.local', role: 'ADMIN', status: 'ACTIVE',
    phone: '+91 88001 12345', department: 'HR',
    last_login_at: '2026-06-01T12:00:00Z', created_at: '2024-06-01T08:00:00Z',
    extra_permissions: ['reports:view'], force_password_reset: false
  },
  {
    id: 'u4', first_name: 'Raj', last_name: 'Sharma', email: 'raj.sharma@ems.local', role: 'EMPLOYEE', status: 'INACTIVE',
    phone: '+91 77009 98765', department: 'Finance',
    last_login_at: '2025-12-15T10:00:00Z', created_at: '2023-11-10T09:00:00Z',
    extra_permissions: [], force_password_reset: false
  },
  {
    id: 'u5', first_name: 'Sneha', last_name: 'Patil', email: 'sneha.patil@ems.local', role: 'EMPLOYEE', status: 'LOCKED',
    phone: '+91 93400 11223', department: 'Design',
    last_login_at: '2026-05-20T14:30:00Z', created_at: '2024-09-05T11:00:00Z',
    extra_permissions: [], force_password_reset: true
  }
];

class MockSupabaseService {
  readonly client = {
    from: (table: string) => {
      return {
        select: () => Promise.resolve({ data: JSON.parse(JSON.stringify(SEED_USERS_DB)), error: null }),
        update: (fields: any) => {
          return {
            eq: (col: string, val: any) => {
              return {
                select: () => {
                  return {
                    single: () => {
                      const found = SEED_USERS_DB.find((u) => u.id === val);
                      const updated = found ? { ...found, ...fields } : null;
                      return Promise.resolve({ data: updated, error: null });
                    }
                  };
                }
              };
            },
            in: (col: string, vals: any[]) => {
              return Promise.resolve({ error: null });
            }
          };
        },
        delete: () => {
          return {
            eq: (col: string, val: any) => {
              return Promise.resolve({ error: null });
            },
            in: (col: string, vals: any[]) => {
              return Promise.resolve({ error: null });
            }
          };
        }
      };
    }
  };
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useClass: MockSupabaseService }
      ]
    });
    service = TestBed.inject(UserService);
    tick(); // resolve loadUsers promise
  }));

  it('should be created', () => expect(service).toBeTruthy());

  it('should seed 5 users from mock Supabase response', () => expect(service.users().length).toBe(5));

  it('should compute activeCount correctly', () => {
    const active = service.users().filter((u) => u.status === 'Active').length;
    expect(service.activeCount()).toBe(active);
  });

  it('should compute lockedCount correctly', () => {
    const locked = service.users().filter((u) => u.status === 'Locked').length;
    expect(service.lockedCount()).toBe(locked);
  });

  it('should compute adminCount correctly', () => {
    const admins = service.users().filter((u) => u.role === 'Admin').length;
    expect(service.adminCount()).toBe(admins);
  });

  it('should reject create action with disabled error', (done) => {
    service.create({
      fullName: 'Test User', email: 'test.new@ems.local', role: 'Employee',
      status: 'Active', extraPermissions: [], forcePasswordReset: false
    }).subscribe({
      error: (err: Error) => {
        expect(err.message).toContain('disabled');
        done();
      }
    });
  });

  it('should update an existing user', fakeAsync(() => {
    const id = service.users()[0].id;
    let updatedUser: any;
    service.update(id, { fullName: 'Updated Name' }).subscribe((u) => {
      updatedUser = u;
    });
    tick();
    expect(updatedUser.fullName).toBe('Updated Name');
    expect(service.users().find((x) => x.id === id)?.fullName).toBe('Updated Name');
  }));

  it('should delete a user', fakeAsync(() => {
    const id = service.users()[0].id;
    const before = service.users().length;
    let deleted = false;
    service.delete(id).subscribe(() => {
      deleted = true;
    });
    tick();
    expect(deleted).toBeTrue();
    expect(service.users().length).toBe(before - 1);
    expect(service.users().find((u) => u.id === id)).toBeUndefined();
  }));

  it('should lock a user', fakeAsync(() => {
    const activeUser = service.users().find((u) => u.status === 'Active')!;
    let lockedUser: any;
    service.lock(activeUser.id).subscribe((u) => {
      lockedUser = u;
    });
    tick();
    expect(lockedUser.status).toBe('Locked');
  }));

  it('should unlock a user', fakeAsync(() => {
    const lockedUser = service.users().find((u) => u.status === 'Locked')!;
    let activeUser: any;
    service.unlock(lockedUser.id).subscribe((u) => {
      activeUser = u;
    });
    tick();
    expect(activeUser.status).toBe('Active');
  }));

  it('should set forcePasswordReset flag', fakeAsync(() => {
    const id = service.users()[0].id;
    let updatedUser: any;
    service.forcePasswordReset(id).subscribe((u) => {
      updatedUser = u;
    });
    tick();
    expect(updatedUser.forcePasswordReset).toBeTrue();
  }));

  it('should add and remove extra permissions', fakeAsync(() => {
    const id = service.users()[1].id;
    let updatedUser: any;
    service.addPermission(id, 'reports:view').subscribe((u) => {
      updatedUser = u;
    });
    tick();
    expect(updatedUser.extraPermissions).toContain('reports:view');

    service.removePermission(id, 'reports:view').subscribe((u2) => {
      updatedUser = u2;
    });
    tick();
    expect(updatedUser.extraPermissions).not.toContain('reports:view');
  }));

  it('should filter by role', () => {
    const admins = service.filtered({ query: '', role: 'Admin', status: '', createdFrom: '', createdTo: '', hasExtraPermissions: null }, []);
    expect(admins.every((u) => u.role === 'Admin')).toBeTrue();
  });

  it('should filter by status', () => {
    const locked = service.filtered({ query: '', role: '', status: 'Locked', createdFrom: '', createdTo: '', hasExtraPermissions: null }, []);
    expect(locked.every((u) => u.status === 'Locked')).toBeTrue();
  });

  it('should filter by query', () => {
    const result = service.filtered({ query: 'avery', role: '', status: '', createdFrom: '', createdTo: '', hasExtraPermissions: null }, []);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].fullName.toLowerCase()).toContain('avery');
  });

  it('should sort by fullName ascending', () => {
    const sorted = service.filtered({ query: '', role: '', status: '', createdFrom: '', createdTo: '', hasExtraPermissions: null }, [{ field: 'fullName', direction: 'asc' }]);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].fullName.toLowerCase() <= sorted[i + 1].fullName.toLowerCase()).toBeTrue();
    }
  });

  it('should bulk update status', fakeAsync(() => {
    const ids = service.users().slice(0, 2).map((u) => u.id);
    let done = false;
    service.bulkSetStatus(ids, 'Inactive').subscribe(() => {
      done = true;
    });
    tick();
    expect(done).toBeTrue();
    const updated = service.users().filter((u) => ids.includes(u.id));
    expect(updated.every((u) => u.status === 'Inactive')).toBeTrue();
  }));
});
