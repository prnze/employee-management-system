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

  // Selected module in the matrix view
  readonly selectedModule = signal<string>('employees');
  
  // Search query for modules list
  readonly moduleSearchQuery = signal<string>('');

  // Draft state representing active permissions before saving
  readonly draftPermissions = signal<Record<AppRole, string[]>>({ Admin: [], Employee: [] });

  constructor() {
    this.resetDraft();
  }

  resetDraft(): void {
    const initial: Record<AppRole, string[]> = { Admin: [], Employee: [] };
    for (const role of this.roles) {
      initial[role] = [...this.permissionsService.getPermissions(role)];
    }
    this.draftPermissions.set(initial);
  }

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

  /** Filtered modules for selection dropdown */
  readonly filteredModules = computed(() => {
    const q = this.moduleSearchQuery().toLowerCase().trim();
    const allScopes = this.groupedPermissions().map(g => g.scope);
    if (!q) return allScopes;
    return allScopes.filter(s => s.toLowerCase().includes(q));
  });

  /** Dynamically generated columns based on selected module actions */
  readonly currentModuleActions = computed(() => {
    const activeMod = this.selectedModule();
    const group = this.groupedPermissions().find(g => g.scope === activeMod);
    if (!group) return [];
    return group.entries.map(e => e.action).sort();
  });

  /** Counts the total active grants in the current draft */
  readonly activeGrantsCount = computed(() => {
    let count = 0;
    const draft = this.draftPermissions();
    for (const role of this.roles) {
      count += (draft[role] ?? []).length;
    }
    return count;
  });

  /** Counts the total denied grants in the current draft */
  readonly deniedGrantsCount = computed(() => {
    const totalPossible = this.permissionsService.allPermissions().length * this.roles.length;
    return totalPossible - this.activeGrantsCount();
  });

  /** Calculates unsaved changes pending */
  readonly pendingChangesCount = computed(() => {
    let diff = 0;
    const draft = this.draftPermissions();
    for (const role of this.roles) {
      const original = this.permissionsService.getPermissions(role);
      const currentDraft = draft[role] ?? [];
      
      const added = currentDraft.filter(p => !original.includes(p)).length;
      const removed = original.filter(p => !currentDraft.includes(p)).length;
      diff += added + removed;
    }
    return diff;
  });

  draftIsGranted(role: AppRole, permission: string): boolean {
    return (this.draftPermissions()[role] ?? []).includes(permission);
  }

  toggleDraftPermission(role: AppRole, permission: string): void {
    this.draftPermissions.update(draft => {
      const current = draft[role] ?? [];
      const next = current.includes(permission)
        ? current.filter(p => p !== permission)
        : [...current, permission];
      return { ...draft, [role]: next };
    });
  }

  updateSearchQuery(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.moduleSearchQuery.set(val);
  }

  // --- Bulk Operations ---
  selectAllForModule(): void {
    const mod = this.selectedModule();
    const group = this.groupedPermissions().find(g => g.scope === mod);
    if (!group) return;
    const allPerms = group.entries.map(e => e.raw);
    
    this.draftPermissions.update(draft => {
      const updated = { ...draft };
      for (const role of this.roles) {
        const current = updated[role] ?? [];
        updated[role] = Array.from(new Set([...current, ...allPerms]));
      }
      return updated;
    });
  }

  clearAllForModule(): void {
    const mod = this.selectedModule();
    const group = this.groupedPermissions().find(g => g.scope === mod);
    if (!group) return;
    const allPerms = group.entries.map(e => e.raw);

    this.draftPermissions.update(draft => {
      const updated = { ...draft };
      for (const role of this.roles) {
        const current = updated[role] ?? [];
        updated[role] = current.filter(p => !allPerms.includes(p));
      }
      return updated;
    });
  }

  copyPermissions(fromRole: AppRole, toRole: AppRole): void {
    this.dialogService.confirm({
      title: 'Copy Permissions',
      message: `Are you sure you want to copy all permissions from ${fromRole} to ${toRole}? This will overwrite existing permissions for ${toRole}.`,
      variant: 'warning',
      icon: APP_ICONS.ROLE
    }).then(confirmed => {
      if (confirmed) {
        this.draftPermissions.update(draft => {
          const next = { ...draft };
          next[toRole] = [...(draft[fromRole] ?? [])];
          return next;
        });
        this.toast.showToast('Permissions copied successfully', 'success');
      }
    });
  }

  cloneRolePermissions(): void {
    const active = this.selectedRole();
    const target = active === 'Admin' ? 'Employee' : 'Admin';
    this.dialogService.confirm({
      title: 'Clone Permissions',
      message: `Are you sure you want to clone permissions from ${active} to ${target}? This will overwrite the target role's permissions.`,
      variant: 'info',
      icon: APP_ICONS.ROLE
    }).then(confirmed => {
      if (confirmed) {
        this.draftPermissions.update(draft => {
          const next = { ...draft };
          next[target] = [...(draft[active] ?? [])];
          return next;
        });
        this.toast.showToast(`Cloned permissions from ${active} to ${target}`, 'success');
      }
    });
  }

  saveChanges(): void {
    const draft = this.draftPermissions();
    for (const role of this.roles) {
      this.permissionsService.setPermissions(role, draft[role]);
    }
    this.toast.showToast('RBAC changes saved successfully', 'success');
    this.resetDraft();
  }

  discardChanges(): void {
    this.dialogService.confirm({
      title: 'Discard Changes',
      message: 'Are you sure you want to discard all pending changes?',
      variant: 'danger',
      icon: APP_ICONS.CLOSE
    }).then(confirmed => {
      if (confirmed) {
        this.resetDraft();
        this.toast.showToast('Changes discarded', 'info');
      }
    });
  }

  // Legacy mappings for backward compatibility
  isGranted(permission: string): boolean {
    return this.draftIsGranted(this.selectedRole(), permission);
  }

  toggle(permission: string): void {
    this.toggleDraftPermission(this.selectedRole(), permission);
  }

  grantAll(): void {
    this.selectAllForModule();
  }

  revokeAll(): void {
    this.clearAllForModule();
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
