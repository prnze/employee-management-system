import {
  ChangeDetectionStrategy, Component, computed, inject, ViewChild
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@core/auth/auth.service';
import { AuthStateService } from '@core/auth/auth-state.service';
import { ThemeService } from '@core/services/theme.service';
import { NotificationService } from '@core/services/notification.service';
import { LanguageService, SUPPORTED_LANGUAGES } from '@core/services/language.service';
import { LanguageTransitionComponent } from '@shared/components/language-transition/language-transition.component';
import { AppNotification } from '@core/models/notification.models';
import { InitialsPipe } from '@shared/pipes/initials.pipe';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { ShellStateService } from '@core/services/shell-state.service';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [InitialsPipe, RouterLink, AppDatePipe, TranslatePipe, LanguageTransitionComponent, IconComponent],
  styleUrl: './top-navbar.component.scss',
  templateUrl: './top-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavbarComponent {
  readonly APP_ICONS = APP_ICONS;
  @ViewChild('langTransition') private langTransition!: LanguageTransitionComponent;

  readonly shell         = inject(ShellStateService);
  readonly authState     = inject(AuthStateService);
  readonly theme         = inject(ThemeService);
  readonly notifications = inject(NotificationService);
  readonly langSvc       = inject(LanguageService);
  private readonly auth  = inject(AuthService);
  private readonly router = inject(Router);

  readonly orgName = this.authState.organization;

  readonly displayRole = computed(() => {
    const role = this.authState.role();
    if (!role) return '';
    const mapping: Record<string, string> = {
      'Admin': 'Administrator',
      'Employee': 'Employee',
      'Manager': 'Manager',
      'Super Admin': 'Super Admin'
    };
    return mapping[role] || role;
  });

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
