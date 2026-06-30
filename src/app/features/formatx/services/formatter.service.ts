import { Injectable } from '@angular/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import { DetectedStyle, FormatOptions, Lang } from '../models/formatx.models';

@Injectable({ providedIn: 'root' })
export class FormatterService {
  private readonly langMap: Record<Lang, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    jsx: 'jsx',
    tsx: 'tsx',
    html: 'markup',
    xml: 'markup',
    css: 'css',
    scss: 'scss',
    json: 'json',
    yaml: 'yaml',
    markdown: 'markdown',
    python: 'python',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    csharp: 'csharp',
    php: 'php',
    sql: 'sql',
    bash: 'bash',
    plaintext: 'plaintext'
  };

  analyzeStyle(code: string): DetectedStyle {
    const lines = code.split('\n');
    let tabCount = 0;
    const spaceCounts: Record<number, number> = {};
    for (const line of lines) {
      const match = line.match(/^(\t+| +)/);
      if (!match) continue;
      if (match[1][0] === '\t') tabCount += 1;
      else {
        const amount = match[1].length;
        for (const unit of [2, 4, 8]) {
          if (amount % unit === 0) {
            spaceCounts[unit] = (spaceCounts[unit] || 0) + 1;
            break;
          }
        }
      }
    }
    const topSpace = Object.entries(spaceCounts).sort((a, b) => b[1] - a[1])[0];
    let indent = '  ';
    let indentLabel = '2 spaces';
    if (tabCount > (topSpace ? topSpace[1] : 0)) {
      indent = '\t';
      indentLabel = 'Tabs';
    } else if (topSpace) {
      indent = ' '.repeat(Number(topSpace[0]));
      indentLabel = `${topSpace[0]} spaces`;
    }

    const single = (code.match(/'/g) || []).length;
    const double = (code.match(/"/g) || []).length;
    const quotes = single > double * 1.2 ? 'single' : double > single * 1.2 ? 'double' : 'mixed';
    const lineEnds = lines.filter((line) => line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#'));
    const semi = lineEnds.filter((line) => /;\s*$/.test(line)).length;
    const semicolons = semi > lineEnds.length * 0.4;
    const sameLine = (code.match(/\)\s*\{/g) || []).length;
    const nextLine = (code.match(/\)\s*\n\s*\{/g) || []).length;
    const braceStyle = sameLine > nextLine * 1.2 ? 'same-line' : nextLine > sameLine * 1.2 ? 'next-line' : 'mixed';
    const trailingCommas = /,\s*[\)\]\}]/.test(code);
    let naming = 'mixed';
    const camel = (code.match(/\b[a-z][a-zA-Z0-9]*[A-Z]\w*\b/g) || []).length;
    const snake = (code.match(/\b[a-z]+(_[a-z0-9]+)+\b/g) || []).length;
    if (camel > snake * 1.5) naming = 'camelCase';
    else if (snake > camel * 1.5) naming = 'snake_case';

    return { indent, indentLabel, quotes, semicolons, braceStyle, trailingCommas, naming };
  }

  formatCode(code: string, lang: Lang, opts: FormatOptions): string {
    const { mode } = opts;
    let indent = opts.indent;
    if (mode === 'preserve') return code;
    if (mode === 'majority') indent = this.analyzeStyle(code).indent;
    const compact = mode === 'compact';
    const expanded = mode === 'expanded';
    const nextLineBrace = mode === 'strict' && (lang === 'c' || lang === 'cpp' || lang === 'csharp');
    try {
      switch (lang) {
        case 'json':
          return this.formatJSON(code, indent, { compact });
        case 'html':
        case 'xml':
          return this.formatXmlLike(code, indent);
        case 'css':
        case 'scss':
          return this.formatCss(code, indent, { compact });
        case 'yaml':
        case 'markdown':
        case 'python':
        case 'bash':
        case 'plaintext':
          return this.normalizeIndent(code, indent);
        case 'sql':
          return this.formatSql(code, indent);
        case 'javascript':
        case 'typescript':
        case 'jsx':
        case 'tsx':
        case 'java':
        case 'c':
        case 'cpp':
        case 'csharp':
        case 'php':
          return this.formatBracey(code, indent, { compact, expanded, nextLineBrace });
        default:
          return code;
      }
    } catch {
      return code;
    }
  }

  bytesOf(value: string): string {
    const size = new Blob([value]).size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }

  highlight(code: string, lang: Lang): string {
    const grammarId = this.langMap[lang];
    const grammar = Prism.languages[grammarId];
    if (!grammar) return this.escapeHtml(code);
    try {
      return Prism.highlight(code, grammar, grammarId);
    } catch {
      return this.escapeHtml(code);
    }
  }

  private formatBracey(code: string, indent: string, opts: { compact?: boolean; expanded?: boolean; nextLineBrace?: boolean }): string {
    let out = '';
    let depth = 0;
    let index = 0;
    const src = code.replace(/\r\n/g, '\n');
    let line = '';
    let inStr: string | null = null;
    let inLineComment = false;
    let inBlockComment = false;

    const pushLine = () => {
      const trimmedLine = line.replace(/\s+$/g, '');
      if (trimmedLine.trim() === '') {
        if (!opts.compact && out.endsWith('\n\n')) {
          line = '';
          return;
        }
        out += opts.compact ? '' : '\n';
      } else {
        out += indent.repeat(Math.max(0, depth)) + trimmedLine.trim() + '\n';
        if (opts.expanded && /[;{}]$/.test(trimmedLine.trim())) {}
      }
      line = '';
    };

    while (index < src.length) {
      const ch = src[index];
      const next = src[index + 1];
      if (inLineComment) {
        if (ch === '\n') {
          inLineComment = false;
          pushLine();
        } else line += ch;
        index += 1;
        continue;
      }
      if (inBlockComment) {
        line += ch;
        if (ch === '*' && next === '/') {
          line += '/';
          index += 2;
          inBlockComment = false;
          continue;
        }
        index += 1;
        continue;
      }
      if (inStr) {
        line += ch;
        if (ch === '\\') {
          line += next;
          index += 2;
          continue;
        }
        if (ch === inStr) inStr = null;
        index += 1;
        continue;
      }
      if (ch === '/' && next === '/') {
        inLineComment = true;
        line += '//';
        index += 2;
        continue;
      }
      if (ch === '/' && next === '*') {
        inBlockComment = true;
        line += '/*';
        index += 2;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        inStr = ch;
        line += ch;
        index += 1;
        continue;
      }
      if (ch === '{') {
        if (opts.nextLineBrace) {
          pushLine();
          out += indent.repeat(Math.max(0, depth)) + '{\n';
        } else {
          line = line.replace(/\s+$/, '') + ' {';
          pushLine();
        }
        depth += 1;
        index += 1;
        continue;
      }
      if (ch === '}') {
        pushLine();
        depth = Math.max(0, depth - 1);
        out += indent.repeat(depth) + '}\n';
        index += 1;
        continue;
      }
      if (ch === ';') {
        line += ';';
        pushLine();
        index += 1;
        continue;
      }
      if (ch === '\n') {
        pushLine();
        index += 1;
        continue;
      }
      line += ch;
      index += 1;
    }
    if (line.trim()) pushLine();
    out = out.replace(/\n{3,}/g, opts.compact ? '\n' : '\n\n');
    return out.trimEnd() + '\n';
  }

  private formatJSON(code: string, indent: string, opts: { compact?: boolean }): string {
    try {
      const obj = JSON.parse(code);
      return opts.compact ? JSON.stringify(obj) : JSON.stringify(obj, null, indent) + '\n';
    } catch {
      return code;
    }
  }

  private formatXmlLike(code: string, indent: string): string {
    const src = code.replace(/>\s+</g, '><').trim();
    let depth = 0;
    let out = '';
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
    const tokens = src.split(/(<[^>]+>)/g).filter(Boolean);
    for (const token of tokens) {
      if (!token.startsWith('<')) {
        const text = token.trim();
        if (text) out += indent.repeat(depth) + text + '\n';
        continue;
      }
      const isClose = /^<\//.test(token);
      const isSelf = /\/>$/.test(token) || (() => {
        const name = token.match(/^<\s*([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase();
        return name ? voidTags.has(name) : false;
      })();
      const isDecl = /^<[!?]/.test(token);
      const isComment = /^<!--/.test(token);
      if (isClose) depth = Math.max(0, depth - 1);
      out += indent.repeat(depth) + token + '\n';
      if (!isClose && !isSelf && !isDecl && !isComment) depth += 1;
    }
    return out.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  }

  private formatCss(code: string, indent: string, opts: { compact?: boolean }): string {
    if (opts.compact) return code.replace(/\s*\{\s*/g, '{').replace(/;\s*/g, ';').replace(/\s*\}\s*/g, '}').trim();
    let out = '';
    let depth = 0;
    const src = code.replace(/\s*\{\s*/g, ' {\n').replace(/;\s*/g, ';\n').replace(/\s*\}\s*/g, '\n}\n');
    for (const raw of src.split('\n')) {
      const line = raw.trim();
      if (!line) continue;
      if (line === '}') {
        depth = Math.max(0, depth - 1);
        out += indent.repeat(depth) + '}\n';
        continue;
      }
      out += indent.repeat(depth) + line + '\n';
      if (line.endsWith('{')) depth += 1;
    }
    return out.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  }

  private normalizeIndent(code: string, indent: string): string {
    const lines = code.replace(/\r\n/g, '\n').split('\n');
    const style = this.analyzeStyle(code);
    const from = style.indent;
    if (from === indent) return code.trimEnd() + '\n';
    return lines.map((line) => {
      const match = line.match(/^((?:\t| {2,})+)/);
      if (!match) return line;
      const lead = match[1];
      let level = 0;
      if (from === '\t') level = (lead.match(/\t/g) || []).length;
      else level = Math.floor(lead.replace(/\t/g, ' '.repeat(from.length)).length / from.length);
      return indent.repeat(level) + line.slice(lead.length);
    }).join('\n').trimEnd() + '\n';
  }

  private formatSql(code: string, indent: string): string {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'UNION', 'UNION ALL'];
    let value = code.replace(/\s+/g, ' ').trim();
    for (const keyword of keywords) {
      const re = new RegExp(`\\s*\\b${keyword.replace(/ /g, '\\s+')}\\b`, 'gi');
      value = value.replace(re, '\n' + keyword.toUpperCase());
    }
    value = value.replace(/,\s*/g, ',\n' + indent);
    value = value.replace(/;\s*/g, ';\n\n');
    return value.split('\n').map((line) => line.replace(/^\s+/, '')).join('\n').trim() + '\n';
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char] || char);
  }
}
