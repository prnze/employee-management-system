import { Injectable, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, startWith } from 'rxjs/operators';
import { UserService } from '@core/services/user.service';
import { ExportService } from '@core/services/export.service';
import { ToastService } from '@core/services/toast.service';
import { PermissionService } from '@core/auth/permission.service';
import { DialogService } from '@core/services/dialog.service';
import { User, UserFilter, UserSortEntry, SavedUserFilter, UserStatus } from '@core/models/user.models';
import { APP_ICONS } from '@core/constants/icon.constants';
import { AppRole } from '@core/constants/roles.constant';

const PAGE_SIZE = 10;

@Injectable({
  providedIn: 'root'
})
export class UsersStore {
  private readonly svc = inject(UserService);
  private readonly exportSvc = inject(ExportService);
  private readonly toast = inject(ToastService);
  private readonly permSvc = inject(PermissionService);
  private readonly dialogService = inject(DialogService);
  private readonly fb = inject(FormBuilder);

  // Core State
  private readonly _loading = signal<boolean>(false);
  private readonly _page = signal<number>(1);
  private readonly _sortStack = signal<UserSortEntry[]>([]);
  readonly showAdvanced = signal<boolean>(false);
  readonly selectedIds = signal<string[]>([]);
  private readonly _detailUser = signal<User | null>(null);
  readonly modalMode = signal<'create' | 'edit' | null>(null);
  readonly editTarget = signal<User | null>(null);
  readonly formError = signal<string>('');
  readonly submitting = signal<boolean>(false);
  private readonly _savedFilters = signal<SavedUserFilter[]>([]);
  readonly showSaveDialog = signal<boolean>(false);
  readonly filterNameDraft = signal<string>('');
  private readonly _filters = signal<UserFilter>({
    query: '',
    role: '',
    status: '',
    createdFrom: '',
    createdTo: '',
    hasExtraPermissions: null
  });

  // Forms
  readonly filterForm = this.fb.nonNullable.group({
    query:               [''],
    role:                ['' as AppRole | ''],
    status:              ['' as UserStatus | ''],
    createdFrom:         [''],
    createdTo:           [''],
    hasExtraPermissions: [false]
  });

  readonly userForm = this.fb.nonNullable.group({
    fullName:           ['', [Validators.required, Validators.minLength(2)]],
    email:              ['', [Validators.required, Validators.email]],
    phone:              [''],
    department:         [''],
    role:               ['Employee' as AppRole, Validators.required],
    status:             ['Active' as UserStatus, Validators.required],
    forcePasswordReset: [false]
  });

  // Local drafts (for drawer)
  newPermissionDraft = '';
  roleDraft: AppRole = 'Employee';

  // Readonly Public Signals
  readonly loading = this._loading.asReadonly();
  readonly page = this._page.asReadonly();
  readonly sortStack = this._sortStack.asReadonly();
  readonly detailUser = this._detailUser.asReadonly();
  readonly savedFilters = this._savedFilters.asReadonly();
  readonly filters = this._filters.asReadonly();

