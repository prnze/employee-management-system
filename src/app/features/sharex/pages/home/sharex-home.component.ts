import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sharex-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sharex-home.component.html',
  styleUrl: './sharex-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharexHomeComponent {
  constructor(title: Title, meta: Meta) {
    title.setTitle('ShareX — Temporary Text & File Sharing');
    meta.updateTag({ name: 'description', content: 'Share text, code, and files with unique self-destructing links. No account needed. Powered by Angular and Supabase.' });
  }

  readonly features = [
    {
      icon: 'edit_note',
      title: 'Text Sharing',
      description: 'Share notes, code snippets, passwords, JSON, and markdown with syntax highlighting.'
    },
    {
      icon: 'cloud_upload',
      title: 'File Uploads',
      description: 'Drag and drop images, PDFs, documents, and archives up to 50 MB per file.'
    },
    {
      icon: 'timer',
      title: 'Auto Expiry',
      description: 'Set content to self-destruct in 10 minutes, 1 hour, 1 day, or up to 30 days.'
    },
    {
      icon: 'lock',
      title: 'Secure',
      description: 'Password protection, burn after reading, and view limits for sensitive content.'
    }
  ];

  readonly steps = [
    { number: '1', title: 'Create', description: 'Paste text or upload files. Configure expiry and security.' },
    { number: '2', title: 'Share', description: 'Get a unique link. Share it with anyone, anywhere.' },
    { number: '3', title: 'Auto-expire', description: 'Content automatically disappears after the chosen duration.' }
  ];
}
