# EMS Architecture Gap Analysis

This document presents a comprehensive architectural gap analysis comparing the current Employee Management System (EMS) codebase against the RefCare enterprise reference architecture.

---

## 1. Project Structure

### Current EMS State
* Flat structure inside `src/app/core` and `src/app/shared`.
* Feature folders exist but are mixed directly under `src/app/features` (e.g., `admin`, `employee`, `auth`, `errors`).
* Reusable components, directives, and pipes reside in `src/app/shared/components`, `src/app/shared/directives`, and `src/app/shared/pipes` respectively, but lack domain structure (e.g. `services`, `constants`, `models`, `layouts` folder inside `shared` is missing).

### Missing Capabilities
* Lack of formal public library boundary or modular sub-packages for shared assets.
* Missing standard folder classification in `shared` (such as `services`, `constants`, `models`, `layouts`).
* Shared UI code directly references core/app services, risking circular dependencies.

### Recommended Implementation
* Restructure `src/app/shared` directory into standard folders:
  ```text
  shared/
  ├── components/
  ├── directives/
  ├── pipes/
  ├── services/
  ├── constants/
  ├── models/
  └── layouts/
  ```
* Define strict import boundaries. Shared library assets must never import from `core` or `features` directly via relative imports; instead, they should rely on Dependency Injection (Injection Tokens) or config parameters.

### Implementation Priority
* **Priority**: P2
* **Migration Risk**: Low-Medium (requires updating import paths across components).

---

## 2. Core Layer

### Current EMS State
* Uses `src/app/core` for guards, interceptors, models, resolvers, and services.
* Services are focused (e.g., `toast.service`, `theme.service`, `language.service`, `loading.service`).
* Lacks a runtime configuration service or loader (API URLs are typically statically imported from environment files).

### Missing Capabilities
* Statically compiled configuration variables restrict the build-once, deploy-anywhere deployment pattern.
* Injection tokens are not leveraged for configurable behaviors.

### Recommended Implementation
* Introduce a `RuntimeConfigService` that loads runtime configuration via `APP_INITIALIZER` from a static `/assets/config.json` file.
* Abstract authentication, notifications, and base API clients behind defined Injection Tokens.

### Implementation Priority
* **Priority**: P1
* **Migration Risk**: Medium (needs refactoring of environment variables).

---

## 3. Shared Layer

### Current EMS State
* Shared folder exists with components, directives, and pipes.
* Basic shared components are standalone (e.g., `app-icon`, `app-pagination`, `app-toast`).

### Missing Capabilities
* Lacks reusable form control wrappers (ControlValueAccessor) similar to RefCare's custom inputs (`rc-input`, `rc-select`).
* Component APIs are inconsistent (e.g., inputs are sometimes raw and other times typed signals).

### Recommended Implementation
* Establish a unified component library in `src/app/shared`.
* Standardize custom ControlValueAccessor components for inputs, dropdowns, and date pickers.
* Expose all shared assets through a consolidated shared module or standalone export entrypoint.

### Implementation Priority
* **Priority**: P2
* **Migration Risk**: Medium.

---

## 4. Services

### Current EMS State
* Focused services exist (e.g., `audit.service`, `employee.service`, `user.service`, `notification.service`, `toast.service`).
* Some services contain a mix of UI presentation state and business logic.

### Missing Capabilities
* No clean separation between UI presentation state and business domain services.
* Core state is not managed through structured store facades.

### Recommended Implementation
* Partition oversized services into focused abstractions:
  * **AuthSessionService**: Token storage, expiration tracking.
  * **PermissionService**: Role and permission logic.
  * **ShellStateService**: Header/sidebar visibility and metadata states.
  * **DialogService**: Abstracted confirmation popups.
  * **DownloadService**: Safe binary and PDF file downloading.

### Implementation Priority
* **Priority**: P1
* **Migration Risk**: Medium-High (affects login, layouts, and permission checking).

---

## 5. Components

### Current EMS State
* Standalone components are utilized.
* Mix of inline layouts and reusable presentation components.

### Missing Capabilities
* Shared components like forms/modals are not packaged for generic configurations.
* Components heavily rely on local logic for common CRUD behaviors.

### Recommended Implementation
* Migrate common primitives into the standardized `shared` library.
* Enforce interface contracts for reusable structures.

### Implementation Priority
* **Priority**: P3
* **Migration Risk**: Low.

---

## 6. Directives

### Current EMS State
* Exists: `debounce-click.directive`, `highlight.directive`, `permission.directive`.

### Missing Capabilities
* Lacks form control-level helper directives (e.g., enabling/disabling form control states reactively).
* Lacks a click-and-drag scroll grab directive for wide scrollable tables.

### Recommended Implementation
* Adopt RefCare's `rcDisableControl` (disabling forms based on permission status) and `rcGrabScroll` (horizontal scroll helper) directives in `src/app/shared/directives`.

### Implementation Priority
* **Priority**: P3
* **Migration Risk**: Low.

---

## 7. Pipes

### Current EMS State
* Exists: `app-date.pipe`, `initials.pipe`, `phone-format.pipe`.

### Missing Capabilities
* Lacks resource safety sanitization pipes (`safeHtml`, `safeUrl`).
* Lacks timezone conversion helpers for backend audit logs in localized environments.

### Recommended Implementation
* Implement `safeHtml` and `safeUrl` pipes to sanitize clinical/audit details.
* Implement a `toLocalTime` pipe to standardize audit log timestamp rendering.

