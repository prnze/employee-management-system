import {
  ChangeDetectionStrategy, Component, computed, inject, TemplateRef, viewChild
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User, SavedUserFilter, UserStatus } from '@core/models/user.models';
import { AppRole } from '@core/constants/roles.constant';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { InitialsPipe } from '@shared/pipes/initials.pipe';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { FilterChipsComponent } from '@shared/components/filter-chips/filter-chips.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TableColumn } from '@core/models/table.models';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { UserService } from '@core/services/user.service';
import { UsersStore } from './users.store';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, AppDatePipe, InitialsPipe, IconComponent,
    PermissionDirective, TableComponent, PaginationComponent, FilterChipsComponent, ModalComponent
  ],
  styleUrl: './users.component.scss',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
  readonly store = inject(UsersStore);
  readonly svc = inject(UserService);
  readonly APP_ICONS = APP_ICONS;

  // Template queries for cell templates
  readonly nameTpl = viewChild<TemplateRef<any>>('nameTpl');
  readonly roleTpl = viewChild<TemplateRef<any>>('roleTpl');
  readonly statusTpl = viewChild<TemplateRef<any>>('statusTpl');
  readonly lastLoginTpl = viewChild<TemplateRef<any>>('lastLoginTpl');
  readonly actionsTpl = viewChild<TemplateRef<any>>('actionsTpl');

  readonly columns = computed<TableColumn<User>[]>(() => [
    { key: 'fullName', label: 'Name', cellTemplate: this.nameTpl(), sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', cellTemplate: this.roleTpl(), sortable: true },
    { key: 'status', label: 'Status', cellTemplate: this.statusTpl(), sortable: true },
    { key: 'lastLoginAt', label: 'Last Login', cellTemplate: this.lastLoginTpl(), sortable: true },
    { key: 'actions', label: '', cellTemplate: this.actionsTpl(), headerClass: 'text-end', cellClass: 'text-end' }
  ]);

  // Expose store signals directly to component class for template bindings
  readonly loading = this.store.loading;
  readonly page = this.store.page;
  readonly sortStack = this.store.sortStack;
  readonly showAdvanced = this.store.showAdvanced;
  readonly selectedIds = this.store.selectedIds;
  readonly detailUser = this.store.detailUser;
  readonly modalMode = this.store.modalMode;
  readonly editTarget = this.store.editTarget;
  readonly formError = this.store.formError;
  readonly submitting = this.store.submitting;
  readonly savedFilters = this.store.savedFilters;
  readonly showSaveDialog = this.store.showSaveDialog;
  readonly filterNameDraft = this.store.filterNameDraft;
  readonly filterForm = this.store.filterForm;
  readonly userForm = this.store.userForm;
  readonly filteredUsers = this.store.filteredUsers;
  readonly totalPages = this.store.totalPages;
  readonly paged = this.store.paged;
  readonly rangeStart = this.store.rangeStart;
  readonly rangeEnd = this.store.rangeEnd;
  readonly activeChips = this.store.activeChips;
  readonly kpiCards = this.store.kpiCards;

  // Expose getters/setters for template ngModel bindings
  get newPermissionDraft(): string {
    return this.store.newPermissionDraft;
  }
  set newPermissionDraft(val: string) {
    this.store.newPermissionDraft = val;
  }

  get roleDraft(): AppRole {
    return this.store.roleDraft;
  }
  set roleDraft(val: AppRole) {
    this.store.roleDraft = val;
  }

  fc = (name: string) => this.userForm.get(name)!;

  addSort(field: string): void {
    this.store.addSort(field);
  }

  setPage(p: number): void {
    this.store.setPage(p);
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

  applyFilter(sf: SavedUserFilter): void {
    this.store.applyFilter(sf);
  }

  removeSavedFilter(id: string): void {
    this.store.removeSavedFilter(id);
  }

  bulkActivate(): void {
    this.store.bulkActivate();
  }

  bulkDeactivate(): void {
    this.store.bulkDeactivate();
  }

  confirmBulkDelete(): void {
    this.store.confirmBulkDelete();
  }

  activate(id: string): void {
    this.store.activate(id);
  }

  deactivate(id: string): void {
    this.store.deactivate(id);
  }

  lock(id: string): void {
    this.store.lock(id);
  }

  unlock(id: string): void {
    this.store.unlock(id);
  }

  forceReset(id: string): void {
    this.store.forceReset(id);
  }

  confirmDeleteUser(u: User): void {
    this.store.confirmDeleteUser(u);
  }

  addExtraPermission(id: string): void {
    this.store.addExtraPermission(id);
  }

  removeExtraPermission(id: string, perm: string): void {
    this.store.removeExtraPermission(id, perm);
  }

  changeRole(id: string): void {
    this.store.changeRole(id);
  }

  openDetail(u: User): void {
    this.store.openDetail(u);
  }

  closeDetail(): void {
    this.store.closeDetail();
  }

  openCreate(): void {
    this.store.openCreate();
  }

  openEdit(u: User): void {
    this.store.openEdit(u);
  }

  closeModal(): void {
    this.store.closeModal();
  }

  submitUser(): void {
    this.store.submitUser();
  }

  exportCsv(): void {
    this.store.exportCsv();
  }

  exportExcel(): void {
    this.store.exportExcel();
  }

  rolePermissions(role: AppRole): string[] {
    return this.store.rolePermissions(role);
  }

  availableExtraPermissions(u: User): string[] {
    return this.store.availableExtraPermissions(u);
  }

  statusClass(status: UserStatus): string {
    return this.store.statusClass(status);
  }

  roleClass(role: AppRole): string {
    return this.store.roleClass(role);
  }

  avatarColor(role: AppRole): string {
    return this.store.avatarColor(role);
  }
}
