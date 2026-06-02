# Angular EMS — Project Architecture Analysis

> **Reviewed by:** Senior Angular Architect  
> **Angular version:** 21.2.13 (standalone components, no NgModules)  
> **Application name:** Employee Management System (EMS)  
> **Date:** 2026-06-02

---

## 1. Folder Structure Explanation

```
src/
├── environments/                     # Per-environment config (dev / prod)
│   ├── environment.ts
│   ├── environment.development.ts
│   └── environment.production.ts
│
└── app/
    ├── app.component.ts              # Root shell — only RouterOutlet + theme init
    ├── app.config.ts                 # ApplicationConfig (functional providers)
    ├── app.routes.ts                 # Top-level lazy route definitions
    │
    ├── core/                         # Singleton infrastructure (never imported by features)
    │   ├── auth/                     # Auth sub-system
    │   │   ├── auth.service.ts           # Login / logout / refresh / password ops (mocked)
    │   │   ├── auth-state.service.ts     # Signal-based current user state
    │   │   ├── token.service.ts          # Signal-based token lifecycle + storage
    │   │   ├── session.service.ts        # Idle-timeout watcher (effect + setInterval)
    │   │   └── permissions.service.ts    # hasRole() / hasPermission() helpers
    │   │
    │   ├── constants/                # Compile-time constants (no classes)
    │   │   ├── roles.constant.ts         # APP_ROLES enum-like + ROLE_PERMISSIONS map
    │   │   ├── storage-keys.constant.ts  # Centralised localStorage/sessionStorage keys
    │   │   ├── api-endpoints.constant.ts # API path segments
    │   │   └── http-context.tokens.ts    # REFRESH_ATTEMPTED HttpContextToken
    │   │
    │   ├── error-handling/
    │   │   ├── global-error.handler.ts   # Replaces Angular's ErrorHandler
    │   │   └── api-error.mapper.ts       # Maps raw errors → typed ApiError
    │   │
    │   ├── guards/
    │   │   ├── auth.guard.ts             # CanActivateFn — must be authenticated
    │   │   ├── guest.guard.ts            # CanActivateFn — redirects authenticated users
    │   │   ├── role.guard.ts             # CanActivateFn — checks route.data.roles
    │   │   └── unsaved-changes.guard.ts  # CanDeactivateFn — window.confirm prompt
    │   │
    │   ├── interceptors/
    │   │   ├── jwt.interceptor.ts            # Attaches Bearer token to API requests
    │   │   ├── refresh-token.interceptor.ts  # Retries 401 with token refresh
    │   │   ├── error.interceptor.ts          # Routes 403/5xx to error pages + toast
    │   │   └── loading.interceptor.ts        # Increments/decrements LoadingService counter
    │   │
    │   ├── models/                   # Pure TypeScript interfaces (no decorators)
    │   │   ├── auth.models.ts
    │   │   ├── employee.models.ts
    │   │   ├── user.models.ts
    │   │   ├── notification.models.ts
    │   │   ├── api.models.ts
    │   │   ├── table.models.ts
    │   │   └── session.models.ts
    │   │
    │   ├── resolvers/
    │   │   ├── dashboard.resolver.ts         # ResolveFn<DashboardStats>
    │   │   └── employee-detail.resolver.ts   # ResolveFn<Employee> by :id
    │   │
    │   └── services/                 # Domain + utility services
    │       ├── employee.service.ts       # Signal-store for employees (full CRUD + paging)
    │       ├── admin-data.service.ts     # Users, roles, notifications, audit (mock data)
    │       ├── audit.service.ts          # In-memory audit log (signal)
    │       ├── loading.service.ts        # Pending-request counter signal
    │       ├── toast.service.ts          # Toast queue signal (max 5, auto-dismiss 5s)
    │       ├── theme.service.ts          # Light/dark toggle signal + DOM side-effect
    │       ├── export.service.ts         # CSV + Excel download utilities
    │       ├── storage.service.ts        # Typed get/set/remove over Web Storage
    │       └── role-preloading.strategy.ts  # Custom PreloadingStrategy
    │
    ├── features/                     # Lazy-loaded feature areas
    │   ├── auth/                     # Public auth pages
    │   │   ├── auth.routes.ts
    │   │   ├── login/
    │   │   ├── forgot-password/
    │   │   ├── reset-password/
    │   │   └── change-password/
    │   │
    │   ├── admin/                    # Admin-only feature area
    │   │   ├── admin.routes.ts
    │   │   ├── dashboard/
    │   │   ├── employees/
    │   │   │   ├── employee-list/
    │   │   │   ├── employee-form/    # Used for both create and edit
    │   │   │   └── employee-detail/
    │   │   ├── users/
    │   │   ├── roles/
    │   │   ├── reports/
    │   │   ├── notifications/
    │   │   ├── audit-logs/
    │   │   └── settings/
    │   │
    │   ├── employee/                 # Employee self-service area
    │   │   ├── employee.routes.ts
    │   │   ├── dashboard/
    │   │   ├── profile/
    │   │   ├── attendance/
    │   │   ├── tasks/
    │   │   └── notifications/
    │   │
    │   └── errors/                   # Error boundary pages
    │       ├── forbidden/            # 403
    │       ├── not-found/            # 404 (**)
    │       └── server-error/         # 500
    │
    ├── layouts/                      # Shell layouts per role / context
    │   ├── admin-layout/
    │   ├── employee-layout/
    │   ├── public-layout/
    │   └── layout-components/        # Composable chrome elements
    │       ├── sidebar/
    │       ├── top-navbar/
    │       ├── breadcrumb/
    │       └── footer/
    │
    └── shared/                       # Reusable UI kit (no business logic)
        ├── components/
        │   ├── table/
        │   ├── modal/
        │   ├── pagination/
        │   ├── loader/
        │   ├── skeleton-loader/
        │   ├── empty-state/
        │   ├── error-state/
        │   └── confirmation-dialog/
        ├── directives/
        │   ├── permission.directive.ts
        │   ├── debounce-click.directive.ts
        │   └── highlight.directive.ts
        ├── pipes/
        │   ├── app-date.pipe.ts
        │   ├── initials.pipe.ts
        │   └── phone-format.pipe.ts
        └── validators/
            ├── match-password.validator.ts
            ├── password-strength.validator.ts
            └── unique-email.validator.ts
```

