import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
