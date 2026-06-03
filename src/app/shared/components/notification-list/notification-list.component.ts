import {
  ChangeDetectionStrategy, Component, computed, inject, signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NotificationService } from '@core/services/notification.service';
import {
  AppNotification, NotificationCategory, NotificationFilter, NotificationPriority
} from '@core/models/notification.models';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';

const PAGE_SIZE = 8;

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AppDatePipe],
  styles: [`
    .notif-card {
      transition: background 0.15s ease, border-color 0.15s ease;
      border-left: 4px solid transparent;
    }
    .notif-card.unread {
      border-left-color: var(--bs-primary);
      background: var(--bs-primary-bg-subtle);
    }
    .notif-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    .priority-badge { font-size: .65rem; letter-spacing:.03em; }
    .notif-icon { font-size: 1.4rem; width: 2.5rem; text-align: center; flex-shrink: 0; }
  `],
  template: `
    <!-- ── Header ─────────────────────────────────────────────── -->
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h1 class="h3 mb-1">Notification Center</h1>
        <p class="text-body-secondary small mb-0">
          {{ svc.unreadCount() }} unread · {{ svc.all().length }} total
        </p>
      </div>
      @if (svc.unreadCount() > 0) {
        <button class="btn btn-outline-primary btn-sm" type="button" (click)="markAllRead()">
          ✓ Mark all as read
        </button>
      }
    </div>

    <!-- ── Filters ─────────────────────────────────────────────── -->
    <form [formGroup]="filterForm" class="surface p-3 mb-3" aria-label="Notification filters">
      <div class="row g-2">
        <div class="col-12 col-md-4">
          <div class="input-group input-group-sm">
            <span class="input-group-text">🔍</span>
            <input class="form-control" placeholder="Search notifications…" formControlName="query"
              aria-label="Search notifications" />
            @if (filterForm.controls.query.value) {
              <button class="btn btn-outline-secondary" type="button"
                aria-label="Clear search" (click)="filterForm.controls.query.setValue('')">✕</button>
            }
          </div>
        </div>
        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="category" aria-label="Filter by category">
            <option value="">All categories</option>
            @for (c of categories; track c) { <option [value]="c">{{ c }}</option> }
          </select>
        </div>
        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="priority" aria-label="Filter by priority">
            <option value="">All priorities</option>
            @for (p of priorities; track p) { <option [value]="p">{{ p }}</option> }
          </select>
        </div>
        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="status" aria-label="Filter by status">
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
        <div class="col-6 col-md-2">
          <button class="btn btn-outline-secondary btn-sm w-100" type="button" (click)="resetFilters()">Reset</button>
        </div>
      </div>
    </form>

    <!-- ── Active filter chips ──────────────────────────────────── -->
    @if (activeChips().length > 0) {
      <div class="d-flex flex-wrap gap-2 mb-3">
        @for (chip of activeChips(); track chip.key) {
          <span class="badge text-bg-primary d-flex align-items-center gap-1">
            {{ chip.label }}
            <button style="background:none;border:none;padding:0;color:inherit;font-size:.7rem;line-height:1;cursor:pointer"
              type="button" (click)="clearChip(chip.key)" [attr.aria-label]="'Remove ' + chip.label">✕</button>
          </span>
        }
      </div>
    }

    <!-- ── Result count ─────────────────────────────────────────── -->
    <p class="text-body-secondary small mb-3">
      Showing {{ pagedItems().length }} of {{ filtered().length }} notification{{ filtered().length !== 1 ? 's' : '' }}
    </p>

    <!-- ── Notification list ─────────────────────────────────────── -->
    @if (loading()) {
      <!-- Skeleton -->
      <div class="d-flex flex-column gap-3">
        @for (i of [1,2,3,4]; track i) {
          <div class="surface p-3 placeholder-glow" aria-hidden="true">
            <div class="d-flex gap-3">
              <span class="placeholder rounded-circle" style="width:40px;height:40px;flex-shrink:0"></span>
              <div class="flex-grow-1">
                <span class="placeholder col-5 d-block mb-2 rounded"></span>
                <span class="placeholder col-8 d-block rounded" style="height:.75rem"></span>
              </div>
            </div>
          </div>
        }
      </div>

    } @else if (filtered().length === 0) {
      <!-- Empty state -->
      <div class="surface p-5 text-center text-body-secondary">
        <div class="fs-1 mb-3">🔔</div>
        <h2 class="h5">No notifications found</h2>
        <p class="small mb-3">Try adjusting your filters or search terms.</p>
        <button class="btn btn-outline-primary btn-sm" type="button" (click)="resetFilters()">Clear filters</button>
      </div>

    } @else {
      <div class="d-flex flex-column gap-2 mb-3">
        @for (n of pagedItems(); track n.id) {
          <article class="surface p-3 notif-card rounded" [class.unread]="!n.read"
            [attr.aria-label]="(!n.read ? 'Unread: ' : '') + n.title">
            <div class="d-flex gap-3">
              <!-- Icon -->
              <div class="notif-icon">{{ typeIcon(n.type) }}</div>

              <!-- Body -->
              <div class="flex-grow-1 min-w-0">
                <div class="d-flex align-items-start justify-content-between gap-2 flex-wrap mb-1">
                  <div class="d-flex align-items-center gap-2 flex-wrap">
                    <h2 class="h6 mb-0" [class.fw-bold]="!n.read" [class.text-body-secondary]="n.read">
                      {{ n.title }}
                    </h2>
                    <span class="badge priority-badge" [class]="priorityClass(n.priority)">{{ n.priority }}</span>
                    <span class="badge" [class]="categoryClass(n.category)">{{ n.category }}</span>
                    @if (!n.read) {
                      <span class="badge text-bg-primary">New</span>
                    }
                  </div>
                  <span class="text-body-secondary small text-nowrap flex-shrink-0">
                    {{ n.createdAt | appDate:'medium' }}
                  </span>
                </div>
                <p class="mb-2 small text-body-secondary">{{ n.message }}</p>
                <!-- Actions -->
                <div class="d-flex flex-wrap gap-2">
                  @if (!n.read) {
                    <button class="btn btn-link btn-sm p-0 small" type="button" (click)="markRead(n.id)">
                      ✓ Mark as read
                    </button>
                  }
                  @if (n.link) {
                    <a class="btn btn-link btn-sm p-0 small" [routerLink]="n.link">
                      View details →
                    </a>
                  }
                  <button class="btn btn-link btn-sm p-0 small text-danger" type="button" (click)="confirmDelete(n.id)">
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          </article>
        }
      </div>

      <!-- ── Pagination ───────────────────────────────────────── -->
      @if (totalPages() > 1) {
        <nav class="d-flex justify-content-between align-items-center flex-wrap gap-2" aria-label="Notifications pagination">
          <small class="text-body-secondary">
            Page {{ page() }} of {{ totalPages() }}
          </small>
          <ul class="pagination mb-0">
            <li class="page-item" [class.disabled]="page() === 1">
              <button class="page-link" type="button" (click)="setPage(page() - 1)" aria-label="Previous">Previous</button>
            </li>
            @for (p of pageNumbers(); track p) {
              <li class="page-item" [class.active]="p === page()">
                <button class="page-link" type="button" [attr.aria-label]="'Go to page ' + p" (click)="setPage(p)">{{ p }}</button>
              </li>
            }
            <li class="page-item" [class.disabled]="page() === totalPages()">
              <button class="page-link" type="button" (click)="setPage(page() + 1)" aria-label="Next">Next</button>
            </li>
          </ul>
        </nav>
      }
    }

    <!-- ── Delete confirmation (inline) ─────────────────────────── -->
    @if (pendingDeleteId()) {
      <div class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,.4);z-index:1055">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fs-6">Delete notification?</h5>
              <button class="btn-close" type="button" (click)="pendingDeleteId.set(null)" aria-label="Close"></button>
            </div>
            <div class="modal-body small">This notification will be permanently removed.</div>
            <div class="modal-footer py-2">
              <button class="btn btn-outline-secondary btn-sm" type="button" (click)="pendingDeleteId.set(null)">Cancel</button>
              <button class="btn btn-danger btn-sm" type="button" (click)="executeDelete()">Delete</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationListComponent {
  readonly svc = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly categories: NotificationCategory[] = ['System', 'Security', 'Employee', 'Attendance', 'Tasks'];
  readonly priorities: NotificationPriority[]  = ['Critical', 'High', 'Medium', 'Low'];

  readonly loading = signal(false);
  readonly page    = signal(1);
  readonly pendingDeleteId = signal<string | null>(null);

  readonly filterForm = this.fb.nonNullable.group({
    query:    [''],
    category: ['' as NotificationCategory | ''],
    priority: ['' as NotificationPriority | ''],
    status:   ['all' as 'all' | 'read' | 'unread']
  });

  /** Convert form value changes into a signal. */
  private readonly filterValues = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue()), debounceTime(150)),
    { initialValue: this.filterForm.getRawValue() }
  );

  readonly filtered = computed(() => {
    const f = this.filterValues() as NotificationFilter;
    return this.svc.filtered(f)
      .sort((a, b) =>
        NotificationService.priorityOrder(b.priority) - NotificationService.priorityOrder(a.priority) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  });

  readonly totalPages  = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1).slice(0, 7));
  readonly pagedItems  = computed(() => {
    const p = this.page();
    return this.filtered().slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
  });

  readonly activeChips = computed(() => {
    const f = this.filterValues() as NotificationFilter;
    const chips: { key: string; label: string }[] = [];
    if (f.query)    chips.push({ key: 'query',    label: `"${f.query}"` });
    if (f.category) chips.push({ key: 'category', label: f.category });
    if (f.priority) chips.push({ key: 'priority', label: f.priority });
    if (f.status !== 'all') chips.push({ key: 'status', label: f.status });
    return chips;
  });

  // ── Actions ──────────────────────────────────────────────────────────────────
  markRead(id: string): void { this.svc.markRead(id); }
  markAllRead(): void       { this.svc.markAllRead(); }

  confirmDelete(id: string): void { this.pendingDeleteId.set(id); }
  executeDelete(): void {
    const id = this.pendingDeleteId();
    if (id) { this.svc.delete(id); this.pendingDeleteId.set(null); }
  }

  setPage(p: number): void {
    if (p >= 1 && p <= this.totalPages()) this.page.set(p);
  }

  resetFilters(): void {
    this.filterForm.patchValue({ query: '', category: '', priority: '', status: 'all' });
    this.page.set(1);
  }

  clearChip(key: string): void {
    this.filterForm.patchValue({ [key]: key === 'status' ? 'all' : '' });
    this.page.set(1);
  }

  // ── Presentation helpers ──────────────────────────────────────────────────────
  typeIcon(type: AppNotification['type']): string {
    return { Info: 'ℹ️', Success: '✅', Warning: '⚠️', Error: '🚨' }[type] ?? '🔔';
  }

  priorityClass(priority: AppNotification['priority']): string {
    return {
      Critical: 'text-bg-danger',
      High:     'text-bg-warning text-dark',
      Medium:   'text-bg-info text-dark',
      Low:      'text-bg-secondary'
    }[priority] ?? 'text-bg-secondary';
  }

  categoryClass(category: AppNotification['category']): string {
    return {
      System:     'text-bg-secondary',
      Security:   'text-bg-danger',
      Employee:   'text-bg-primary',
      Attendance: 'text-bg-warning text-dark',
      Tasks:      'text-bg-info text-dark'
    }[category] ?? 'text-bg-secondary';
  }
}