### Key architectural decisions

| Decision | Implementation |
|---|---|
| Zero NgModules | 100% standalone components throughout |
| Path aliases | `@core`, `@shared`, `@features`, `@layouts`, `@env` configured in `tsconfig.json` |
| Strict TypeScript | `strict`, `strictTemplates`, `noImplicitReturns`, `noFallthroughCasesInSwitch` all enabled |
| Change detection | `OnPush` applied uniformly across all layout and shared components |

---

## 2. Route Structure

### Top-level (`app.routes.ts`)

```
/                         → redirects to /auth/login
/auth                     → PublicLayoutComponent  [guestGuard]
  /login
  /forgot-password
  /reset-password
/admin                    → AdminLayoutComponent   [authGuard, roleGuard(Admin)]
  /dashboard              ← dashboardResolver prefetches DashboardStats
  /employees
  /employees/create       [unsavedChangesGuard deactivate]
  /employees/:id          ← employeeDetailResolver
  /employees/:id/edit     ← employeeDetailResolver + [unsavedChangesGuard deactivate]
  /users
  /roles
  /reports
  /notifications
  /audit-logs
  /settings
/employee                 → EmployeeLayoutComponent [authGuard, roleGuard(Employee)]
  /dashboard
  /profile                [unsavedChangesGuard deactivate]
  /attendance
  /tasks
  /notifications
/account/change-password  [authGuard only — role-agnostic]
/403                      → ForbiddenComponent     (lazy, no guard)
/500                      → ServerErrorComponent   (lazy, no guard)
/**                       → NotFoundComponent      (lazy, wildcard)
```

### Routing features in use

