import { DOCUMENT, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatxFadeUp, formatxModal } from '../../animations/formatx.animations';
import { AmbientBackgroundComponent } from '../../components/ambient-background/ambient-background.component';
import { EditorPanelComponent } from '../../components/editor-panel/editor-panel.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { ACCENTS, LANGUAGES, MODES } from '../../constants/formatx.constants';
import { FormatMode, FormatxTheme, Lang } from '../../models/formatx.models';
import { FormatxClipboardService } from '../../services/clipboard.service';
import { FormatxDownloadService } from '../../services/download.service';
import { FormatterService } from '../../services/formatter.service';
import { LanguageDetectorService } from '../../services/language-detector.service';
import { FormatxUploadService } from '../../services/upload.service';
import { FormatxStore } from '../../store/formatx.store';

@Component({
  selector: 'app-formatx',
  standalone: true,
  imports: [AmbientBackgroundComponent, DecimalPipe, EditorPanelComponent, FormsModule, ToolbarComponent],
  templateUrl: './formatx.component.html',
  styleUrl: './formatx.component.scss',
  animations: [formatxFadeUp, formatxModal],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormatxComponent {
  readonly store = inject(FormatxStore);
  private readonly clipboard = inject(FormatxClipboardService);
  private readonly downloadService = inject(FormatxDownloadService);
  private readonly detector = inject(LanguageDetectorService);
  private readonly formatter = inject(FormatterService);
  private readonly uploadService = inject(FormatxUploadService);
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly accents = ACCENTS;
  readonly languages = LANGUAGES;
  readonly modes = MODES;
  readonly themes: { id: FormatxTheme; label: string; icon: string }[] = [
    { id: 'light', label: 'Light Grey', icon: 'light_mode' },
    { id: 'dark', label: 'Dark Grey', icon: 'dark_mode' },
    { id: 'pitch', label: 'Pitch Black', icon: 'radio_button_unchecked' }
  ];

  readonly fullscreen = signal(false);
  readonly showSettings = signal(false);
  readonly showAbout = signal(false);
  readonly showPalette = signal(false);
  readonly showLangPicker = signal(false);
  readonly dragActive = signal(false);
  readonly toast = signal<{ title: string; description?: string } | null>(null);
  readonly sourceFileName = signal<string | null>(null);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  readonly currentLang = computed(() => this.languages.find((language) => language.id === this.store.lang()) ?? this.languages[0]);
  readonly currentMode = computed(() => this.modes.find((mode) => mode.id === this.store.mode()) ?? this.modes[0]);
  readonly inputStats = computed(() => this.statsFor(this.store.input()));
  readonly outputStats = computed(() => this.statsFor(this.store.output()));
  readonly historyPreview = computed(() => this.store.history().slice().reverse());

  setTheme(theme: FormatxTheme): void {
    this.store.setTheme(theme);
  }

  setAccent(accent: string): void {
    this.store.setAccent(accent);
  }

  setMode(mode: FormatMode): void {
    this.store.setMode(mode);
  }

  setLang(lang: Lang, autoLang = false): void {
    this.store.setLang(lang, autoLang);
    this.showLangPicker.set(false);
  }

  runFormat(): void {
    this.store.format();
    this.notify('Formatted', `${this.currentLang().label} · ${this.currentMode().label}`);
  }

  clearAll(): void {
    this.store.clear();
    this.notify('Cleared');
  }

  async copyOutput(): Promise<void> {
    const copied = await this.clipboard.copy(this.store.output());
    this.notify(copied ? 'Copied to clipboard' : 'Copy unavailable');
  }

  downloadOutput(): void {
    const ext = this.currentLang().ext[0] ?? 'txt';
    const sourceName = this.sourceFileName();
    const stem = sourceName ? sourceName.replace(/\.[^.]+$/, '') : 'formatx';
    const filename = `${stem || 'formatx'}.${ext}`;
    this.downloadService.download(filename, this.store.output());
    this.notify('Downloaded', filename);
  }

  async handleFile(file: File): Promise<void> {
    try {
      const text = await this.uploadService.readFile(file);
      this.store.setInput(text);
      this.sourceFileName.set(file.name);
      const lang = this.detector.extToLang(file.name);
      if (lang) this.store.setLang(lang, false);
      else this.store.setAutoLang(true);
      this.notify('File loaded', file.name);
    } catch {
      this.notify('Unable to read file', file.name);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) void this.handleFile(file);
  }

  onDrag(event: DragEvent, active: boolean): void {
    event.preventDefault();
    this.dragActive.set(active);
  }

  execute(action: 'format' | 'copy' | 'download' | 'clear' | 'settings' | 'language'): void {
    this.showPalette.set(false);
    const actions: Record<typeof action, () => void> = {
      format: () => this.runFormat(),
      copy: () => void this.copyOutput(),
      download: () => this.downloadOutput(),
      clear: () => this.clearAll(),
      settings: () => this.showSettings.set(true),
      language: () => this.showLangPicker.set(true)
    };
    actions[action]();
  }

  restoreHistory(reversedIndex: number): void {
    const originalIndex = this.store.history().length - 1 - reversedIndex;
    this.store.restoreHistory(originalIndex);
    this.notify('History restored');
  }

  closeModals(): void {
    this.showSettings.set(false);
    this.showAbout.set(false);
    this.showPalette.set(false);
    this.showLangPicker.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (!this.browser) return;
    const mod = event.metaKey || event.ctrlKey;
    const key = event.key.toLowerCase();
    if (mod && key === 'k') {
      event.preventDefault();
      this.showPalette.update((value) => !value);
    }
    if (mod && event.shiftKey && key === 'f') {
      event.preventDefault();
      this.runFormat();
    }
    if (mod && !event.shiftKey && key === 's') {
      event.preventDefault();
      this.downloadOutput();
    }
    if (mod && key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.store.undo();
    }
    if (mod && (key === 'y' || (event.shiftKey && key === 'z'))) {
      event.preventDefault();
      this.store.redo();
    }
    if (event.key === 'Escape') this.closeModals();
  }

  private statsFor(value: string): { lines: number; chars: number; size: string } {
    return {
      lines: value.split('\n').length,
      chars: value.length,
      size: this.formatter.bytesOf(value)
    };
  }

  private notify(title: string, description?: string): void {
    this.toast.set({ title, description });
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 2600);
  }
}
