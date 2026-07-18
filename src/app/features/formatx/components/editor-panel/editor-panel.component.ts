import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorStats } from '../../models/formatx.models';

@Component({
  selector: 'app-formatx-editor-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './editor-panel.component.html',
  styleUrl: './editor-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorPanelComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) icon = '';
  @Input({ required: true }) stats: EditorStats = { lines: 0, chars: 0, size: '0 B' };
  @Input() value = '';
  @Input() highlighted = '';
  @Input() language = 'plaintext';
  @Input() readonly = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() copy = new EventEmitter<void>();
  @Output() upload = new EventEmitter<File>();
  @Output() clear = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

  readonly lineNumbers = Array.from({ length: 300 }, (_, index) => index + 1);

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.upload.emit(file);
    input.value = '';
  }
}
