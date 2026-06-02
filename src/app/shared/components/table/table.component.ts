import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableColumn } from '@core/models/table.models';

@Component({
  selector: 'app-table',
  standalone: true,
  template: `
    <div class="table-responsive surface">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th scope="col" class="text-center" style="width: 3rem;">
              <input class="form-check-input" type="checkbox" aria-label="Select all rows" [checked]="allSelected()" (change)="toggleAll()" />
            </th>
            @for (column of visibleColumns(); track column.key) {
              <th scope="col">
                <button class="btn btn-link p-0 text-decoration-none fw-semibold" type="button" [disabled]="!column.sortable" (click)="sort.emit(column.key)">
                  {{ column.label }}
                </button>
              </th>
            }
            <th scope="col" class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track trackById(row)) {
            <tr>
              <td class="text-center">
                <input class="form-check-input" type="checkbox" aria-label="Select row" [checked]="selectedIds().includes(trackById(row))" (change)="toggleRow(row)" />
              </td>
              @for (column of visibleColumns(); track column.key) {
                <td>{{ row[column.key] }}</td>
              }
              <td class="text-end">
                <ng-content />
              </td>
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="visibleColumns().length + 2" class="text-center py-5 text-body-secondary">No records found.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends { id: string }> {
  readonly rows = input.required<T[]>();
  readonly columns = input.required<TableColumn<T>[]>();
  readonly selectedIds = input<string[]>([]);
  readonly selectionChange = output<string[]>();
  readonly sort = output<keyof T>();

  visibleColumns(): TableColumn<T>[] {
    return this.columns().filter((column) => column.visible !== false);
  }

  allSelected(): boolean {
    return this.rows().length > 0 && this.rows().every((row) => this.selectedIds().includes(row.id));
  }

  toggleAll(): void {
    this.selectionChange.emit(this.allSelected() ? [] : this.rows().map((row) => row.id));
  }

  toggleRow(row: T): void {
    const current = this.selectedIds();
    this.selectionChange.emit(current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id]);
  }

  trackById(row: T): string {
    return row.id;
  }
}
