import {
  ChangeDetectionStrategy, Component, computed, inject, ViewChild
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@core/auth/auth.service';
import { AuthStateService } from '@core/auth/auth-state.service';
import { ThemeService } from '@core/services/theme.service';
import { ToastService } from '@core/services/toast.service';
import { NotificationService } from '@core/services/notification.service';
import { LanguageService, SUPPORTED_LANGUAGES } from '@core/services/language.service';
import { LanguageTransitionComponent } from '@shared/components/language-transition/language-transition.component';
import { AppNotification } from '@core/models/notification.models';
import { InitialsPipe } from '@shared/pipes/initials.pipe';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [InitialsPipe, RouterLink, AppDatePipe, TranslatePipe, LanguageTransitionComponent],
  styles: [`
    .bell-btn { position: relative; }
    .unread-badge {
      position: absolute; top: 2px; right: 2px;
      min-width: 18px; height: 18px; line-height: 18px;
      font-size: .65rem; padding: 0 4px;
      background: var(--bs-danger); color: #fff;
      border-radius: 9px; font-weight: 700;
      pointer-events: none;
    }
    .notification-dropdown { width: 360px; max-height: 420px; overflow-y: auto; }
    .notif-item { transition: background 0.15s; }
    .notif-item:hover { background: var(--bs-body-tertiary); }
    .notif-item.unread { border-left: 3px solid var(--bs-primary); }
    .notif-item.read   { border-left: 3px solid transparent; }
    .priority-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
    .lang-flag { font-size: 1rem; line-height: 1; }
  `],
  template: `
    <!-- Language transition overlay (sits above everything) -->
    <app-language-transition #langTransition />

    <header class="navbar navbar-expand bg-body border-bottom px-3">
      <button class="btn btn-outline-secondary d-lg-none me-2" type="button"
        data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar"
        [attr.aria-label]="'NAV_NAVIGATION' | translate">☰</button>

      <div class="ms-auto d-flex align-items-center gap-2">

        <!-- Language selector -->
        <div class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-1"
            type="button" data-bs-toggle="dropdown" aria-expanded="false"
            [attr.aria-label]="'LANG_SELECT' | translate">
            <span class="lang-flag">{{ langSvc.currentLanguage().flag }}</span>
            <span class="d-none d-md-inline small">{{ langSvc.currentLanguage().name }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            @for (lang of languages; track lang.code) {
              <li>
                <button class="dropdown-item d-flex align-items-center gap-2"
                  type="button"
                  [class.active]="lang.code === langSvc.currentCode()"
                  (click)="switchLanguage(lang.code)">
                  <span class="lang-flag">{{ lang.flag }}</span>
                  <span>{{ lang.code === 'en' ? ('LANG_ENGLISH' | translate) : ('LANG_GERMAN' | translate) }}</span>
                </button>
              </li>
            }
          </ul>
        </div>

        <!-- Theme toggle -->
        <button class="btn btn-outline-secondary btn-sm" type="button"
          [attr.aria-label]="'LANG_SELECT' | translate"
          (click)="theme.toggle()">
          {{ theme.theme() === 'light' ? ('THEME_DARK' | translate) : ('THEME_LIGHT' | translate) }}
        </button>

        <!-- Notification bell -->
        <div class="dropdown">
          <button class="btn btn-outline-secondary btn-sm bell-btn position-relative"
            type="button" id="notif-dropdown-btn"
            data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"
            [attr.aria-label]="('NOTIF_TITLE' | translate) + ' — ' + notifications.unreadCount() + ' ' + ('NOTIF_UNREAD' | translate)">
            🔔
            @if (notifications.unreadCount() > 0) {
              <span class="unread-badge" aria-hidden="true">
                {{ notifications.unreadCount() > 99 ? '99+' : notifications.unreadCount() }}
              </span>
            }
          </button>

          <div class="dropdown-menu dropdown-menu-end notification-dropdown shadow-sm p-0">
            <!-- Header -->
            <div class="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
              <strong class="small">{{ 'NOTIF_TITLE' | translate }}</strong>
              <div class="d-flex gap-2">
                @if (notifications.unreadCount() > 0) {
                  <button class="btn btn-link btn-sm p-0 small" type="button" (click)="markAllRead()">
                    {{ 'NOTIF_MARK_ALL' | translate }}
                  </button>
                }
                <a class="btn btn-link btn-sm p-0 small" [routerLink]="notificationsRoute()">
                  {{ 'NOTIF_VIEW_ALL' | translate }}
                </a>
              </div>
            </div>

            <!-- Preview list -->
            @if (previewItems().length > 0) {
              @for (n of previewItems(); track n.id) {
                <div class="notif-item px-3 py-2 border-bottom d-flex gap-2"
                  [class.unread]="!n.read" [class.read]="n.read"
                  style="cursor:pointer" (click)="handleNotifClick(n)">
                  <span class="priority-dot mt-1" [style.background]="priorityColor(n.priority)"></span>
                  <div class="flex-grow-1 min-w-0">
                    <div class="d-flex justify-content-between align-items-start gap-1">
                      <p class="mb-0 small fw-semibold text-truncate" [class.text-body-secondary]="n.read">{{ n.title }}</p>
                      <span class="badge flex-shrink-0" [class]="categoryClass(n.category)">{{ n.category }}</span>
                    </div>
                    <p class="mb-0 small text-body-secondary text-truncate">{{ n.message }}</p>
                    <p class="mb-0 small text-body-secondary" style="font-size:.7rem">{{ n.createdAt | appDate:'shortTime' }}</p>
                  </div>
                  @if (!n.read) {
                    <span class="rounded-circle bg-primary flex-shrink-0" style="width:8px;height:8px;margin-top:6px"></span>
                  }
                </div>
              }
            } @else {
              <div class="px-3 py-5 text-center text-body-secondary">
                <div class="fs-2 mb-2">🔔</div>
                <p class="small mb-0">{{ 'NOTIF_ALL_CAUGHT_UP' | translate }}</p>
              </div>
            }

            <!-- Footer -->
            <div class="px-3 py-2 text-center border-top">
              <a class="btn btn-outline-primary btn-sm w-100" [routerLink]="notificationsRoute()">
                {{ 'NOTIF_VIEW_ALL' | translate }} ({{ notifications.all().length }})
              </a>
            </div>
          </div>
        </div>

        <!-- User menu -->
        <div class="dropdown">
          <button class="btn btn-outline-primary btn-sm dropdown-toggle" type="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            <span class="badge rounded-pill text-bg-primary me-1">{{ authState.user()?.fullName | initials }}</span>
            {{ authState.user()?.fullName }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" routerLink="/account/change-password">{{ 'AUTH_CHANGE_PASSWORD' | translate }}</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item text-danger" type="button" (click)="logout()">{{ 'AUTH_LOGOUT' | translate }}</button></li>
          </ul>
        </div>
      </div>
    </header>

    <!-- Toast container -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index:1100">
      @for (toast of toasts.messages(); track toast.id) {
        <div class="toast show text-bg-{{ toast.type }}" role="status" aria-live="polite">
          <div class="toast-header">
            <strong class="me-auto">{{ toast.title }}</strong>
            <button type="button" class="btn-close" [attr.aria-label]="'COMMON_CLOSE' | translate" (click)="toasts.dismiss(toast.id)"></button>
          </div>
          <div class="toast-body">{{ toast.message }}</div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavbarComponent {
  @ViewChild('langTransition') private langTransition!: LanguageTransitionComponent;

  readonly authState     = inject(AuthStateService);
  readonly theme         = inject(ThemeService);
  readonly toasts        = inject(ToastService);
  readonly notifications = inject(NotificationService);
  readonly langSvc       = inject(LanguageService);
  private readonly auth  = inject(AuthService);
  private readonly router = inject(Router);

  readonly languages = SUPPORTED_LANGUAGES;

  readonly previewItems = computed(() =>
    [...this.notifications.all()]
      .sort((a, b) =>
        NotificationService.priorityOrder(b.priority) - NotificationService.priorityOrder(a.priority) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
  );

  readonly notificationsRoute = computed(() =>
    this.authState.role() === 'Admin' ? '/admin/notifications' : '/employee/notifications'
  );

  switchLanguage(code: string): void {
    if (code === this.langSvc.currentCode()) return;
    // Trigger diagonal sweep, swap language at midpoint
    this.langTransition.trigger(() => this.langSvc.setLanguage(code));
  }

  handleNotifClick(n: AppNotification): void {
    this.notifications.markRead(n.id);
    if (n.link) void this.router.navigateByUrl(n.link);
  }

  onBellClick(): void { /* handled by Bootstrap dropdown */ }
  markAllRead(): void  { this.notifications.markAllRead(); }

  priorityColor(priority: AppNotification['priority']): string {
    return { Critical: '#dc3545', High: '#fd7e14', Medium: '#ffc107', Low: '#6c757d' }[priority] ?? '#6c757d';
  }

  categoryClass(category: AppNotification['category']): string {
    return {
      System: 'text-bg-secondary', Security: 'text-bg-danger',
      Employee: 'text-bg-primary', Attendance: 'text-bg-warning text-dark', Tasks: 'text-bg-info text-dark'
    }[category] ?? 'text-bg-secondary';
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}
