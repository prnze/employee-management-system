import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AppRole, APP_ROLES } from '@core/constants/roles.constant';
import { PermissionsService } from '@core/auth/permissions.service';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { ToastService } from '@core/services/toast.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';

/** Groups raw permission strings like 'employees:create' into { scope, action }. */
interface PermissionEntry {
  raw: string;
  scope: string;
  action: string;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [PermissionDirective, TranslatePipe],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="h3 mb-1">{{ 'ROLES_TITLE' | translate }}</h1>
        <p class="text-body-secondary mb-0">{{ 'ROLES_SUBTITLE' | translate }}</p>
      </div>
      <span *appPermission="'roles:manage'" class="badge text-bg-success fs-6">{{ 'ROLES_LIVE_EDITING' | translate }}</span>
    </div>

    <!-- Role tabs -->
    <ul class="nav nav-tabs mb-4" role="tablist">
      @for (role of roles; track role) {
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            [class.active]="selectedRole() === role"
            type="button"
            role="tab"
            [attr.aria-selected]="selectedRole() === role"
            (click)="selectedRole.set(role)"
          >
            {{ role }}
            <span class="badge ms-2" [class.text-bg-primary]="selectedRole() === role" [class.text-bg-secondary]="selectedRole() !== role">
              {{ permissionsService.getPermissions(role).length }}
            </span>
          </button>
        </li>
      }
    </ul>

    <!-- Permission matrix -->
    <div class="surface p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">{{ selectedRole() }} permissions</h2>
        <div class="d-flex gap-2" *appPermission="'roles:manage'">
          <button class="btn btn-sm btn-outline-success" type="button" (click)="grantAll()">{{ 'ROLES_GRANT_ALL' | translate }}</button>
          <button class="btn btn-sm btn-outline-danger" type="button" (click)="revokeAll()">{{ 'ROLES_REVOKE_ALL' | translate }}</button>
        </div>
      </div>

      @for (group of groupedPermissions(); track group.scope) {
        <div class="mb-4">
          <h3 class="h6 text-uppercase text-body-secondary border-bottom pb-2 mb-3">
            <span class="me-2">{{ scopeIcon(group.scope) }}</span>{{ group.scope }}
          </h3>
          <div class="row g-2">
            @for (entry of group.entries; track entry.raw) {
              <div class="col-sm-6 col-lg-4">
                <div
                  class="permission-card d-flex align-items-center gap-3 p-3 rounded border"
                  [class.permission-card--granted]="isGranted(entry.raw)"
                  [class.permission-card--denied]="!isGranted(entry.raw)"
                >
                  <div class="form-check form-switch mb-0">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      [id]="'perm-' + entry.raw + '-' + selectedRole()"
                      [checked]="isGranted(entry.raw)"
                      [attr.aria-label]="'Toggle ' + entry.raw + ' for ' + selectedRole()"
                      (change)="toggle(entry.raw)"
                    />
                  </div>
                  <label class="mb-0 flex-grow-1" [for]="'perm-' + entry.raw + '-' + selectedRole()">
                    <span class="fw-semibold d-block">{{ entry.action }}</span>
                    <code class="small text-body-secondary">{{ entry.raw }}</code>
                  </label>
                  @if (isGranted(entry.raw)) {
                    <span class="badge text-bg-success">✓</span>
                  } @else {
                    <span class="badge text-bg-secondary">✗</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- Summary panel -->
    <div class="row g-3 mt-2">
      @for (role of roles; track role) {
        <div class="col-md-6">
          <div class="surface p-3 h-100">
            <h3 class="h6 fw-semibold mb-2">{{ role }}</h3>
            <div class="d-flex flex-wrap gap-1">
              @for (perm of permissionsService.getPermissions(role); track perm) {
                <span class="badge text-bg-primary">{{ perm }}</span>
              } @empty {
                <span class="text-body-secondary fst-italic small">{{ 'USER_NO_EXTRA_PERMS' | translate }}</span>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .permission-card {
      transition: background-color 0.2s ease, border-color 0.2s ease;
      cursor: default;
    }
    .permission-card--granted {
      background-color: var(--bs-success-bg-subtle);
      border-color: var(--bs-success-border-subtle) !important;
    }
    .permission-card--denied {
      background-color: var(--bs-body-bg);
      border-color: var(--bs-border-color) !important;
    }
    .form-check-input {
      cursor: pointer;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent {
  readonly permissionsService = inject(PermissionsService);
  private readonly toast   = inject(ToastService);
  private readonly langSvc = inject(LanguageService);

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
    this.toast.show({
      title: granted ? 'Permission granted' : 'Permission revoked',
      message: `${permission} → ${this.selectedRole()}`,
      type: granted ? 'success' : 'info'
    });
  }

  grantAll(): void {
    const all = this.permissionsService.allPermissions();
    this.permissionsService.setPermissions(this.selectedRole(), all);
    this.toast.show({ title: 'All permissions granted', message: `Role: ${this.selectedRole()}`, type: 'success' });
  }

  revokeAll(): void {
    this.permissionsService.setPermissions(this.selectedRole(), []);
    this.toast.show({ title: 'All permissions revoked', message: `Role: ${this.selectedRole()}`, type: 'warning' });
  }

  scopeIcon(scope: string): string {
    const icons: Record<string, string> = {
      dashboard: '📊', employees: '👥', users: '👤', roles: '🔑',
      reports: '📄', audit: '🔍', settings: '⚙️', profile: '🪪',
      attendance: '📅', tasks: '✅', notifications: '🔔'
    };
    return icons[scope] ?? '🔒';
  }
}
