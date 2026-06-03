import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PermissionsService } from '@core/auth/permissions.service';

export interface NavItem {
  /** Translation key string (e.g. 'NAV_DASHBOARD'). */
  label: string;
  path: string;
  icon?: string;
  /** If set, this item is hidden unless the user has the named permission. */
  permission?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  styles: [`
    :host { display: block; }
    .sidebar { min-height: 100%; }
    .nav-link {
      border-radius: 0.5rem;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .nav-link.active {
      background: var(--bs-primary);
      color: #fff;
    }
    .nav-icon { width: 1.25rem; text-align: center; }
  `],
  template: `
    <aside class="sidebar border-end bg-body-tertiary p-3 d-flex flex-column" aria-label="Primary navigation">
      <a class="navbar-brand fw-bold d-block mb-4 text-primary text-decoration-none fs-5" routerLink="/">
        ⚡ EMS
      </a>
      <nav class="nav nav-pills flex-column gap-1 flex-grow-1">
        @for (item of visibleItems(); track item.path) {
          <a class="nav-link d-flex align-items-center gap-2" [routerLink]="item.path" routerLinkActive="active">
            @if (item.icon) {
              <span class="nav-icon">{{ item.icon }}</span>
            }
            {{ item.label | translate }}
          </a>
        }
      </nav>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  readonly items = input.required<NavItem[]>();
  private readonly perms = inject(PermissionsService);

  readonly visibleItems = computed(() =>
    this.items().filter((item) => !item.permission || this.perms.hasPermission(item.permission))
  );
}
