# Table Framework Analysis

This document provides a comprehensive audit of all table, grid, list, and paginated data views across the Employee Management System (EMS) application.

---

## 1. Users Module

### Data Source
* **Service Used:** `UserService` (`src/app/core/services/user.service.ts`)
* **API Endpoint:** In-memory mock storage (`SEED_USERS`), exposed as a read-only signal. Operations return delayed RxJS Observables (`of(value).pipe(delay(...))`).
* **Pagination Strategy:** Client-side slicing. The component computes `paged` users using `computed(() => filteredUsers().slice((page() - 1) * PAGE_SIZE, page() * PAGE_SIZE))`.
* **Sorting Strategy:** Client-side multi-sort stack. The component updates a `sortStack` signal of type `UserSortEntry[]` via the `addSort()` method and passes it to the `UserService.filtered()` helper method.

### UI Structure
* **Columns:**
  * Selection Checkbox (column 1)
  * **Name** (column 2) - includes avatar circle (with `initials` pipe), full name text, and a conditional "Reset required" badge.
  * **Email** (column 3) - standard text styled with `.small` and `.text-body-secondary`.
  * **Role** (column 4) - styled using a badge class mapped by `roleClass()`.
  * **Status** (column 5) - styled using a badge class mapped by `statusClass()`.
  * **Last Login** (column 6) - formatted via `appDate:'mediumDate'`.
  * **Actions** (column 7) - right-aligned container with quick action buttons ("View", "Edit").
* **Actions & Inline Buttons:**
  * "View" button - opens the slide-out user details drawer.
  * "Edit" button - opens the create/edit user modal.
* **Row Menus:** No row-level context menus (uses direct action buttons in the actions column instead).
* **Selection Checkboxes:** Included at the head of the row (select all on current page) and on individual rows.
  * Checked status: `[checked]="selectedIds().includes(user.id)"`
  * Check change trigger: `(change)="toggleRow(user.id)"`

### Search
* **Search Fields:** Single global text search input bound to `query` control in `filterForm`. Matches against: `fullName`, `email`, `role`, and `department`.
* **Debounce Logic:** Reactive forms value change pipeline with `debounceTime(150)` and `startWith()` operators mapping into `filterValues` signal.
* **Trigger Strategy:** Automatic search trigger on form input change (via RxJS debounce). Includes an inline clear button (`APP_ICONS.CLOSE`) to immediately clear search inputs.

### Filters
* **Filter Controls:**
  * **Role:** Select dropdown (`All roles`, `Admin`, `Employee`).
  * **Status:** Select dropdown (`All statuses`, `Active`, `Inactive`, `Locked`).
  * **Created From / Created To:** Standard HTML5 date inputs in the advanced filter drawer.
  * **Has Extra Permissions:** Checkbox in the advanced drawer.
* **Query Generation:** Automatically managed by the reactive form value group. Changes are debounced and fed into the `UserService.filtered()` method.
* **Reset Logic:**
  * Form-wide reset via `resetFilters()`, which resets controls to initial states, clears `sortStack`, and resets `page` to `1`.
  * Chip-level reset via `clearChip(key)` to clear individual filters.

### Pagination
* **Current Page:** Managed by a local `page = signal(1)` signal.
* **Page Size:** Hardcoded local constant `PAGE_SIZE = 10`.
* **Total Count:** Derived dynamically using `svc.totalCount()` and filtered count `filteredUsers().length`.

### Loading State
* **Spinner/Skeleton:** 5 skeleton placeholder rows (using Bootstrap `.placeholder`) displayed when `loading()` is true.
* **Disabled Actions:** Submitting button shows a `.spinner-border` spinner and is disabled while `submitting()` is true.

### Empty State
* **Current Implementation:** Displayed inline within the table body via Angular's `@empty` block. Renders a search icon, a "No users found" heading, and advice to adjust filters.
* **Missing Implementation:** No options to reset filters directly from the empty state view.

### Export Features
* **CSV:** `exportCsv()` maps filtered rows and passes them to `ExportService.downloadCsv()`. Displays a success toast.
* **Excel:** `exportExcel()` maps filtered rows and passes them to `ExportService.downloadExcel()`. Displays a success toast.
* **Other Exports:** None.

### Permissions
* **RBAC Checks:** Component level permission checking is applied inside the HTML template:
  * Quick action buttons inside the details drawer are wrapped in `*appPermission="{ module: 'users', action: 'manage' }"`.
* **Route Guards:** Secured via `permissionGuard` with configuration data: `permission: PERMISSIONS.USERS.MANAGE` in `admin.routes.ts`.

