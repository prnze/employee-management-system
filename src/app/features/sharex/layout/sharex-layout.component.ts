import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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

  private readonly fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap'
  ];

  ngOnInit(): void {
    this.fonts.forEach((url) => this.loadFont(url));
  }

  private loadFont(url: string): void {
    if (this.document.querySelector(`link[href="${url}"]`)) return;
    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    this.document.head.appendChild(link);
  }
}
