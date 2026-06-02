import { computed, Injectable, signal } from '@angular/core';
import { AuthStateService } from './auth-state.service';
import { AppRole, ROLE_PERMISSIONS } from '@core/constants/roles.constant';

export type PermissionMap = Record<AppRole, string[]>;

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  /** Mutable permission map — admin UI writes here; guards read from it. */
  private readonly permissionMapSignal = signal<PermissionMap>({ ...ROLE_PERMISSIONS });
  readonly permissionMap = this.permissionMapSignal.asReadonly();

  /** All unique permission strings available across all roles. */
  readonly allPermissions = computed(() => {
    const seen = new Set<string>();
    Object.values(this.permissionMapSignal()).forEach((perms) => perms.forEach((p) => seen.add(p)));
    return Array.from(seen).sort();
  });

  constructor(private readonly authState: AuthStateService) {}

  hasRole(roles: AppRole[]): boolean {
    const role = this.authState.role();
    return Boolean(role && roles.includes(role));
  }

  hasPermission(permission: string): boolean {
    const role = this.authState.role();
    if (!role) return false;
    return (this.permissionMapSignal()[role] ?? []).includes(permission);
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
