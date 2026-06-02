import { Injectable } from '@angular/core';
import { delay, map, Observable, of, throwError } from 'rxjs';
import { APP_ROLES, ROLE_PERMISSIONS } from '@core/constants/roles.constant';
import { AuthUser, ChangePasswordRequest, LoginRequest, LoginResponse, ResetPasswordRequest } from '@core/models/auth.models';
import { AuditService } from '@core/services/audit.service';
import { AuthStateService } from './auth-state.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly mockUsers: Array<AuthUser & { password: string }> = [
    {
      id: 'u-admin',
      email: 'admin@ems.local',
      password: 'Admin@123',
      fullName: 'Avery Admin',
      role: APP_ROLES.admin,
      permissions: ROLE_PERMISSIONS.Admin
    },
    {
      id: 'u-employee',
      email: 'employee@ems.local',
      password: 'Employee@123',
      fullName: 'Emerson Employee',
      role: APP_ROLES.employee,
      permissions: ROLE_PERMISSIONS.Employee
    }
  ];

  constructor(
    private readonly authState: AuthStateService,
    private readonly tokenService: TokenService,
    private readonly audit: AuditService
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    const found = this.mockUsers.find((user) => user.email === request.email && user.password === request.password);
    if (!found) {
      return throwError(() => new Error('Invalid email or password'));
    }
    const { password: _password, ...user } = found;
    const response: LoginResponse = {
      user,
      accessToken: `mock-access-token-${user.role}-${Date.now()}`,
      refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };
    return of(response).pipe(
      delay(350),
      map((result) => {
        this.tokenService.setTokens(result.accessToken, result.refreshToken, request.rememberMe, result.expiresAt);
        this.authState.setUser(result.user, request.rememberMe);
        this.audit.record(result.user.fullName, 'LOGIN', 'Auth');
        return result;
      })
    );
  }

  logout(): void {
    const actor = this.authState.user()?.fullName ?? 'Unknown user';
    this.audit.record(actor, 'LOGOUT', 'Auth');
    this.authState.clear();
    this.tokenService.clear();
  }

  forgotPassword(email: string): Observable<boolean> {
    return of(this.mockUsers.some((user) => user.email === email)).pipe(delay(300));
  }

  resetPassword(_request: ResetPasswordRequest): Observable<boolean> {
    return of(true).pipe(delay(300));
  }

  changePassword(_request: ChangePasswordRequest): Observable<boolean> {
    return of(true).pipe(delay(300));
  }

  refreshToken(): Observable<{ accessToken: string; expiresAt: string }> {
    if (!this.tokenService.refreshToken()) {
      return throwError(() => new Error('Missing refresh token'));
    }
    return of({
      accessToken: `mock-access-token-refreshed-${Date.now()}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    }).pipe(delay(250));
  }
}
