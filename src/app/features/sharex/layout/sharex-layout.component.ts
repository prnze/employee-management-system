import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, HostListener, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DropFilesService } from '../services/drop-files.service';
import { SharexAccent, SharexTheme, SharexThemeService } from '../services/sharex-theme.service';

@Component({
  selector: 'app-sharex-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sharex-layout.component.html',
  styleUrl: './sharex-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharexLayoutComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly dropService = inject(DropFilesService);
  readonly themeService = inject(SharexThemeService);

  /**
   * Drag counter pattern: increment on dragenter, decrement on dragleave.
   * Prevents overlay flickering caused by nested elements firing
   * dragenter/dragleave independently.
   */
  readonly dragCounter = signal(0);
  readonly isDragOverGlobal = () => this.dragCounter() > 0;

  @HostBinding('attr.data-sx-theme')
  get hostTheme(): SharexTheme {
    return this.themeService.theme();
  }

  private readonly fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap'
  ];

  ngOnInit(): void {
    this.fonts.forEach((url) => this.loadFont(url));
  }

  setTheme(theme: SharexTheme): void {
    this.themeService.setTheme(theme);
  }

  setAccent(accent: SharexAccent): void {
    this.themeService.setAccent(accent.name);
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    // Only react to file drags, not text selection drags
    if (this.hasFiles(event)) {
      this.dragCounter.update((c) => c + 1);
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter.update((c) => Math.max(0, c - 1));
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter.set(0);

    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length === 0) return;

    this.dropService.setPending(files);
    this.router.navigate(['/sharex/create']);
  }

  private hasFiles(event: DragEvent): boolean {
    if (!event.dataTransfer?.types) return false;
    return event.dataTransfer.types.includes('Files');
  }

  private loadFont(url: string): void {
    if (this.document.querySelector(`link[href="${url}"]`)) return;
    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    this.document.head.appendChild(link);
  }
}
