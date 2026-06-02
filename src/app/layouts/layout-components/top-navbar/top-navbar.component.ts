import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { AuthStateService } from '@core/auth/auth-state.service';
import { ThemeService } from '@core/services/theme.service';
import { ToastService } from '@core/services/toast.service';
import { InitialsPipe } from '@shared/pipes/initials.pipe';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [InitialsPipe, RouterLink],
  template: `
    <header class="navbar navbar-expand bg-body border-bottom px-3">
      <button class="btn btn-outline-secondary d-lg-none me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar" aria-label="Open navigation">☰</button>
      <div class="ms-auto d-flex align-items-center gap-2">
        <button class="btn btn-outline-secondary" type="button" aria-label="Toggle theme" (click)="theme.toggle()">
          {{ theme.theme() === 'light' ? 'Dark' : 'Light' }}
        </button>
        <div class="dropdown">
          <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="badge rounded-pill text-bg-primary me-1">{{ authState.user()?.fullName | initials }}</span>
            {{ authState.user()?.fullName }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" routerLink="/account/change-password">Change password</a></li>
            <li><button class="dropdown-item" type="button" (click)="logout()">Logout</button></li>
          </ul>
        </div>
      </div>
    </header>
    <div class="toast-container position-fixed top-0 end-0 p-3">
      @for (toast of toasts.messages(); track toast.id) {
        <div class="toast show text-bg-{{ toast.type }}" role="status" aria-live="polite">
          <div class="toast-header">
            <strong class="me-auto">{{ toast.title }}</strong>
            <button type="button" class="btn-close" aria-label="Dismiss" (click)="toasts.dismiss(toast.id)"></button>
          </div>
          <div class="toast-body">{{ toast.message }}</div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavbarComponent {
  readonly authState = inject(AuthStateService);
  readonly theme = inject(ThemeService);
  readonly toasts = inject(ToastService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}
