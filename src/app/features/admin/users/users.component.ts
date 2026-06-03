import {
  ChangeDetectionStrategy, Component, computed, inject, signal
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, startWith } from 'rxjs';
import { UserService } from '@core/services/user.service';
import { ExportService } from '@core/services/export.service';
import { ToastService } from '@core/services/toast.service';
import { PermissionsService } from '@core/auth/permissions.service';
import { User, UserFilter, UserSortEntry, UserStatus, SavedUserFilter } from '@core/models/user.models';
import { AppRole, ROLE_PERMISSIONS } from '@core/constants/roles.constant';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { InitialsPipe } from '@shared/pipes/initials.pipe';

const PAGE_SIZE = 10;

type ModalMode = 'create' | 'edit' | null;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, AppDatePipe, InitialsPipe],
  styles: [`
    .avatar-circle {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: .8rem; flex-shrink: 0;
    }
    .drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 1055; }
    .drawer {
      position: fixed; top: 0; right: 0; bottom: 0; width: min(520px, 100vw);
      background: var(--bs-body-bg); z-index: 1056; overflow-y: auto;
      box-shadow: -4px 0 24px rgba(0,0,0,.15);
    }
    .chip { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem;
            border-radius: 2rem; background: var(--bs-primary-bg-subtle);
            color: var(--bs-primary); border: 1px solid var(--bs-primary-border-subtle); font-size: .8rem; }
    .chip-close { background: none; border: none; padding: 0; line-height: 1; cursor: pointer; color: inherit; }
    .sort-btn { background: none; border: none; padding: 0; font-weight: 600; cursor: pointer; color: inherit; }
    .sort-btn:hover { color: var(--bs-primary); }
    .row-selected { background: var(--bs-primary-bg-subtle) !important; }
    .bulk-bar { background: var(--bs-primary); color: #fff; border-radius: .5rem; padding: .5rem 1rem; }
    .perm-chip { font-size: .7rem; padding: .15rem .5rem; border-radius: 2rem; }
  `],
  template: `
    <!-- ── Header ──────────────────────────────────────────────── -->
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h1 class="h3 mb-1">User Management</h1>
        <p class="text-body-secondary small mb-0">
          {{ svc.totalCount() }} users · {{ svc.activeCount() }} active · {{ svc.lockedCount() }} locked
        </p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <!-- Export -->
        <div class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-label="Export">Export</button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" type="button" (click)="exportCsv()">📄 CSV</button></li>
            <li><button class="dropdown-item" type="button" (click)="exportExcel()">📊 Excel</button></li>
          </ul>
        </div>
        <button class="btn btn-primary btn-sm" type="button" (click)="openCreate()">+ New User</button>
      </div>
    </div>

    <!-- ── KPI Cards ────────────────────────────────────────────── -->
    <section class="row g-3 mb-4" aria-label="User statistics">
      @for (card of kpiCards(); track card.label) {
        <div class="col-6 col-xl-3">
          <article class="surface p-3 d-flex align-items-center gap-3" [style.border-left]="'4px solid ' + card.color">
            <span style="font-size:1.8rem">{{ card.icon }}</span>
            <div>
              <strong class="fs-4 d-block lh-1">{{ card.value }}</strong>
              <p class="text-body-secondary small mb-0">{{ card.label }}</p>
            </div>
          </article>
        </div>
      }
    </section>

    <!-- ── Filters ───────────────────────────────────────────────── -->
    <form [formGroup]="filterForm" class="surface p-3 mb-3" aria-label="User filters">
      <div class="row g-2 mb-2">
        <div class="col-12 col-md-4">
          <div class="input-group input-group-sm">
            <span class="input-group-text">🔍</span>
            <input class="form-control" placeholder="Search name, email, dept…" formControlName="query" aria-label="Search users" />
            @if (filterForm.controls.query.value) {
              <button class="btn btn-outline-secondary" type="button" aria-label="Clear search" (click)="filterForm.controls.query.setValue('')">✕</button>
            }
          </div>
        </div>
        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="role" aria-label="Filter by role">
            <option value="">All roles</option>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="status" aria-label="Filter by status">
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Locked">Locked</option>
          </select>
        </div>
        <div class="col-6 col-md-2">
          <button class="btn btn-link btn-sm p-0" type="button" (click)="showAdvanced.update(v => !v)">
            {{ showAdvanced() ? '▲ Less' : '▼ More filters' }}
          </button>
        </div>
        <div class="col-6 col-md-2">
          <button class="btn btn-outline-secondary btn-sm w-100" type="button" (click)="resetFilters()">Reset</button>
        </div>
      </div>
      @if (showAdvanced()) {
        <div class="row g-2">
          <div class="col-md-2">
            <label class="form-label small mb-1 text-body-secondary">Created from</label>
            <input class="form-control form-control-sm" type="date" formControlName="createdFrom" aria-label="Created from" />
          </div>
          <div class="col-md-2">
            <label class="form-label small mb-1 text-body-secondary">Created to</label>
            <input class="form-control form-control-sm" type="date" formControlName="createdTo" aria-label="Created to" />
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" formControlName="hasExtraPermissions" id="extraPermCheck" />
              <label class="form-check-label small" for="extraPermCheck">Has extra permissions</label>
            </div>
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <button class="btn btn-outline-primary btn-sm" type="button" (click)="saveCurrentFilter()">💾 Save filter</button>
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

    <!-- ── Active filter chips ──────────────────────────────────── -->
    @if (activeChips().length > 0) {
      <div class="d-flex flex-wrap gap-2 mb-3">
        @for (chip of activeChips(); track chip.key) {
          <span class="chip">{{ chip.label }}
            <button class="chip-close" type="button" (click)="clearChip(chip.key)" [attr.aria-label]="'Remove ' + chip.label">✕</button>
          </span>
        }
        <button class="btn btn-link btn-sm p-0" type="button" (click)="resetFilters()">Clear all</button>
      </div>
    }

    <!-- ── Bulk action bar ──────────────────────────────────────── -->
    @if (selectedIds().length > 0) {
      <div class="bulk-bar mb-3 d-flex flex-wrap align-items-center gap-3">
        <strong>{{ selectedIds().length }} selected</strong>
        <div class="d-flex flex-wrap gap-2 ms-auto">
          <button class="btn btn-sm btn-light" type="button" (click)="bulkActivate()">✅ Activate</button>
          <button class="btn btn-sm btn-light" type="button" (click)="bulkDeactivate()">⛔ Deactivate</button>
          <button class="btn btn-sm btn-danger" type="button" (click)="confirmBulkDelete()">🗑 Delete</button>
          <button class="btn btn-sm btn-outline-light" type="button" (click)="selectedIds.set([])">Deselect all</button>
        </div>
      </div>
    }

    <!-- ── Table ───────────────────────────────────────────────── -->
    @if (paged().length > 0 || !loading()) {
      <div class="surface table-responsive mb-3">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" style="width:2.5rem">
                <input class="form-check-input" type="checkbox" aria-label="Select all on page"
                  [checked]="allPageSelected()" [indeterminate]="somePageSelected()"
                  (change)="togglePageSelection()" />
              </th>
              <th scope="col"><button class="sort-btn" type="button" (click)="addSort('fullName')">Name {{ sortIcon('fullName') }}</button></th>
              <th scope="col"><button class="sort-btn" type="button" (click)="addSort('email')">Email {{ sortIcon('email') }}</button></th>
              <th scope="col"><button class="sort-btn" type="button" (click)="addSort('role')">Role {{ sortIcon('role') }}</button></th>
              <th scope="col"><button class="sort-btn" type="button" (click)="addSort('status')">Status {{ sortIcon('status') }}</button></th>
              <th scope="col"><button class="sort-btn" type="button" (click)="addSort('lastLoginAt')">Last Login {{ sortIcon('lastLoginAt') }}</button></th>
              <th scope="col" class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            @if (loading()) {
              @for (i of [1,2,3,4,5]; track i) {
                <tr aria-hidden="true">
                  <td><span class="placeholder col-12 rounded" style="height:1rem;display:block"></span></td>
                  <td><span class="placeholder col-10 rounded" style="height:1rem;display:block"></span></td>
                  <td><span class="placeholder col-8 rounded" style="height:1rem;display:block"></span></td>
                  <td><span class="placeholder col-6 rounded" style="height:1rem;display:block"></span></td>
                  <td><span class="placeholder col-6 rounded" style="height:1rem;display:block"></span></td>
                  <td><span class="placeholder col-6 rounded" style="height:1rem;display:block"></span></td>
                  <td></td>
                </tr>
              }
            } @else {
              @for (user of paged(); track user.id) {
                <tr [class.row-selected]="selectedIds().includes(user.id)">
                  <td>
                    <input class="form-check-input" type="checkbox"
                      [checked]="selectedIds().includes(user.id)"
                      [attr.aria-label]="'Select ' + user.fullName"
                      (change)="toggleRow(user.id)" />
                  </td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="avatar-circle" [style.background]="avatarColor(user.role)">
                        {{ user.fullName | initials }}
                      </div>
                      <div>
                        <div class="fw-semibold small">{{ user.fullName }}</div>
                        @if (user.forcePasswordReset) {
                          <span class="badge text-bg-warning" style="font-size:.6rem">Reset required</span>
                        }
                      </div>
                    </div>
                  </td>
                  <td class="small text-body-secondary">{{ user.email }}</td>
                  <td><span class="badge" [class]="roleClass(user.role)">{{ user.role }}</span></td>
                  <td><span class="badge" [class]="statusClass(user.status)">{{ user.status }}</span></td>
                  <td class="small text-body-secondary">{{ user.lastLoginAt | appDate:'mediumDate' }}</td>
                  <td class="text-end">
                    <div class="d-flex justify-content-end gap-1 flex-wrap">
                      <button class="btn btn-sm btn-outline-primary" type="button" (click)="openDetail(user)" [attr.aria-label]="'View ' + user.fullName">View</button>
                      <button class="btn btn-sm btn-outline-secondary" type="button" (click)="openEdit(user)" [attr.aria-label]="'Edit ' + user.fullName">Edit</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center py-5 text-body-secondary">
                    <div class="fs-2 mb-2">👤</div>
                    <strong>No users found</strong>
                    <p class="small mb-0">Try adjusting your filters</p>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- ── Pagination ─────────────────────────────────────────── -->
      @if (totalPages() > 1) {
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
      }
    }

    <!-- ── Detail Drawer ──────────────────────────────────────────── -->
    @if (detailUser()) {
      <div class="drawer-backdrop" (click)="closeDetail()" aria-hidden="true"></div>
      <aside class="drawer p-4" role="dialog" aria-modal="true" [attr.aria-label]="detailUser()!.fullName + ' details'">
        @let u = detailUser()!;
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h2 class="h5 mb-0">User Details</h2>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" type="button" (click)="openEdit(u)">Edit</button>
            <button class="btn btn-outline-secondary btn-sm" type="button" (click)="closeDetail()" aria-label="Close">✕</button>
          </div>
        </div>

        <!-- Avatar + identity -->
        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="avatar-circle" style="width:56px;height:56px;font-size:1.2rem" [style.background]="avatarColor(u.role)">
            {{ u.fullName | initials }}
          </div>
          <div>
            <h3 class="h5 mb-1">{{ u.fullName }}</h3>
            <p class="text-body-secondary small mb-1">{{ u.email }}</p>
            <div class="d-flex gap-2 flex-wrap">
              <span class="badge" [class]="roleClass(u.role)">{{ u.role }}</span>
              <span class="badge" [class]="statusClass(u.status)">{{ u.status }}</span>
              @if (u.forcePasswordReset) { <span class="badge text-bg-warning">Reset required</span> }
            </div>
          </div>
        </div>

        <!-- Details -->
        <dl class="row row-cols-2 g-2 small mb-4">
          <div class="col"><dt class="text-body-secondary">Phone</dt><dd class="mb-0">{{ u.phone || '—' }}</dd></div>
          <div class="col"><dt class="text-body-secondary">Department</dt><dd class="mb-0">{{ u.department || '—' }}</dd></div>
          <div class="col"><dt class="text-body-secondary">Last Login</dt><dd class="mb-0">{{ u.lastLoginAt | appDate:'medium' }}</dd></div>
          <div class="col"><dt class="text-body-secondary">Member Since</dt><dd class="mb-0">{{ u.createdAt | appDate:'mediumDate' }}</dd></div>
        </dl>

        <!-- Quick actions -->
        <h4 class="h6 fw-semibold mb-2">Quick Actions</h4>
        <div class="d-flex flex-wrap gap-2 mb-4">
          @if (u.status !== 'Active') {
            <button class="btn btn-outline-success btn-sm" type="button" (click)="activate(u.id)">✅ Activate</button>
          }
          @if (u.status === 'Active') {
            <button class="btn btn-outline-warning btn-sm" type="button" (click)="deactivate(u.id)">⛔ Deactivate</button>
          }
          @if (u.status !== 'Locked') {
            <button class="btn btn-outline-danger btn-sm" type="button" (click)="lock(u.id)">🔒 Lock</button>
          } @else {
            <button class="btn btn-outline-secondary btn-sm" type="button" (click)="unlock(u.id)">🔓 Unlock</button>
          }
          <button class="btn btn-outline-secondary btn-sm" type="button" (click)="forceReset(u.id)">🔑 Force Reset</button>
          <button class="btn btn-outline-danger btn-sm" type="button" (click)="confirmDeleteUser(u)">🗑 Delete</button>
        </div>

        <!-- Role permissions -->
        <h4 class="h6 fw-semibold mb-2">Role Permissions <span class="badge text-bg-secondary ms-1">{{ u.role }}</span></h4>
        <div class="d-flex flex-wrap gap-1 mb-4">
          @for (p of rolePermissions(u.role); track p) {
            <span class="badge text-bg-secondary perm-chip">{{ p }}</span>
          }
        </div>

        <!-- Extra permissions -->
        <h4 class="h6 fw-semibold mb-2">Extra Permissions</h4>
        @if ((u.extraPermissions?.length ?? 0) === 0) {
          <p class="text-body-secondary small mb-3">No extra permissions assigned.</p>
        } @else {
          <div class="d-flex flex-wrap gap-1 mb-3">
            @for (p of u.extraPermissions; track p) {
              <div class="d-flex align-items-center gap-1">
                <span class="badge text-bg-primary perm-chip">{{ p }}</span>
                <button class="btn btn-link btn-sm p-0 text-danger small" type="button"
                  (click)="removeExtraPermission(u.id, p)" [attr.aria-label]="'Remove ' + p">✕</button>
              </div>
            }
          </div>
        }
        <!-- Add extra permission -->
        <div class="d-flex gap-2 mb-4">
          <select class="form-select form-select-sm" [(ngModel)]="newPermissionDraft" [ngModelOptions]="{standalone: true}" aria-label="Select permission to add">
            <option value="">Add permission…</option>
            @for (p of availableExtraPermissions(u); track p) { <option [value]="p">{{ p }}</option> }
          </select>
          <button class="btn btn-outline-primary btn-sm" type="button" [disabled]="!newPermissionDraft" (click)="addExtraPermission(u.id)">Add</button>
        </div>

        <!-- Role change -->
        <h4 class="h6 fw-semibold mb-2">Change Role</h4>
        <div class="d-flex gap-2">
          <select class="form-select form-select-sm" [(ngModel)]="roleDraft" [ngModelOptions]="{standalone: true}" aria-label="Change role">
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
          </select>
          <button class="btn btn-outline-warning btn-sm" type="button" [disabled]="roleDraft === u.role" (click)="changeRole(u.id)">
            Change
          </button>
        </div>
      </aside>
    }

    <!-- ── Create / Edit Modal ───────────────────────────────────── -->
    @if (modalMode()) {
      <div class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,.4);z-index:1060">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ modalMode() === 'create' ? 'Create User' : 'Edit User' }}</h5>
              <button class="btn-close" type="button" (click)="closeModal()" aria-label="Close"></button>
            </div>
            <form [formGroup]="userForm" (ngSubmit)="submitUser()">
              <div class="modal-body">
                @if (formError()) {
                  <div class="alert alert-danger small py-2">{{ formError() }}</div>
                }
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small" for="fullName">Full Name *</label>
                    <input id="fullName" class="form-control form-control-sm" formControlName="fullName" placeholder="e.g. Jane Smith" />
                    @if (fc('fullName').touched && fc('fullName').errors?.['required']) {
                      <div class="text-danger small mt-1">Full name is required</div>
                    }
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small" for="email">Email *</label>
                    <input id="email" class="form-control form-control-sm" type="email" formControlName="email" placeholder="user@company.local" />
                    @if (fc('email').touched && fc('email').errors?.['required']) {
                      <div class="text-danger small mt-1">Email is required</div>
                    }
                    @if (fc('email').touched && fc('email').errors?.['email']) {
                      <div class="text-danger small mt-1">Enter a valid email</div>
                    }
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small" for="phone">Phone</label>
                    <input id="phone" class="form-control form-control-sm" formControlName="phone" placeholder="+91 98765 43210" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small" for="department">Department</label>
                    <input id="department" class="form-control form-control-sm" formControlName="department" placeholder="e.g. Engineering" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small" for="role">Role *</label>
                    <select id="role" class="form-select form-select-sm" formControlName="role">
                      <option value="Admin">Admin</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small" for="status">Status *</label>
                    <select id="status" class="form-select form-select-sm" formControlName="status">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Locked">Locked</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" formControlName="forcePasswordReset" id="fpr" />
                      <label class="form-check-label small" for="fpr">Require password reset on next login</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-outline-secondary btn-sm" type="button" (click)="closeModal()">Cancel</button>
                <button class="btn btn-primary btn-sm" type="submit" [disabled]="userForm.invalid || submitting()">
                  @if (submitting()) { <span class="spinner-border spinner-border-sm me-1"></span> }
                  {{ modalMode() === 'create' ? 'Create User' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }

    <!-- ── Delete confirmation ──────────────────────────────────── -->
    @if (confirmDeleteTarget()) {
      <div class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,.4);z-index:1065">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fs-6">Delete user?</h5>
              <button class="btn-close" type="button" (click)="confirmDeleteTarget.set(null)" aria-label="Close"></button>
            </div>
            <div class="modal-body small">
              Permanently delete <strong>{{ confirmDeleteTarget()?.fullName }}</strong>? This cannot be undone.
            </div>
            <div class="modal-footer py-2">
              <button class="btn btn-outline-secondary btn-sm" type="button" (click)="confirmDeleteTarget.set(null)">Cancel</button>
              <button class="btn btn-danger btn-sm" type="button" (click)="executeDelete()">Delete</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ── Save filter dialog ──────────────────────────────────── -->
    @if (showSaveDialog()) {
      <div class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,.4);z-index:1070">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header"><h5 class="modal-title fs-6">Save filter</h5>
              <button class="btn-close" type="button" (click)="showSaveDialog.set(false)" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <input #filterNameEl class="form-control" placeholder="Filter name…" [value]="filterNameDraft()" (input)="filterNameDraft.set(filterNameEl.value)" />
            </div>
            <div class="modal-footer py-2">
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
export class UsersComponent {
  readonly svc         = inject(UserService);
  readonly exportSvc   = inject(ExportService);
  readonly toast       = inject(ToastService);
  readonly permSvc     = inject(PermissionsService);
  private readonly fb  = inject(FormBuilder);

  // ── UI state ───────────────────────────────────────────────────────────────
  readonly loading            = signal(false);
  readonly page               = signal(1);
  readonly sortStack          = signal<UserSortEntry[]>([]);
  readonly showAdvanced       = signal(false);
  readonly selectedIds        = signal<string[]>([]);
  readonly detailUser         = signal<User | null>(null);
  readonly modalMode          = signal<ModalMode>(null);
  readonly editTarget         = signal<User | null>(null);
  readonly formError          = signal('');
  readonly submitting         = signal(false);
  readonly confirmDeleteTarget = signal<User | null>(null);
  readonly savedFilters       = signal<SavedUserFilter[]>([]);
  readonly showSaveDialog     = signal(false);
  readonly filterNameDraft    = signal('');

  // Drawer state
  newPermissionDraft = '';
  roleDraft: AppRole = 'Employee';

  // ── Filter form ────────────────────────────────────────────────────────────
  readonly filterForm = this.fb.nonNullable.group({
    query:               [''],
    role:                ['' as AppRole | ''],
    status:              ['' as UserStatus | ''],
    createdFrom:         [''],
    createdTo:           [''],
    hasExtraPermissions: [false]
  });

  private readonly filterValues = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue()), debounceTime(150)),
    { initialValue: this.filterForm.getRawValue() }
  );

  // ── User form ──────────────────────────────────────────────────────────────
  readonly userForm = this.fb.nonNullable.group({
    fullName:           ['', [Validators.required, Validators.minLength(2)]],
    email:              ['', [Validators.required, Validators.email]],
    phone:              [''],
    department:         [''],
    role:               ['Employee' as AppRole, Validators.required],
    status:             ['Active' as UserStatus, Validators.required],
    forcePasswordReset: [false]
  });

  fc = (name: string) => this.userForm.get(name)!;

  // ── Derived signals ────────────────────────────────────────────────────────
  readonly filteredUsers = computed(() => {
    const f = this.filterValues() as unknown as UserFilter;
    // map checkbox boolean properly
    const extra = (f as unknown as { hasExtraPermissions: boolean | '' }).hasExtraPermissions;
    return this.svc.filtered(
      { ...f, hasExtraPermissions: extra === '' || extra === false ? null : true },
      this.sortStack()
    );
  });

  readonly totalPages  = computed(() => Math.max(1, Math.ceil(this.filteredUsers().length / PAGE_SIZE)));
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1).slice(0, 7));
  readonly paged       = computed(() => this.filteredUsers().slice((this.page() - 1) * PAGE_SIZE, this.page() * PAGE_SIZE));
  readonly rangeStart  = computed(() => Math.min((this.page() - 1) * PAGE_SIZE + 1, this.filteredUsers().length));
  readonly rangeEnd    = computed(() => Math.min(this.page() * PAGE_SIZE, this.filteredUsers().length));

  readonly allPageSelected = computed(() => {
    const items = this.paged();
    return items.length > 0 && items.every((u) => this.selectedIds().includes(u.id));
  });
  readonly somePageSelected = computed(() => {
    const items = this.paged();
    const count = items.filter((u) => this.selectedIds().includes(u.id)).length;
    return count > 0 && count < items.length;
  });

  readonly activeChips = computed(() => {
    const f = this.filterValues() as unknown as UserFilter & { hasExtraPermissions: boolean };
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
    { icon: '👥', label: 'Total Users',    value: this.svc.totalCount(),  color: '#0f6cbd' },
    { icon: '✅', label: 'Active',         value: this.svc.activeCount(), color: '#198754' },
    { icon: '🔒', label: 'Locked',         value: this.svc.lockedCount(), color: '#dc3545' },
    { icon: '👑', label: 'Admins',         value: this.svc.adminCount(),  color: '#6f42c1' }
  ]);

  // ── Sort ───────────────────────────────────────────────────────────────────
  addSort(field: UserSortEntry['field']): void {
    this.sortStack.update((stack) => {
      const i = stack.findIndex((e) => e.field === field);
      if (i === -1) return [...stack, { field, direction: 'asc' }];
      return stack.map((e, idx) => idx === i ? { ...e, direction: e.direction === 'asc' ? 'desc' : 'asc' } : e);
    });
    this.page.set(1);
  }

  sortIcon(field: UserSortEntry['field']): string {
    const entry = this.sortStack().find((e) => e.field === field);
    if (!entry) return '';
    return entry.direction === 'asc' ? '↑' : '↓';
  }

  // ── Selection ──────────────────────────────────────────────────────────────
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

  // ── Filter helpers ─────────────────────────────────────────────────────────
  setPage(p: number): void { if (p >= 1 && p <= this.totalPages()) this.page.set(p); }

  resetFilters(): void {
    this.filterForm.reset({ query: '', role: '', status: '', createdFrom: '', createdTo: '', hasExtraPermissions: false });
    this.sortStack.set([]);
    this.page.set(1);
  }

  clearChip(key: string): void {
    if (key === 'hasExtraPermissions') this.filterForm.patchValue({ hasExtraPermissions: false });
    else this.filterForm.patchValue({ [key]: '' });
    this.page.set(1);
  }

  saveCurrentFilter(): void { this.filterNameDraft.set(''); this.showSaveDialog.set(true); }

  confirmSaveFilter(): void {
    const name = this.filterNameDraft().trim();
    if (!name) return;
    const f = this.filterForm.getRawValue();
    const saved: SavedUserFilter = { id: crypto.randomUUID(), name, filter: { ...f as Partial<UserFilter> }, createdAt: new Date().toISOString() };
    this.savedFilters.update((sf) => [...sf, saved]);
    this.showSaveDialog.set(false);
    this.toast.show({ title: 'Filter saved', message: `"${name}" saved`, type: 'success' });
  }

  applyFilter(sf: SavedUserFilter): void {
    const f = sf.filter;
    this.filterForm.patchValue({ query: f.query ?? '', role: f.role ?? '', status: f.status ?? '', createdFrom: f.createdFrom ?? '', createdTo: f.createdTo ?? '' });
    this.toast.show({ title: 'Filter applied', message: `Loaded "${sf.name}"`, type: 'info' });
  }

  removeSavedFilter(id: string): void { this.savedFilters.update((sf) => sf.filter((f) => f.id !== id)); }

  // ── Bulk ops ───────────────────────────────────────────────────────────────
  bulkActivate(): void {
    const ids = this.selectedIds();
    this.svc.bulkSetStatus(ids, 'Active').subscribe(() => {
      this.toast.show({ title: 'Activated', message: `${ids.length} user(s) activated`, type: 'success' });
      this.selectedIds.set([]);
    });
  }

  bulkDeactivate(): void {
    const ids = this.selectedIds();
    this.svc.bulkSetStatus(ids, 'Inactive').subscribe(() => {
      this.toast.show({ title: 'Deactivated', message: `${ids.length} user(s) deactivated`, type: 'info' });
      this.selectedIds.set([]);
    });
  }

  confirmBulkDelete(): void {
    const ids = this.selectedIds();
    this.svc.bulkDelete(ids).subscribe(() => {
      this.toast.show({ title: 'Deleted', message: `${ids.length} user(s) deleted`, type: 'success' });
      this.selectedIds.set([]);
      this.page.set(1);
    });
  }

  // ── Per-user quick actions ─────────────────────────────────────────────────
  activate(id: string): void {
    this.svc.setStatus(id, 'Active').subscribe((u) => {
      this.detailUser.set(u);
      this.toast.show({ title: 'Activated', message: `${u.fullName} is now active`, type: 'success' });
    });
  }

  deactivate(id: string): void {
    this.svc.setStatus(id, 'Inactive').subscribe((u) => {
      this.detailUser.set(u);
      this.toast.show({ title: 'Deactivated', message: `${u.fullName} is now inactive`, type: 'info' });
    });
  }

  lock(id: string): void {
    this.svc.lock(id).subscribe((u) => {
      this.detailUser.set(u);
      this.toast.show({ title: 'Locked', message: `${u.fullName}'s account is locked`, type: 'warning' });
    });
  }

  unlock(id: string): void {
    this.svc.unlock(id).subscribe((u) => {
      this.detailUser.set(u);
      this.toast.show({ title: 'Unlocked', message: `${u.fullName}'s account is unlocked`, type: 'success' });
    });
  }

  forceReset(id: string): void {
    this.svc.forcePasswordReset(id).subscribe((u) => {
      this.detailUser.set(u);
      this.toast.show({ title: 'Reset required', message: `${u.fullName} will be prompted to reset on next login`, type: 'info' });
    });
  }

  confirmDeleteUser(u: User): void { this.confirmDeleteTarget.set(u); }

  executeDelete(): void {
    const u = this.confirmDeleteTarget();
    if (!u) return;
    this.svc.delete(u.id).subscribe(() => {
      this.toast.show({ title: 'Deleted', message: `${u.fullName} removed`, type: 'success' });
      this.confirmDeleteTarget.set(null);
      this.detailUser.set(null);
    });
  }

  addExtraPermission(id: string): void {
    if (!this.newPermissionDraft) return;
    this.svc.addPermission(id, this.newPermissionDraft).subscribe((u) => {
      this.detailUser.set(u);
      this.toast.show({ title: 'Permission added', message: this.newPermissionDraft, type: 'success' });
      this.newPermissionDraft = '';
    });
  }

  removeExtraPermission(id: string, perm: string): void {
    this.svc.removePermission(id, perm).subscribe((u) => {
      this.detailUser.set(u);
      this.toast.show({ title: 'Permission removed', message: perm, type: 'info' });
    });
  }

  changeRole(id: string): void {
    this.svc.assignRole(id, this.roleDraft).subscribe((u) => {
      this.detailUser.set(u);
      this.toast.show({ title: 'Role changed', message: `${u.fullName} is now ${u.role}`, type: 'success' });
    });
  }

  // ── Detail drawer ──────────────────────────────────────────────────────────
  openDetail(u: User): void {
    this.detailUser.set(u);
    this.roleDraft = u.role;
    this.newPermissionDraft = '';
  }

  closeDetail(): void { this.detailUser.set(null); }

  // ── Create / Edit modal ────────────────────────────────────────────────────
  openCreate(): void {
    this.editTarget.set(null);
    this.modalMode.set('create');
    this.formError.set('');
    this.userForm.reset({ fullName: '', email: '', phone: '', department: '', role: 'Employee', status: 'Active', forcePasswordReset: false });
  }

  openEdit(u: User): void {
    this.detailUser.set(null);
    this.editTarget.set(u);
    this.modalMode.set('edit');
    this.formError.set('');
    this.userForm.patchValue({
      fullName: u.fullName, email: u.email, phone: u.phone ?? '',
      department: u.department ?? '', role: u.role, status: u.status,
      forcePasswordReset: u.forcePasswordReset ?? false
    });
  }

  closeModal(): void { this.modalMode.set(null); this.editTarget.set(null); }

  submitUser(): void {
    if (this.userForm.invalid) { this.userForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.formError.set('');
    const val = this.userForm.getRawValue();

    const obs = this.modalMode() === 'create'
      ? this.svc.create({ ...val, extraPermissions: [], forcePasswordReset: val.forcePasswordReset ?? false })
      : this.svc.update(this.editTarget()!.id, val);

    obs.subscribe({
      next: (u) => {
        this.submitting.set(false);
        this.closeModal();
        this.toast.show({
          title: this.modalMode() === 'create' ? 'User created' : 'User updated',
          message: u.fullName, type: 'success'
        });
      },
      error: (err: Error) => {
        this.submitting.set(false);
        this.formError.set(err.message);
      }
    });
  }

  // ── Export ──────────────────────────────────────────────────────────────────
  exportCsv(): void {
    const rows = this.filteredUsers().map((u) => ({
      id: u.id, fullName: u.fullName, email: u.email, role: u.role,
      status: u.status, department: u.department ?? '', phone: u.phone ?? '',
      lastLogin: u.lastLoginAt ?? '', createdAt: u.createdAt ?? ''
    }));
    this.exportSvc.downloadCsv(rows, 'users');
    this.toast.show({ title: 'Exported', message: `${rows.length} users exported as CSV`, type: 'success' });
  }

  exportExcel(): void {
    const rows = this.filteredUsers().map((u) => ({
      id: u.id, fullName: u.fullName, email: u.email, role: u.role,
      status: u.status, department: u.department ?? '', phone: u.phone ?? '',
      lastLogin: u.lastLoginAt ?? '', createdAt: u.createdAt ?? ''
    }));
    this.exportSvc.downloadExcel(rows, 'users');
    this.toast.show({ title: 'Exported', message: `${rows.length} users exported as Excel`, type: 'success' });
  }

  // ── Permissions helpers ─────────────────────────────────────────────────────
  rolePermissions(role: AppRole): string[] {
    return ROLE_PERMISSIONS[role] ?? [];
  }

  availableExtraPermissions(u: User): string[] {
    const role = u.role;
    const existing = new Set([...(ROLE_PERMISSIONS[role] ?? []), ...(u.extraPermissions ?? [])]);
    return this.permSvc.allPermissions().filter((p) => !existing.has(p));
  }

  // ── Presentation helpers ────────────────────────────────────────────────────
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
