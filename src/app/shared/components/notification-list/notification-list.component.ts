import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppNotification, NotificationCategory, NotificationPriority } from '@core/models/notification.models';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { TranslatePipe } from '@ngx-translate/core';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { FilterChipsComponent } from '@shared/components/filter-chips/filter-chips.component';
import { NotificationService } from '@core/services/notification.service';
import { NotificationListStore } from './notification-list.store';

const PAGE_SIZE = 8;

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, AppDatePipe, IconComponent,
    TranslatePipe, PermissionDirective, PaginationComponent, FilterChipsComponent
  ],
  styleUrl: './notification-list.component.scss',
  templateUrl: './notification-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationListComponent {
  readonly APP_ICONS = APP_ICONS;
  readonly store = inject(NotificationListStore);
  readonly svc = inject(NotificationService);

  readonly categories: NotificationCategory[] = ['System', 'Security', 'Employee', 'Attendance', 'Tasks'];
  readonly priorities: NotificationPriority[]  = ['Critical', 'High', 'Medium', 'Low'];

  // Read signals directly from store
  readonly loading = this.store.loading;
  readonly page = this.store.page;
  readonly pageSize = PAGE_SIZE;
  readonly filterForm = this.store.filterForm;
  readonly filtered = this.store.filtered;
  readonly totalPages = this.store.totalPages;
  readonly pagedItems = this.store.pagedItems;
  readonly activeChips = this.store.activeChips;

  // Delegate actions to store
  markRead(id: string): void {
    this.store.markRead(id);
  }

  markAllRead(): void {
    this.store.markAllRead();
  }

  confirmDelete(id: string): void {
    this.store.confirmDelete(id);
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

  typeIcon(type: AppNotification['type']): string {
    return this.store.typeIcon(type);
  }

  priorityClass(priority: AppNotification['priority']): string {
    return this.store.priorityClass(priority);
  }

  categoryClass(category: AppNotification['category']): string {
    return this.store.categoryClass(category);
  }
}
