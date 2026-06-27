import { ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { SharexService } from '../../services/sharex.service';
import { DropFilesService } from '../../services/drop-files.service';
import { ContentType, CreateSharePayload, ExpiryOption, CONTENT_TYPES, Share } from '../../models/share.model';
import { FileDropzoneComponent } from '../../components/file-dropzone/file-dropzone.component';
import { ExpirySelectorComponent } from '../../components/expiry-selector/expiry-selector.component';
import { ShareResultModalComponent } from '../../components/share-result-modal/share-result-modal.component';
import { UploadProgressComponent } from '../../components/upload-progress/upload-progress.component';
import { UploadManagerService, UploadState } from '../../services/upload-manager.service';
import { ShareCodeService } from '../../services/share-code.service';
import {
  isValidShareCode,
  normalizeSlug
} from '../../models/share.model';

type CreateTab = 'text' | 'files' | 'both';
type CodeAvailability = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

@Component({
  selector: 'app-sharex-create',
  standalone: true,
  imports: [
    FormsModule,
    FileDropzoneComponent,
    ExpirySelectorComponent,
    ShareResultModalComponent,
    UploadProgressComponent
  ],
  templateUrl: './sharex-create.component.html',
  styleUrl: './sharex-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharexCreateComponent implements OnInit, OnDestroy {
  private readonly sharexService = inject(SharexService);
  private readonly dropService = inject(DropFilesService);
  private readonly uploadManager = inject(UploadManagerService);
  private readonly shareCodeService = inject(ShareCodeService);

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

  // Upload progress
  readonly uploadState = signal<UploadState | null>(null);

  // Clipboard paste toast
  readonly pasteToast = signal<string | null>(null);
  private pasteToastTimeout: ReturnType<typeof setTimeout> | null = null;

  // Custom share code
  readonly useCustomCode = signal(false);
  readonly customCode = signal('');
  readonly codeAvailability = signal<CodeAvailability>('idle');
  readonly codeError = signal<string | null>(null);
  private codeCheckTimeout: ReturnType<typeof setTimeout> | null = null;

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

  ngOnInit(): void {
    // Consume files from global drag & drop
    const pending = this.dropService.consume();
    if (pending.length > 0) {
      this.files.set(pending);
      this.activeTab.set('files');
    }
  }

  ngOnDestroy(): void {
    if (this.codeCheckTimeout) clearTimeout(this.codeCheckTimeout);
    if (this.pasteToastTimeout) clearTimeout(this.pasteToastTimeout);
  }

  setTab(tab: CreateTab): void {
    this.activeTab.set(tab);
    this.error.set(null);
  }

  onFilesChanged(files: File[]): void {
    this.files.set(files);
    this.error.set(null);
  }

  // ── Clipboard Paste ──────────────────────────────────────────────────────

  @HostListener('document:paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    // Don't intercept paste inside text input/textarea
    const target = event.target as HTMLElement;
    const isTextInput = target.tagName === 'TEXTAREA' ||
      (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') ||
      (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'password');

    // If pasting into the content textarea on text/both tab, let it through
    if (isTextInput && target.id !== 'sharex-paste-intercept') {
      return;
    }

    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const pastedFiles: File[] = [];

    // Check for files in clipboard
    if (clipboardData.files.length > 0) {
      pastedFiles.push(...Array.from(clipboardData.files));
    }

    // Check for image items (screenshot paste)
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file && !pastedFiles.some((f) => f.size === file.size && f.type === file.type)) {
          // Generate a meaningful filename for screenshots
          const ext = file.type.split('/')[1] || 'png';
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
          const renamedFile = new File([file], `screenshot-${timestamp}.${ext}`, { type: file.type });
          pastedFiles.push(renamedFile);
        }
      }
    }

    if (pastedFiles.length === 0) return;

    event.preventDefault();

    // Add pasted files to the file list
    const current = this.files();
    this.files.set([...current, ...pastedFiles]);

    // Auto-switch tab
    if (this.activeTab() === 'text' && !this.content().trim()) {
      this.activeTab.set('files');
    } else if (this.activeTab() === 'text') {
      this.activeTab.set('both');
    }

    // Show toast
    const label = pastedFiles.length === 1
      ? `Pasted: ${pastedFiles[0].name}`
      : `Pasted ${pastedFiles.length} files`;
    this.showPasteToast(label);
  }

  private showPasteToast(message: string): void {
    if (this.pasteToastTimeout) clearTimeout(this.pasteToastTimeout);
    this.pasteToast.set(message);
    this.pasteToastTimeout = setTimeout(() => this.pasteToast.set(null), 3000);
  }

  // ── Custom Share Code ────────────────────────────────────────────────────

  toggleCustomCode(): void {
    this.useCustomCode.update((v) => !v);
    if (!this.useCustomCode()) {
      this.customCode.set('');
      this.codeAvailability.set('idle');
      this.codeError.set(null);
    }
  }

  onCustomCodeInput(raw: string): void {
    const slug = normalizeSlug(raw);
    this.customCode.set(slug);

    // Clear previous check
    if (this.codeCheckTimeout) clearTimeout(this.codeCheckTimeout);

    if (!slug) {
      this.codeAvailability.set('idle');
      this.codeError.set(null);
      return;
    }

    // Validate
    const validation = isValidShareCode(slug);
    if (!validation.valid) {
      this.codeAvailability.set('invalid');
      this.codeError.set(validation.error ?? 'Invalid code');
      return;
    }

    // Debounced availability check
    this.codeAvailability.set('checking');
    this.codeError.set(null);

    this.codeCheckTimeout = setTimeout(async () => {
      try {
        const result = await this.shareCodeService.checkAvailability(slug);
        this.codeAvailability.set(result.available ? 'available' : 'taken');
        this.codeError.set(result.available ? null : 'This code is already taken');
      } catch {
        this.codeAvailability.set('idle');
        this.codeError.set('Could not check availability');
      }
    }, 300);
  }

  // ── Create Share ─────────────────────────────────────────────────────────

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

    if (!(await this.validateCustomCodeForSubmit())) {
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
        view_limit: this.viewLimit() ?? undefined,
        custom_code: this.useCustomCode() && this.customCode() ? this.customCode() : undefined
      };

      const share = await this.sharexService.createShare(payload);

      if ((tab === 'files' || tab === 'both') && fileList.length > 0) {
        // Use upload manager for progress tracking
        await this.uploadManager.uploadFiles(share.id, fileList, (state) => {
          this.uploadState.set({ ...state });
        });
      }

      // Save to localStorage for dashboard tracking
      this.saveToLocalShares(share, tab);

      this.createdShare.set(share);
      this.uploadState.set(null);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to create share. Please try again.');
      this.uploadState.set(null);
    } finally {
      this.isCreating.set(false);
    }
  }

  private async validateCustomCodeForSubmit(): Promise<boolean> {
    if (!this.useCustomCode()) return true;

    const code = this.customCode();
    if (!code) {
      this.error.set('Please enter a custom URL or turn off Custom URL.');
      this.codeAvailability.set('invalid');
      this.codeError.set('Code is required');
      return false;
    }

    const validation = isValidShareCode(code);
    if (!validation.valid) {
      this.error.set(validation.error ?? 'Invalid custom URL');
      this.codeAvailability.set('invalid');
      this.codeError.set(validation.error ?? 'Invalid code');
      return false;
    }

    if (this.codeCheckTimeout) {
      clearTimeout(this.codeCheckTimeout);
      this.codeCheckTimeout = null;
    }

    this.codeAvailability.set('checking');

    try {
      const result = await this.shareCodeService.checkAvailability(code);
      this.codeAvailability.set(result.available ? 'available' : 'taken');
      this.codeError.set(result.available ? null : 'This code is already taken');

      if (!result.available) {
        this.error.set('This custom URL is already taken. Please choose another.');
      }

      return result.available;
    } catch {
      this.codeAvailability.set('idle');
      this.codeError.set('Could not check availability');
      this.error.set('Could not check custom URL availability. Please try again.');
      return false;
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
    this.useCustomCode.set(false);
    this.customCode.set('');
    this.codeAvailability.set('idle');
    this.codeError.set(null);
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
