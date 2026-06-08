import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PermissionService, PermissionDefinition } from '@core/auth/permission.service';
import { AuthStateService } from '@core/auth/auth-state.service';
import { RuntimeConfigService } from '@core/services/runtime-config.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { InitialsPipe } from '@shared/pipes/initials.pipe';
import { ShellStateService } from '@core/services/shell-state.service';

export interface NavItem {
  /** Translation key string (e.g. 'NAV_DASHBOARD'). */
  label: string;
  path: string;
  icon?: string;
  /** If set, this item is hidden unless the user has the named permission. */
  permission?: string | PermissionDefinition;
  /** If set, this item is hidden unless the feature flag is enabled. */
  featureFlag?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe, IconComponent, InitialsPipe],
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  readonly items = input.required<NavItem[]>();
  readonly shell = inject(ShellStateService);
  private readonly permissionSvc = inject(PermissionService);
  private readonly authState = inject(AuthStateService);
  private readonly configSvc = inject(RuntimeConfigService);

  readonly user = this.authState.user;
  readonly orgName = this.authState.organization;

  readonly visibleItems = computed(() =>
    this.items().filter((item) => {
      if (item.permission) {
        let allowed = false;
        if (typeof item.permission === 'string') {
          const [module, action] = item.permission.split(':');
          allowed = this.permissionSvc.can(module ?? '', action ?? '');
        } else if (typeof item.permission === 'object' && 'module' in item.permission && 'action' in item.permission) {
          allowed = this.permissionSvc.can(item.permission.module, item.permission.action);
        }
        if (!allowed) return false;
      }
      if (item.featureFlag && !this.configSvc.featureEnabled(item.featureFlag)) return false;
      return true;
    })
  );

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
}
