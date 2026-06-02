import { Directive, HostListener, input, output } from '@angular/core';

@Directive({ selector: '[appDebounceClick]', standalone: true })
export class DebounceClickDirective {
  readonly debounceMs = input(500);
  readonly appDebounceClick = output<MouseEvent>();
  private lastClick = 0;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const now = Date.now();
    if (now - this.lastClick > this.debounceMs()) {
      this.lastClick = now;
      this.appDebounceClick.emit(event);
    }
  }
}
