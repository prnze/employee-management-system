import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from '@core/services/supabase.service';
import { AuditService } from '@core/services/audit.service';

const mockSupabaseClient = {
  auth: {
    signInWithPassword: jasmine.createSpy('signInWithPassword').and.callFake((credentials: any) => {
      if (credentials.email === 'admin@ems.local' && credentials.password === 'Admin@123') {
        return Promise.resolve({
          data: {
            session: {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
              expires_in: 3600,
              user: { id: 'fe28418e-6dd2-4013-8125-253dce495ec2' }
            },
            user: { id: 'fe28418e-6dd2-4013-8125-253dce495ec2' }
          },
          error: null
        });
      }
      return Promise.resolve({
        data: { session: null, user: null },
        error: new Error('Invalid email or password')
      });
    }),
    signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve({ error: null })),
    getSession: jasmine.createSpy('getSession').and.returnValue(Promise.resolve({ data: { session: null }, error: null }))
  },
  from: jasmine.createSpy('from').and.callFake((table: string) => {
    return {
      select: jasmine.createSpy('select').and.callFake(() => {
        return {
          eq: jasmine.createSpy('eq').and.callFake(() => {
            return {
              single: jasmine.createSpy('single').and.callFake(() => {
                return Promise.resolve({
                  data: {
                    id: 'fe28418e-6dd2-4013-8125-253dce495ec2',
                    email: 'admin@ems.local',
                    first_name: 'Avery',
                    last_name: 'Admin',
                    role: 'ADMIN',
                    status: 'ACTIVE'
                  },
                  error: null
                });
              })
            };
          })
        };
      })
    };
  })
};

const mockSupabaseService = {
  client: mockSupabaseClient
};

class MockAuditService {
  recordAsync = jasmine.createSpy('recordAsync').and.returnValue(Promise.resolve());
  readonly logs = () => [];
  readonly totalCount = () => 0;
  readonly actors = () => [];
  readonly actions = () => [];
  record() {}
  filtered() { return []; }
}

describe('AuthService', () => {
  let service: AuthService;
  let audit: MockAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: AuditService, useClass: MockAuditService }
      ]
    });
    service = TestBed.inject(AuthService);
    audit = TestBed.inject(AuditService) as unknown as MockAuditService;
  });

  it('authenticates the admin mock user', (done) => {
    service.login({ email: 'admin@ems.local', password: 'Admin@123', rememberMe: false }).subscribe((result) => {
      expect(result.user.role).toBe('Admin');
      expect(result.accessToken).toContain('mock-access-token');
      expect(audit.recordAsync).toHaveBeenCalledWith(
        'Avery Admin',
        'LOGIN',
        'Auth',
        { category: 'Auth', details: 'User logged in' }
      );
      done();
    });
  });

  it('records logout before signing out', async () => {
    let resolveAudit!: () => void;
    audit.recordAsync.and.returnValue(new Promise<void>((resolve) => {
      resolveAudit = resolve;
    }));
    mockSupabaseClient.auth.signOut.calls.reset();

    service.logout();
    expect(audit.recordAsync).toHaveBeenCalledWith(
      jasmine.any(String),
      'LOGOUT',
      'Auth',
      { category: 'Auth', details: 'User logged out' }
    );
    expect(mockSupabaseClient.auth.signOut).not.toHaveBeenCalled();

    resolveAudit();
    await Promise.resolve();
    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
  });

  it('rejects invalid credentials', (done) => {
    service.login({ email: 'admin@ems.local', password: 'wrong', rememberMe: false }).subscribe({
      error: (error: Error) => {
        expect(error.message).toContain('Invalid');
        done();
      }
    });
  });
});
