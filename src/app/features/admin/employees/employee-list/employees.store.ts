import { Injectable, computed, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { Employee, EmployeeFilter, EmployeeStatus, SavedFilter, SortEntry } from '@core/models/employee.models';
import { PagedResult } from '@core/models/table.models';
import { EmployeeService } from '@core/services/employee.service';
import { ExportService } from '@core/services/export.service';
import { ToastService } from '@core/services/toast.service';
import { DialogService } from '@core/services/dialog.service';
import { PermissionService } from '@core/auth/permission.service';

export interface ColumnDef {
  key: keyof Employee;
  label: string;
  sortable: boolean;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeesStore {
  private readonly employeeService = inject(EmployeeService);
  private readonly exportService = inject(ExportService);
  private readonly toast = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly permSvc = inject(PermissionService);
  private readonly fb = inject(FormBuilder);

  // Core State
  readonly selectedIds = signal<string[]>([]);
  private readonly _sortStack = signal<SortEntry[]>([]);
  readonly showAdvanced = signal<boolean>(false);
  private readonly _savedFilters = signal<SavedFilter[]>([]);
  readonly showSaveDialog = signal<boolean>(false);
  readonly filterNameDraft = signal<string>('');
  private readonly _pagedResult = signal<PagedResult<Employee> | null>(null);

  private readonly _columnsConfig = signal<ColumnDef[]>([
    { key: 'employeeCode', label: 'Code',        sortable: true,  visible: true  },
    { key: 'firstName',    label: 'Name',         sortable: true,  visible: true  },
    { key: 'email',        label: 'Email',        sortable: true,  visible: true  },
    { key: 'phone',        label: 'Phone',        sortable: false, visible: true  },
    { key: 'department',   label: 'Department',   sortable: true,  visible: true  },
    { key: 'designation',  label: 'Designation',  sortable: true,  visible: false },
    { key: 'location',     label: 'Location',     sortable: true,  visible: true  },
    { key: 'status',       label: 'Status',       sortable: true,  visible: true  },
    { key: 'joinedAt',     label: 'Joined',       sortable: true,  visible: true  }
  ]);

  private readonly _filters = signal<EmployeeFilter>({
    query: '',
    department: '',
    status: '',
    location: '',
    designation: '',
    joinedFrom: '',
    joinedTo: '',
    page: 1,
    pageSize: 10,
    sortBy: 'employeeCode',
    sortDirection: 'asc',
    sortStack: []
  });

  // Forms
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

  // Readonly Public Signals
  readonly sortStack = this._sortStack.asReadonly();
  readonly savedFilters = this._savedFilters.asReadonly();
  readonly columnsConfig = this._columnsConfig.asReadonly();
  readonly pagedResult = this._pagedResult.asReadonly();
  readonly filters = this._filters.asReadonly();

  // Computed Properties
  readonly totalText = computed(() => {
    const p = this._pagedResult();
    return p ? `${p.total} employee${p.total !== 1 ? 's' : ''}` : '';
  });

  readonly primarySortKey = computed(() => {
    return this._sortStack()[0]?.field ?? this._filters().sortBy;
  });

  readonly primarySortDir = computed(() => {
    return this._sortStack()[0]?.direction ?? this._filters().sortDirection;
  });

  readonly activeChips = computed(() => {
    const f = this._filters();
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

  readonly departments = this.employeeService.departments;
  readonly locations = this.employeeService.locations;
  readonly designations = this.employeeService.designations;
  readonly allEmployees = this.employeeService.employees;

  constructor() {
    // Combine form changes and sort stack updates into a single stream to fetch employees list
    combineLatest([
      this.filterForm.valueChanges.pipe(
        startWith(this.filterForm.getRawValue()),
        debounceTime(220)
      ),
      toObservable(this.sortStack)
    ])
      .pipe(
        switchMap(([rawForm, sortStack]) => {
          const raw = rawForm as EmployeeFilter;
          this.patchFilters(raw);
          return this.employeeService.list({ ...raw, sortStack });
        }),
        takeUntilDestroyed()
      )
      .subscribe({
        next: (result) => {
          this.setPagedResult(result);
        },
        error: (err) => {
          console.error('Failed to load employees list:', err);
          this.setPagedResult(null);
        }
      });
  }

  // Mutations/Actions
  setSelectedIds(val: string[]): void { this.selectedIds.set(val); }
  setSortStack(val: SortEntry[]): void { this._sortStack.set(val); }
  setShowAdvanced(val: boolean): void { this.showAdvanced.set(val); }
  setSavedFilters(val: SavedFilter[]): void { this._savedFilters.set(val); }
  setShowSaveDialog(val: boolean): void { this.showSaveDialog.set(val); }
  setFilterNameDraft(val: string): void { this.filterNameDraft.set(val); }
  setPagedResult(val: PagedResult<Employee> | null): void { this._pagedResult.set(val); }

  toggleColumn(col: ColumnDef): void {
    this._columnsConfig.update((cols) =>
      cols.map((c) => (c.key === col.key ? { ...c, visible: !c.visible } : c))
    );
  }

  colVisible(key: keyof Employee): boolean {
    return this.columnsConfig().find((c) => c.key === key)?.visible ?? false;
  }

  addSort(field: keyof Employee | string): void {
    const f = field as keyof Employee;
    this._sortStack.update((stack) => {
      const existing = stack.findIndex((e) => e.field === f);
      if (existing === -1) {
        return [...stack, { field: f, direction: 'asc' }];
      }
      return stack.map((e, i) =>
        i === existing ? { ...e, direction: e.direction === 'asc' ? 'desc' : 'asc' } : e
      );
    });
    this.filterForm.patchValue({ page: 1 });
  }

  removeSortEntry(index: number): void {
    this._sortStack.update((s) => s.filter((_, i) => i !== index));
    this.filterForm.patchValue({ page: 1 });
  }

  clearSort(): void {
    this._sortStack.set([]);
    this.filterForm.patchValue({ page: 1 });
  }

  sortStackIndex(field: keyof Employee): number {
    return this.sortStack().findIndex((e) => e.field === field) + 1;
  }

  setPage(page: number): void {
    this.filterForm.patchValue({ page });
  }

  patchFilters(partial: Partial<EmployeeFilter>): void {
    this._filters.update(f => ({ ...f, ...partial }));
  }

  resetFilters(): void {
    this.filterForm.patchValue({
      query: '',
      department: '',
      status: '',
      location: '',
      designation: '',
      joinedFrom: '',
      joinedTo: '',
      page: 1
    });
    this._filters.set({
      query: '',
      department: '',
      status: '',
      location: '',
      designation: '',
      joinedFrom: '',
      joinedTo: '',
      page: 1,
      pageSize: 10,
      sortBy: 'employeeCode',
      sortDirection: 'asc',
      sortStack: []
    });
    this._sortStack.set([]);
  }

  clearFilterKey(key: string): void {
    this.filterForm.patchValue({ [key]: '', page: 1 });
    this.patchFilters({ [key]: '', page: 1 });
  }

  addSavedFilter(sf: SavedFilter): void {
    this._savedFilters.update((prev) => [...prev, sf]);
  }

  removeSavedFilter(id: string): void {
    this._savedFilters.update((prev) => prev.filter((f) => f.id !== id));
  }

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
      filter: {
        ...this.filterForm.getRawValue() as Partial<EmployeeFilter>,
        sortStack: this.sortStack()
      },
      createdAt: new Date().toISOString()
    };
    this.addSavedFilter(saved);
    this.showSaveDialog.set(false);
    this.toast.showToast('FILTER_SAVED_SUCCESS', 'success', { name });
  }

  applyFilter(sf: SavedFilter): void {
    const f = sf.filter;
    this.filterForm.patchValue({
      query: f.query ?? '',
      department: f.department ?? '',
      status: f.status ?? '',
      location: f.location ?? '',
      designation: f.designation ?? '',
      joinedFrom: f.joinedFrom ?? '',
      joinedTo: f.joinedTo ?? '',
      page: 1,
      pageSize: f.pageSize ?? 10
    });
    if (f.sortStack) {
      this.setSortStack(f.sortStack);
    }
    this.toast.showToast('FILTER_APPLIED_SUCCESS', 'info', { name: sf.name });
  }

  // Bulk Actions
  bulkSetStatus(status: EmployeeStatus): void {
    const ids = this.selectedIds();
    this.dialogService.confirm({
      title: 'DIALOG_STATUS_CHANGE_TITLE',
      message: 'DIALOG_STATUS_CHANGE_MSG',
      translationParams: { status },
      variant: 'warning',
      icon: 'warning'
    }).then((confirmed) => {
      if (confirmed) {
        this.employeeService.bulkUpdateStatus(ids, status).subscribe(() => {
          this.toast.showToast('EMPLOYEES_STATUS_UPDATED_SUCCESS', 'success', { count: ids.length, status });
          this.setSelectedIds([]);
        });
      }
    });
  }

  confirmBulkDelete(): void {
    const ids = this.selectedIds();
    this.dialogService.confirm({
      title: 'DIALOG_BULK_DELETE_EMPLOYEES_TITLE',
      message: 'DIALOG_BULK_DELETE_EMPLOYEES_MSG',
      translationParams: { count: ids.length },
      variant: 'danger',
      icon: 'delete'
    }).then((confirmed) => {
      if (confirmed) {
        this.employeeService.bulkDelete(ids).subscribe(() => {
          this.toast.showToast('EMPLOYEES_DELETED_SUCCESS', 'error', { count: ids.length });
          this.setSelectedIds([]);
          this.filterForm.patchValue({ page: 1 });
        });
      }
    });
  }

  // Exports
  exportCsv(): void {
    this.exportService.downloadCsv(this.allEmployees(), 'employees-all');
  }

  exportExcel(): void {
    this.exportService.downloadExcel(this.allEmployees(), 'employees-all');
  }

  exportFiltered(): void {
    const pagedVal = this.pagedResult();
    if (!pagedVal?.items.length) {
      this.toast.showToast('NOTHING_TO_EXPORT', 'warning');
      return;
    }
    const raw = {
      ...this.filterForm.getRawValue() as EmployeeFilter,
      page: 1,
      pageSize: 9999,
      sortStack: this.sortStack()
    };
    this.employeeService.list(raw).subscribe((result) => {
      this.exportService.downloadCsv(result.items, 'employees-filtered');
      this.toast.showToast('EXPORT_READY_SUCCESS', 'success', { count: result.total });
    });
  }

  // Helpers
  statusClass(status: EmployeeStatus): string {
    return {
      Active: 'text-bg-success',
      Inactive: 'text-bg-danger',
      'On Leave': 'text-bg-warning text-dark'
    }[status] ?? 'text-bg-secondary';
  }

  rangeStart(pagedVal: { page: number; pageSize: number }): number {
    return (pagedVal.page - 1) * pagedVal.pageSize + 1;
  }

  rangeEnd(pagedVal: { page: number; pageSize: number; total?: number; items: unknown[] }): number {
    return (pagedVal.page - 1) * pagedVal.pageSize + pagedVal.items.length;
  }
}
