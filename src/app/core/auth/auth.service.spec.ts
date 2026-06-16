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
  readonly logs = () => [];
  readonly totalCount = () => 0;
  readonly actors = () => [];
  readonly actions = () => [];
  record() {}
  filtered() { return []; }
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: AuditService, useClass: MockAuditService }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('authenticates the admin mock user', (done) => {
    service.login({ email: 'admin@ems.local', password: 'Admin@123', rememberMe: false }).subscribe((result) => {
      expect(result.user.role).toBe('Admin');
      expect(result.accessToken).toContain('mock-access-token');
      done();
    });
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
