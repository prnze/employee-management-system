import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Reusable chart card wrapper.
 * Provides a consistent surface with title, optional badge, and slot for chart content.
 * Handles loading skeleton and error states via inputs.
 *
 * Usage:
 * ```html
 * <app-chart-card title="Employee Growth" badge="12 months" [loading]="loading()">
 *   <app-line-chart ... />
 * </app-chart-card>
 * ```
 */
@Component({
  selector: 'app-chart-card',
  standalone: true,
  template: `
    <div class="surface p-3 h-100 d-flex flex-column">
      <!-- Header -->
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="h6 fw-semibold mb-0">{{ title() }}</h2>
        @if (badge()) {
          <span class="badge" [class]="badgeClass()">{{ badge() }}</span>
        }
      </div>

      <!-- Loading state -->
      @if (loading()) {
        <div class="flex-grow-1 placeholder-glow d-flex flex-column gap-2 justify-content-center" aria-busy="true" [attr.aria-label]="'Loading ' + title()">
          <span class="placeholder col-12 rounded" [style.height]="skeletonHeight()"></span>
        </div>

      <!-- Error state -->
      } @else if (error()) {
        <div class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-danger gap-2">
          <span class="fs-2" aria-hidden="true">⚠️</span>
          <p class="mb-0 small fw-semibold">Failed to load chart</p>
          <p class="mb-0 small text-body-secondary">{{ error() }}</p>
        </div>

      <!-- Content slot -->
      } @else {
        <div class="flex-grow-1">
          <ng-content />
        </div>

        <!-- Optional footer slot -->
        <ng-content select="[slot=footer]" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartCardComponent {
  readonly title         = input.required<string>();
  readonly badge         = input<string>('');
  readonly badgeClass    = input<string>('text-bg-primary');
  readonly loading       = input<boolean>(false);
  readonly error         = input<string>('');
  readonly skeletonHeight = input<string>('180px');
}