  // Computed Properties
  readonly filteredUsers = computed(() => {
    const f = this._filters();
    return this.svc.filtered(f, this._sortStack());
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredUsers().length / PAGE_SIZE)));
  readonly paged = computed(() => this.filteredUsers().slice((this._page() - 1) * PAGE_SIZE, this._page() * PAGE_SIZE));
  readonly rangeStart = computed(() => Math.min((this._page() - 1) * PAGE_SIZE + 1, this.filteredUsers().length));
  readonly rangeEnd = computed(() => Math.min(this._page() * PAGE_SIZE, this.filteredUsers().length));

  readonly activeChips = computed(() => {
    const f = this._filters();
    const chips: { key: string; label: string }[] = [];
    if (f.query)               chips.push({ key: 'query',       label: `"${f.query}"` });
    if (f.role)                chips.push({ key: 'role',        label: `Role: ${f.role}` });
    if (f.status)              chips.push({ key: 'status',      label: `Status: ${f.status}` });
    if (f.createdFrom)         chips.push({ key: 'createdFrom', label: `From: ${f.createdFrom}` });
    if (f.createdTo)           chips.push({ key: 'createdTo',   label: `To: ${f.createdTo}` });
    if (f.hasExtraPermissions) chips.push({ key: 'hasExtraPermissions', label: 'Has extra permissions' });
    return chips;
  });

  readonly kpiCards = computed(() => [
    { icon: APP_ICONS.USERS, label: 'Total Users',    value: this.svc.totalCount(),  color: '#0f6cbd' },
    { icon: APP_ICONS.SUCCESS, label: 'Active',         value: this.svc.activeCount(), color: '#198754' },
    { icon: APP_ICONS.LOCK, label: 'Locked',         value: this.svc.lockedCount(), color: '#dc3545' },
    { icon: APP_ICONS.ROLE, label: 'Admins',         value: this.svc.adminCount(),  color: '#6f42c1' }
  ]);

  constructor() {
    // Synchronize form value changes with state filters
    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.getRawValue()),
        debounceTime(150),
        takeUntilDestroyed()
      )
      .subscribe((f) => {
        this.patchFilters({
          query: f.query ?? '',
          role: f.role ?? '',
          status: f.status ?? '',
          createdFrom: f.createdFrom ?? '',
          createdTo: f.createdTo ?? '',
          hasExtraPermissions: f.hasExtraPermissions === false ? null : true
        });
      });
  }

  // Mutations
  setLoading(val: boolean): void { this._loading.set(val); }
  setPage(val: number): void { this._page.set(val); }
  setSortStack(val: UserSortEntry[]): void { this._sortStack.set(val); }
  setShowAdvanced(val: boolean): void { this.showAdvanced.set(val); }
  setSelectedIds(val: string[]): void { this.selectedIds.set(val); }
  setDetailUser(val: User | null): void { this._detailUser.set(val); }
  setModalMode(val: 'create' | 'edit' | null): void { this.modalMode.set(val); }
  setEditTarget(val: User | null): void { this.editTarget.set(val); }
  setFormError(val: string): void { this.formError.set(val); }
  setSubmitting(val: boolean): void { this.submitting.set(val); }
  setSavedFilters(val: SavedUserFilter[]): void { this._savedFilters.set(val); }
  setShowSaveDialog(val: boolean): void { this.showSaveDialog.set(val); }
  setFilterNameDraft(val: string): void { this.filterNameDraft.set(val); }

  addSort(field: string): void {
    this._sortStack.update((stack) => {
      const i = stack.findIndex((e) => e.field === field);
      if (i === -1) return [...stack, { field, direction: 'asc' } as UserSortEntry];
      return stack.map((e, idx) => idx === i ? { ...e, direction: e.direction === 'asc' ? 'desc' : 'asc' } : e);
    });
    this._page.set(1);
  }

  patchFilters(partial: Partial<UserFilter>): void {
    this._filters.update(f => ({ ...f, ...partial }));
    this._page.set(1);
  }

  resetFilters(): void {
    this.filterForm.reset({
      query: '',
      role: '',
      status: '',
      createdFrom: '',
      createdTo: '',
      hasExtraPermissions: false
    });
    this._filters.set({
      query: '',
      role: '',
      status: '',
      createdFrom: '',
      createdTo: '',
      hasExtraPermissions: null
    });
    this._sortStack.set([]);
    this._page.set(1);
  }

  clearFilterKey(key: string): void {
    if (key === 'hasExtraPermissions') {
      this.filterForm.patchValue({ hasExtraPermissions: false });
      this.patchFilters({ hasExtraPermissions: null });
    } else {
      this.filterForm.patchValue({ [key]: '' });
      this.patchFilters({ [key]: '' });
    }
  }

  addSavedFilter(filter: SavedUserFilter): void {
    this._savedFilters.update((sf) => [...sf, filter]);
  }

  removeSavedFilter(id: string): void {
    this._savedFilters.update((sf) => sf.filter((f) => f.id !== id));
  }

  saveCurrentFilter(): void {
    this.filterNameDraft.set('');
    this.showSaveDialog.set(true);
  }

  confirmSaveFilter(): void {
    const name = this.filterNameDraft().trim();
    if (!name) return;
    const f = this.filterForm.getRawValue();
    const saved: SavedUserFilter = {
      id: crypto.randomUUID(),
      name,
      filter: { ...f as Partial<UserFilter> },
      createdAt: new Date().toISOString()
    };
    this.addSavedFilter(saved);
    this.showSaveDialog.set(false);
    this.toast.showToast('FILTER_SAVED_SUCCESS', 'success', { name });
  }

  applyFilter(sf: SavedUserFilter): void {
    const f = sf.filter;
    this.filterForm.patchValue({
      query: f.query ?? '',
      role: f.role ?? '',
      status: f.status ?? '',
      createdFrom: f.createdFrom ?? '',
      createdTo: f.createdTo ?? '',
      hasExtraPermissions: !!f.hasExtraPermissions
    });
    this.toast.showToast('FILTER_APPLIED_SUCCESS', 'info', { name: sf.name });
  }

  // Bulk Operations
  bulkActivate(): void {
    const ids = this.selectedIds();
    this.dialogService.confirm({
      title: 'DIALOG_BULK_ACTIVATE_USERS_TITLE',
      message: 'DIALOG_BULK_ACTIVATE_USERS_MSG',
      translationParams: { count: ids.length },
      variant: 'info',
      icon: 'check_circle'
    }).then((confirmed) => {
      if (confirmed) {
        this.svc.bulkSetStatus(ids, 'Active').subscribe(() => {
          this.toast.showToast('USERS_ACTIVATED_SUCCESS', 'success', { count: ids.length });
          this.setSelectedIds([]);
        });
      }
    });
  }

  bulkDeactivate(): void {
    const ids = this.selectedIds();
    this.dialogService.confirm({
      title: 'DIALOG_BULK_DEACTIVATE_USERS_TITLE',
      message: 'DIALOG_BULK_DEACTIVATE_USERS_MSG',
      translationParams: { count: ids.length },
      variant: 'warning',
      icon: 'warning'
    }).then((confirmed) => {
      if (confirmed) {
        this.svc.bulkSetStatus(ids, 'Inactive').subscribe(() => {
          this.toast.showToast('USERS_DEACTIVATED_SUCCESS', 'info', { count: ids.length });
          this.setSelectedIds([]);
        });
      }
    });
  }

  confirmBulkDelete(): void {
    const ids = this.selectedIds();
    this.dialogService.confirm({
      title: 'DIALOG_BULK_DELETE_USERS_TITLE',
      message: 'DIALOG_BULK_DELETE_USERS_MSG',
      translationParams: { count: ids.length },
      variant: 'danger',
      icon: 'delete'
    }).then((confirmed) => {
      if (confirmed) {
        this.svc.bulkDelete(ids).subscribe(() => {
          this.toast.showToast('USERS_DELETED_SUCCESS', 'error', { count: ids.length });
          this.setSelectedIds([]);
          this.setPage(1);
        });
      }
    });
  }

  // Single User Actions
  activate(id: string): void {
    this.svc.setStatus(id, 'Active').subscribe((u) => {
      this.setDetailUser(u);
      this.toast.showToast('USER_ACTIVATED_SUCCESS', 'success', { name: u.fullName });
    });
  }

  deactivate(id: string): void {
    const userObj = this.svc.users().find((x) => x.id === id);
    if (!userObj) return;
    this.dialogService.confirm({
      title: 'DIALOG_DEACTIVATE_USER_TITLE',
      message: 'DIALOG_DEACTIVATE_USER_MSG',
      translationParams: { name: userObj.fullName },
      variant: 'warning',
      icon: 'warning'
    }).then((confirmed) => {
      if (confirmed) {
        this.svc.setStatus(id, 'Inactive').subscribe((u) => {
          this.setDetailUser(u);
          this.toast.showToast('USER_DEACTIVATED_SUCCESS', 'info', { name: u.fullName });
        });
      }
    });
  }

  lock(id: string): void {
    const userObj = this.svc.users().find((x) => x.id === id);
    if (!userObj) return;
    this.dialogService.confirm({
      title: 'DIALOG_LOCK_USER_TITLE',
      message: 'DIALOG_LOCK_USER_MSG',
      translationParams: { name: userObj.fullName },
      variant: 'warning',
      icon: 'lock'
    }).then((confirmed) => {
      if (confirmed) {
        this.svc.lock(id).subscribe((u) => {
          this.setDetailUser(u);
          this.toast.showToast('USER_LOCKED_SUCCESS', 'warning', { name: u.fullName });
        });
      }
    });
  }

  unlock(id: string): void {
    const userObj = this.svc.users().find((x) => x.id === id);
    if (!userObj) return;
    this.dialogService.confirm({
      title: 'DIALOG_UNLOCK_USER_TITLE',
      message: 'DIALOG_UNLOCK_USER_MSG',
      translationParams: { name: userObj.fullName },
      variant: 'info',
      icon: 'lock_open'
    }).then((confirmed) => {
      if (confirmed) {
        this.svc.unlock(id).subscribe((u) => {
          this.setDetailUser(u);
          this.toast.showToast('USER_UNLOCKED_SUCCESS', 'success', { name: u.fullName });
        });
      }
    });
  }

  forceReset(id: string): void {
    const userObj = this.svc.users().find((x) => x.id === id);
    if (!userObj) return;
    this.dialogService.confirm({
      title: 'DIALOG_FORCE_RESET_TITLE',
      message: 'DIALOG_FORCE_RESET_MSG',
      translationParams: { name: userObj.fullName },
      variant: 'warning',
      icon: 'password'
    }).then((confirmed) => {
      if (confirmed) {
        this.svc.forcePasswordReset(id).subscribe((u) => {
          this.setDetailUser(u);
          this.toast.showToast('USER_RESET_REQUIRED_SUCCESS', 'info', { name: u.fullName });
        });
      }
    });
  }

  confirmDeleteUser(u: User): void {
    this.dialogService.confirm({
      title: 'DIALOG_DELETE_USER_TITLE',
      message: 'DIALOG_DELETE_USER_MSG',
      translationParams: { name: u.fullName },
      variant: 'danger',
      icon: 'delete'
    }).then((confirmed) => {
      if (confirmed) {
        this.svc.delete(u.id).subscribe(() => {
          this.toast.showToast('USER_DELETED_SUCCESS', 'error', { name: u.fullName });
          this.setDetailUser(null);
        });
      }
    });
  }

  // Drawer / Custom Permissions actions
  addExtraPermission(id: string): void {
    if (!this.newPermissionDraft) return;
    this.svc.addPermission(id, this.newPermissionDraft).subscribe((u) => {
      this.setDetailUser(u);
      this.toast.showToast('PERMISSION_ADDED_SUCCESS', 'success', { permission: this.newPermissionDraft });
      this.newPermissionDraft = '';
    });
  }

  removeExtraPermission(id: string, perm: string): void {
    this.svc.removePermission(id, perm).subscribe((u) => {
      this.setDetailUser(u);
      this.toast.showToast('PERMISSION_REMOVED_SUCCESS', 'info', { permission: perm });
    });
  }

  changeRole(id: string): void {
    this.svc.assignRole(id, this.roleDraft).subscribe((u) => {
      this.setDetailUser(u);
      this.toast.showToast('ROLE_UPDATED_SUCCESS', 'success', { name: u.fullName, role: u.role });
    });
  }

  openDetail(u: User): void {
    this.setDetailUser(u);
    this.roleDraft = u.role;
    this.newPermissionDraft = '';
  }

  closeDetail(): void {
    this.setDetailUser(null);
  }

  // Modals (Create / Edit)
  openCreate(): void {
    this.setEditTarget(null);
    this.setModalMode('create');
    this.setFormError('');
    this.userForm.reset({
      fullName: '',
      email: '',
      phone: '',
      department: '',
      role: 'Employee',
      status: 'Active',
      forcePasswordReset: false
    });
  }

  openEdit(u: User): void {
    this.setDetailUser(null);
    this.setEditTarget(u);
    this.setModalMode('edit');
    this.setFormError('');
    this.userForm.patchValue({
      fullName: u.fullName,
      email: u.email,
      phone: u.phone ?? '',
      department: u.department ?? '',
      role: u.role,
      status: u.status,
      forcePasswordReset: u.forcePasswordReset ?? false
    });
  }

  closeModal(): void {
    this.setModalMode(null);
    this.setEditTarget(null);
  }

  submitUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.setSubmitting(true);
    this.setFormError('');
    const val = this.userForm.getRawValue();

    const obs = this.modalMode() === 'create'
      ? this.svc.create({ ...val, extraPermissions: [], forcePasswordReset: val.forcePasswordReset ?? false })
      : this.svc.update(this.editTarget()!.id, val);

    obs.subscribe({
      next: (u) => {
        this.setSubmitting(false);
        const successKey = this.modalMode() === 'create' ? 'USER_CREATED_SUCCESS' : 'USER_UPDATED_SUCCESS';
        this.closeModal();
        this.toast.showToast(successKey, 'success', { name: u.fullName });
      },
      error: (err: Error) => {
        this.setSubmitting(false);
        this.setFormError(err.message);
      }
    });
  }

  // Exports
  exportCsv(): void {
    const rows = this.filteredUsers().map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      status: u.status,
      department: u.department ?? '',
      phone: u.phone ?? '',
      lastLogin: u.lastLoginAt ?? '',
      createdAt: u.createdAt ?? ''
    }));
    this.exportSvc.downloadCsv(rows, 'users');
    this.toast.showToast('USERS_EXPORTED_CSV_SUCCESS', 'success', { count: rows.length });
  }

  exportExcel(): void {
    const rows = this.filteredUsers().map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      status: u.status,
      department: u.department ?? '',
      phone: u.phone ?? '',
      lastLogin: u.lastLoginAt ?? '',
      createdAt: u.createdAt ?? ''
    }));
    this.exportSvc.downloadExcel(rows, 'users');
    this.toast.showToast('USERS_EXPORTED_EXCEL_SUCCESS', 'success', { count: rows.length });
  }

  // Helpers
  rolePermissions(role: AppRole): string[] {
    return this.permSvc.getPermissions(role);
  }

  availableExtraPermissions(u: User): string[] {
    const role = u.role;
    const existing = new Set([...this.permSvc.getPermissions(role), ...(u.extraPermissions ?? [])]);
    return this.permSvc.allPermissions().filter((p) => !existing.has(p));
  }

  statusClass(status: UserStatus): string {
    return { Active: 'text-bg-success', Inactive: 'text-bg-secondary', Locked: 'text-bg-danger' }[status] ?? 'text-bg-secondary';
  }

  roleClass(role: AppRole): string {
    return role === 'Admin' ? 'text-bg-primary' : 'text-bg-info text-dark';
  }

  avatarColor(role: AppRole): string {
    return role === 'Admin' ? '#0f6cbd' : '#198754';
  }
}
