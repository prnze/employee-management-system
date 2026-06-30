export type FormatMode = 'majority' | 'standard' | 'compact' | 'expanded' | 'strict' | 'preserve';

export type FormatxTheme = 'light' | 'dark' | 'pitch';

export type Lang =
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'html'
  | 'css'
  | 'scss'
  | 'json'
  | 'xml'
  | 'yaml'
  | 'markdown'
  | 'python'
  | 'java'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'php'
  | 'sql'
  | 'bash'
  | 'plaintext';

export interface FormatOptions {
  mode: FormatMode;
  indent: string;
}

export interface DetectedStyle {
  indent: string;
  indentLabel: string;
  quotes: 'single' | 'double' | 'mixed';
  semicolons: boolean;
  braceStyle: 'same-line' | 'next-line' | 'mixed';
  trailingCommas: boolean;
  naming: string;
}

export interface LanguageInfo {
  id: Lang;
  label: string;
  ext: string[];
}

export interface AccentOption {
  name: string;
  value: string;
}

export interface EditorStats {
  lines: number;
  chars: number;
  size: string;
}

export interface FormatxPrefs {
  theme: FormatxTheme;
  accent: string;
  indent: string;
  mode: FormatMode;
}

export interface FormatxState extends FormatxPrefs {
  input: string;
  output: string;
  lang: Lang;
  autoLang: boolean;
  confidence: number;
  style: DetectedStyle | null;
  history: string[];
  histIdx: number;
}
