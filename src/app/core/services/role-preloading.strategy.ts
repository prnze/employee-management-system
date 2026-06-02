import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthStateService } from '@core/auth/auth-state.service';

@Injectable({ providedIn: 'root' })
export class RolePreloadingStrategy implements PreloadingStrategy {
  constructor(private readonly authState: AuthStateService) {}

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const shouldPreload = route.data?.['preload'] === true && this.authState.isAuthenticated();
    return shouldPreload ? load() : of(null);
  }
}
