import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sharex-about',
  standalone: true,
  templateUrl: './sharex-about.component.html',
  styleUrl: './sharex-about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharexAboutComponent {
  constructor(title: Title, meta: Meta) {
    title.setTitle('About ShareX — Temporary Sharing Platform');
    meta.updateTag({ name: 'description', content: 'Learn about ShareX, a temporary text and file sharing platform built with Angular, Supabase, and modern web technologies.' });
  }

  readonly infoCards = [
    { icon: 'security', title: 'Secure by Design', text: 'Content is automatically deleted after expiry. Optional password protection and burn-after-reading for maximum privacy.' },
    { icon: 'speed', title: 'Fast & Simple', text: 'No account required. Paste, upload, share. Get a unique link in seconds with zero friction.' },
    { icon: 'code', title: 'Developer Friendly', text: 'Supports code snippets with language detection, markdown, JSON formatting, and plain text.' },
    { icon: 'cloud_upload', title: 'File Sharing', text: 'Upload images, PDFs, documents, archives and more. Drag and drop with multi-file support.' }
  ];

  readonly techStack = [
    'Angular', 'TypeScript', 'Signals', 'SCSS',
    'Supabase', 'PostgreSQL', 'Storage', 'RLS',
    'Vercel', 'Standalone Components', 'OnPush'
  ];
}
