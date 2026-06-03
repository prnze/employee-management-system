import {
  ChangeDetectionStrategy, Component, computed, inject, signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, startWith } from 'rxjs';
import { AuditService } from '@core/services/audit.service';
import { ExportService } from '@core/services/export.service';
import { ToastService } from '@core/services/toast.service';
import { AuditFilter, AuditLog, AuditSeverity } from '@core/models/notification.models';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';

const PAGE_SIZE = 15;

type ViewMode = 'table' | 'timeline';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [ReactiveFormsModule, AppDatePipe],
  styles: [`
    .timeline-line { position: absolute; top: 0; bottom: 0; left: .45rem; width: 2px; background: var(--app-border); }
    .timeline-dot  { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; margin-top: .25rem; }
    .timeline-item { position: relative; padding-left: 1.75rem; padding-bottom: 1.25rem; }
    .chip { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem;
            border-radius: 2rem; background: var(--bs-primary-bg-subtle);
            color: var(--bs-primary); border: 1px solid var(--bs-primary-border-subtle); font-size: .8rem; }
    .chip-close { background: none; border: none; padding: 0; line-height: 1; cursor: pointer; color: inherit; }
    .drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 1055; }
    .drawer { position: fixed; top: 0; right: 0; bottom: 0; width: min(480px, 100vw);
              background: var(--bs-body-bg); z-index: 1056; overflow-y: auto;
              box-shadow: -4px 0 24px rgba(0,0,0,.15);
              transition: transform .25s ease; }
    .sev-badge { font-size: .65rem; letter-spacing: .04em; }
  `],
  template: `
    <!-- ── Header ────────────────────────────────────────────────── -->
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h1 class="h3 mb-1">Audit Logs</h1>
        <p class="text-body-secondary small mb-0">
          {{ filtered().length }} of {{ svc.totalCount() }} entries
        </p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <!-- View toggle -->
        <div class="btn-group btn-group-sm" role="group" aria-label="View mode">
          <button type="button" class="btn" [class.btn-primary]="view() === 'table'" [class.btn-outline-secondary]="view() !== 'table'" (click)="view.set('table')">📋 Table</button>
          <button type="button" class="btn" [class.btn-primary]="view() === 'timeline'" [class.btn-outline-secondary]="view() !== 'timeline'" (click)="view.set('timeline')">⏱ Timeline</button>
        </div>
        <!-- Export -->
        <div class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-label="Export">Export</button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" type="button" (click)="exportCsv()">📄 CSV</button></li>
            <li><button class="dropdown-item" type="button" (click)="exportExcel()">📊 Excel</button></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ── Filters ─────────────────────────────────────────────── -->
    <form [formGroup]="filterForm" class="surface p-3 mb-3" aria-label="Audit log filters">
      <div class="row g-2 mb-2">
        <!-- Global search -->
        <div class="col-12 col-md-4">
          <div class="input-group input-group-sm">
            <span class="input-group-text">🔍</span>
            <input class="form-control" placeholder="Search actor, action, entity…" formControlName="query" aria-label="Search" />
            @if (filterForm.controls.query.value) {
              <button class="btn btn-outline-secondary" type="button" aria-label="Clear" (click)="filterForm.controls.query.setValue('')">✕</button>
            }
          </div>
        </div>
        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="actor" aria-label="Filter by actor">
            <option value="">All actors</option>
            @for (a of svc.actors(); track a) { <option [value]="a">{{ a }}</option> }
          </select>
        </div>
        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="action" aria-label="Filter by action">
            <option value="">All actions</option>
            @for (a of svc.actions(); track a) { <option [value]="a">{{ a }}</option> }
          </select>
        </div>
        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="severity" aria-label="Filter by severity">
            <option value="">All severities</option>
            @for (s of severities; track s) { <option [value]="s">{{ s }}</option> }
          </select>
        </div>
        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="category" aria-label="Filter by category">
            <option value="">All categories</option>
            @for (c of categories; track c) { <option [value]="c">{{ c }}</option> }
          </select>
        </div>
      </div>
      <div class="row g-2">
        <div class="col-6 col-md-2">
          <label class="form-label small mb-1 text-body-secondary">From</label>
          <input class="form-control form-control-sm" type="date" formControlName="dateFrom" aria-label="From date" />
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label small mb-1 text-body-secondary">To</label>
          <input class="form-control form-control-sm" type="date" formControlName="dateTo" aria-label="To date" />
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button class="btn btn-outline-secondary btn-sm w-100" type="button" (click)="resetFilters()">Reset</button>
        </div>
      </div>
    </form>

    <!-- ── Active filter chips ────────────────────────────────────── -->
    @if (activeChips().length > 0) {
      <div class="d-flex flex-wrap gap-2 mb-3">
        @for (chip of activeChips(); track chip.key) {
          <span class="chip">
            {{ chip.label }}
            <button class="chip-close" type="button" (click)="clearChip(chip.key)" [attr.aria-label]="'Remove ' + chip.label">✕</button>
          </span>
        }
        <button class="btn btn-link btn-sm p-0" type="button" (click)="resetFilters()">Clear all</button>
      </div>
    }

    <!-- ── Content ─────────────────────────────────────────────── -->
    @if (filtered().length === 0) {
      <!-- Empty state -->
      <div class="surface p-5 text-center text-body-secondary">
        <div class="fs-1 mb-3">🔍</div>
        <h2 class="h5">No audit logs found</h2>
        <p class="small mb-3">Try adjusting your search or filters.</p>
        <button class="btn btn-outline-primary btn-sm" type="button" (click)="resetFilters()">Clear filters</button>
      </div>

    } @else if (view() === 'table') {
      <!-- ── Table view ──────────────────────────────────────────── -->
      <div class="surface table-responsive mb-3">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">Severity</th>
              <th scope="col">Actor</th>
              <th scope="col">Action</th>
              <th scope="col">Entity</th>
              <th scope="col">Category</th>
              <th scope="col">Time</th>
              <th scope="col">IP</th>
              <th scope="col" class="text-end">Detail</th>
            </tr>
          </thead>
          <tbody>
            @for (log of pagedItems(); track log.id) {
              <tr style="cursor:pointer" (click)="openDrawer(log)">
                <td><span class="badge sev-badge" [class]="severityClass(log.severity)">{{ log.severity }}</span></td>
                <td class="small fw-semibold">{{ log.actor }}</td>
                <td><code class="small">{{ log.action }}</code></td>
                <td class="small text-body-secondary">{{ log.entity }}</td>
                <td><span class="badge text-bg-secondary small">{{ log.category }}</span></td>
                <td class="small text-body-secondary text-nowrap">{{ log.createdAt | appDate:'medium' }}</td>
                <td class="small text-body-secondary">{{ log.ipAddress }}</td>
                <td class="text-end"><button class="btn btn-sm btn-outline-primary" type="button" (click)="openDrawer(log); $event.stopPropagation()">→</button></td>
              </tr>
            } @empty {
              <tr><td colspan="8" class="text-center py-5 text-body-secondary">No entries on this page.</td></tr>
            }
          </tbody>
        </table>
      </div>

    } @else {
      <!-- ── Timeline view ───────────────────────────────────────── -->
      <div class="surface p-3 mb-3">
        <div class="position-relative" style="padding-left: 1.75rem">
          <div class="timeline-line"></div>
          @for (log of pagedItems(); track log.id) {
            <div class="timeline-item d-flex gap-3" style="cursor:pointer" (click)="openDrawer(log)">
              <span class="timeline-dot" [style.background]="severityColor(log.severity)"></span>
              <div class="flex-grow-1 min-w-0 surface p-3 rounded mb-3">
                <div class="d-flex align-items-start justify-content-between flex-wrap gap-1 mb-1">
                  <div class="d-flex align-items-center gap-2 flex-wrap">
                    <span class="badge sev-badge" [class]="severityClass(log.severity)">{{ log.severity }}</span>
                    <span class="badge text-bg-secondary small">{{ log.category }}</span>
                    <code class="small">{{ log.action }}</code>
                  </div>
                  <span class="text-body-secondary small text-nowrap">{{ log.createdAt | appDate:'medium' }}</span>
                </div>
                <p class="mb-1 small fw-semibold">{{ log.actor }} · <span class="text-body-secondary fw-normal">{{ log.entity }}</span></p>
                @if (log.details) {
                  <p class="mb-0 small text-body-secondary">{{ log.details }}</p>
                }
              </div>
            </div>
          }
        </div>
      </div>
    }

    <!-- ── Pagination ─────────────────────────────────────────────── -->
    @if (totalPages() > 1) {
      <nav class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4" aria-label="Audit log pagination">
        <small class="text-body-secondary">
          Showing {{ rangeStart() }}–{{ rangeEnd() }} of {{ filtered().length }}
        </small>
        <ul class="pagination mb-0">
          <li class="page-item" [class.disabled]="page() === 1">
            <button class="page-link" type="button" (click)="setPage(page() - 1)" aria-label="Previous">Previous</button>
          </li>
          @for (p of pageNumbers(); track p) {
            <li class="page-item" [class.active]="p === page()">
              <button class="page-link" type="button" [attr.aria-label]="'Page ' + p" (click)="setPage(p)">{{ p }}</button>
            </li>
          }
          <li class="page-item" [class.disabled]="page() === totalPages()">
            <button class="page-link" type="button" (click)="setPage(page() + 1)" aria-label="Next">Next</button>
          </li>
        </ul>
      </nav>
    }

    <!-- ── Detail Drawer ──────────────────────────────────────────── -->
    @if (selectedLog()) {
      <div class="drawer-backdrop" (click)="closeDrawer()" aria-hidden="true"></div>
      <aside class="drawer p-4" role="dialog" aria-modal="true" [attr.aria-label]="'Audit log detail: ' + selectedLog()!.action">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h2 class="h5 mb-0">Log Detail</h2>
          <button class="btn btn-outline-secondary btn-sm" type="button" (click)="closeDrawer()" aria-label="Close">✕</button>
        </div>

        @let log = selectedLog()!;

        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="badge fs-6" [class]="severityClass(log.severity)">{{ log.severity }}</span>
          <span class="badge text-bg-secondary fs-6">{{ log.category }}</span>
        </div>

        <dl class="row row-cols-1 g-2 small">
          <div class="col">
            <dt class="text-body-secondary">Action</dt>
            <dd class="mb-0"><code>{{ log.action }}</code></dd>
          </div>
          <div class="col">
            <dt class="text-body-secondary">Actor</dt>
            <dd class="mb-0 fw-semibold">{{ log.actor }}</dd>
          </div>
          <div class="col">
            <dt class="text-body-secondary">Entity</dt>
            <dd class="mb-0">{{ log.entity }}</dd>
          </div>
          <div class="col">
            <dt class="text-body-secondary">Timestamp</dt>
            <dd class="mb-0">{{ log.createdAt | appDate:'full' }}</dd>
          </div>
          <div class="col">
            <dt class="text-body-secondary">IP Address</dt>
            <dd class="mb-0"><code>{{ log.ipAddress }}</code></dd>
          </div>
          @if (log.sessionId) {
            <div class="col">
              <dt class="text-body-secondary">Session ID</dt>
              <dd class="mb-0"><code class="text-body-secondary">{{ log.sessionId }}</code></dd>
            </div>
          }
          @if (log.details) {
            <div class="col">
              <dt class="text-body-secondary">Details</dt>
              <dd class="mb-0 text-body-secondary">{{ log.details }}</dd>
            </div>
          }
          <div class="col">
            <dt class="text-body-secondary">Log ID</dt>
            <dd class="mb-0"><code class="text-body-secondary small">{{ log.id }}</code></dd>
          </div>
        </dl>
      </aside>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditLogsComponent {
  readonly svc     = inject(AuditService);
  readonly exportSvc = inject(ExportService);
  readonly toast   = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly severities: AuditSeverity[] = ['Critical', 'Error', 'Warning', 'Info'];
  readonly categories: AuditLog['category'][] = ['Auth', 'Employee', 'Permissions', 'Export', 'System'];

  readonly view        = signal<ViewMode>('table');
  readonly page        = signal(1);
  readonly selectedLog = signal<AuditLog | null>(null);

  readonly filterForm = this.fb.nonNullable.group({
    query:    [''],
    actor:    [''],
    action:   [''],
    severity: ['' as AuditSeverity | ''],
    category: ['' as AuditLog['category'] | ''],
    dateFrom: [''],
    dateTo:   ['']
  });

  private readonly filterValues = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue()), debounceTime(180)),
    { initialValue: this.filterForm.getRawValue() }
  );

  readonly filtered = computed(() => this.svc.filtered(this.filterValues() as AuditFilter));
  readonly totalPages  = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1).slice(0, 7));
  readonly pagedItems  = computed(() => {
    const p = this.page();
    return this.filtered().slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
  });
  readonly rangeStart  = computed(() => Math.min((this.page() - 1) * PAGE_SIZE + 1, this.filtered().length));
  readonly rangeEnd    = computed(() => Math.min(this.page() * PAGE_SIZE, this.filtered().length));

  readonly activeChips = computed(() => {
    const f = this.filterValues() as AuditFilter;
    const chips: { key: string; label: string }[] = [];
    if (f.query)    chips.push({ key: 'query',    label: `"${f.query}"` });
    if (f.actor)    chips.push({ key: 'actor',    label: `Actor: ${f.actor}` });
    if (f.action)   chips.push({ key: 'action',   label: `Action: ${f.action}` });
    if (f.severity) chips.push({ key: 'severity', label: f.severity });
    if (f.category) chips.push({ key: 'category', label: f.category });
    if (f.dateFrom) chips.push({ key: 'dateFrom', label: `From: ${f.dateFrom}` });
    if (f.dateTo)   chips.push({ key: 'dateTo',   label: `To: ${f.dateTo}` });
    return chips;
  });

  // ── Actions ────────────────────────────────────────────────────────────────
  resetFilters(): void {
    this.filterForm.reset({ query: '', actor: '', action: '', severity: '', category: '', dateFrom: '', dateTo: '' });
    this.page.set(1);
  }

  clearChip(key: string): void {
    this.filterForm.patchValue({ [key]: '' });
    this.page.set(1);
  }

  setPage(p: number): void {
    if (p >= 1 && p <= this.totalPages()) { this.page.set(p); }
  }

  openDrawer(log: AuditLog): void  { this.selectedLog.set(log); }
  closeDrawer(): void              { this.selectedLog.set(null); }

  exportCsv(): void {
    const rows = this.filtered().map((l) => ({
      id: l.id, timestamp: l.createdAt, actor: l.actor, action: l.action,
      entity: l.entity, severity: l.severity, category: l.category,
      ip: l.ipAddress, details: l.details ?? ''
    }));
    this.exportSvc.downloadCsv(rows, 'audit-logs');
    this.svc.record('System', 'EXPORT', 'Audit logs', { category: 'Export', details: `Exported ${rows.length} audit log rows as CSV` });
    this.toast.show({ title: 'Exported', message: `${rows.length} audit entries exported as CSV`, type: 'success' });
  }

  exportExcel(): void {
    const rows = this.filtered().map((l) => ({
      id: l.id, timestamp: l.createdAt, actor: l.actor, action: l.action,
      entity: l.entity, severity: l.severity, category: l.category,
      ip: l.ipAddress, details: l.details ?? ''
    }));
    this.exportSvc.downloadExcel(rows, 'audit-logs');
    this.svc.record('System', 'EXPORT', 'Audit logs', { category: 'Export', details: `Exported ${rows.length} audit log rows as Excel` });
    this.toast.show({ title: 'Exported', message: `${rows.length} audit entries exported as Excel`, type: 'success' });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  severityClass(sev: AuditSeverity): string {
    return { Critical: 'text-bg-danger', Error: 'text-bg-warning text-dark', Warning: 'text-bg-info text-dark', Info: 'text-bg-secondary' }[sev] ?? 'text-bg-secondary';
  }

  severityColor(sev: AuditSeverity): string {
    return { Critical: '#dc3545', Error: '#fd7e14', Warning: '#0dcaf0', Info: '#6c757d' }[sev] ?? '#6c757d';
  }
}
