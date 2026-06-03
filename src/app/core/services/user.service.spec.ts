import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('should seed 5 users', () => expect(service.users().length).toBe(5));

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

  it('should create a new user', (done) => {
    const before = service.users().length;
    service.create({
      fullName: 'Test User', email: 'test.new@ems.local', role: 'Employee',
      status: 'Active', extraPermissions: [], forcePasswordReset: false
    }).subscribe((u) => {
      expect(service.users().length).toBe(before + 1);
      expect(u.email).toBe('test.new@ems.local');
      done();
    });
  });

  it('should reject duplicate email on create', (done) => {
    service.create({
      fullName: 'Dupe', email: 'admin@ems.local', role: 'Employee',
      status: 'Active', extraPermissions: [], forcePasswordReset: false
    }).subscribe({
      error: (err: Error) => {
        expect(err.message).toContain('admin@ems.local');
        done();
      }
    });
  });

  it('should update an existing user', (done) => {
    const id = service.users()[0].id;
    service.update(id, { fullName: 'Updated Name' }).subscribe((u) => {
      expect(u.fullName).toBe('Updated Name');
      expect(service.users().find((x) => x.id === id)?.fullName).toBe('Updated Name');
      done();
    });
  });

  it('should delete a user', (done) => {
    const id = service.users()[0].id;
    const before = service.users().length;
    service.delete(id).subscribe(() => {
      expect(service.users().length).toBe(before - 1);
      expect(service.users().find((u) => u.id === id)).toBeUndefined();
      done();
    });
  });

  it('should lock a user', (done) => {
    const activeUser = service.users().find((u) => u.status === 'Active')!;
    service.lock(activeUser.id).subscribe((u) => {
      expect(u.status).toBe('Locked');
      done();
    });
  });

  it('should unlock a user', (done) => {
    const lockedUser = service.users().find((u) => u.status === 'Locked')!;
    service.unlock(lockedUser.id).subscribe((u) => {
      expect(u.status).toBe('Active');
      done();
    });
  });

  it('should set forcePasswordReset flag', (done) => {
    const id = service.users()[0].id;
    service.forcePasswordReset(id).subscribe((u) => {
      expect(u.forcePasswordReset).toBeTrue();
      done();
    });
  });

  it('should add and remove extra permissions', (done) => {
    const id = service.users()[1].id;
    service.addPermission(id, 'reports:view').subscribe((u) => {
      expect(u.extraPermissions).toContain('reports:view');
      service.removePermission(id, 'reports:view').subscribe((u2) => {
        expect(u2.extraPermissions).not.toContain('reports:view');
        done();
      });
    });
  });

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

  it('should bulk update status', (done) => {
    const ids = service.users().slice(0, 2).map((u) => u.id);
    service.bulkSetStatus(ids, 'Inactive').subscribe(() => {
      const updated = service.users().filter((u) => ids.includes(u.id));
      expect(updated.every((u) => u.status === 'Inactive')).toBeTrue();
      done();
    });
  });
});
