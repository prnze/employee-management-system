import { Injectable } from '@angular/core';
import { from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { APP_ROLES, ROLE_PERMISSIONS, AppRole } from '@core/constants/roles.constant';
import { AuthUser, ChangePasswordRequest, LoginRequest, LoginResponse, ResetPasswordRequest } from '@core/models/auth.models';
import { AuditService } from '@core/services/audit.service';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthStateService } from './auth-state.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly restoreSessionTimeoutMs = 2500;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly authState: AuthStateService,
    private readonly tokenService: TokenService,
    private readonly audit: AuditService
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return from(
      this.supabase.client.auth.signInWithPassword({
        email: request.email,
        password: request.password
      })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => error);
        }
        if (!data.session || !data.user) {
          return throwError(() => new Error('No session data returned'));
        }
        const session = data.session;
        return this.fetchProfile(session.user.id).pipe(
          switchMap((user) => {
            const response: LoginResponse = {
              user,
              accessToken: session.access_token,
              refreshToken: session.refresh_token ?? '',
              expiresAt: new Date(Date.now() + (session.expires_in ?? 3600) * 1000).toISOString()
            };
            this.tokenService.setTokens(response.accessToken, response.refreshToken, request.rememberMe, response.expiresAt);
            this.authState.setUser(response.user, request.rememberMe);
            return from(
              this.audit.recordAsync(user.fullName, 'LOGIN', 'Auth', {
                category: 'Auth',
                details: 'User logged in'
              })
            ).pipe(map(() => response));
          })
        );
      })
    );
  }

  logout(): void {
    const actor = this.authState.user()?.fullName ?? 'Unknown user';
    const auditWrite = this.audit.recordAsync(actor, 'LOGOUT', 'Auth', {
      category: 'Auth',
      details: 'User logged out'
    });

    this.authState.clear();
    this.tokenService.clear();

    void auditWrite.finally(() => this.supabase.client.auth.signOut());
  }

  forgotPassword(email: string): Observable<boolean> {
    return from(
      this.supabase.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/ems/auth/reset-password`
      })
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return true;
      })
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<boolean> {
    return from(
      this.supabase.client.auth.updateUser({ password: request.password })
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return true;
      })
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<boolean> {
    const userId = this.authState.user()?.id;
    return from(
      this.supabase.client.auth.updateUser({ password: request.newPassword })
    ).pipe(
      switchMap(({ error }) => {
        if (error) throw error;
        if (!userId) return of(true);
        return from(
          this.supabase.client
            .from('users')
            .update({ force_password_reset: false })
            .eq('id', userId)
        ).pipe(
          map(({ error: dbErr }) => {
            if (dbErr) console.warn('Failed to update force_password_reset flag:', dbErr);
            return true;
          })
        );
      })
    );
  }

  refreshToken(): Observable<{ accessToken: string; expiresAt: string }> {
    return from(
      this.supabase.client.auth.refreshSession()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data.session) throw new Error('Failed to refresh session');
        
        const session = data.session;
        const expiresAt = new Date(Date.now() + (session.expires_in ?? 3600) * 1000).toISOString();
        this.tokenService.updateAccessToken(session.access_token, expiresAt);
        
        return {
          accessToken: session.access_token,
          expiresAt: expiresAt
        };
      })
    );
  }

  restoreSession(): Promise<void> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<void>((resolve) => {
      timeoutId = setTimeout(() => {
        console.warn('Session restore timed out. Continuing app bootstrap.');
        resolve();
      }, this.restoreSessionTimeoutMs);
    });

    return Promise.race([
      this.restoreSessionFromSupabase(),
      timeout
    ]).finally(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });
  }

  private restoreSessionFromSupabase(): Promise<void> {
    return new Promise((resolve) => {
      this.supabase.client.auth.getSession().then(({ data: { session } }) => {
        if (!session?.user) {
          this.clearLocalSession();
          resolve();
          return;
        }

        const expiresAt = new Date(Date.now() + (session.expires_in ?? 3600) * 1000).toISOString();
        this.tokenService.setTokens(
          session.access_token,
          session.refresh_token ?? '',
          this.tokenService.rememberMe(),
          expiresAt
        );

        this.fetchProfile(session.user.id).subscribe({
          next: (authUser) => {
            this.authState.setUser(authUser, this.tokenService.rememberMe());
            resolve();
          },
          error: (err) => {
            console.error('Failed to restore session profile:', err);
            this.clearLocalSession();
            resolve();
          }
        });
      }).catch((err) => {
        console.error('Get session error during restore:', err);
        this.clearLocalSession();
        resolve();
      });
    });
  }

  private clearLocalSession(): void {
    this.authState.clear();
    this.tokenService.clear();
  }

  private fetchProfile(userId: string): Observable<AuthUser> {
    return from(
      this.supabase.client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
    ).pipe(
      map((res) => {
        if (res.error) throw res.error;
        const dbUser = res.data;
        const dbRole = (dbUser.role || '').toUpperCase();
        const mappedRole: AppRole = dbRole === 'ADMIN' ? APP_ROLES.admin : APP_ROLES.employee;
        return {
          id: dbUser.id,
          email: dbUser.email,
          fullName: `${dbUser.first_name || ''} ${dbUser.last_name || ''}`.trim() || dbUser.email,
          role: mappedRole,
          permissions: ROLE_PERMISSIONS[mappedRole],
          avatarUrl: dbUser.avatar_url || undefined,
          forcePasswordReset: dbUser.force_password_reset || false
        };
      })
    );
  }
}
