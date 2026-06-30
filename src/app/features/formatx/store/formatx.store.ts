import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { FORMATX_HISTORY_KEY, FORMATX_PREFS_KEY, SAMPLE_CODE } from '../constants/formatx.constants';
import { FormatMode, FormatxPrefs, FormatxState, FormatxTheme, Lang } from '../models/formatx.models';
import { FormatterService } from '../services/formatter.service';
import { FormatxHistoryService } from '../services/history.service';
import { LanguageDetectorService } from '../services/language-detector.service';
import { FormatxStorageService } from '../services/storage.service';
import { FormatxThemeService } from '../services/theme.service';

@Injectable({ providedIn: 'root' })
export class FormatxStore {
  private readonly formatter = inject(FormatterService);
  private readonly detector = inject(LanguageDetectorService);
  private readonly historyService = inject(FormatxHistoryService);
  private readonly storage = inject(FormatxStorageService);
  private readonly themeService = inject(FormatxThemeService);
  private readonly state = signal<FormatxState>(this.restore());

  readonly theme = computed(() => this.state().theme);
  readonly accent = computed(() => this.state().accent);
  readonly input = computed(() => this.state().input);
  readonly output = computed(() => this.state().output);
  readonly lang = computed(() => this.state().lang);
  readonly autoLang = computed(() => this.state().autoLang);
  readonly confidence = computed(() => this.state().confidence);
  readonly mode = computed(() => this.state().mode);
  readonly indent = computed(() => this.state().indent);
  readonly style = computed(() => this.state().style);
  readonly history = computed(() => this.state().history);
  readonly histIdx = computed(() => this.state().histIdx);
  readonly highlightedOutput = computed(() => this.formatter.highlight(this.output() || ' ', this.lang()));

  constructor() {
    effect(() => {
      const state = this.state();
      this.storage.write<FormatxPrefs>(FORMATX_PREFS_KEY, {
        theme: state.theme,
        accent: state.accent,
        indent: state.indent,
        mode: state.mode
      });
      this.storage.write(FORMATX_HISTORY_KEY, { history: state.history, histIdx: state.histIdx });
      this.themeService.apply(state.theme, state.accent);
    });
  }

  setTheme(theme: FormatxTheme): void {
    this.patch({ theme });
  }

  setAccent(accent: string): void {
    this.patch({ accent });
  }

  setMode(mode: FormatMode): void {
    this.patch({ mode });
  }

  setIndent(indent: string): void {
    this.patch({ indent });
  }

  setAutoLang(autoLang: boolean): void {
    this.patch({ autoLang });
    if (autoLang) this.detectLanguage();
  }

  setLang(lang: Lang, autoLang = false): void {
    this.patch({ lang, autoLang, confidence: autoLang ? this.confidence() : 1 });
  }

  setInput(input: string, pushHistory = true): void {
    const detected = this.autoLang() ? this.detector.detectLanguage(input) : { lang: this.lang(), confidence: this.confidence() };
    const historyPatch = pushHistory ? this.historyService.push(this.history(), this.histIdx(), input) : { history: this.history(), histIdx: this.histIdx() };
    this.patch({
      input,
      lang: detected.lang,
      confidence: detected.confidence,
      style: this.formatter.analyzeStyle(input),
      ...historyPatch
    });
  }

  setOutput(output: string): void {
    this.patch({ output });
  }

  format(): string {
    const output = this.formatter.formatCode(this.input(), this.lang(), { mode: this.mode(), indent: this.indent() });
    this.patch({ output });
    return output;
  }

  clear(): void {
    this.setInput('');
    this.patch({ output: '' });
  }

  swap(): void {
    const previousInput = this.input();
    const nextInput = this.output();
    this.setInput(nextInput);
    this.patch({ output: previousInput });
  }

  undo(): void {
    if (this.histIdx() <= 0) return;
    const histIdx = this.histIdx() - 1;
    const input = this.history()[histIdx] ?? '';
    this.patch({ histIdx });
    this.setInput(input, false);
  }

  redo(): void {
    if (this.histIdx() >= this.history().length - 1) return;
    const histIdx = this.histIdx() + 1;
    const input = this.history()[histIdx] ?? '';
    this.patch({ histIdx });
    this.setInput(input, false);
  }

  deleteHistory(index: number): void {
    const history = this.history().filter((_, i) => i !== index);
    this.patch({ history, histIdx: Math.min(this.histIdx(), Math.max(0, history.length - 1)) });
  }

  clearHistory(): void {
    this.patch({ history: [this.input()], histIdx: 0 });
  }

  restoreHistory(index: number): void {
    const value = this.history()[index];
    if (typeof value === 'string') {
      this.patch({ histIdx: index });
      this.setInput(value, false);
    }
  }

  private detectLanguage(): void {
    const detected = this.detector.detectLanguage(this.input());
    this.patch({ lang: detected.lang, confidence: detected.confidence });
  }

  private patch(value: Partial<FormatxState>): void {
    this.state.update((state) => ({ ...state, ...value }));
  }

  private restore(): FormatxState {
    const prefs = this.storage.read<Partial<FormatxPrefs>>(FORMATX_PREFS_KEY) ?? {};
    const persistedHistory = this.storage.read<{ history?: string[]; histIdx?: number }>(FORMATX_HISTORY_KEY) ?? {};
    const detected = this.detector.detectLanguage(SAMPLE_CODE);
    const state: FormatxState = {
      theme: prefs.theme ?? 'dark',
      accent: prefs.accent ?? 'oklch(0.62 0.2 255)',
      indent: prefs.indent ?? '  ',
      mode: prefs.mode ?? 'majority',
      input: SAMPLE_CODE,
      output: '',
      lang: detected.lang,
      autoLang: true,
      confidence: detected.confidence,
      style: this.formatter.analyzeStyle(SAMPLE_CODE),
      history: persistedHistory.history?.length ? persistedHistory.history : [SAMPLE_CODE],
      histIdx: persistedHistory.histIdx ?? 0
    };
    state.output = this.formatter.formatCode(state.input, state.lang, { mode: state.mode, indent: state.indent });
    return state;
  }
}