### Reusability Score (6/10)
* **What can be extracted:** Table header sort buttons, pagination navbar, checkbox selection logic, active filter chips, and advanced filter drawer layout.
* **What is duplicated:** Checked selection math (`allPageSelected`, `somePageSelected`), paging math (`totalPages`, `rangeStart`, `rangeEnd`), chip clearing, sorting icons, and bootstrap table structure.

---

## 2. Employees Module

### Data Source
* **Service Used:** `EmployeeService` (`src/app/core/services/employee.service.ts`)
* **API Endpoint:** Serves paginated responses using `EmployeeService.list(filter)` which queries an in-memory collection and returns a `PagedResult<Employee>`.
* **Pagination Strategy:** Server-side pagination. Page number, page size, and filter details are passed directly to the service.
* **Sorting Strategy:** Server-side multi-sort stack. The `sortStack` signal is passed to the service via the filter payload.

### UI Structure
* **Columns:**
  * Checkbox (column 1)
  * **Code** (`employeeCode`) - formatted inside `<code>` tags.
  * **Name** (`firstName` + `lastName`) - displayed in bold.
  * **Email** (`email`) - text styled with `.text-body-secondary` and `.small`.
  * **Phone** (`phone`) - formatted using the custom `phoneFormat` pipe.
  * **Department** (`department`) - styled inside a secondary badge.
  * **Designation** (`designation`) - standard text (hidden by default).
  * **Location** (`location`) - standard text.
  * **Status** (`status`) - styled using classes mapped by `statusClass()`.
  * **Joined** (`joinedAt`) - formatted using the custom `appDate` pipe.
  * **Actions** - links to view details (`/admin/employees/:id`) and edit page (`/admin/employees/:id/edit`).
* **Actions & Inline Buttons:** View and Edit links.
* **Row Menus:** Column visibility toggle dropdown in the component header.
* **Selection Checkboxes:** Master page checkbox and individual row checkboxes.

### Search
* **Search Fields:** Global search input (`query` control in `filterForm`). Matches employee code, names, email, designation, department, and location.
* **Debounce Logic:** Debounced at `220ms` in `valueChanges` RxJS chain before calling the service.
* **Trigger Strategy:** Automatic trigger on search input change. Clear search button resets the field.

### Filters
* **Filter Controls:**
  * **Department:** Select dropdown populated from `departments` signal.
  * **Status:** Select dropdown (`Active`, `Inactive`, `On Leave`).
  * **Location:** Select dropdown populated from `locations` signal.
  * **Designation:** Select dropdown in advanced filters.
  * **Joined From / Joined To:** Advanced HTML5 date filters.
  * **Page Size:** Select dropdown (`5`, `10`, `25`, `50` rows per page).
* **Query Generation:** Form group values mapped directly to `EmployeeFilter` models.
* **Reset Logic:** `resetFilters()` patches the form value group back to defaults.

### Pagination
* **Current Page:** Read from the `filterForm` control `page`.
* **Page Size:** Read from the `filterForm` control `pageSize`.
* **Total Count:** Returned by the server-side payload under `paged.total`.

### Loading State
* **Spinner/Skeleton:** Full-card Bootstrap spinner displayed when `paged` signal is empty.
* **Disabled Actions:** Bulk action buttons are hidden or disabled if no rows are selected.

### Empty State
* **Current Implementation:** Angular `@empty` block inside table body. Displays a search icon, a "No employees found" header, and filter adjustment text.
* **Missing Implementation:** Action button to reset filters.

### Export Features
* **CSV:** Full export via `exportCsv()` using `ExportService`.
* **Excel:** Full export via `exportExcel()` using `ExportService`.
* **Filtered Exports:** `exportFiltered()` calls the service with a page size of `9999` to fetch all matching entries before downloading as CSV.

### Permissions
* **RBAC Checks:**
  * Export menu wrapped in `*appPermission="{ module: 'employees', action: 'read' }"`.
  * "New Employee" button wrapped in `*appPermission="{ module: 'employees', action: 'create' }"`.
  * Inline "Edit" action button wrapped in `*appPermission="{ module: 'employees', action: 'update' }"`.
  * Bulk status buttons wrapped in `*appPermission="{ module: 'employees', action: 'update' }"`.
  * Bulk delete button wrapped in `*appPermission="{ module: 'employees', action: 'delete' }"`.
* **Route Guards:** Protected by `permissionGuard` with configuration: `permission: PERMISSIONS.EMPLOYEES.READ` or `PERMISSIONS.EMPLOYEES.CREATE`/`UPDATE` in `admin.routes.ts`.

### Reusability Score (8/10)
* **What can be extracted:** Shared `PaginationComponent` is already extracted and imported! The filter preset logic and active filter chips can also be consolidated.
* **What is duplicated:** Checked selection math, column visibility logic, sort stack management, and grid layout.

---

## 3. Roles Module

