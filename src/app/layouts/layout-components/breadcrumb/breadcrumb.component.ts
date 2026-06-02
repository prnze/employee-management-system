import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, TitleCasePipe],
  template: `
    <nav aria-label="Breadcrumb" class="px-3 py-2 bg-body">
      <ol class="breadcrumb mb-0">
        @for (crumb of crumbs(); track crumb.url) {
          <li class="breadcrumb-item" [class.active]="crumb.active">
            @if (crumb.active) {
              <span>{{ crumb.label | titlecase }}</span>
            } @else {
              <a [routerLink]="crumb.url">{{ crumb.label | titlecase }}</a>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  private readonly router = inject(Router);
  private readonly navigation = toSignal(this.router.events.pipe(filter((event) => event instanceof NavigationEnd), startWith(null)));
  readonly crumbs = computed(() => {
    this.navigation();
    const parts = this.router.url.split('?')[0].split('/').filter(Boolean);
    return parts.map((label, index) => ({
      label,
      url: `/${parts.slice(0, index + 1).join('/')}`,
      active: index === parts.length - 1
    }));
  });
}
