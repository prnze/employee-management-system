import { Injectable } from '@angular/core';
import { LANGUAGES } from '../constants/formatx.constants';
import { Lang } from '../models/formatx.models';

@Injectable({ providedIn: 'root' })
export class LanguageDetectorService {
  detectLanguage(code: string): { lang: Lang; confidence: number } {
    const c = code.trim();
    if (!c) return { lang: 'plaintext', confidence: 0 };
    if (/^[\s]*[\{\[]/.test(c) && /[\}\]][\s]*$/.test(c)) {
      try {
        JSON.parse(c);
        return { lang: 'json', confidence: 0.99 };
      } catch {}
    }
    if (/^<!DOCTYPE\s+html/i.test(c) || /<html[\s>]/i.test(c)) return { lang: 'html', confidence: 0.97 };
    if (/^<\?xml/.test(c)) return { lang: 'xml', confidence: 0.98 };
    if (/^#{1,6}\s+\S/m.test(c) && /\n/.test(c)) return { lang: 'markdown', confidence: 0.78 };
    if (/^#!\s*\/.*\b(bash|sh|zsh)\b/.test(c)) return { lang: 'bash', confidence: 0.98 };
    if (/^\s*(def |class |import |from |print\()/m.test(c) && !/;\s*$/m.test(c)) return { lang: 'python', confidence: 0.85 };
    if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(c) && /\b(FROM|INTO|TABLE|WHERE)\b/i.test(c)) return { lang: 'sql', confidence: 0.9 };
    if (/<\?php/.test(c)) return { lang: 'php', confidence: 0.98 };
    if (/\busing\s+System\b|\bnamespace\s+\w+/.test(c)) return { lang: 'csharp', confidence: 0.85 };
    if (/\bpublic\s+(class|interface|static\s+void\s+main)/.test(c)) return { lang: 'java', confidence: 0.88 };
    if (/#include\s*<[^>]+>/.test(c)) {
      if (/\b(std::|cout|cin|template|class\s+\w+)/.test(c)) return { lang: 'cpp', confidence: 0.85 };
      return { lang: 'c', confidence: 0.78 };
    }
    if (/^[\w-]+:\s*\S|^- \w/m.test(c) && !/[{};]/.test(c.slice(0, 200))) return { lang: 'yaml', confidence: 0.72 };
    if (/[@$]\w+|&\s*[:.]/m.test(c) && /\{[\s\S]*\}/.test(c) && /:[^;]+;/.test(c)) return { lang: 'scss', confidence: 0.82 };
    if (/^[^{]*\{[\s\S]*?:\s*[^;]+;[\s\S]*?\}/m.test(c)) return { lang: 'css', confidence: 0.85 };
    if (/(:\s*(string|number|boolean|any|unknown|void)\b)|\binterface\s+\w+|\btype\s+\w+\s*=/.test(c)) {
      if (/<\/?\w+[^>]*>/.test(c)) return { lang: 'tsx', confidence: 0.86 };
      return { lang: 'typescript', confidence: 0.9 };
    }
    if (/<\/?\w+[^>]*>/.test(c) && /\b(function|const|let|=>|import)\b/.test(c)) return { lang: 'jsx', confidence: 0.78 };
    if (/\b(function|const|let|var|=>|console\.log|require\()/.test(c)) return { lang: 'javascript', confidence: 0.86 };
    if (/<\/?\w+[^>]*>/.test(c)) return { lang: 'html', confidence: 0.6 };
    return { lang: 'plaintext', confidence: 0.3 };
  }

  extToLang(name: string): Lang | null {
    const ext = name.split('.').pop()?.toLowerCase();
    if (!ext) return null;
    for (const language of LANGUAGES) {
      if (language.ext.includes(ext)) return language.id;
    }
    return null;
  }
}
