import { ChangeDetectionStrategy, Component, computed, inject, TemplateRef, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Employee, EmployeeStatus, SavedFilter } from '@core/models/employee.models';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { PhoneFormatPipe } from '@shared/pipes/phone-format.pipe';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { TableComponent } from '@shared/components/table/table.component';
import { FilterChipsComponent } from '@shared/components/filter-chips/filter-chips.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TableColumn } from '@core/models/table.models';
import { EmployeesStore, ColumnDef } from './employees.store';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, PaginationComponent, PhoneFormatPipe, AppDatePipe,
    IconComponent, PermissionDirective, TableComponent, FilterChipsComponent, ModalComponent
  ],
  styleUrl: './employee-list.component.scss',
  templateUrl: './employee-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent {
  readonly store = inject(EmployeesStore);
  readonly APP_ICONS = APP_ICONS;

  // Local Template queries (UI specific, must remain in component)
  readonly codeTpl = viewChild<TemplateRef<any>>('codeTpl');
  readonly nameTpl = viewChild<TemplateRef<any>>('nameTpl');
  readonly phoneTpl = viewChild<TemplateRef<any>>('phoneTpl');
  readonly deptTpl = viewChild<TemplateRef<any>>('deptTpl');
  readonly statusTpl = viewChild<TemplateRef<any>>('statusTpl');
  readonly joinedTpl = viewChild<TemplateRef<any>>('joinedTpl');
  readonly actionsTpl = viewChild<TemplateRef<any>>('actionsTpl');

  // Dynamic columns configuration computed based on local template queries and store config
  readonly tableColumns = computed<TableColumn<Employee>[]>(() => {
    const config = this.columnsConfig();
    return [
      { key: 'employeeCode', label: 'Code', sortable: true, cellTemplate: this.codeTpl(), visible: config.find(c => c.key === 'employeeCode')?.visible },
      { key: 'firstName', label: 'Name', sortable: true, cellTemplate: this.nameTpl(), visible: config.find(c => c.key === 'firstName')?.visible },
      { key: 'email', label: 'Email', sortable: true, visible: config.find(c => c.key === 'email')?.visible },
      { key: 'phone', label: 'Phone', cellTemplate: this.phoneTpl(), visible: config.find(c => c.key === 'phone')?.visible },
      { key: 'department', label: 'Department', cellTemplate: this.deptTpl(), sortable: true, visible: config.find(c => c.key === 'department')?.visible },
      { key: 'designation', label: 'Designation', sortable: true, visible: config.find(c => c.key === 'designation')?.visible },
      { key: 'location', label: 'Location', sortable: true, visible: config.find(c => c.key === 'location')?.visible },
      { key: 'status', label: 'Status', cellTemplate: this.statusTpl(), sortable: true, visible: config.find(c => c.key === 'status')?.visible },
      { key: 'joinedAt', label: 'Joined', cellTemplate: this.joinedTpl(), sortable: true, visible: config.find(c => c.key === 'joinedAt')?.visible },
      { key: 'actions', label: '', cellTemplate: this.actionsTpl(), headerClass: 'text-end', cellClass: 'text-end' }
    ];
  });

  readonly visibleColumns = computed(() => this.columnsConfig().filter((c) => c.visible));

  // Expose signals from store directly
  readonly selectedIds = this.store.selectedIds;
  readonly sortStack = this.store.sortStack;
  readonly showAdvanced = this.store.showAdvanced;
  readonly savedFilters = this.store.savedFilters;
  readonly showSaveDialog = this.store.showSaveDialog;
  readonly filterNameDraft = this.store.filterNameDraft;
  readonly columnsConfig = this.store.columnsConfig;
  readonly filterForm = this.store.filterForm;
  readonly paged = this.store.pagedResult;
  readonly totalText = this.store.totalText;
  readonly primarySortKey = this.store.primarySortKey;
  readonly primarySortDir = this.store.primarySortDir;
  readonly activeChips = this.store.activeChips;
  readonly departments = this.store.departments;
  readonly locations = this.store.locations;
  readonly designations = this.store.designations;
  readonly allEmployees = this.store.allEmployees;

  // Delegate actions to store
  toggleColumn(col: ColumnDef): void {
    this.store.toggleColumn(col);
  }

  colVisible(key: keyof Employee): boolean {
    return this.store.colVisible(key);
  }

  addSort(field: keyof Employee | string): void {
    this.store.addSort(field);
  }

  removeSortEntry(index: number): void {
    this.store.removeSortEntry(index);
  }

  clearSort(): void {
    this.store.clearSort();
  }

  sortStackIndex(field: keyof Employee): number {
    return this.store.sortStackIndex(field);
  }

  setPage(page: number): void {
    this.store.setPage(page);
  }

  resetFilters(): void {
    this.store.resetFilters();
  }

  clearChip(key: string): void {
    this.store.clearFilterKey(key);
  }

  saveCurrentFilter(): void {
    this.store.saveCurrentFilter();
  }

  confirmSaveFilter(): void {
    this.store.confirmSaveFilter();
  }

  applyFilter(sf: SavedFilter): void {
    this.store.applyFilter(sf);
  }

  removeSavedFilter(id: string): void {
    this.store.removeSavedFilter(id);
  }

  bulkSetStatus(status: EmployeeStatus): void {
    this.store.bulkSetStatus(status);
  }

  confirmBulkDelete(): void {
    this.store.confirmBulkDelete();
  }

  exportCsv(): void {
    this.store.exportCsv();
  }

  exportExcel(): void {
    this.store.exportExcel();
  }

  exportFiltered(): void {
    this.store.exportFiltered();
  }

  statusClass(status: EmployeeStatus): string {
    return this.store.statusClass(status);
  }

  rangeStart(pagedVal: { page: number; pageSize: number }): number {
    return this.store.rangeStart(pagedVal);
  }

  rangeEnd(pagedVal: { page: number; pageSize: number; total?: number; items: unknown[] }): number {
    return this.store.rangeEnd(pagedVal);
  }
}
