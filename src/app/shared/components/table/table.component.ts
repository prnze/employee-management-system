import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableColumn } from '@core/models/table.models';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { IconComponent } from '../icon/icon.component';
import { LoaderComponent } from '../loader/loader.component';
import { APP_ICONS } from '@core/constants/icon.constants';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgTemplateOutlet, TranslateModule, EmptyStateComponent, IconComponent, LoaderComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends { id: string }> {
  readonly APP_ICONS = APP_ICONS;
  readonly rows = input.required<T[]>();
  readonly columns = input.required<TableColumn<T>[]>();
  readonly selectedIds = input<string[]>([]);
  readonly selectedSet = computed(() => new Set(this.selectedIds()));
  readonly selectable = input<boolean>(false);
  readonly rowClickable = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly sortStack = input<{ field: string; direction: 'asc' | 'desc' }[]>([]);
  readonly emptyTitle = input<string>('AUDIT_NONE_FOUND');
  readonly emptyMessage = input<string>('AUDIT_ADJUST');

  readonly selectionChange = output<string[]>();
  readonly sort = output<keyof T | string>();
  readonly rowClick = output<T>();

  readonly visibleColumns = computed(() => this.columns().filter((column) => column.visible !== false));

  allSelected(): boolean {
    return this.rows().length > 0 && this.rows().every((row) => this.selectedSet().has(row.id));
  }

  toggleAll(): void {
    this.selectionChange.emit(this.allSelected() ? [] : this.rows().map((row) => row.id));
  }

  toggleRow(row: T): void {
    const current = this.selectedIds();
    this.selectionChange.emit(this.selectedSet().has(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id]);
  }

  trackById(row: T): string {
    return row.id;
  }

  getRowValue(row: T, key: keyof T | string): any {
    return (row as any)[key];
  }

  onRowClick(row: T): void {
    if (this.rowClickable()) {
      this.rowClick.emit(row);
    }
  }

  onSort(key: keyof T | string): void {
    this.sort.emit(key);
  }

  isSorted(key: string): boolean {
    return this.sortStack().some(e => e.field === key);
  }

  getSortDirection(key: string): 'asc' | 'desc' | null {
    const entry = this.sortStack().find(e => e.field === key);
    return entry ? entry.direction : null;
  }

  getSortIcon(key: string): string {
    const dir = this.getSortDirection(key);
    return dir === 'asc' ? APP_ICONS.SORT_UP : APP_ICONS.SORT_DOWN;
  }

  sortStackIndex(key: string): number {
    return this.sortStack().findIndex(e => e.field === key) + 1;
  }
}
