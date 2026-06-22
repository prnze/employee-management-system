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
  readonly isBurnAfterRead = signal(false);
  readonly isCreating = signal(false);
  readonly createdShare = signal<Share | null>(null);
  readonly error = signal<string | null>(null);

  readonly tabs: { value: CreateTab; label: string; icon: string }[] = [
    { value: 'text', label: 'Text', icon: 'edit_note' },
    { value: 'files', label: 'Files', icon: 'attach_file' },
    { value: 'both', label: 'Both', icon: 'dashboard' }
  ];

  readonly contentTypes = CONTENT_TYPES;

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
        is_burn_after_read: this.isBurnAfterRead()
      };

      const share = await this.sharexService.createShare(payload);

      if ((tab === 'files' || tab === 'both') && fileList.length > 0) {
        await this.storageService.uploadFiles(share.id, fileList);
      }

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
    this.isBurnAfterRead.set(false);
    this.error.set(null);
  }
}
