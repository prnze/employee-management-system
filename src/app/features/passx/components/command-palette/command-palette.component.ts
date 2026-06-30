import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Output, inject, signal } from '@angular/core';
import { PassxStore } from '../../store/passx.store';
import { passxScale } from '../../animations/passx.animations';

@Component({
  selector: 'app-passx-command-palette',
  standalone: true,
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
  animations: [passxScale],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandPaletteComponent {
  @Output() regenerate = new EventEmitter<void>();
  @Output() copyPassword = new EventEmitter<void>();
  @Output() toggleVisibility = new EventEmitter<void>();

  readonly store = inject(PassxStore);
  readonly open = signal(false);

  @HostListener('window:keydown', ['$event'])
  handleShortcut(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === 'k') {
      event.preventDefault();
      this.open.update((value) => !value);
    }
    if ((event.metaKey || event.ctrlKey) && key === 'r' && !event.shiftKey) {
      event.preventDefault();
      this.regenerate.emit();
    }
  }

  close(): void {
    this.open.set(false);
  }
}
