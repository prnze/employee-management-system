import { AccentOption, FormatMode, LanguageInfo } from '../models/formatx.models';

export const FORMATX_PREFS_KEY = 'formatx-prefs';
export const FORMATX_HISTORY_KEY = 'formatx-history';

export const SAMPLE_CODE = `function greet(name){const message='Hello, '+name+'!';
if(name){console.log(message);return message;}else{return null;}}
const user={name:'Ada',role:'admin',perms:['read','write']};
greet(user.name);`;

export const ACCENTS: AccentOption[] = [
  { name: 'Blue', value: 'oklch(0.62 0.2 255)' },
  { name: 'Purple', value: 'oklch(0.6 0.24 295)' },
  { name: 'Pink', value: 'oklch(0.7 0.22 350)' },
  { name: 'Orange', value: 'oklch(0.72 0.2 50)' },
  { name: 'Green', value: 'oklch(0.7 0.18 150)' },
  { name: 'Red', value: 'oklch(0.62 0.24 25)' },
  { name: 'Yellow', value: 'oklch(0.85 0.18 95)' },
  { name: 'Cyan', value: 'oklch(0.78 0.14 200)' },
  { name: 'White', value: 'oklch(0.97 0 0)' }
];

export const MODES: { id: FormatMode; label: string; hint: string }[] = [
  { id: 'majority', label: 'Majority Lines', hint: 'Match dominant style' },
  { id: 'standard', label: 'Standard', hint: 'Industry defaults' },
  { id: 'compact', label: 'Compact', hint: 'Minimal spacing' },
  { id: 'expanded', label: 'Expanded', hint: 'Maximum readability' },
  { id: 'strict', label: 'Strict', hint: 'Language conventions' },
  { id: 'preserve', label: 'Preserve', hint: 'Keep original style' }
];

export const LANGUAGES: LanguageInfo[] = [
  { id: 'javascript', label: 'JavaScript', ext: ['js', 'mjs', 'cjs'] },
  { id: 'typescript', label: 'TypeScript', ext: ['ts'] },
  { id: 'jsx', label: 'JSX', ext: ['jsx'] },
  { id: 'tsx', label: 'TSX', ext: ['tsx'] },
  { id: 'html', label: 'HTML', ext: ['html', 'htm'] },
  { id: 'css', label: 'CSS', ext: ['css'] },
  { id: 'scss', label: 'SCSS', ext: ['scss', 'sass'] },
  { id: 'json', label: 'JSON', ext: ['json'] },
  { id: 'xml', label: 'XML', ext: ['xml', 'svg'] },
  { id: 'yaml', label: 'YAML', ext: ['yml', 'yaml'] },
  { id: 'markdown', label: 'Markdown', ext: ['md', 'markdown'] },
  { id: 'python', label: 'Python', ext: ['py'] },
  { id: 'java', label: 'Java', ext: ['java'] },
  { id: 'c', label: 'C', ext: ['c', 'h'] },
  { id: 'cpp', label: 'C++', ext: ['cpp', 'cc', 'cxx', 'hpp'] },
  { id: 'csharp', label: 'C#', ext: ['cs'] },
  { id: 'php', label: 'PHP', ext: ['php'] },
  { id: 'sql', label: 'SQL', ext: ['sql'] },
  { id: 'bash', label: 'Bash', ext: ['sh', 'bash'] },
  { id: 'plaintext', label: 'Plain Text', ext: ['txt'] }
];
