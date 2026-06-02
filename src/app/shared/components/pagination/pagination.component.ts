import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <nav aria-label="Table pagination" class="d-flex align-items-center justify-content-between gap-3 flex-wrap">
      <small class="text-body-secondary">Page {{ page() }} of {{ totalPages() }}</small>
      <ul class="pagination mb-0">
        <li class="page-item" [class.disabled]="page() === 1">
          <button class="page-link" type="button" aria-label="Previous page" (click)="goTo(page() - 1)">Previous</button>
        </li>
        @for (item of pages(); track item) {
          <li class="page-item" [class.active]="item === page()">
            <button class="page-link" type="button" [attr.aria-label]="'Go to page ' + item" (click)="goTo(item)">{{ item }}</button>
          </li>
        }
        <li class="page-item" [class.disabled]="page() === totalPages()">
          <button class="page-link" type="button" aria-label="Next page" (click)="goTo(page() + 1)">Next</button>
        </li>
      </ul>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly total = input.required<number>();
  readonly pageChange = output<number>();
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1).slice(0, 7));

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.page()) {
      this.pageChange.emit(page);
    }
  }
}
