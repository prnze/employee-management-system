import { Directive, ElementRef, HostListener, input, inject } from '@angular/core';

@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  readonly appHighlight = input('#fff3cd');
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('mouseenter')
  enter(): void {
    this.element.nativeElement.style.backgroundColor = this.appHighlight();
  }

  @HostListener('mouseleave')
  leave(): void {
    this.element.nativeElement.style.backgroundColor = '';
  }
}