### Data Source
* **Service Used:** `PermissionService` (`src/app/core/services/permission.service.ts`)
* **API Endpoint:** In-memory configuration matching roles to permission arrays.
* **Pagination Strategy:** None. The grid shows the full matrix of permissions.
* **Sorting Strategy:** None.

### UI Structure
* **Columns:** Rendered as a grid of permission cards grouped by scope categories (e.g. `dashboard`, `employees`, `users`, `roles`, `reports`, `audit`, `settings`, `profile`, `attendance`, `tasks`, `notifications`).
* **Actions & Inline Buttons:**
  * Switch toggle: Toggles status of individual permissions.
  * "Grant All" and "Revoke All" buttons at the top of the permission matrix.
* **Row Menus:** None.
* **Selection Checkboxes:** Switch toggle inputs acting as individual select elements.

### Search & Filters
* **Search / Filters:** None. Active tab filters the permission display by `selectedRole`.

### Loading State
* **Spinner/Skeleton:** None (local fast load).
* **Disabled Actions:** Switches are only togglable if the user has `roles:manage` permission.

### Empty State
* **Current Implementation:** Standard list elements display an italicized text prompt "No extra permissions" if empty.
* **Missing Implementation:** None.

### Export Features
* **Exports:** None.

### Permissions
* **RBAC Checks:**
  * "Live Editing" badge is conditionally shown.
  * "Grant All" and "Revoke All" actions are protected by `*appPermission="{ module: 'roles', action: 'manage' }"`.
  * Switch switch-inputs are disabled if permissions are read-only.
* **Route Guards:** Guarded by `permissionGuard` with `permission: PERMISSIONS.ROLES.MANAGE`.

### Reusability Score (2/10)
* **What can be extracted:** Standard permission matrix cards.
* **What is duplicated:** Matrix layout custom designs.

---

## 4. Audit Logs Module

### Data Source
* **Service Used:** `AuditService` (`src/app/core/services/audit.service.ts`)
* **API Endpoint:** In-memory array (`SEED_LOGS`), exposed via service signals.
* **Pagination Strategy:** Client-side sliced pagination. Slices the logs into pages of `15`.
* **Sorting Strategy:** Chronologically ordered, newest-first, by default. No dynamic sorting stack.

### UI Structure
* **Columns (Table View):**
  * **Severity** - color-coded badge based on `severityClass()`.
  * **Actor** - small bold text.
  * **Action** - inline code tag.
  * **Entity** - small secondary text.
  * **Category** - secondary badge.
  * **Time** - formatted via `appDate:'medium'`.
  * **IP Address** - plain text.
  * **Detail Button** - forward arrow button opening detail drawer.
* **Actions & Inline Buttons:** Timeline/Table view toggle, CSV export, Excel export. Clicking on a table row or timeline card opens the detail drawer.
* **Row Menus:** None.
* **Selection Checkboxes:** None.

### Search
* **Search Fields:** Text search input (`query` control in `filterForm`). Filters across actor, action, entity, and details.
* **Debounce Logic:** Form value change pipeline debounced at `180ms`.
* **Trigger Strategy:** Automatic search trigger on input change. Clear search button clears values.

### Filters
* **Filter Controls:**
  * **Actor:** Populated dynamically from `svc.actors()` signal.
  * **Action:** Populated dynamically from `svc.actions()` signal.
  * **Severity:** Dropdown (`Critical`, `Error`, `Warning`, `Info`).
  * **Category:** Dropdown (`Auth`, `Employee`, `Permissions`, `Export`, `System`).
  * **Date From / Date To:** Standard date pickers.
* **Query Generation:** Fed directly into the client-side `svc.filtered()` helper.
* **Reset Logic:** Reset button opens a confirmation dialog before resetting form values.

### Pagination
* **Current Page:** Managed by local `page = signal(1)` signal.
* **Page Size:** Hardcoded constant `PAGE_SIZE = 15`.
* **Total Count:** Calculated from `filtered().length` vs `svc.totalCount()`.

### Loading State
* **Spinner/Skeleton:** None (instantaneous client-side computation).
* **Disabled Actions:** Reset button is disabled or hidden if filters are pristine.

### Empty State
* **Current Implementation:** Displayed if `filtered().length === 0`. Renders search icon, "No audit logs found" header, details advice, and a clear button.
* **Missing Implementation:** None.

### Export Features
* **CSV:** `exportCsv()` maps and exports log rows, prompts verification dialog, and records the export action to the audit logger.
* **Excel:** `exportExcel()` performs the same operation as CSV but formats to Excel.
* **Other Exports:** None.

### Permissions
* **RBAC Checks:** Export button protected by `*appPermission="{ module: 'audit', action: 'view' }"`. Detail drawer button protected by same check.
* **Route Guards:** Guarded by `permissionGuard` with configuration: `permission: PERMISSIONS.AUDIT.VIEW`.

