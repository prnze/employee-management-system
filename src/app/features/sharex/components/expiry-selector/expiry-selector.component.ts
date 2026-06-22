import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ExpiryOption, EXPIRY_OPTIONS } from '../../models/share.model';

@Component({
  selector: 'app-expiry-selector',
  standalone: true,
  template: `
    <div class="sx-expiry-pills">
      @for (option of options; track option.value) {
        <button
          type="button"
          class="sx-expiry-pill"
          [class.sx-expiry-pill--active]="value() === option.value"
          [attr.title]="option.description"
          (click)="valueChange.emit(option.value)">
          {{ option.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .sx-expiry-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .sx-expiry-pill {
      padding: 8px 16px;
      border-radius: var(--sx-radius-sm, 12px);
      border: 1px solid var(--sx-border, rgba(255, 255, 255, 0.07));
      background: var(--sx-surface, rgba(255, 255, 255, 0.035));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: var(--sx-text-secondary, rgba(255, 255, 255, 0.55));
      font-family: var(--sx-font, 'Inter', sans-serif);
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: var(--sx-surface-hover, rgba(255, 255, 255, 0.055));
        border-color: var(--sx-border-hover, rgba(255, 255, 255, 0.12));
        color: var(--sx-text, rgba(255, 255, 255, 0.93));
        transform: translateY(-1px);
      }

      &--active {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.15)) !important;
        border-color: rgba(139, 92, 246, 0.35) !important;
        color: #ffffff !important;
        box-shadow:
          0 0 20px rgba(139, 92, 246, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpirySelectorComponent {
  readonly value = input<ExpiryOption>('1d');
  readonly valueChange = output<ExpiryOption>();
  readonly options = EXPIRY_OPTIONS;
}