| Feature | Usage |
|---|---|
| Lazy loading | Every feature component uses `loadComponent()` / `loadChildren()` |
| Role-based preloading | `RolePreloadingStrategy` preloads `admin` and `employee` routes when authenticated |
| Component input binding | `withComponentInputBinding()` — resolver data bound directly as `@Input()` |
| Scroll restoration | `withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })` |
| Resolvers | `dashboardResolver`, `employeeDetailResolver` block navigation until data is ready |
| Deactivate guards | `unsavedChangesGuard` on all form routes (create, edit, profile) |

---

## 3. Authentication Flow

```
User enters credentials on /auth/login
        │
        ▼
AuthService.login(request)
  ├── Searches mockUsers array (in-memory, simulates 350ms latency)
  ├── On failure → throwError('Invalid email or password')
  └── On success:
        ├── TokenService.setTokens(accessToken, refreshToken, rememberMe, expiresAt)
        │     ├── Stores tokens in localStorage (rememberMe=true) or sessionStorage
        │     └── Hydrates four internal signals
        ├── AuthStateService.setUser(user, rememberMe)
        │     ├── Updates userSignal → triggers isAuthenticated + role computed signals
        │     └── Persists AuthUser to matching storage
        └── AuditService.record(fullName, 'LOGIN', 'Auth')
                │
                ▼
        guestGuard detects isAuthenticated() → redirects to /admin/dashboard or /employee/dashboard
                │
                ▼ (on subsequent page loads)
        TokenService.restore() runs in constructor
          ├── Reads rememberMe flag from localStorage
          └── Re-hydrates all token signals from correct storage
        AuthStateService constructor re-hydrates userSignal from storage
                │
                ▼
        SessionService starts idle watcher (via effect on isAuthenticated)
          ├── Listens to mousemove, keydown, click, touchstart (throttled 1s)
          ├── Polls every 30s via setInterval
          └── On idle > environment.idleTimeoutMinutes → AuthService.logout() + navigate /auth/login
                │
                ▼ (logout path)
        AuthService.logout()
          ├── AuditService.record(actor, 'LOGOUT', 'Auth')
          ├── AuthStateService.clear() → sets userSignal(null) + removes storage entry
          └── TokenService.clear() → nulls all token signals + removes storage entries
```

### Storage strategy

| Preference | Storage location |
|---|---|
| `rememberMe = true` | `localStorage` (persists across browser restarts) |
| `rememberMe = false` | `sessionStorage` (cleared on tab close) |
| `rememberMe` flag itself | Always `localStorage` (needed for hydration decision) |
| Theme preference | Always `localStorage` |

---

## 4. Guard Flow

### `authGuard` — protects authenticated routes

```
Request to /admin/* or /employee/* or /account/change-password
        │
        ▼
authGuard checks:
  authState.isAuthenticated() && tokens.hasTokens()
    │
    ├── TRUE  → ✅ pass through
    └── FALSE → createUrlTree('/auth/login', { queryParams: { returnUrl: state.url } })
```

### `guestGuard` — prevents authenticated users reaching /auth/*

```
Request to /auth/login (or any /auth/* route)
        │
        ▼
guestGuard checks:
  !authState.isAuthenticated() || !role
    │
    ├── TRUE  → ✅ allow (render login page)
    └── FALSE → createUrlTree('/admin/dashboard' | '/employee/dashboard')
                (role-aware redirect — no hardcoded default)
```

### `roleGuard` — enforces role-based route access

```
Request to /admin/* (data.roles = ['Admin']) or /employee/* (data.roles = ['Employee'])
        │
        ▼
roleGuard reads route.data.roles[]
        │
        ▼
PermissionsService.hasRole(roles) → checks authState.role() against list
    │
    ├── TRUE  → ✅ pass through
    └── FALSE → createUrlTree('/403')
```

### `unsavedChangesGuard` — protects form navigation away

