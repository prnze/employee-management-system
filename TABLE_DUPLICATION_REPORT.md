# Table Duplication Report

This report documents the copy-pasted layout designs, pagination math, selection tracking, sorting systems, and filtering mechanisms discovered during the audit of the Employee Management System (EMS).

---

## 1. Duplicated State Mathematics

### A. Checkbox Selection Tracking
Both `UsersComponent` and `EmployeeListComponent` maintain manual checkbox arrays and use identical logic to track selection states page-by-page.

**Duplicated Code (TS):**
* [users.component.ts](file:///c:/Users/princ/Downloads/personal%20project/src/app/features/admin/users/users.component.ts#L104-L112) vs [employee-list.component.ts](file:///c:/Users/princ/Downloads/personal%20project/src/app/features/admin/employees/employee-list/employee-list.component.ts#L108-L118):
```ts
// Users Component
readonly allPageSelected = computed(() => {
  const items = this.paged();
  return items.length > 0 && items.every((u) => this.selectedIds().includes(u.id));
});
readonly somePageSelected = computed(() => {
  const items = this.paged();
  const count = items.filter((u) => this.selectedIds().includes(u.id)).length;
  return count > 0 && count < items.length;
});

// Employee List Component
readonly allPageSelected = computed(() => {
  const items = this.paged()?.items ?? [];
  return items.length > 0 && items.every((e) => this.selectedIds().includes(e.id));
});
readonly somePageSelected = computed(() => {
  const items = this.paged()?.items ?? [];
  const sel   = this.selectedIds();
  const count = items.filter((e) => sel.includes(e.id)).length;
  return count > 0 && count < items.length;
});
```

* [users.component.ts](file:///c:/Users/princ/Downloads/personal%20project/src/app/features/admin/users/users.component.ts#L152-L163) vs [employee-list.component.ts](file:///c:/Users/princ/Downloads/personal%20project/src/app/features/admin/employees/employee-list/employee-list.component.ts#L163-L174):
```ts
// Users Component
toggleRow(id: string): void {
  this.selectedIds.update((ids) => ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]);
}
togglePageSelection(): void {
  const items = this.paged();
  if (this.allPageSelected()) {
    this.selectedIds.update((ids) => ids.filter((id) => !items.some((u) => u.id === id)));
  } else {
    this.selectedIds.update((ids) => Array.from(new Set([...ids, ...items.map((u) => u.id)])));
  }
}

// Employee List Component
toggleRow(id: string): void {
  this.selectedIds.update((ids) => ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]);
}
togglePageSelection(): void {
  const items = this.paged()?.items ?? [];
  if (this.allPageSelected()) {
    this.selectedIds.update((ids) => ids.filter((id) => !items.some((e) => e.id === id)));
  } else {
    this.selectedIds.update((ids) => Array.from(new Set([...ids, ...items.map((e) => e.id)])));
  }
}
```

---

### B. Pagination Calculations
The logic to determine the current pagination bounds and ranges is duplicated across three separate controllers: `UsersComponent`, `AuditLogsComponent`, and `NotificationListComponent`.

**Duplicated Code (TS):**
* Found in `users.component.ts`, `audit-logs.component.ts`, and `notification-list.component.ts`:
```ts
readonly totalPages  = computed(() => Math.max(1, Math.ceil(this.filteredUsers().length / PAGE_SIZE)));
readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1).slice(0, 7));
readonly rangeStart  = computed(() => Math.min((this.page() - 1) * PAGE_SIZE + 1, this.filteredUsers().length));
readonly rangeEnd    = computed(() => Math.min(this.page() * PAGE_SIZE, this.filteredUsers().length));
```

---

### C. Multi-Column Sorting Management
`UsersComponent` and `EmployeeListComponent` duplicate the accumulation and modification of sorting parameter stack structures.

**Duplicated Code (TS):**
* [users.component.ts](file:///c:/Users/princ/Downloads/personal%20project/src/app/features/admin/users/users.component.ts#L136-L143) vs [employee-list.component.ts](file:///c:/Users/princ/Downloads/personal%20project/src/app/features/admin/employees/employee-list/employee-list.component.ts#L139-L150):
```ts
// Users Component
addSort(field: UserSortEntry['field']): void {
  this.sortStack.update((stack) => {
    const i = stack.findIndex((e) => e.field === field);
    if (i === -1) return [...stack, { field, direction: 'asc' }];
    return stack.map((e, idx) => idx === i ? { ...e, direction: e.direction === 'asc' ? 'desc' : 'asc' } : e);
  });
  this.page.set(1);
}

// Employee List Component
addSort(field: keyof Employee): void {
  this.sortStack.update((stack) => {
    const existing = stack.findIndex((e) => e.field === field);
    if (existing === -1) {
      return [...stack, { field, direction: 'asc' }];
    }
    return stack.map((e, i) =>
      i === existing ? { ...e, direction: e.direction === 'asc' ? 'desc' : 'asc' } : e
    );
  });
  this.filterForm.patchValue({ page: 1 });
}
```

---

## 2. Duplicated UI Layouts and Markups

### A. HTML Pagination Control Elements
HTML layouts with class structures, button states, active tabs, previous/next buttons, and layout styles are copied across various components.

**Duplicated HTML:**
* [users.component.html](file:///c:/Users/princ/Downloads/personal%20project/src/app/features/admin/users/users.component.html#L270-L289) vs [notification-list.component.html](file:///c:/Users/princ/Downloads/personal%20project/src/app/shared/components/notification-list/notification-list.component.html#L158-L177):
```html
<nav class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4" aria-label="User list pagination">
  <small class="text-body-secondary">
    Showing {{ rangeStart() }}–{{ rangeEnd() }} of {{ filteredUsers().length }}
  </small>
  <ul class="pagination mb-0">
    <li class="page-item" [class.disabled]="page() === 1">
      <button class="page-link" type="button" (click)="setPage(page() - 1)">Previous</button>
    </li>
    @for (p of pageNumbers(); track p) {
      <li class="page-item" [class.active]="p === page()">
        <button class="page-link" type="button" (click)="setPage(p)">{{ p }}</button>
      </li>
    }
    <li class="page-item" [class.disabled]="page() === totalPages()">
      <button class="page-link" type="button" (click)="setPage(page() + 1)">Next</button>
    </li>
  </ul>
</nav>
```

---

### B. Filter presets and filter preset dialogs
The logic and markup for naming, saving, applying, and rendering preset filters inside an overlay modal are copied directly between `Users` and `Employees`.

**Duplicated Dialog Template:**
* Found in `users.component.html` and `employee-list.component.html`:
```html
<div class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,.4)">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Save filter</h5>
        <button class="btn-close" type="button" (click)="showSaveDialog.set(false)" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input #filterInput class="form-control" placeholder="Filter name…" [value]="filterNameDraft()" (input)="filterNameDraft.set(filterInput.value)" />
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline-secondary btn-sm" type="button" (click)="showSaveDialog.set(false)">Cancel</button>
        <button class="btn btn-primary btn-sm" type="button" [disabled]="!filterNameDraft().trim()" (click)="confirmSaveFilter()">Save</button>
      </div>
    </div>
  </div>
</div>
```

---

### C. Active Filter Chips Layout
The markup to display currently active filters as badges with an inline close/clear action button is repeated four times:

**Duplicated Chip Element:**
* Found in `users.component.html`, `employee-list.component.html`, `audit-logs.component.html`, and `notification-list.component.html`:
```html
<div class="d-flex flex-wrap gap-2 mb-3">
  @for (chip of activeChips(); track chip.key) {
    <span class="chip">
      {{ chip.label }}
      <button class="chip-close d-inline-flex align-items-center justify-content-center" type="button" (click)="clearChip(chip.key)">
        <app-icon [icon]="APP_ICONS.CLOSE" [size]="12" aria-hidden="true"></app-icon>
      </button>
    </span>
  }
  <button class="btn btn-link btn-sm p-0" type="button" (click)="resetFilters()">Clear all</button>
</div>
```

---

## 3. Impact Assessment and Consolidation Goals

| Duplicated Area | Occurrences | Complexity | Severity | Refactoring Strategy |
| :--- | :--- | :--- | :--- | :--- |
| Checkbox State Tracking | 2 Modules | Medium | Low | Extract into a selection utility or a shared Table State Service. |
| Pagination Layout / Math | 3 Modules | Medium | High | Replace with shared `app-pagination` component. |
| Sorting Stack Math | 2 Modules | Medium | Medium | Consolidate inside a shared Table State signal controller. |
| Filter Chips Layout | 4 Modules | Low | Medium | Standardize with a `table-toolbar` or `filter-chips` component. |
| Presets Save Modal | 2 Modules | Medium | High | Extract into a generic saved filter service or directive. |
| Table Skeleton Loading | 3 Modules | Low | Low | Extract into a shared `table-loading` skeleton component. |
