import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { SharexService } from '../../services/sharex.service';
import { SharexStorageService } from '../../services/sharex-storage.service';
import { ContentType, CreateSharePayload, ExpiryOption, CONTENT_TYPES, Share } from '../../models/share.model';
import { FileDropzoneComponent } from '../../components/file-dropzone/file-dropzone.component';
import { ExpirySelectorComponent } from '../../components/expiry-selector/expiry-selector.component';
import { ShareResultModalComponent } from '../../components/share-result-modal/share-result-modal.component';

type CreateTab = 'text' | 'files' | 'both';

@Component({
  selector: 'app-sharex-create',
  standalone: true,
  imports: [
    FormsModule,
    FileDropzoneComponent,
    ExpirySelectorComponent,
    ShareResultModalComponent
  ],
  templateUrl: './sharex-create.component.html',
  styleUrl: './sharex-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharexCreateComponent {
  private readonly sharexService = inject(SharexService);
  private readonly storageService = inject(SharexStorageService);

  readonly activeTab = signal<CreateTab>('text');
  readonly title = signal('');
  readonly content = signal('');
  readonly contentType = signal<ContentType>('text');
  readonly files = signal<File[]>([]);
  readonly expiryOption = signal<ExpiryOption>('1d');
  readonly customExpiryDate = signal('');
  readonly isBurnAfterRead = signal(false);
  readonly password = signal('');
  readonly showPassword = signal(false);
  readonly viewLimit = signal<number | null>(null);
  readonly isCreating = signal(false);
  readonly createdShare = signal<Share | null>(null);
  readonly error = signal<string | null>(null);

  readonly tabs: { value: CreateTab; label: string; icon: string }[] = [
    { value: 'text', label: 'Text', icon: 'edit_note' },
    { value: 'files', label: 'Files', icon: 'attach_file' },
    { value: 'both', label: 'Both', icon: 'dashboard' }
  ];

  readonly contentTypes = CONTENT_TYPES;

  readonly viewLimitOptions: { value: number | null; label: string }[] = [
    { value: null, label: 'Unlimited' },
    { value: 1, label: '1' },
    { value: 3, label: '3' },
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];

  constructor(titleService: Title, meta: Meta) {
    titleService.setTitle('Create a Share — ShareX');
    meta.updateTag({ name: 'description', content: 'Create a temporary share with text, code, or files. Set expiry, password protection, and more.' });
  }

  setTab(tab: CreateTab): void {
    this.activeTab.set(tab);
    this.error.set(null);
  }

  onFilesChanged(files: File[]): void {
    this.files.set(files);
    this.error.set(null);
  }

  async createShare(): Promise<void> {
    const tab = this.activeTab();
    const textContent = this.content().trim();
    const fileList = this.files();

    if (tab === 'text' && !textContent) {
      this.error.set('Please enter some content to share.');
      return;
    }
    if (tab === 'files' && fileList.length === 0) {
      this.error.set('Please add at least one file.');
      return;
    }
    if (tab === 'both' && !textContent && fileList.length === 0) {
      this.error.set('Please add some content or files.');
      return;
    }

    this.isCreating.set(true);
    this.error.set(null);

    try {
      const payload: CreateSharePayload = {
        title: this.title().trim() || undefined,
        content: (tab === 'text' || tab === 'both') ? textContent : undefined,
        content_type: this.contentType(),
        expiry_option: this.expiryOption(),
        custom_expiry_at: this.expiryOption() === 'custom' ? this.customExpiryDate() : undefined,
        is_burn_after_read: this.isBurnAfterRead(),
        password: this.password().trim() || undefined,
        view_limit: this.viewLimit() ?? undefined
      };

      const share = await this.sharexService.createShare(payload);

      if ((tab === 'files' || tab === 'both') && fileList.length > 0) {
        await this.storageService.uploadFiles(share.id, fileList);
      }

      // Save to localStorage for dashboard tracking
      this.saveToLocalShares(share, tab);

      this.createdShare.set(share);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to create share. Please try again.');
    } finally {
      this.isCreating.set(false);
    }
  }

  closeModal(): void {
    this.createdShare.set(null);
    this.title.set('');
    this.content.set('');
    this.files.set([]);
    this.contentType.set('text');
    this.expiryOption.set('1d');
    this.customExpiryDate.set('');
    this.isBurnAfterRead.set(false);
    this.password.set('');
    this.showPassword.set(false);
    this.viewLimit.set(null);
    this.error.set(null);
  }

  private saveToLocalShares(share: Share, tab: CreateTab): void {
    try {
      const stored = localStorage.getItem('sharex_my_shares');
      const shares: LocalShare[] = stored ? JSON.parse(stored) : [];
      const localShare: LocalShare = {
        id: share.id,
        code: share.share_code,
        title: share.title || 'Untitled',
        type: tab === 'both' ? 'mixed' : (tab === 'files' ? 'files' : 'text'),
        createdAt: share.created_at,
        expiresAt: share.expiry_at,
        burnAfterRead: share.is_burn_after_read,
        passwordProtected: !!share.password_hash
      };
      shares.unshift(localShare);
      localStorage.setItem('sharex_my_shares', JSON.stringify(shares));
    } catch {
      // localStorage unavailable — silently ignore
    }
  }
}

export interface LocalShare {
  id: string;
  code: string;
  title: string;
  type: 'text' | 'files' | 'mixed';
  createdAt: string;
  expiresAt: string | null;
  burnAfterRead: boolean;
  passwordProtected: boolean;
}