```
User tries to navigate away from employee-form / profile
        │
        ▼
unsavedChangesGuard calls component.hasUnsavedChanges()
    │
    ├── FALSE → ✅ allow navigation
    └── TRUE  → window.confirm('You have unsaved changes. Leave this page?')
                  ├── OK     → allow navigation
                  └── Cancel → block navigation
```

### Guard composition on `/admin` route

```
canActivate: [authGuard, roleGuard]
   │              │
   │              └─ runs second; checks role ∈ ['Admin']
   └─ runs first;  checks isAuthenticated && hasTokens
```

---

## 5. Interceptor Flow

All four interceptors are registered as **functional interceptors** via `withInterceptors()` and execute in this order on every outgoing HTTP request:

```
Outgoing Request
       │
       ▼
①  jwtInterceptor
   ├── Reads TokenService.accessToken() signal
   ├── Checks: request.url starts with environment.apiBaseUrl OR '/api'
   │     ├── Match + token exists → clone request with Authorization: Bearer <token>
   │     └── No match or no token → pass through unchanged
       │
       ▼
②  refreshTokenInterceptor
   ├── Passes request downstream
   └── catchError on 401 response:
         Conditions: status=401 AND refreshToken exists AND !REFRESH_ATTEMPTED context flag
           │
           ├── Executes auth.refreshToken() via module-level singleton Observable
           │     (shareReplay prevents duplicate refresh calls for concurrent requests)
           ├── On success: TokenService.updateAccessToken() + retry original request
           │     with new token and REFRESH_ATTEMPTED=true context flag
           └── On failure or second 401 → rethrows error
       │
       ▼
③  errorInterceptor
   ├── Passes request downstream
   └── catchError on HttpErrorResponse:
         ├── status 403  → navigateByUrl('/403')
         ├── status ≥500 → navigateByUrl('/500')
         └── All errors  → ToastService.show({ type: 'danger' })
         (always rethrows so upstream callers can also handle)
       │
       ▼
④  loadingInterceptor
   ├── LoadingService.start() immediately (increments pending counter)
   ├── Passes request downstream
   └── finalize() → LoadingService.stop() (decrements, floors at 0)
```

### Concurrent-refresh de-duplication pattern

The `refreshTokenInterceptor` stores the in-flight refresh as a module-level variable:

```typescript
let refreshRequest$: Observable<...> | null = null;

refreshRequest$ ??= auth.refreshToken().pipe(
  finalize(() => { refreshRequest$ = null; }),
  shareReplay({ bufferSize: 1, refCount: false })
);
```

This ensures that if multiple requests fail with 401 simultaneously, only **one** refresh call is made and all waiters receive the result via `shareReplay`.

---

## 6. Signal Usage

This application is a strong example of **signals-first state management** in Angular 17+. Zero use of `BehaviorSubject` or `ReplaySubject` for state.

### Signal inventory

| Service | Signals | Computed signals | Effects |
|---|---|---|---|
| `AuthStateService` | `userSignal` | `isAuthenticated`, `role`, `permissions` | — |
| `TokenService` | `accessTokenSignal`, `refreshTokenSignal`, `expiresAtSignal`, `rememberMeSignal` | `hasTokens`, `isAccessTokenExpired` | — |
| `SessionService` | `lastActivity` | — | Watches `isAuthenticated` to start/stop idle timer |
| `ThemeService` | `themeSignal` | — | Applies `data-bs-theme` attribute to `<html>` + persists to storage |
| `LoadingService` | `pending` (counter) | `isLoading` | — |
| `ToastService` | `messagesSignal` (array) | — | — |
| `AuditService` | `logsSignal` (array) | — | — |
| `EmployeeService` | `employeesSignal` (array) | `departments` (derived unique list) | — |
| `AdminDataService` | `usersSignal` (array) | — | — |

### Directive-level signal usage

`PermissionDirective` uses `input()` (signal-based input) and an `effect()` to reactively show/hide template content without `*ngIf`:

```typescript
effect(() => {
  const allowed = this.permissions.hasPermission(this.appPermission());
  if (allowed && !this.rendered) { this.view.createEmbeddedView(this.template); }
  if (!allowed && this.rendered)  { this.view.clear(); }
});
```

