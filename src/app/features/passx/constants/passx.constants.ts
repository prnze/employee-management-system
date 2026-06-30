import { AccentKey, PassOptions, PassxMode } from '../models/passx.models';

export const PASSX_STORAGE_KEY = 'passx-store';

export const DEFAULT_PASS_OPTIONS: PassOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  extendedSymbols: false,
  spaces: false,
  excludeAmbiguous: false,
  excludeSimilar: true,
  excludeDuplicates: false,
  avoidSequential: false,
  avoidRepeated: false,
  enforceEach: true,
  mode: 'standard'
};

export const PASSWORD_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*',
  extendedSymbols: '()_+-=[]{}|;:,.<>?/~`',
  spaces: ' ',
  ambiguous: '{}[]()/\\\'"`~,;:.<>',
  similar: '0Oo1lI|'
} as const;

export const PASSX_WORDS = [
  'apple',
  'ocean',
  'river',
  'mountain',
  'stellar',
  'quantum',
  'velvet',
  'copper',
  'crystal',
  'horizon',
  'summit',
  'forest',
  'glacier',
  'ember',
  'prism',
  'nebula',
  'cipher',
  'orbit',
  'cobalt',
  'ivory',
  'lunar',
  'aurora',
  'cascade',
  'matrix',
  'tundra',
  'zenith',
  'onyx',
  'saffron',
  'mirage',
  'echo'
] as const;

export const PASSX_MODES: PassxMode[] = ['standard', 'pronounceable', 'passphrase', 'memorable', 'pin'];

export const ACCENTS: Record<AccentKey, string> = {
  blue: 'oklch(0.62 0.18 255)',
  violet: 'oklch(0.62 0.19 292)',
  pink: 'oklch(0.66 0.20 345)',
  red: 'oklch(0.62 0.22 27)',
  orange: 'oklch(0.70 0.18 50)',
  yellow: 'oklch(0.78 0.16 85)',
  green: 'oklch(0.68 0.17 145)',
  teal: 'oklch(0.70 0.15 180)',
  cyan: 'oklch(0.72 0.15 220)',
  custom: '#5b8def'
};

export const OPTION_ROWS = [
  { key: 'uppercase', label: 'Uppercase', hint: 'A-Z' },
  { key: 'lowercase', label: 'Lowercase', hint: 'a-z' },
  { key: 'numbers', label: 'Numbers', hint: '0-9' },
  { key: 'symbols', label: 'Symbols', hint: '!@#$%^&*' },
  { key: 'extendedSymbols', label: 'Extended symbols', hint: '()[]{}|;:,' },
  { key: 'spaces', label: 'Spaces', hint: 'word-style' },
  { key: 'excludeSimilar', label: 'Exclude similar', hint: '0/O - 1/l/I' },
  { key: 'excludeAmbiguous', label: 'Exclude ambiguous', hint: '{}[]()/\\' },
  { key: 'excludeDuplicates', label: 'No duplicates', hint: 'unique chars only' },
  { key: 'avoidSequential', label: 'No sequential', hint: 'ab, 12 disallowed' },
  { key: 'avoidRepeated', label: 'No repeated', hint: 'aa, 11 disallowed' },
  { key: 'enforceEach', label: 'Enforce each', hint: 'at least one per set' }
] as const;
