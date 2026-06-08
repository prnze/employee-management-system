import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AppRole, APP_ROLES } from '@core/constants/roles.constant';
import { PermissionService } from '@core/auth/permission.service';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { ToastService } from '@core/services/toast.service';
import { DialogService } from '@core/services/dialog.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';

/** Groups raw permission strings like 'employees:create' into { scope, action }. */
interface PermissionEntry {
  raw: string;
  scope: string;
  action: string;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [PermissionDirective, TranslatePipe, IconComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent {
  readonly APP_ICONS = APP_ICONS;
  readonly permissionsService = inject(PermissionService);
  private readonly toast   = inject(ToastService);
  private readonly langSvc = inject(LanguageService);
  private readonly dialogService = inject(DialogService);

  readonly roles: AppRole[] = [APP_ROLES.admin, APP_ROLES.employee];
  readonly selectedRole = signal<AppRole>(APP_ROLES.admin);

  /** All known permissions, parsed and grouped by scope. */
  readonly groupedPermissions = computed(() => {
    const all = this.permissionsService.allPermissions();
    const map = new Map<string, PermissionEntry[]>();
    for (const raw of all) {
      const [scope, action] = raw.split(':');
      const key = scope ?? raw;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({ raw, scope: key, action: action ?? raw });
    }
    return Array.from(map.entries()).map(([scope, entries]) => ({ scope, entries }));
  });

  isGranted(permission: string): boolean {
    return this.permissionsService.getPermissions(this.selectedRole()).includes(permission);
  }

  toggle(permission: string): void {
    this.permissionsService.togglePermission(this.selectedRole(), permission);
    const granted = this.permissionsService.getPermissions(this.selectedRole()).includes(permission);
    this.toast.showToast(
      granted ? 'PERMISSION_GRANTED_SUCCESS' : 'PERMISSION_REVOKED_SUCCESS',
      granted ? 'success' : 'info',
      { permission, role: this.selectedRole() }
    );
  }

  grantAll(): void {
    this.dialogService.confirm({
      title: 'DIALOG_GRANT_ALL_TITLE',
      message: 'DIALOG_GRANT_ALL_MSG',
      translationParams: { role: this.selectedRole() },
      variant: 'warning',
      icon: 'security'
    }).then((confirmed) => {
      if (confirmed) {
        const all = this.permissionsService.allPermissions();
        this.permissionsService.setPermissions(this.selectedRole(), all);
        this.toast.showToast('ALL_PERMISSIONS_GRANTED_SUCCESS', 'success', { role: this.selectedRole() });
      }
    });
  }

  revokeAll(): void {
    this.dialogService.confirm({
      title: 'DIALOG_REVOKE_ALL_TITLE',
      message: 'DIALOG_REVOKE_ALL_MSG',
      translationParams: { role: this.selectedRole() },
      variant: 'danger',
      icon: 'gpp_bad'
    }).then((confirmed) => {
      if (confirmed) {
        this.permissionsService.setPermissions(this.selectedRole(), []);
        this.toast.showToast('ALL_PERMISSIONS_REVOKED_SUCCESS', 'warning', { role: this.selectedRole() });
      }
    });
  }

  scopeIcon(scope: string): string {
    const icons: Record<string, string> = {
      dashboard: APP_ICONS.DASHBOARD,
      employees: APP_ICONS.USERS,
      users: APP_ICONS.USER,
      roles: APP_ICONS.ROLE,
      reports: APP_ICONS.REPORTS,
      audit: APP_ICONS.AUDIT,
      settings: APP_ICONS.SETTINGS,
      profile: APP_ICONS.EMPLOYEE,
      attendance: APP_ICONS.CALENDAR,
      tasks: APP_ICONS.TASKS,
      notifications: APP_ICONS.NOTIFICATIONS
    };
    return icons[scope] ?? APP_ICONS.LOCK;
  }
}