### Signal patterns used

| Pattern | Location |
|---|---|
| `signal().asReadonly()` | All services — public read surface is immutable |
| `computed()` | Derived state (isAuthenticated, role, permissions, isLoading, departments) |
| `effect()` | Side-effects: DOM mutation (theme), timer management (session), view update (permission directive) |
| `input()` / `input.required()` | All shared + layout components — replaces `@Input()` decorator |
| `output()` | `TableComponent`, `DebounceClickDirective` — replaces `@Output()` decorator |
| `toSignal()` | `BreadcrumbComponent` — converts Router NavigationEnd observable to signal for computed crumbs |

---

## 7. Shared Component Architecture

### `shared/components/` — Reusable UI primitives

| Component | Purpose | Key API |
|---|---|---|
| `TableComponent<T>` | Generic sortable table with bulk-select | `rows`, `columns`, `selectedIds` inputs; `selectionChange`, `sort` outputs |
| `ModalComponent` | Wrapper for dialog overlays | — |
| `PaginationComponent` | Page navigation | — |
| `LoaderComponent` | Spinner / overlay | — |
| `SkeletonLoaderComponent` | Loading placeholder UI | — |
| `EmptyStateComponent` | Zero-results messaging | — |
| `ErrorStateComponent` | Data-fetch error messaging | — |
| `ConfirmationDialogComponent` | Reusable confirm prompt | — |

`TableComponent<T extends { id: string }>` is notably generic — it uses TypeScript generics so any entity with an `id: string` can be rendered with full type safety on column keys.

### `shared/directives/` — Structural & behavioral directives

| Directive | Selector | Behaviour |
|---|---|---|
| `PermissionDirective` | `[appPermission]` | Structural — shows/hides DOM based on `PermissionsService.hasPermission()`. Reactive via `effect()`. |
| `DebounceClickDirective` | `[appDebounceClick]` | Prevents double-clicks; emits `appDebounceClick` output after configurable debounce (default 500ms) |
| `HighlightDirective` | `[appHighlight]` | Visual — applies background colour on mouseenter, clears on mouseleave |

### `shared/pipes/` — Display formatting

| Pipe | Name | Purpose |
|---|---|---|
| `AppDatePipe` | `appDate` | Wraps Angular `DatePipe` with `en-IN` locale; format configurable |
| `InitialsPipe` | `initials` | Extracts up to two initials from a full name string |
| `PhoneFormatPipe` | `phoneFormat` | Formats phone number strings for display |

### `shared/validators/` — Reusable form validators

| Validator | Type | Purpose |
|---|---|---|
| `matchPasswordValidator` | `ValidatorFn` | Cross-field group validator — confirms two fields match |
| `passwordStrengthValidator` | `ValidatorFn` | Enforces uppercase + lowercase + digit + special char + min length |
| `uniqueEmailValidator` | `AsyncValidatorFn` | Simulates async uniqueness check (250ms delay) against known emails |

### `layouts/layout-components/` — Chrome shell components

| Component | Responsibility |
|---|---|
| `SidebarComponent` | Renders nav items from `input.required<NavItem[]>()` — decoupled from routing knowledge |
| `TopNavbarComponent` | User menu, theme toggle, toast rendering |
| `BreadcrumbComponent` | Signal-computed crumbs from router URL — no route `data` configuration needed |
| `FooterComponent` | Static footer |

Layout components are **not** in `shared/` — a deliberate architectural decision that keeps chrome concerns separate from reusable UI primitives.

---

## 8. Potential Weaknesses

### Security

