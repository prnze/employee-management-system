import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { ToastService } from '@core/services/toast.service';
import { ClipboardService } from '../../services/clipboard.service';
import { PassxStore } from '../../store/passx.store';

@Component({
  selector: 'app-passx-history',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {
  @Output() restoreSettings = new EventEmitter<string>();
  readonly store = inject(PassxStore);
  private readonly clipboard = inject(ClipboardService);
  private readonly toast = inject(ToastService);

  async copy(password: string): Promise<void> {
    if (await this.clipboard.copy(password)) {
      this.toast.showToast('Copied', 'success');
    }
  }

  clear(): void {
    this.store.clearHistory();
    this.toast.showToast('History cleared', 'success');
  }
}
