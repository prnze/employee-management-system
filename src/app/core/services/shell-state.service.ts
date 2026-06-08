import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

export interface RecentPage {
  title: string;
  route: string;
  timestamp: Date;
}

export interface FavoriteItem {
  title: string;
  route: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShellStateService {
  private readonly router = inject(Router);

  // Core Shell State
  private readonly _sidebarCollapsed = signal<boolean>(false);
  private readonly _mobileSidebarOpen = signal<boolean>(false);
  private readonly _pageTitle = signal<string>('');
  private readonly _breadcrumbs = signal<BreadcrumbItem[]>([]);
  private readonly _currentModule = signal<string | null>(null);

  // Future Expansion
  private readonly _globalSearchQuery = signal<string>('');
  private readonly _quickActions = signal<string[]>([]);
  private readonly _notificationsCount = signal<number>(0);
  private readonly _recentPages = signal<RecentPage[]>([]);
  private readonly _favorites = signal<FavoriteItem[]>([]);

  // Readonly Public Signals
  readonly sidebarCollapsed = this._sidebarCollapsed.asReadonly();
  readonly mobileSidebarOpen = this._mobileSidebarOpen.asReadonly();
  readonly pageTitle = this._pageTitle.asReadonly();
  readonly breadcrumbs = this._breadcrumbs.asReadonly();
  readonly currentModule = this._currentModule.asReadonly();

  readonly globalSearchQuery = this._globalSearchQuery.asReadonly();
  readonly quickActions = this._quickActions.asReadonly();
  readonly notificationsCount = this._notificationsCount.asReadonly();
  readonly recentPages = this._recentPages.asReadonly();
  readonly favorites = this._favorites.asReadonly();

  constructor() {
    // Restore persisted sidebar state
    const savedState = localStorage.getItem('sidebarCollapsed');

    if (savedState !== null) {
      this._sidebarCollapsed.set(savedState === 'true');
    }

    // Update shell metadata after successful navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateStateFromRoute();
        this.closeMobileSidebar();
      });
  }

  // Sidebar Actions
  toggleSidebar(): void {
    this._sidebarCollapsed.update((value) => {
      const next = !value;
      localStorage.setItem('sidebarCollapsed', String(next));
      return next;
    });
  }

  collapseSidebar(): void {
    this._sidebarCollapsed.set(true);
    localStorage.setItem('sidebarCollapsed', 'true');
  }

  expandSidebar(): void {
    this._sidebarCollapsed.set(false);
    localStorage.setItem('sidebarCollapsed', 'false');
  }

  // Mobile Sidebar Actions
  openMobileSidebar(): void {
    this._mobileSidebarOpen.set(true);
  }

  closeMobileSidebar(): void {
    this._mobileSidebarOpen.set(false);
  }

  // Metadata Setters
  setPageTitle(title: string): void {
    this._pageTitle.set(title);
  }

  setBreadcrumbs(items: BreadcrumbItem[]): void {
    this._breadcrumbs.set(items);
  }

  setCurrentModule(module: string | null): void {
    this._currentModule.set(module);
  }

  private updateStateFromRoute(): void {
    let route = this.router.routerState.root;

    const crumbs: BreadcrumbItem[] = [];
    let accumulatedUrl = '';

    let resolvedTitle = '';
    let resolvedModule: string | null = null;

    while (route) {
      const snapshot = route.snapshot;

      const segments =
        snapshot.url?.map((segment) => segment.path).join('/') ?? '';

      if (segments) {
        accumulatedUrl += `/${segments}`;
      }

      const breadcrumb = snapshot.data?.['breadcrumb'];

      if (breadcrumb) {
        crumbs.push({
          label: breadcrumb,
          route: segments ? accumulatedUrl : undefined
        });
      }

      if (snapshot.data?.['title']) {
        resolvedTitle = snapshot.data['title'];
      }

      if (snapshot.data?.['module']) {
        resolvedModule = snapshot.data['module'];
      }

      route = route.firstChild!;
    }

    this._pageTitle.set(resolvedTitle);
    this._currentModule.set(resolvedModule);
    this._breadcrumbs.set(crumbs);
  }
}