| Issue | Location | Severity |
|---|---|---|
| **Credentials in source code** | `AuthService.mockUsers` stores plain-text passwords (`Admin@123`, `Employee@123`) | 🔴 Critical (dev only, but still a risk) |
| **Tokens stored in Web Storage** | `TokenService` / `StorageService` — XSS can steal tokens | 🟠 High |
| **IP address hardcoded** | `AuditService.record()` always logs `'127.0.0.1'` — no real IP capture | 🟡 Medium |
| **No CSRF protection** | No custom headers or double-submit cookie pattern for mutating requests | 🟡 Medium |
| **`window.confirm()` in guard** | `unsaved-changes.guard.ts` — blocks the JS thread, looks unprofessional, not accessible | 🟡 Medium |
| **Token expiry not enforced on JWT interceptor** | `jwtInterceptor` attaches the token even if `isAccessTokenExpired` is true; relies on server 401 | 🟡 Medium |

### Architecture & Code Quality

| Issue | Location | Details |
|---|---|---|
| **Role string comparison is stringly-typed in guest guard** | `guest.guard.ts` line 12 | `role === 'Admin'` — should use `APP_ROLES.admin` constant |
| **No barrel / index files** | All `@core/*` imports are deep paths | Increases refactoring cost; `@core/auth/auth-state.service` vs `@core/auth` |
| **`AuthStateService` writes to both storages on `clear()`** | `StorageService.remove()` removes from both storages, but `setUser()` only writes to one | Minor inconsistency, works correctly today |
| **`TableComponent` renders actions via `<ng-content />`** | Shared for all rows — every row gets the same projected content | Can't easily vary per-row; should use template outlet or column renderers |
| **`ExportService` — CSV injection partially mitigated** | `safeSpreadsheetValue` prefixes `=`, `+`, `-`, `@` but not `\t` or `\r` (less common vectors) | Low risk |
| **Module-level mutable variable in interceptor** | `let refreshRequest$` in `refresh-token.interceptor.ts` | Functional interceptors share module scope — this pattern is intentional but is a hidden global |
| **`AuditService` is entirely in-memory** | Data is lost on page refresh | Cannot persist across sessions |
| **`StorageService.remove()` always removes from both storages** | `storage.service.ts:14-17` | Side-effect: if `remove()` is called while tokens are in sessionStorage only, it also clears any same-key localStorage entry (unlikely but subtle) |
| **`uniqueEmailValidator` uses a hardcoded array** | `unique-email.validator.ts:4` | Must be kept in sync with `AuthService.mockUsers` manually |

### Testing

| Issue | Details |
|---|---|
| **Minimal test coverage** | Only 2 spec files found (`auth.service.spec.ts`, `role.guard.spec.ts`, `employee.service.spec.ts`) — vast majority of services and components have no tests |
| **No E2E test setup** | No Cypress / Playwright configuration present |
| **Karma / Jasmine only** | No Jest, meaning slower feedback loops in CI |

### UX / Accessibility

| Issue | Details |
|---|---|
| **`window.confirm()` dialog** | Not accessible (screen readers, keyboard-only users), not styleable |
| **No ARIA live regions for loading state** | `LoadingService.isLoading` signal not wired to an `aria-busy` or visually-hidden status region globally |
| **Breadcrumb derives labels from URL segments** | Slugs like `employee-list` or UUIDs will appear verbatim — no human-friendly label override |

---

## 9. Missing Enterprise Features

### Authentication & Security

| Missing Feature | Priority | Notes |
|---|---|---|
| **Real backend integration** | 🔴 P0 | All auth and data is mocked; `HttpClient` is not used in any service |
| **HttpOnly cookie token storage** | 🔴 P0 | Mitigates XSS token theft; requires backend coordination |
| **MFA / 2FA support** | 🟠 P1 | TOTP, SMS OTP, or authenticator app flow |
| **OAuth 2.0 / OIDC (SSO)** | 🟠 P1 | Microsoft Entra ID, Google, Okta — expected in enterprise |
| **Token rotation / sliding sessions** | 🟠 P1 | Current refresh issues a new access token but the refresh token itself never rotates |
| **Concurrent session control** | 🟡 P2 | Detect and invalidate duplicate sessions across devices |
| **Security event logging to backend** | 🟡 P2 | AuditService is in-memory only |
| **Rate limiting awareness** | 🟡 P2 | No handling of 429 responses in interceptors |
| **Content Security Policy headers** | 🟡 P2 | Should be enforced at the server/CDN layer, but no `meta` CSP directives either |

