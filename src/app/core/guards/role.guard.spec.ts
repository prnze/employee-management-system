import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthStateService } from '@core/auth/auth-state.service';
import { PermissionService } from '@core/auth/permission.service';
import { AuthUser } from '@core/models/auth.models';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  const user: AuthUser = {
    id: '1',
    email: 'admin@ems.local',
    fullName: 'Admin User',
    role: 'Admin',
    permissions: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), AuthStateService, PermissionService] });
    TestBed.inject(AuthStateService).setUser(user, false);
  });

  it('allows matching roles', () => {
    const result = TestBed.runInInjectionContext(() => roleGuard({ data: { roles: ['Admin'] } } as never, {} as never));
    expect(result).toBeTrue();
  });

  it('redirects non-matching roles', () => {
    const result = TestBed.runInInjectionContext(() => roleGuard({ data: { roles: ['Employee'] } } as never, {} as never));
    expect(result).toEqual(TestBed.inject(Router).createUrlTree(['/403']));
  });
});
