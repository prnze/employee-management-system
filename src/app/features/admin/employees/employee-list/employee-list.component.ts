import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { Employee, EmployeeFilter, EmployeeStatus, SavedFilter, SortEntry } from '@core/models/employee.models';
import { EmployeeService } from '@core/services/employee.service';
import { ExportService } from '@core/services/export.service';
import { ToastService } from '@core/services/toast.service';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { PhoneFormatPipe } from '@shared/pipes/phone-format.pipe';

type BulkAction = 'delete' | 'activate' | 'deactivate' | 'on-leave';

interface ColumnDef {
  key: keyof Employee;
  label: string;
  sortable: boolean;
  visible: boolean;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PaginationComponent, ConfirmationDialogComponent, PhoneFormatPipe, AppDatePipe],
  styles: [`
    .sort-btn { background: none; border: none; padding: 0; font-weight: 600; cursor: pointer; white-space: nowrap; color: inherit; }
    .sort-btn:hover { color: var(--bs-primary); }
    .sort-indicator { font-size: .65rem; opacity: .7; }
    .sort-stack-badge { font-size: .65rem; }
    .chip { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem; border-radius: 2rem;
            background: var(--bs-primary-bg-subtle); color: var(--bs-primary); border: 1px solid var(--bs-primary-border-subtle); font-size: .8rem; }
    .chip-close { background: none; border: none; padding: 0; line-height: 1; cursor: pointer; color: inherit; }
    .row-selected { background: var(--bs-primary-bg-subtle) !important; }
    .bulk-bar { background: var(--bs-primary); color: #fff; border-radius: .5rem; padding: .5rem 1rem; }
    .col-visible-toggle { font-size: .75rem; }
  `],
  template: `
    <!-- ── Header ─────────────────────────────────── -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <div>
        <h1 class="h3 mb-0">Employees</h1>
        <p class="text-body-secondary small mb-0">{{ totalText() }}</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <!-- Column visibility toggle -->
        <div class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-label="Toggle columns">
            Columns
          </button>
          <ul class="dropdown-menu p-2" style="min-width:160px">
            @for (col of columns; track col.key) {
              <li>
                <label class="dropdown-item d-flex align-items-center gap-2 col-visible-toggle" style="cursor:pointer">
                  <input type="checkbox" [checked]="col.visible" (change)="toggleColumn(col)" />
                  {{ col.label }}
                </label>
              </li>
            }
          </ul>
        </div>

        <!-- Export -->
        <div class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-label="Export">
            Export
          </button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" type="button" (click)="exportCsv()">📄 CSV</button></li>
            <li><button class="dropdown-item" type="button" (click)="exportExcel()">📊 Excel (XLS)</button></li>
            <li><button class="dropdown-item" type="button" (click)="exportFiltered()">🔍 Filtered CSV</button></li>
          </ul>
        </div>

        <a class="btn btn-primary btn-sm" routerLink="/admin/employees/create">+ New Employee</a>
      </div>
    </div>

    <!-- ── Filter panel ────────────────────────────── -->
    <form [formGroup]="filterForm" class="surface p-3 mb-3" aria-label="Employee filters">
      <div class="row g-2 mb-2">
        <!-- Global search -->
        <div class="col-12 col-md-4">
          <div class="input-group input-group-sm">
            <span class="input-group-text">🔍</span>
            <input class="form-control" placeholder="Search name, email, code, dept…" formControlName="query" aria-label="Search employees" />
            @if (filterForm.controls.query.value) {
              <button class="btn btn-outline-secondary" type="button" (click)="filterForm.controls.query.setValue('')" aria-label="Clear search">✕</button>
            }
          </div>
        </div>

        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="department" aria-label="Filter by department">
            <option value="">All departments</option>
            @for (dept of departments(); track dept) { <option [value]="dept">{{ dept }}</option> }
          </select>
        </div>

        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="status" aria-label="Filter by status">
            <option value="">All statuses</option>
            <option>Active</option><option>Inactive</option><option>On Leave</option>
          </select>
        </div>

        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="location" aria-label="Filter by location">
            <option value="">All locations</option>
            @for (loc of locations(); track loc) { <option [value]="loc">{{ loc }}</option> }
          </select>
        </div>

        <div class="col-6 col-md-2">
          <button class="btn btn-link btn-sm p-0" type="button" (click)="showAdvanced.update(v => !v)">
            {{ showAdvanced() ? '▲ Less' : '▼ More filters' }}
          </button>
        </div>
      </div>

      @if (showAdvanced()) {
        <div class="row g-2 mb-2">
          <div class="col-md-3">
            <select class="form-select form-select-sm" formControlName="designation" aria-label="Filter by designation">
              <option value="">All designations</option>
              @for (d of designations(); track d) { <option [value]="d">{{ d }}</option> }
            </select>
          </div>
          <div class="col-md-2">
            <input class="form-control form-control-sm" type="date" formControlName="joinedFrom" aria-label="Joined from date" />
          </div>
          <div class="col-md-2">
            <input class="form-control form-control-sm" type="date" formControlName="joinedTo" aria-label="Joined to date" />
          </div>
          <div class="col-md-2">
            <select class="form-select form-select-sm" formControlName="pageSize" aria-label="Rows per page">
              <option [ngValue]="5">5 per page</option>
              <option [ngValue]="10">10 per page</option>
              <option [ngValue]="25">25 per page</option>
              <option [ngValue]="50">50 per page</option>
            </select>
          </div>
          <div class="col-md-3 d-flex gap-2">
            <button class="btn btn-outline-secondary btn-sm flex-fill" type="button" (click)="resetFilters()">Reset</button>
            <button class="btn btn-outline-primary btn-sm flex-fill" type="button" (click)="saveCurrentFilter()">Save filter</button>
          </div>
        </div>
      }

      <!-- Saved filter presets -->
      @if (savedFilters().length > 0) {
        <div class="d-flex flex-wrap gap-2 mt-2 pt-2 border-top">
          <small class="text-body-secondary align-self-center">Saved:</small>
          @for (sf of savedFilters(); track sf.id) {
            <div class="chip">
              <button type="button" style="background:none;border:none;padding:0;color:inherit;font-size:.8rem" (click)="applyFilter(sf)">{{ sf.name }}</button>
              <button class="chip-close" type="button" (click)="removeSavedFilter(sf.id)" aria-label="Remove saved filter">✕</button>
            </div>
          }
        </div>
      }
    </form>

    <!-- ── Active filter chips ─────────────────────── -->
    @if (activeChips().length > 0) {
      <div class="d-flex flex-wrap gap-2 mb-3">
        @for (chip of activeChips(); track chip.key) {
          <span class="chip">
            {{ chip.label }}
            <button class="chip-close" type="button" (click)="clearChip(chip.key)" [attr.aria-label]="'Remove ' + chip.label + ' filter'">✕</button>
          </span>
        }
        <button class="btn btn-link btn-sm p-0" type="button" (click)="resetFilters()">Clear all</button>
      </div>
    }

    <!-- ── Sort stack badges ───────────────────────── -->
    @if (sortStack().length > 0) {
      <div class="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <small class="text-body-secondary">Sort:</small>
        @for (entry of sortStack(); track entry.field; let i = $index) {
          <span class="badge text-bg-secondary sort-stack-badge d-flex align-items-center gap-1">
            #{{ i + 1 }} {{ entry.field }} {{ entry.direction === 'asc' ? '↑' : '↓' }}
            <button style="background:none;border:none;color:inherit;padding:0;line-height:1;font-size:.7rem" type="button" (click)="removeSortEntry(i)" aria-label="Remove sort">✕</button>
          </span>
        }
        <button class="btn btn-link btn-sm p-0" type="button" (click)="clearSort()">Clear sort</button>
      </div>
    }

    <!-- ── Bulk action bar ────────────────────────── -->
    @if (selectedIds().length > 0) {
      <div class="bulk-bar mb-3 d-flex flex-wrap align-items-center gap-3">
        <strong>{{ selectedIds().length }} selected</strong>
        <div class="d-flex flex-wrap gap-2 ms-auto">
          <button class="btn btn-sm btn-light" type="button" (click)="bulkSetStatus('Active')">✅ Activate</button>
          <button class="btn btn-sm btn-light" type="button" (click)="bulkSetStatus('Inactive')">⛔ Deactivate</button>
          <button class="btn btn-sm btn-light" type="button" (click)="bulkSetStatus('On Leave')">🏖️ On Leave</button>
          <button class="btn btn-sm btn-danger" type="button" (click)="confirmDialog.set('delete')">🗑 Delete</button>
          <button class="btn btn-sm btn-outline-light" type="button" (click)="selectedIds.set([])">Deselect all</button>
        </div>
      </div>
    }

    <!-- ── Table ──────────────────────────────────── -->
    @if (paged(); as paged) {
      <div class="surface table-responsive mb-3">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" style="width:2.5rem">
                <input class="form-check-input" type="checkbox" aria-label="Select all rows on page"
                  [checked]="allPageSelected()"
                  [indeterminate]="somePageSelected()"
                  (change)="togglePageSelection()" />
              </th>
              @for (col of visibleColumns(); track col.key) {
                <th scope="col">
                  <button class="sort-btn" type="button" [attr.aria-label]="'Sort by ' + col.label" (click)="addSort(col.key)">
                    {{ col.label }}
                    @if (primarySortKey() === col.key) {
                      <span class="sort-indicator">{{ primarySortDir() === 'asc' ? '↑' : '↓' }}</span>
                    }
                    @if (sortStackIndex(col.key) > 0) {
                      <sup class="sort-stack-badge text-primary">{{ sortStackIndex(col.key) }}</sup>
                    }
                  </button>
                </th>
              }
              <th scope="col" class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (emp of paged.items; track emp.id) {
              <tr [class.row-selected]="selectedIds().includes(emp.id)">
                <td>
                  <input class="form-check-input" type="checkbox" [attr.aria-label]="'Select ' + emp.firstName + ' ' + emp.lastName"
                    [checked]="selectedIds().includes(emp.id)"
                    (change)="toggleRow(emp.id)" />
                </td>
                @if (colVisible('employeeCode'))  { <td><code class="small">{{ emp.employeeCode }}</code></td> }
                @if (colVisible('firstName'))     { <td><strong>{{ emp.firstName }} {{ emp.lastName }}</strong></td> }
                @if (colVisible('email'))         { <td class="text-body-secondary small">{{ emp.email }}</td> }
                @if (colVisible('phone'))         { <td class="text-body-secondary small">{{ emp.phone | phoneFormat }}</td> }
                @if (colVisible('department'))    { <td><span class="badge text-bg-secondary">{{ emp.department }}</span></td> }
                @if (colVisible('designation'))   { <td class="small">{{ emp.designation }}</td> }
                @if (colVisible('location'))      { <td class="small">{{ emp.location }}</td> }
                @if (colVisible('status'))        { <td><span class="badge" [class]="statusClass(emp.status)">{{ emp.status }}</span></td> }
                @if (colVisible('joinedAt'))      { <td class="small">{{ emp.joinedAt | appDate }}</td> }
                <td class="text-end">
                  <a class="btn btn-sm btn-outline-primary me-1" [routerLink]="['/admin/employees', emp.id]">View</a>
                  <a class="btn btn-sm btn-outline-secondary" [routerLink]="['/admin/employees', emp.id, 'edit']">Edit</a>
                </td>
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="visibleColumns().length + 2" class="text-center py-5">
                  <div class="text-body-secondary">
                    <div class="fs-2 mb-2">🔍</div>
                    <strong>No employees found</strong>
                    <p class="mb-0 small">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- ── Pagination footer ──────────────────── -->
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div class="small text-body-secondary">
          Showing {{ rangeStart(paged) }}–{{ rangeEnd(paged) }} of {{ paged.total }}
        </div>
        <app-pagination
          [page]="filterForm.controls.page.value"
          [pageSize]="filterForm.controls.pageSize.value"
          [total]="paged.total"
          (pageChange)="setPage($event)" />
      </div>
    } @else {
      <div class="surface p-5 text-center text-body-secondary">
        <div class="spinner-border mb-3" role="status"><span class="visually-hidden">Loading…</span></div>
        <p class="mb-0">Loading employees…</p>
      </div>
    }

    <!-- ── Dialogs ────────────────────────────────── -->
    <app-confirmation-dialog
      [open]="confirmDialog() === 'delete'"
      title="Delete employees"
      [message]="'Permanently delete ' + selectedIds().length + ' employee record(s). This cannot be undone.'"
      (cancel)="confirmDialog.set(null)"
      (confirm)="executeBulkDelete()" />

    <app-confirmation-dialog
      [open]="confirmDialog() === 'status'"
      title="Update status"
      [message]="'Set ' + selectedIds().length + ' employee(s) to ' + pendingStatus() + '?'"
      (cancel)="confirmDialog.set(null)"
      (confirm)="executeBulkStatus()" />

    <!-- ── Save filter dialog (inline) ───────────── -->
    @if (showSaveDialog()) {
      <div class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,.4)">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Save filter</h5>
              <button class="btn-close" type="button" (click)="showSaveDialog.set(false)" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <input #filterNameInput class="form-control" placeholder="Filter name…" [value]="filterNameDraft()" (input)="filterNameDraft.set(filterNameInput.value)" />
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-secondary btn-sm" type="button" (click)="showSaveDialog.set(false)">Cancel</button>
              <button class="btn btn-primary btn-sm" type="button" [disabled]="!filterNameDraft().trim()" (click)="confirmSaveFilter()">Save</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent {
  private readonly fb              = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly exportService   = inject(ExportService);
  private readonly toast           = inject(ToastService);

  // ── Service data ────────────────────────────────────
  readonly departments  = this.employeeService.departments;
  readonly locations    = this.employeeService.locations;
  readonly designations = this.employeeService.designations;
  readonly allEmployees = this.employeeService.employees;

  // ── UI state signals ────────────────────────────────
  readonly selectedIds   = signal<string[]>([]);
  readonly confirmDialog = signal<'delete' | 'status' | null>(null);
  readonly pendingStatus = signal<EmployeeStatus>('Active');
  readonly sortStack     = signal<SortEntry[]>([]);
  readonly showAdvanced  = signal(false);
  readonly savedFilters  = signal<SavedFilter[]>([]);
  readonly showSaveDialog = signal(false);
  readonly filterNameDraft = signal('');

  // ── Columns ─────────────────────────────────────────
  readonly columns: ColumnDef[] = [
    { key: 'employeeCode', label: 'Code',        sortable: true,  visible: true  },
    { key: 'firstName',    label: 'Name',         sortable: true,  visible: true  },
    { key: 'email',        label: 'Email',        sortable: true,  visible: true  },
    { key: 'phone',        label: 'Phone',        sortable: false, visible: true  },
    { key: 'department',   label: 'Department',   sortable: true,  visible: true  },
    { key: 'designation',  label: 'Designation',  sortable: true,  visible: false },
    { key: 'location',     label: 'Location',     sortable: true,  visible: true  },
    { key: 'status',       label: 'Status',       sortable: true,  visible: true  },
    { key: 'joinedAt',     label: 'Joined',       sortable: true,  visible: true  }
  ];
  readonly visibleColumns = computed(() => this.columns.filter((c) => c.visible));

  // ── Filter form ─────────────────────────────────────
  readonly filterForm = this.fb.nonNullable.group({
    query:       [''],
    department:  [''],
    status:      [''],
    location:    [''],
    designation: [''],
    joinedFrom:  [''],
    joinedTo:    [''],
    page:        [1],
    pageSize:    [10],
    sortBy:      ['employeeCode' as keyof Employee],
    sortDirection: ['asc' as 'asc' | 'desc']
  });

  // ── Paged result as signal ───────────────────────────
  private readonly pagedResult$ = this.filterForm.valueChanges.pipe(
    startWith(this.filterForm.getRawValue()),
    debounceTime(220),
    switchMap(() => {
      const raw = this.filterForm.getRawValue() as EmployeeFilter;
      return this.employeeService.list({ ...raw, sortStack: this.sortStack() });
    })
  );
  readonly paged = toSignal(this.pagedResult$);

  // ── Derived display ──────────────────────────────────
  readonly totalText = computed(() => {
    const p = this.paged();
    return p ? `${p.total} employee${p.total !== 1 ? 's' : ''}` : '';
  });

  readonly primarySortKey = computed(() => this.sortStack()[0]?.field ?? this.filterForm.controls.sortBy.value as keyof Employee);
  readonly primarySortDir = computed(() => this.sortStack()[0]?.direction ?? this.filterForm.controls.sortDirection.value as 'asc' | 'desc');

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

  /** Active filter chips for display. */
  readonly activeChips = computed(() => {
    const f = this.filterForm.getRawValue();
    const chips: { key: string; label: string }[] = [];
    if (f.query)       chips.push({ key: 'query',       label: `"${f.query}"` });
    if (f.department)  chips.push({ key: 'department',  label: `Dept: ${f.department}` });
    if (f.status)      chips.push({ key: 'status',      label: `Status: ${f.status}` });
    if (f.location)    chips.push({ key: 'location',    label: `Location: ${f.location}` });
    if (f.designation) chips.push({ key: 'designation', label: `Role: ${f.designation}` });
    if (f.joinedFrom)  chips.push({ key: 'joinedFrom',  label: `From: ${f.joinedFrom}` });
    if (f.joinedTo)    chips.push({ key: 'joinedTo',    label: `To: ${f.joinedTo}` });
    return chips;
  });

  // ── Column visibility ────────────────────────────────
  toggleColumn(col: ColumnDef): void { col.visible = !col.visible; }
  colVisible(key: keyof Employee): boolean { return this.columns.find((c) => c.key === key)?.visible ?? false; }

  // ── Sort ────────────────────────────────────────────
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

  removeSortEntry(index: number): void {
    this.sortStack.update((s) => s.filter((_, i) => i !== index));
  }

  clearSort(): void { this.sortStack.set([]); }

  sortStackIndex(field: keyof Employee): number {
    return this.sortStack().findIndex((e) => e.field === field) + 1;
  }

  // ── Selection ────────────────────────────────────────
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

  // ── Filters ──────────────────────────────────────────
  setPage(page: number): void { this.filterForm.patchValue({ page }); }

  resetFilters(): void {
    this.filterForm.patchValue({
      query: '', department: '', status: '', location: '', designation: '',
      joinedFrom: '', joinedTo: '', page: 1
    });
    this.sortStack.set([]);
  }

  clearChip(key: string): void {
    this.filterForm.patchValue({ [key]: '', page: 1 });
  }

  // ── Saved filters ────────────────────────────────────
  saveCurrentFilter(): void {
    this.filterNameDraft.set('');
    this.showSaveDialog.set(true);
  }

  confirmSaveFilter(): void {
    const name = this.filterNameDraft().trim();
    if (!name) return;
    const saved: SavedFilter = {
      id: crypto.randomUUID(),
      name,
      filter: { ...this.filterForm.getRawValue() as Partial<EmployeeFilter>, sortStack: this.sortStack() },
      createdAt: new Date().toISOString()
    };
    this.savedFilters.update((sf) => [...sf, saved]);
    this.showSaveDialog.set(false);
    this.toast.show({ title: 'Filter saved', message: `"${name}" saved as preset`, type: 'success' });
  }

  applyFilter(sf: SavedFilter): void {
    const f = sf.filter;
    this.filterForm.patchValue({
      query: f.query ?? '', department: f.department ?? '', status: f.status ?? '',
      location: f.location ?? '', designation: f.designation ?? '',
      joinedFrom: f.joinedFrom ?? '', joinedTo: f.joinedTo ?? '', page: 1,
      pageSize: f.pageSize ?? 10
    });
    if (f.sortStack) this.sortStack.set(f.sortStack);
    this.toast.show({ title: 'Filter applied', message: `Loaded "${sf.name}"`, type: 'info' });
  }

  removeSavedFilter(id: string): void {
    this.savedFilters.update((sf) => sf.filter((f) => f.id !== id));
  }

  // ── Bulk actions ─────────────────────────────────────
  bulkSetStatus(status: EmployeeStatus): void {
    this.pendingStatus.set(status);
    this.confirmDialog.set('status');
  }

  executeBulkDelete(): void {
    const ids = this.selectedIds();
    this.employeeService.bulkDelete(ids).subscribe(() => {
      this.toast.show({ title: 'Deleted', message: `${ids.length} employee(s) deleted`, type: 'success' });
      this.selectedIds.set([]);
      this.confirmDialog.set(null);
      this.filterForm.patchValue({ page: 1 });
    });
  }

  executeBulkStatus(): void {
    const ids    = this.selectedIds();
    const status = this.pendingStatus();
    this.employeeService.bulkUpdateStatus(ids, status).subscribe(() => {
      this.toast.show({ title: 'Status updated', message: `${ids.length} employee(s) set to ${status}`, type: 'success' });
      this.selectedIds.set([]);
      this.confirmDialog.set(null);
    });
  }

  // ── Export ───────────────────────────────────────────
  exportCsv(): void {
    this.exportService.downloadCsv(this.allEmployees(), 'employees-all');
  }

  exportExcel(): void {
    this.exportService.downloadExcel(this.allEmployees(), 'employees-all');
  }

  exportFiltered(): void {
    const paged = this.paged();
    if (!paged?.items.length) {
      this.toast.show({ title: 'Nothing to export', message: 'No records match the current filters', type: 'warning' });
      return;
    }
    // Export all matching rows (re-run filter without pagination)
    const raw = { ...this.filterForm.getRawValue() as EmployeeFilter, page: 1, pageSize: 9999, sortStack: this.sortStack() };
    this.employeeService.list(raw).subscribe((result) => {
      this.exportService.downloadCsv(result.items, 'employees-filtered');
      this.toast.show({ title: 'Export ready', message: `${result.total} records exported`, type: 'success' });
    });
  }

  // ── Helpers ──────────────────────────────────────────
  statusClass(status: EmployeeStatus): string {
    return { Active: 'text-bg-success', Inactive: 'text-bg-danger', 'On Leave': 'text-bg-warning text-dark' }[status] ?? 'text-bg-secondary';
  }

  rangeStart(paged: { page: number; pageSize: number }): number {
    return (paged.page - 1) * paged.pageSize + 1;
  }

  rangeEnd(paged: { page: number; pageSize: number; total?: number; items: unknown[] }): number {
    return (paged.page - 1) * paged.pageSize + paged.items.length;
  }
}
