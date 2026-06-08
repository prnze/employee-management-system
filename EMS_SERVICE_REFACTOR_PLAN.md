# EMS Service Refactor Plan

This document details the refactoring blueprint for core app services to upgrade the Employee Management System (EMS) into a maintainable, enterprise-scale service layer.

---

## 1. Core Service Mapping

To prevent monolithic utility patterns (such as RefCare's `CmnService` merge), EMS will adopt specialized, single-responsibility services.

| Proposed Service | Scope & Responsibility | Target Folder | Priority | Refactoring Source |
|---|---|---|---|---|
| **RuntimeConfigService** | Handles browser-independent runtime variables loaded from `/assets/config.json` at startup. | `core/services/` | P1 | New creation (replaces hardcoded environments). |
| **AuthSessionService** | Manages session state, cookie token lifecycle, and authentication validation. | `core/auth/` | P1 | Extract from `AuthService` and `TokenService`. |
| **PermissionService** | Resolves role permission matrices and performs authorization validation checks. | `core/auth/` | P1 | Refactor `PermissionsService`. |
| **ShellStateService** | Handles sidebar expansion, current active titles, and UI configuration overlays. | `core/services/` | P2 | Refactor `ThemeService` and inline layouts. |
| **DialogService** | Manages confirmation dialog modals, overlay lifecycles, and promise results. | `core/services/` | P1 | Refactor `ToastService` and modal logic. |
| **NotificationService** | Handles global toast and toast queue status messaging systems. | `core/services/` | P2 | Standardize current `ToastService`. |
| **FormStateService** | Handles form dirty validations, component state preservation, and navigation warning dialog triggers. | `core/services/` | P2 | Refactor `unsaved-changes.guard.ts`. |
| **DownloadService** | Manages blob formatting, CSV exports, Excel downloads, and filename timestamp assignments. | `core/services/` | P2 | Refactor `ExportService`. |
| **StorageService** | Manages cookie actions, namespace preservation, and typed `localStorage` interactions. | `core/services/` | P1 | Refactor `StorageService`. |

---

## 2. Refactoring Steps

### Step 1: Runtime Config Sequence (P1)
1. Implement `RuntimeConfigService` exposing configurations via Angular signals:
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class RuntimeConfigService {
     private readonly config = signal<{ apiUrl: string } | null>(null);
     readonly apiUrl = computed(() => this.config()?.apiUrl ?? '');

     loadConfig(): Promise<void> {
       return fetch('/assets/config.json')
         .then(res => res.json())
         .then(data => this.config.set(data));
     }
   }
   ```
2. Register this service in `app.config.ts` using `APP_INITIALIZER`.

### Step 2: Separate Auth & Permissions (P1)
1. Split authentication operations (`AuthService`) from token access logic (`AuthSessionService` / `TokenService`).
2. Implement strict typing in `PermissionService` to query specific modules and actions:
   ```typescript
   can(module: string, action: string): boolean {
     const permissions = this.getUserPermissions();
     return permissions.includes(`${module}:${action}`) || permissions.includes('admin');
   }
   ```

### Step 3: Standardize the Dialog Pipeline (P1)
1. Create a focused `DialogService` wrapping the instantiation of confirmation popups.
2. Deprecate inline modal templates. Modals must be opened dynamically:
   ```typescript
   confirm(title: string, message: string): Promise<boolean> {
     return this.modalService.open(ConfirmationDialogComponent, { title, message });
   }
   ```

### Step 4: Refactor Persistence & Lists (P2)
1. Create a reusable list-state persistence adapter (`RcPersistService` equivalent) inside `shared/services`.
2. Clean up local filter arrays from feature components, binding them instead to the persistence layer.
