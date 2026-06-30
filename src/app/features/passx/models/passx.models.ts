export type PassxMode = 'standard' | 'pronounceable' | 'passphrase' | 'memorable' | 'pin';
export type PassxTheme = 'light' | 'dark' | 'black';
export type AccentKey = 'blue' | 'violet' | 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'cyan' | 'custom';

export interface PassOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  extendedSymbols: boolean;
  spaces: boolean;
  excludeAmbiguous: boolean;
  excludeSimilar: boolean;
  excludeDuplicates: boolean;
  avoidSequential: boolean;
  avoidRepeated: boolean;
  enforceEach: boolean;
  mode: PassxMode;
}

export interface HistoryEntry {
  id: string;
  password: string;
  at: number;
  entropy: number;
  options?: PassOptions;
}

export interface FavoritePreset {
  id: string;
  name: string;
  options: PassOptions;
}

export interface StrengthResult {
  label: string;
  score: number;
  color: string;
}

export interface CharacterDistribution {
  upper: number;
  lower: number;
  number: number;
  symbol: number;
}

export interface PassxState {
  theme: PassxTheme;
  accent: AccentKey;
  customAccent: string;
  options: PassOptions;
  history: HistoryEntry[];
  favorites: FavoritePreset[];
}
