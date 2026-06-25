import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpiryOption, EXPIRY_OPTIONS } from '../../models/share.model';

@Component({
  selector: 'app-expiry-selector',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="sx-expiry-pills">
      @for (option of options; track option.value) {
        <button
          type="button"
          class="sx-expiry-pill"
          [class.sx-expiry-pill--active]="value() === option.value"
          [attr.title]="option.description"
          (click)="selectOption(option.value)">
          @if (option.value === 'custom') {
            <span class="material-symbols-rounded sx-expiry-pill-icon" aria-hidden="true">calendar_month</span>
          }
          {{ option.label }}
        </button>
      }
    </div>

    @if (value() === 'custom') {
      <div class="sx-custom-date-wrapper">
        <span class="material-symbols-rounded sx-custom-date-icon" aria-hidden="true">event</span>
        <input
          type="datetime-local"
          class="sx-custom-date-input"
          [min]="minDateTime"
          [ngModel]="customDate()"
          (ngModelChange)="onCustomDateChange($event)"
          id="sharex-custom-expiry">
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .sx-expiry-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .sx-expiry-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
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

    .sx-expiry-pill-icon {
      font-size: 0.95rem;
    }

    .sx-custom-date-wrapper {
      position: relative;
      animation: custom-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes custom-slide-in {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .sx-custom-date-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
      color: var(--sx-text-muted, rgba(255, 255, 255, 0.32));
      pointer-events: none;
      z-index: 1;
    }

    .sx-custom-date-input {
      width: 100%;
      height: 48px;
      padding: 12px 18px 12px 44px;
      border-radius: var(--sx-radius-md, 16px);
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--sx-border, rgba(255, 255, 255, 0.07));
      color: var(--sx-text, rgba(255, 255, 255, 0.93));
      font-family: var(--sx-font, 'Inter', sans-serif);
      font-size: 0.88rem;
      box-sizing: border-box;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color-scheme: dark;

      &:focus {
        outline: none;
        border-color: rgba(139, 92, 246, 0.4);
        box-shadow:
          0 0 0 3px rgba(139, 92, 246, 0.12),
          0 0 24px rgba(139, 92, 246, 0.08);
      }

      &::-webkit-calendar-picker-indicator {
        filter: invert(0.5);
        cursor: pointer;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpirySelectorComponent {
  readonly value = input<ExpiryOption>('1d');
  readonly valueChange = output<ExpiryOption>();
  readonly customDateChange = output<string>();

  readonly options = EXPIRY_OPTIONS;
  readonly customDate = signal('');

  get minDateTime(): string {
    const now = new Date();
    // Offset to local time for datetime-local input
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  selectOption(option: ExpiryOption): void {
    this.valueChange.emit(option);
  }

  onCustomDateChange(value: string): void {
    this.customDate.set(value);
    this.customDateChange.emit(value);
  }
}