### Reusability Score (7/10)
* **What can be extracted:** Pagination controls, timeline view component, filter presets, date range widgets.
* **What is duplicated:** Slicing mathematics, chip filters rendering, export logic dialogs, and drawer layout templates.

---

## 5. Notifications Module

### Data Source
* **Service Used:** `NotificationService` (`src/app/core/services/notification.service.ts`)
* **API Endpoint:** In-memory notification storage collection (`SEED_NOTIFICATIONS`).
* **Pagination Strategy:** Client-side sliced pagination. Slices data to pages of `8`.
* **Sorting Strategy:** Client-side sorting sorted by priority order descending, then creation date descending.

### UI Structure
* **Columns / Card Elements:** Renders as a list of notification cards.
  * **Icon** - mapped via `typeIcon()`.
  * **Title** - bold if unread.
  * **Priority Badge** - colored via `priorityClass()`.
  * **Category Badge** - colored via `categoryClass()`.
  * **New Badge** - primary colored badge.
  * **Message Body** - secondary text.
  * **Actions Row** - quick actions ("Mark Read", "View Details" link, "Delete").
* **Actions & Inline Buttons:** View details link, Mark read button, Delete button. "Mark All Read" button in header.
* **Row Menus:** None.
* **Selection Checkboxes:** None.

### Search
* **Search Fields:** Text search input (`query` control in `filterForm`). Matches title and message text.
* **Debounce Logic:** Debounced at `150ms`.
* **Trigger Strategy:** Automatic search on input change. Clear search button clears values.

### Filters
* **Filter Controls:**
  * **Category:** Dropdown.
  * **Priority:** Dropdown.
  * **Status:** Dropdown (`All`, `Unread`, `Read`).
* **Query Generation:** Fed directly into the client-side `svc.filtered()` helper.
* **Reset Logic:** Reset button clears the form.

### Pagination
* **Current Page:** Managed by local `page = signal(1)` signal.
* **Page Size:** Hardcoded constant `PAGE_SIZE = 8`.
* **Total Count:** Obtained from `filtered().length` vs `svc.all().length`.

### Loading State
* **Spinner/Skeleton:** 4 placeholder skeleton cards (Bootstrap placeholder-glow animation) shown when `loading()` is true.
* **Disabled Actions:** Buttons disabled when operations are in progress.

### Empty State
* **Current Implementation:** Displayed if `filtered().length === 0`. Renders search icon, "No notifications found" heading, details, and a clear button.
* **Missing Implementation:** None.

### Export Features
* **Exports:** None.

### Permissions
* **RBAC Checks:** Header, mark read, and delete controls are wrapped in `*appPermission="{ module: 'notifications', action: 'view' }"`.
* **Route Guards:** Guarded by `featureFlagGuard` and `permissionGuard` with configuration: `permission: PERMISSIONS.NOTIFICATIONS.VIEW` or feature flag configuration: `notifications` in route definitions.

### Reusability Score (6/10)
* **What can be extracted:** Shared notification cards, chip filters, pagination buttons.
* **What is duplicated:** Slicing mathematics, layout structures, empty states.

---

## 6. Discovered Additional List Views

### A. Attendance List (`AttendanceComponent` under `src/app/features/employee/attendance`)
* **Data Source:** Hardcoded local array `rows`. No service or endpoints.
* **UI Structure:** Native HTML table with columns: Date, Check-In, Check-Out, and Status badge.
* **Search / Filters:** None.
* **Pagination / Sorting:** None.
* **Loading / Empty States:** None.
* **Reusability Score:** 1/10 (highly static, hardcoded template).

### B. Tasks List (`TasksComponent` under `src/app/features/employee/tasks`)
* **Data Source:** Hardcoded local array `tasks`. No service or endpoints.
* **UI Structure:** Bootstrap Accordion. Clicking a header expands the task description and displays its status badge.
* **Search / Filters / Pagination / Sorting:** None.
* **Loading / Empty States:** None.
* **Reusability Score:** 1/10 (static).

### C. Recent Activity Feed (Admin Dashboard under `src/app/features/admin/dashboard`)
* **Data Source:** `AuditService.logs()`, sliced to the 8 most recent entries via computed signal: `computed(() => this.auditService.logs().slice(0, 8))`.
* **UI Structure:** Vertical ordered list (`<ol>`) representing a timeline feed. Includes actor, action label, entity details, and timestamp.
* **Search / Filters / Pagination / Sorting:** None (static slice).
* **Loading / Empty States:** Shows empty search graphic if no logs are present.
* **Reusability Score:** 3/10 (could use a shared timeline layout component).
