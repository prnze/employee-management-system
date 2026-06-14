import {
  ChangeDetectionStrategy, Component, inject, viewChild, TemplateRef, computed
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuditLog, AuditSeverity } from '@core/models/notification.models';
import { AuditService } from '@core/services/audit.service';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { TranslatePipe } from '@ngx-translate/core';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableColumn } from '@core/models/table.models';
import { FilterChipsComponent } from '@shared/components/filter-chips/filter-chips.component';
import { JsonPipe, DecimalPipe } from '@angular/common';
import { AuditLogsStore } from './audit-logs.store';

const PAGE_SIZE = 15;

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [
    ReactiveFormsModule, AppDatePipe, IconComponent, TranslatePipe,
    PermissionDirective, TableComponent, PaginationComponent, FilterChipsComponent,
    JsonPipe, DecimalPipe
  ],
  styleUrl: './audit-logs.component.scss',
  templateUrl: './audit-logs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditLogsComponent {
  readonly APP_ICONS = APP_ICONS;
  readonly store = inject(AuditLogsStore);
  readonly svc = inject(AuditService);

  readonly pageSize = PAGE_SIZE;

  readonly totalLogsCount = computed(() => this.svc.totalCount());
  readonly criticalEventsCount = computed(() => this.svc.logs().filter(l => l.severity === 'Critical').length);
  readonly todayActivityCount = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.svc.logs().filter(l => l.createdAt.startsWith(todayStr)).length;
  });

  // Template queries for table columns
  readonly severityTpl = viewChild<TemplateRef<any>>('severityTpl');
  readonly actorTpl = viewChild<TemplateRef<any>>('actorTpl');
  readonly actionTpl = viewChild<TemplateRef<any>>('actionTpl');
  readonly entityTpl = viewChild<TemplateRef<any>>('entityTpl');
  readonly categoryTpl = viewChild<TemplateRef<any>>('categoryTpl');
  readonly timeTpl = viewChild<TemplateRef<any>>('timeTpl');
  readonly ipTpl = viewChild<TemplateRef<any>>('ipTpl');
  readonly actionsTpl = viewChild<TemplateRef<any>>('actionsTpl');

  readonly columns = computed<TableColumn<AuditLog>[]>(() => [
    { key: 'severity', label: 'AUDIT_SEVERITY', cellTemplate: this.severityTpl() },
    { key: 'actor', label: 'AUDIT_ACTOR', cellTemplate: this.actorTpl() },
    { key: 'action', label: 'AUDIT_ACTION', cellTemplate: this.actionTpl() },
    { key: 'entity', label: 'AUDIT_ENTITY', cellTemplate: this.entityTpl() },
    { key: 'category', label: 'AUDIT_CATEGORY', cellTemplate: this.categoryTpl() },
    { key: 'createdAt', label: 'AUDIT_TIME', cellTemplate: this.timeTpl() },
    { key: 'ipAddress', label: 'AUDIT_IP', cellTemplate: this.ipTpl() },
    { key: 'actions', label: '', cellTemplate: this.actionsTpl(), headerClass: 'text-end', cellClass: 'text-end' }
  ]);

  readonly severities: AuditSeverity[] = ['Critical', 'Error', 'Warning', 'Info'];
  readonly categories: AuditLog['category'][] = ['Auth', 'Employee', 'Permissions', 'Export', 'System'];

  // Expose store signals directly to template to maintain HTML compatibility
  readonly view = this.store.view;
  readonly page = this.store.page;
  readonly selectedLog = this.store.selectedLog;
  readonly filterForm = this.store.filterForm;
  readonly filtered = this.store.filtered;
  readonly pagedItems = this.store.pagedItems;
  readonly activeChips = this.store.activeChips;
  readonly loading = this.store.loading;

  // Actions delegated to the store
  resetFilters(): void {
    this.store.resetFilters();
  }

  clearChip(key: string): void {
    this.store.clearFilterKey(key);
  }

  setPage(p: number): void {
    this.store.setPage(p);
  }

  openDrawer(log: AuditLog): void {
    this.store.openDrawer(log);
  }

  closeDrawer(): void {
    this.store.closeDrawer();
  }

  exportCsv(): void {
    this.store.exportCsv();
  }

  exportExcel(): void {
    this.store.exportExcel();
  }

  severityClass(sev: AuditSeverity): string {
    return this.store.severityClass(sev);
  }

  severityColor(sev: AuditSeverity): string {
    return this.store.severityColor(sev);
  }
}
