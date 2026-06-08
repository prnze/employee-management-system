# Table Migration Plan

This document details the recommended migration sequence, risk levels, and complexity ratings for transitioning all EMS data views to the new Signal-based Table Framework.

---

## 1. Phase 1: Foundation and Shared Utilities (No Risk)

Before migrating any feature module, the core shared components must be created and validated.

* **Task 1:** Create `table-column.model.ts` and `table-state.model.ts`.
* **Task 2:** Implement shared leaf components: `TableLoadingComponent` and `TableEmptyStateComponent`.
* **Task 3:** Implement wrapper components: `TablePaginationComponent` and `TableToolbarComponent`.
* **Task 4:** Implement core rendering controller: `TableComponent`.
* **Task 5:** Write unit tests to verify selection tracking, sorting triggers, and dynamic column visibility calculation.

---

## 2. Migration Sequence & Risk Assessment

| Sequence | Module | Complexity | Risk Level | Rationale |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Audit Logs | Medium | **Low** | Read-only data view. No write forms, creation models, or status changes. Excellent candidate for validating table grid and sorting styling. |
| **2** | Notifications | Medium | **Low** | Simple leaf component. Uses client-side slicing and features simple read/delete actions. Easy to validate. |
| **3** | Users | High | **Medium** | Client-side paging and sorting, but introduces interactive dialog flows, detail drawers, status quick actions, and edit/create modals. |
| **4** | Employees | High | **High** | Full server-side pagination, sorting, and filtering integration. Involves query parameters synchronization, presets storage, column visibility settings, and complex Excel exports. |
| **5** | Attendance | Low | **Low** | Static, read-only list. Can be migrated last to clean up remaining native HTML table code. |

---

## 3. Wave Details and Step-by-Step Instructions

### Wave 1: Read-Only Lists (Audit Logs & Notifications)
1. **Audit Logs:**
   * Replace the table block inside `audit-logs.component.html` with `<app-table-framework>`.
   * Bind `pagedItems()` to `[rows]`.
   * Define column list configuration. Provide templates for `severity` badges and timestamp pipes.
   * Verify timeline view toggle remains unaffected by table swaps.
2. **Notifications:**
   * Replace the notification loop inside `notification-list.component.html` with the card-list adapter or table structure.
   * Bind `pagedItems()` to rows. Verify action buttons trigger status updates.

---

### Wave 2: Read-Write Client-Side Lists (Users)
1. **Users:**
   * Replace the selection checkboxes, user name badge cells, and actions column with the new framework properties.
   * Bind `selectedIds()` to `[selectedIds]` input. Connect `(selectionChange)` events to `selectedIds.set($event)`.
   * Verify detail drawer opening, edit modal triggers, and status activation buttons.

---

### Wave 3: Complex Server-Side Tables (Employees)
1. **Employees:**
   * Map the columns list definition array to `TableColumn<Employee>[]`.
   * Replace the pagination bar with the new pagination footer component. Connect pagination output triggers to search form values.
   * Bind sorting stack changes to search queries, triggering server-side service re-fetches.
   * Confirm columns toggle options and filtered CSV exports function correctly.

---

### Wave 4: Static Views Cleanup (Attendance)
1. **Attendance:**
   * Swap out the native HTML table for a read-only instance of `<app-table-framework>` with selection and actions disabled.