### Role & Permission Management

| Missing Feature | Priority | Notes |
|---|---|---|
| **Fine-grained permission checks on routes** | 🟠 P1 | Role guard operates at `route.data.roles` level only; no permission-level route protection |
| **Dynamic role/permission loading from API** | 🟠 P1 | `ROLE_PERMISSIONS` is hardcoded at build time |
| **Permission inheritance / hierarchy** | 🟡 P2 | No concept of "super-admin" inheriting all permissions |
| **Resource-level authorization** | 🟡 P2 | Cannot express "can edit only own profile"; needs ABAC/PBAC layer |

### State Management

| Missing Feature | Priority | Notes |
|---|---|---|
| **Server-side pagination / filtering** | 🔴 P0 | `EmployeeService.list()` does all paging in memory — will not scale |
| **Optimistic UI updates** | 🟡 P2 | Current CRUD mutates the signal immediately but has no rollback on API failure |
| **Caching layer** | 🟡 P2 | No HTTP caching, no `transferState` for SSR, repeated calls re-fetch same data |
| **Real-time updates (WebSocket / SSE)** | 🟡 P2 | Notifications, audit logs, and dashboard stats are static snapshots |

### Observability & Operations

| Missing Feature | Priority | Notes |
|---|---|---|
| **Error reporting / APM** | 🟠 P1 | `GlobalErrorHandler` only logs to console + shows a generic toast; no Sentry/Datadog |
| **Structured logging** | 🟡 P2 | No correlation IDs, no structured event format |
| **Performance monitoring** | 🟡 P2 | No Angular performance profiling hooks or Core Web Vitals tracking |
| **Feature flags** | 🟡 P2 | No mechanism to toggle features per environment or user segment |

### Developer Experience & Quality

| Missing Feature | Priority | Notes |
|---|---|---|
| **Comprehensive unit test coverage** | 🔴 P0 | Only 3 spec files for ~60+ classes and functions |
| **E2E tests (Cypress / Playwright)** | 🟠 P1 | No automated user-flow testing |
| **API mocking layer (MSW or similar)** | 🟠 P1 | Replace hardcoded mock data with request-intercepting test doubles |
| **Storybook for shared components** | 🟡 P2 | No visual component catalogue |
| **CI/CD pipeline definition** | 🟡 P2 | No `.github/workflows`, `Jenkinsfile`, or similar |
| **Docker / containerisation** | 🟡 P2 | No Dockerfile or compose setup |
| **i18n / l10n** | 🟡 P2 | `AppDatePipe` hardcodes `en-IN` locale; no Angular i18n setup |

### UX Features

| Missing Feature | Priority | Notes |
|---|---|---|
| **Notifications badge / real-time count** | 🟠 P1 | No live unread count in navbar |
| **Advanced table features** | 🟡 P2 | No column resizing, no fixed headers on scroll, no virtual scrolling for large datasets |
| **Keyboard navigation / shortcuts** | 🟡 P2 | No global shortcut system |
| **Print / PDF export** | 🟡 P2 | Only CSV/Excel export; no print stylesheets |
| **Drag-and-drop** | 🟡 P2 | Task board / org chart visualisations |
| **Dashboard customisation** | 🟡 P2 | No widget pinning or user-configurable views |

---

## Summary Assessment

**Overall quality: Solid foundation — production-ready patterns with a mock backend.**

The codebase demonstrates excellent Angular 17+ practices: signals-first state, functional guards and interceptors, standalone components throughout, strict TypeScript, and clean separation of concerns across `core/`, `features/`, `layouts/`, and `shared/`. The interceptor pipeline for auth, error handling, and loading is well-structured and the token refresh de-duplication pattern is production-grade.

The primary gaps are the absence of a **real backend**, **minimal test coverage**, and several **enterprise security hardening** items (HttpOnly cookies, MFA, SSO). These are expected omissions for a personal/portfolio project but would be the first priorities before any production deployment.
