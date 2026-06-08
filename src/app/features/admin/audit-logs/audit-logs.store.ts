import { Injectable, computed, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith, debounceTime } from 'rxjs/operators';
import { AuditLog, AuditFilter, AuditSeverity } from '@core/models/notification.models';
import { AuditService } from '@core/services/audit.service';
import { ExportService } from '@core/services/export.service';
import { ToastService } from '@core/services/toast.service';
import { DialogService } from '@core/services/dialog.service';
import { APP_ICONS } from '@core/constants/icon.constants';

const PAGE_SIZE = 15;

@Injectable({
  providedIn: 'root'
})
export class AuditLogsStore {
  private readonly svc = inject(AuditService);
  private readonly exportSvc = inject(ExportService);
  private readonly toast = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly fb = inject(FormBuilder);

  // Core State
  private readonly _loading = signal<boolean>(false);
  readonly view = signal<'table' | 'timeline'>('table');
  private readonly _page = signal<number>(1);
  private readonly _selectedLog = signal<AuditLog | null>(null);
  private readonly _filters = signal<AuditFilter>({
    query: '',
    actor: '',
    action: '',
    severity: '',
    category: '',
    dateFrom: '',
    dateTo: ''
  });

  // Forms
  readonly filterForm = this.fb.nonNullable.group({
    query:    [''],
    actor:    [''],
    action:   [''],
    severity: ['' as AuditSeverity | ''],
    category: ['' as AuditLog['category'] | ''],
    dateFrom: [''],
    dateTo:   ['']
  });

  // Readonly Public Signals
  readonly loading = this._loading.asReadonly();
  readonly page = this._page.asReadonly();
  readonly selectedLog = this._selectedLog.asReadonly();
  readonly filters = this._filters.asReadonly();

  // Computed Properties
  readonly filtered = computed(() => this.svc.filtered(this._filters()));
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  readonly pagedItems = computed(() => {
    const p = this._page();
    return this.filtered().slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
  });
  readonly rangeStart = computed(() => Math.min((this._page() - 1) * PAGE_SIZE + 1, this.filtered().length));
  readonly rangeEnd = computed(() => Math.min(this._page() * PAGE_SIZE, this.filtered().length));

  readonly activeChips = computed(() => {
    const f = this._filters();
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

  constructor() {
    // Synchronize form value changes with state filters
    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.getRawValue()),
        debounceTime(180),
        takeUntilDestroyed()
      )
      .subscribe((values) => {
        this.patchFilters(values);
      });
  }

  // Mutations/Actions
  setView(view: 'table' | 'timeline'): void {
    this.view.set(view);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this._page.set(page);
    }
  }

  openDrawer(log: AuditLog): void {
    this._selectedLog.set(log);
  }

  closeDrawer(): void {
    this._selectedLog.set(null);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  patchFilters(partial: Partial<AuditFilter>): void {
    this._filters.update(f => ({ ...f, ...partial }));
    this._page.set(1);
  }

  resetFilters(): void {
    this.dialogService.confirm({
      title: 'DIALOG_CLEAR_CONFIRMATION_TITLE',
      message: 'DIALOG_CLEAR_CONFIRMATION_MSG',
      variant: 'warning',
      icon: APP_ICONS.CLOSE
    }).then((confirmed) => {
      if (confirmed) {
        this.filterForm.reset({
          query: '',
          actor: '',
          action: '',
          severity: '',
          category: '',
          dateFrom: '',
          dateTo: ''
        });
        this._filters.set({
          query: '',
          actor: '',
          action: '',
          severity: '',
          category: '',
          dateFrom: '',
          dateTo: ''
        });
        this._page.set(1);
      }
    });
  }

  clearFilterKey(key: string): void {
    this.filterForm.patchValue({ [key]: '' });
    this.patchFilters({ [key]: '' });
  }

  exportCsv(): void {
    this.dialogService.confirm({
      title: 'DIALOG_EXPORT_CONFIRMATION_TITLE',
      message: 'DIALOG_EXPORT_CONFIRMATION_MSG',
      variant: 'info',
      icon: 'download'
    }).then((confirmed) => {
      if (confirmed) {
        const rows = this.filtered().map((l) => ({
          id: l.id,
          timestamp: l.createdAt,
          actor: l.actor,
          action: l.action,
          entity: l.entity,
          severity: l.severity,
          category: l.category,
          ip: l.ipAddress,
          details: l.details ?? ''
        }));
        this.exportSvc.downloadCsv(rows, 'audit-logs');
        this.svc.record('System', 'EXPORT', 'Audit logs', {
          category: 'Export',
          details: `Exported ${rows.length} audit log rows as CSV`
        });
        this.toast.showToast('AUDIT_EXPORTED_CSV_SUCCESS', 'success', { count: rows.length });
      }
    });
  }

  exportExcel(): void {
    this.dialogService.confirm({
      title: 'DIALOG_EXPORT_CONFIRMATION_TITLE',
      message: 'DIALOG_EXPORT_CONFIRMATION_MSG',
      variant: 'info',
      icon: 'download'
    }).then((confirmed) => {
      if (confirmed) {
        const rows = this.filtered().map((l) => ({
          id: l.id,
          timestamp: l.createdAt,
          actor: l.actor,
          action: l.action,
          entity: l.entity,
          severity: l.severity,
          category: l.category,
          ip: l.ipAddress,
          details: l.details ?? ''
        }));
        this.exportSvc.downloadExcel(rows, 'audit-logs');
        this.svc.record('System', 'EXPORT', 'Audit logs', {
          category: 'Export',
          details: `Exported ${rows.length} audit log rows as Excel`
        });
        this.toast.showToast('AUDIT_EXPORTED_EXCEL_SUCCESS', 'success', { count: rows.length });
      }
    });
  }

  severityClass(sev: AuditSeverity): string {
    return (
      {
        Critical: 'text-bg-danger',
        Error: 'text-bg-warning text-dark',
        Warning: 'text-bg-info text-dark',
        Info: 'text-bg-secondary'
      }[sev] ?? 'text-bg-secondary'
    );
  }

  severityColor(sev: AuditSeverity): string {
    return (
      {
        Critical: '#dc3545',
        Error: '#fd7e14',
        Warning: '#0dcaf0',
        Info: '#6c757d'
      }[sev] ?? '#6c757d'
    );
  }
}
