import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthStateService } from './auth-state.service';
import { AppRole, ROLE_PERMISSIONS } from '@core/constants/roles.constant';

export interface PermissionDefinition {
  module: string;
  action: string;
}

export type PermissionMap = Record<AppRole, string[]>;

export const PERMISSIONS = {
  DASHBOARD: {
    VIEW: { module: 'dashboard', action: 'view' }
  },
  EMPLOYEES: {
    READ: { module: 'employees', action: 'read' },
    CREATE: { module: 'employees', action: 'create' },
    UPDATE: { module: 'employees', action: 'update' },
    DELETE: { module: 'employees', action: 'delete' }
  },
  USERS: {
    MANAGE: { module: 'users', action: 'manage' }
  },
  ROLES: {
    MANAGE: { module: 'roles', action: 'manage' }
  },
  REPORTS: {
    VIEW: { module: 'reports', action: 'view' }
  },
  AUDIT: {
    VIEW: { module: 'audit', action: 'view' }
  },
  SETTINGS: {
    MANAGE: { module: 'settings', action: 'manage' }
  },
  PROFILE: {
    UPDATE: { module: 'profile', action: 'update' }
  },
  ATTENDANCE: {
    VIEW: { module: 'attendance', action: 'view' }
  },
  TASKS: {
    VIEW: { module: 'tasks', action: 'view' }
  },
  NOTIFICATIONS: {
    VIEW: { module: 'notifications', action: 'view' }
  }
} as const;

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly authState = inject(AuthStateService);

  /** Mutable permission map — admin UI writes here; guards read from it. */
  private readonly permissionMapSignal = signal<PermissionMap>({ ...ROLE_PERMISSIONS });
  readonly permissionMap = this.permissionMapSignal.asReadonly();

  /** All unique permission strings available across all roles. */
  readonly allPermissions = computed(() => {
    const seen = new Set<string>();
    Object.values(this.permissionMapSignal()).forEach((perms) => perms.forEach((p) => seen.add(p)));
    return Array.from(seen).sort();
  });

  /**
   * Checks if current user has the specified permission.
   * Supports wildcard checking: exact match ('module:action'), module wildcard ('module:*'), or global 'admin'.
   */
  can(module: string, action: string): boolean {
    const role = this.authState.role();
    if (!role) return false;

    // Get permissions from dynamic map (for live Roles updates) + auth user direct permissions
    const rolePermissions = this.permissionMapSignal()[role] ?? [];
    const directPermissions = this.authState.permissions() ?? [];
    const userPermissions = new Set([...rolePermissions, ...directPermissions]);

    // 1. Exact match
    if (userPermissions.has(`${module}:${action}`)) {
      return true;
    }

    // 2. Module wildcard
    if (userPermissions.has(`${module}:*`)) {
      return true;
    }

    // 3. Global admin wildcard
    if (userPermissions.has('admin')) {
      return true;
    }

    return false;
  }

  /**
   * Returns true if any of the given permissions is granted.
   */
  canAny(permissions: PermissionDefinition[]): boolean {
    return permissions.some((p) => this.can(p.module, p.action));
  }

  /**
   * Returns true if all of the given permissions are granted.
   */
  canAll(permissions: PermissionDefinition[]): boolean {
    return permissions.every((p) => this.can(p.module, p.action));
  }

  /**
   * Checks if user has the specified role or one of the specified roles.
   */
  hasRole(roleOrRoles: string | string[]): boolean {
    const currentRole = this.authState.role();
    if (!currentRole) return false;
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.includes(currentRole);
    }
    return currentRole === roleOrRoles;
  }

  /** Returns the permission list for a given role. */
  getPermissions(role: AppRole): string[] {
    return this.permissionMapSignal()[role] ?? [];
  }

  /** Admin UI: toggle a single permission on a role. */
  togglePermission(role: AppRole, permission: string): void {
    this.permissionMapSignal.update((map) => {
      const current = map[role] ?? [];
      const next = current.includes(permission)
        ? current.filter((p) => p !== permission)
        : [...current, permission];
      return { ...map, [role]: next };
    });
  }

  /** Admin UI: replace the entire permission list for a role. */
  setPermissions(role: AppRole, permissions: string[]): void {
    this.permissionMapSignal.update((map) => ({ ...map, [role]: [...permissions] }));
  }
}