### Implementation Priority
* **Priority**: P2
* **Migration Risk**: Low.

---

## 8. Layouts

### Current EMS State
* Authenticated routes share a main shell (`admin-layout`, `employee-layout`) containing a responsive top navbar and fixed/collapsed sidebar.

### Missing Capabilities
* Sidebars do not dynamically adjust according to active layout metadata.
* Mobile and desktop navigation layouts are hardcoded in structural elements.

### Recommended Implementation
* Introduce dynamic layout metadata checks using route `data` properties (e.g., `data: { menuGroup: 'admin' }`).
* Abstract sidebar visibility and menu tree structures via a central `ShellStateService`.

### Implementation Priority
* **Priority**: P2
* **Migration Risk**: Medium.

---

## 9. Forms

### Current EMS State
* Basic reactive forms inside feature components (e.g. settings form, login form, user creation form).
* Unsaved changes guard utilizes standard native browser `window.confirm`.

### Missing Capabilities
* Inconsistent form error display and visual feedback rules.
* Lacks automatic keyboard focus management on validation failure.
* Missing standardized unsaved changes dialog wrapper.

### Recommended Implementation
* Introduce standardized custom form validation controls.
* Standardize error highlighting and scroll-to-invalid-input utilities on form submit.
* Replace native `window.confirm` with a custom Dialog-backed unsaved change component.

### Implementation Priority
* **Priority**: P2
* **Migration Risk**: Medium.

---

## 10. Tables

### Current EMS State
* Tabular layouts exist inside `users.component.html`, `employee-list.component.html`, and `audit-logs.component.html`.
* Search, filtering, and sorting are implemented locally in each component, repeating logic.

### Missing Capabilities
* Lack of generic table configurations.
* No persistence for active filters, visible columns, or paging limits between route changes.
* Custom column selection controls are duplicated.

### Recommended Implementation
* Design a reusable `TableComponent` / `ListComponent` ecosystem backed by a state-persistence mechanism (`RcPersistService`).
* Abstract list retrieval, sorting, pagination, and file exports behind generic payload contracts.

### Implementation Priority
* **Priority**: P1
* **Migration Risk**: High (requires rewriting core list pages).

---

## 11. RBAC

### Current EMS State
* RBAC uses a `PermissionsService` checking permission strings manually or via `appPermission` directive.
* `permissionGuard` parses the required string from static route data.

### Missing Capabilities
* Route guard logic is constrained to single permission strings rather than structured modules/actions.
* Navbars and sidebars check individual permissions rather than modular features.

### Recommended Implementation
* Shift toward route metadata-driven authorization structure:
  ```typescript
  data: {
    permission: { module: 'employees', action: 'read' }
  }
  ```
* Standardize checks to support hierarchical wildcard permissions (e.g., checking `admin` automatically unlocks all actions).

### Implementation Priority
* **Priority**: P1
* **Migration Risk**: Medium (requires updating routing setup and sidebar configurations).

---

## 12. State Management

### Current EMS State
* Uses local signals inside components and BehaviorSubjects inside services for global variables.

### Missing Capabilities
* Lacks dedicated facade patterns. Feature components directly fetch and manipulate state inside shared services.

### Recommended Implementation
* Create small, focused Signal-backed state facades (e.g., `SessionStore`, `NotificationStore`) to isolate side-effects from component templates.

### Implementation Priority
* **Priority**: P2
* **Migration Risk**: Medium.

---

## 13. Notification System

### Current EMS State
* Uses a global `ToastService` utilizing a computed signal of active toasts and bootstrap styling.

### Missing Capabilities
* Limited alert queues and status classes.
* Toast messages require manual template passing for styled elements.

### Recommended Implementation
* Align `ToastService` to accept distinct toast configurations (`ToastMessage` interfaces).
* Establish separate success/error/warning message types with standardized translation parameters.

### Implementation Priority
* **Priority**: P2
* **Migration Risk**: Low.

---

## 14. Modal System

### Current EMS State
* Standard Bootstrap modals are embedded inline inside templates (e.g., in user/employee management).

### Missing Capabilities
* Lacks dynamically instantiated modal overlays, forcing components to pollute templates with modal layouts.
* Duplicate dialog template structures for delete/status change actions.

### Recommended Implementation
* Implement a `DialogService` using dynamic component instantiation or standard `ng-bootstrap` wrapper service (`RcModalService`).
* Build a generic `ConfirmationDialogComponent` for confirmations.

### Implementation Priority
* **Priority**: P1
* **Migration Risk**: Medium-High (refactors user/employee modal actions).

---

## 15. Export System

### Current EMS State
* Custom export logic in components using raw file utility libraries or localized functions.

### Missing Capabilities
* Missing generic export framework with backend integration.
* Lacks a clean pipeline to export only active columns or filters.

### Recommended Implementation
* Introduce a standard `DownloadService` or `ExportService` that coordinates generic column export workflows (CSV, Excel).

### Implementation Priority
* **Priority**: P2
* **Migration Risk**: Low.

---

## 16. Runtime Configuration

### Current EMS State
* Environment values are compiled directly into the application bundles (`environment.ts`).

### Missing Capabilities
* Hardcoded backend paths restrict containerization. Bundles must be recompiled for each environment (Staging vs. Production).

### Recommended Implementation
* Implement `ConfigService` loading variables from static asset configurations during boot sequence (`APP_INITIALIZER`).

### Implementation Priority
* **Priority**: P1
* **Migration Risk**: Medium.
