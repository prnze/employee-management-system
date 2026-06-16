import { Injectable, computed, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith, debounceTime } from 'rxjs/operators';
import { NotificationService } from '@core/services/notification.service';
import { DialogService } from '@core/services/dialog.service';
import { APP_ICONS } from '@core/constants/icon.constants';
import { AppNotification, NotificationCategory, NotificationFilter, NotificationPriority } from '@core/models/notification.models';

const PAGE_SIZE = 8;

@Injectable({
  providedIn: 'root'
})
export class NotificationListStore {
  private readonly svc = inject(NotificationService);
  private readonly dialogService = inject(DialogService);
  private readonly fb = inject(FormBuilder);

  // Core State
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string>('');
  private readonly _page = signal<number>(1);
  private readonly _filters = signal<NotificationFilter>({
    query: '',
    category: '',
    priority: '',
    status: 'all'
  });

  // Forms
  readonly filterForm = this.fb.nonNullable.group({
    query:    [''],
    category: ['' as NotificationCategory | ''],
    priority: ['' as NotificationPriority | ''],
    status:   ['all' as 'all' | 'read' | 'unread']
  });

  // Readonly Public Signals
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly page = this._page.asReadonly();
  readonly filters = this._filters.asReadonly();

  // Computed Properties
  readonly filtered = computed(() => {
    const f = this._filters();
    return this.svc.filtered(f)
      .sort((a, b) =>
        NotificationService.priorityOrder(b.priority) - NotificationService.priorityOrder(a.priority) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));

  readonly pagedItems = computed(() => {
    const p = this._page();
    return this.filtered().slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
  });

  readonly activeChips = computed(() => {
    const f = this._filters();
    const chips: { key: string; label: string }[] = [];
    if (f.query)    chips.push({ key: 'query',    label: `"${f.query}"` });
    if (f.category) chips.push({ key: 'category', label: f.category });
    if (f.priority) chips.push({ key: 'priority', label: f.priority });
    if (f.status !== 'all') chips.push({ key: 'status', label: f.status });
    return chips;
  });

  constructor() {
    // Sync form values to store filters
    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.getRawValue()),
        debounceTime(150),
        takeUntilDestroyed()
      )
      .subscribe((values) => {
        this.patchFilters(values);
      });
  }

  // Mutations/Actions
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  loadNotifications(): void {
    this._loading.set(true);
    this._error.set('');
    this.svc.getNotifications().subscribe({
      next: () => {
        this._loading.set(false);
      },
      error: (err: Error) => {
        this._error.set(err.message);
        this._loading.set(false);
      }
    });
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this._page.set(page);
    }
  }

  patchFilters(partial: Partial<NotificationFilter>): void {
    this._filters.update(f => ({ ...f, ...partial }));
    this._page.set(1);
  }

  markRead(id: string): void {
    this.svc.markAsRead(id).subscribe({
      error: (err: Error) => this._error.set(err.message)
    });
  }

  markAllRead(): void {
    this.dialogService.confirm({
      title: 'DIALOG_MARK_ALL_READ_TITLE',
      message: 'DIALOG_MARK_ALL_READ_MSG',
      variant: 'info',
      icon: APP_ICONS.SUCCESS
    }).then((confirmed) => {
      if (confirmed) {
        this.svc.markAllAsRead().subscribe({
          error: (err: Error) => this._error.set(err.message)
        });
      }
    });
  }

  confirmDelete(id: string): void {
    this.dialogService.confirm({
      title: 'DIALOG_DELETE_NOTIFICATION_TITLE',
      message: 'DIALOG_DELETE_NOTIFICATION_MSG',
      variant: 'danger',
      icon: APP_ICONS.DELETE
    }).then((confirmed) => {
      if (confirmed) {
        this.svc.deleteNotification(id).subscribe({
          error: (err: Error) => this._error.set(err.message)
        });
      }
    });
  }

  resetFilters(): void {
    this.filterForm.patchValue({
      query: '',
      category: '',
      priority: '',
      status: 'all'
    });
    this._filters.set({
      query: '',
      category: '',
      priority: '',
      status: 'all'
    });
    this._page.set(1);
  }

  clearFilterKey(key: string): void {
    this.filterForm.patchValue({ [key]: key === 'status' ? 'all' : '' });
    this.patchFilters({ [key]: key === 'status' ? 'all' : '' });
  }

  // Presentation helpers
  typeIcon(type: AppNotification['type']): string {
    return (
      {
        Info: APP_ICONS.INFO,
        Success: APP_ICONS.SUCCESS,
        Warning: APP_ICONS.WARNING,
        Error: APP_ICONS.ERROR
      }[type] ?? APP_ICONS.NOTIFICATIONS
    );
  }

  priorityClass(priority: AppNotification['priority']): string {
    return (
      {
        Critical: 'text-bg-danger',
        High:     'text-bg-warning text-dark',
        Medium:   'text-bg-info text-dark',
        Low:      'text-bg-secondary'
      }[priority] ?? 'text-bg-secondary'
    );
  }

  categoryClass(category: AppNotification['category']): string {
    return (
      {
        System:     'text-bg-secondary',
        Security:   'text-bg-danger',
        Employee:   'text-bg-primary',
        Attendance: 'text-bg-warning text-dark',
        Tasks:      'text-bg-info text-dark'
      }[category] ?? 'text-bg-secondary'
    );
  }
}
