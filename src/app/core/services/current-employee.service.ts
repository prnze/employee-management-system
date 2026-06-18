import { inject, Injectable, signal } from '@angular/core';
import { Observable, from, map, of, shareReplay, tap, throwError } from 'rxjs';
import { AuthStateService } from '@core/auth/auth-state.service';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class CurrentEmployeeService {
  private readonly supabase = inject(SupabaseService);
  private readonly authState = inject(AuthStateService);
  private readonly employeeIdSignal = signal<string | null>(null);
  private resolvedForAuthUserId: string | null = null;
  private pendingRequest?: Observable<string>;

  readonly employeeId = this.employeeIdSignal.asReadonly();

  resolve(force = false): Observable<string> {
    const authUserId = this.authState.user()?.id ?? null;
    if (!authUserId) {
      this.reset();
      return throwError(() => new Error('User is not authenticated.'));
    }

    if (this.resolvedForAuthUserId !== authUserId) {
      this.reset();
      this.resolvedForAuthUserId = authUserId;
    }

    const cachedEmployeeId = this.employeeIdSignal();
    if (!force && cachedEmployeeId) {
      return of(cachedEmployeeId);
    }
    if (!force && this.pendingRequest) {
      return this.pendingRequest;
    }

    const request = from(this.supabase.client.rpc('current_employee_id')).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        if (this.authState.user()?.id !== authUserId) {
          throw new Error('Authenticated user changed while resolving the employee record.');
        }
        if (typeof data !== 'string' || !data) {
          throw new Error('No employee record is linked to the authenticated user.');
        }
        return data;
      }),
      tap({
        next: (employeeId) => {
          this.employeeIdSignal.set(employeeId);
          this.pendingRequest = undefined;
        },
        error: () => {
          this.pendingRequest = undefined;
        }
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    this.pendingRequest = request;
    return request;
  }

  private reset(): void {
    this.employeeIdSignal.set(null);
    this.resolvedForAuthUserId = null;
    this.pendingRequest = undefined;
  }
}
