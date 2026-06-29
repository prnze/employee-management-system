// Lightweight code formatters. No external prettier dependency to keep bundle small.
// Each formatter takes (code, opts) and returns formatted code.

export type FormatMode =
  | "majority"
  | "standard"
  | "compact"
  | "expanded"
  | "strict"
  | "preserve";

export interface FormatOpts {
  mode: FormatMode;
  indent: string; // e.g. "  " or "\t"
}

export interface DetectedStyle {
  indent: string;
  indentLabel: string;
  quotes: "single" | "double" | "mixed";
  semicolons: boolean;
  braceStyle: "same-line" | "next-line" | "mixed";
  trailingCommas: boolean;
  naming: string;
}

const LANGS = [
  "javascript","typescript","jsx","tsx","html","css","scss","json","xml","yaml","markdown","python","java","c","cpp","csharp","php","sql","bash","plaintext",
] as const;
export type Lang = (typeof LANGS)[number];

export const LANGUAGES: { id: Lang; label: string; ext: string[] }[] = [
  { id: "javascript", label: "JavaScript", ext: ["js", "mjs", "cjs"] },
  { id: "typescript", label: "TypeScript", ext: ["ts"] },
  { id: "jsx", label: "JSX", ext: ["jsx"] },
  { id: "tsx", label: "TSX", ext: ["tsx"] },
  { id: "html", label: "HTML", ext: ["html", "htm"] },
  { id: "css", label: "CSS", ext: ["css"] },
  { id: "scss", label: "SCSS", ext: ["scss", "sass"] },
  { id: "json", label: "JSON", ext: ["json"] },
  { id: "xml", label: "XML", ext: ["xml", "svg"] },
  { id: "yaml", label: "YAML", ext: ["yml", "yaml"] },
  { id: "markdown", label: "Markdown", ext: ["md", "markdown"] },
  { id: "python", label: "Python", ext: ["py"] },
  { id: "java", label: "Java", ext: ["java"] },
  { id: "c", label: "C", ext: ["c", "h"] },
  { id: "cpp", label: "C++", ext: ["cpp", "cc", "cxx", "hpp"] },
  { id: "csharp", label: "C#", ext: ["cs"] },
  { id: "php", label: "PHP", ext: ["php"] },
  { id: "sql", label: "SQL", ext: ["sql"] },
  { id: "bash", label: "Bash", ext: ["sh", "bash"] },
  { id: "plaintext", label: "Plain Text", ext: ["txt"] },
];

// ---------- Detection ----------
export function detectLanguage(code: string): { lang: Lang; confidence: number } {
  const c = code.trim();
  if (!c) return { lang: "plaintext", confidence: 0 };

  // JSON
  if (/^[\s]*[\{\[]/.test(c) && /[\}\]][\s]*$/.test(c)) {
    try { JSON.parse(c); return { lang: "json", confidence: 0.99 }; } catch {}
  }
  // HTML
  if (/^<!DOCTYPE\s+html/i.test(c) || /<html[\s>]/i.test(c)) return { lang: "html", confidence: 0.97 };
  // XML
  if (/^<\?xml/.test(c)) return { lang: "xml", confidence: 0.98 };
  // Markdown
  if (/^#{1,6}\s+\S/m.test(c) && /\n/.test(c)) return { lang: "markdown", confidence: 0.78 };
  // Bash
  if (/^#!\s*\/.*\b(bash|sh|zsh)\b/.test(c)) return { lang: "bash", confidence: 0.98 };
  // Python
  if (/^\s*(def |class |import |from |print\()/m.test(c) && !/;\s*$/m.test(c)) return { lang: "python", confidence: 0.85 };
  // SQL
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(c) && /\b(FROM|INTO|TABLE|WHERE)\b/i.test(c))
    return { lang: "sql", confidence: 0.9 };
  // PHP
  if (/<\?php/.test(c)) return { lang: "php", confidence: 0.98 };
  // C#
  if (/\busing\s+System\b|\bnamespace\s+\w+/.test(c)) return { lang: "csharp", confidence: 0.85 };
  // Java
  if (/\bpublic\s+(class|interface|static\s+void\s+main)/.test(c)) return { lang: "java", confidence: 0.88 };
  // C++ vs C
  if (/#include\s*<[^>]+>/.test(c)) {
    if (/\b(std::|cout|cin|template|class\s+\w+)/.test(c)) return { lang: "cpp", confidence: 0.85 };
    return { lang: "c", confidence: 0.78 };
  }
  // YAML
  if (/^[\w-]+:\s*\S|^- \w/m.test(c) && !/[{};]/.test(c.slice(0, 200))) return { lang: "yaml", confidence: 0.72 };
  // SCSS
  if (/[@$]\w+|&\s*[:.]/m.test(c) && /\{[\s\S]*\}/.test(c) && /:[^;]+;/.test(c)) return { lang: "scss", confidence: 0.82 };
  // CSS
  if (/^[^{]*\{[\s\S]*?:\s*[^;]+;[\s\S]*?\}/m.test(c)) return { lang: "css", confidence: 0.85 };
  // TypeScript
  if (/(:\s*(string|number|boolean|any|unknown|void)\b)|\binterface\s+\w+|\btype\s+\w+\s*=/.test(c)) {
    if (/<\/?\w+[^>]*>/.test(c)) return { lang: "tsx", confidence: 0.86 };
    return { lang: "typescript", confidence: 0.9 };
  }
  // JSX
  if (/<\/?\w+[^>]*>/.test(c) && /\b(function|const|let|=>|import)\b/.test(c))
    return { lang: "jsx", confidence: 0.78 };
  // JavaScript
  if (/\b(function|const|let|var|=>|console\.log|require\()/.test(c)) return { lang: "javascript", confidence: 0.86 };
  // HTML loose
  if (/<\/?\w+[^>]*>/.test(c)) return { lang: "html", confidence: 0.6 };

  return { lang: "plaintext", confidence: 0.3 };
}

// ---------- Style analysis ----------
export function analyzeStyle(code: string): DetectedStyle {
  const lines = code.split("\n");
  let tabCount = 0;
  let spaceCounts: Record<number, number> = {};
  for (const ln of lines) {
    const m = ln.match(/^(\t+| +)/);
    if (!m) continue;
    if (m[1][0] === "\t") tabCount++;
    else {
      const n = m[1].length;
      // count smallest unit
      for (const u of [2, 4, 8]) if (n % u === 0) { spaceCounts[u] = (spaceCounts[u] || 0) + 1; break; }
    }
  }
  const topSpace = Object.entries(spaceCounts).sort((a, b) => b[1] - a[1])[0];
  let indent = "  ";
  let indentLabel = "2 spaces";
  if (tabCount > (topSpace ? topSpace[1] : 0)) { indent = "\t"; indentLabel = "Tabs"; }
  else if (topSpace) { indent = " ".repeat(+topSpace[0]); indentLabel = `${topSpace[0]} spaces`; }

  const single = (code.match(/'/g) || []).length;
  const double = (code.match(/"/g) || []).length;
  const quotes = single > double * 1.2 ? "single" : double > single * 1.2 ? "double" : "mixed";

  const lineEnds = lines.filter((l) => l.trim() && !l.trim().startsWith("//") && !l.trim().startsWith("#"));
  const semi = lineEnds.filter((l) => /;\s*$/.test(l)).length;
  const semicolons = semi > lineEnds.length * 0.4;

  const sameLine = (code.match(/\)\s*\{/g) || []).length;
  const nextLine = (code.match(/\)\s*\n\s*\{/g) || []).length;
  const braceStyle = sameLine > nextLine * 1.2 ? "same-line" : nextLine > sameLine * 1.2 ? "next-line" : "mixed";

  const trailingCommas = /,\s*[\)\]\}]/.test(code);

  let naming = "mixed";
  const camel = (code.match(/\b[a-z][a-zA-Z0-9]*[A-Z]\w*\b/g) || []).length;
  const snake = (code.match(/\b[a-z]+(_[a-z0-9]+)+\b/g) || []).length;
  if (camel > snake * 1.5) naming = "camelCase";
  else if (snake > camel * 1.5) naming = "snake_case";

  return { indent, indentLabel, quotes, semicolons, braceStyle, trailingCommas, naming };
}

// ---------- Generic brace-based formatter ----------
function formatBracey(code: string, indent: string, opts: { compact?: boolean; expanded?: boolean; nextLineBrace?: boolean }) {
  // Strip empty lines for compact, normalize otherwise. Single-pass char walker.
  let out = "";
  let depth = 0;
  let i = 0;
  const src = code.replace(/\r\n/g, "\n");
  let line = "";
  let inStr: string | null = null;
  let inLineComment = false;
  let inBlockComment = false;

  const pushLine = () => {
    const t = line.replace(/\s+$/g, "");
    if (t.trim() === "") {
      if (!opts.compact && out.endsWith("\n\n")) { line = ""; return; }
      out += opts.compact ? "" : "\n";
    } else {
      out += indent.repeat(Math.max(0, depth)) + t.trim() + "\n";
      if (opts.expanded && /[;{}]$/.test(t.trim())) {
        // no extra blank between simple statements
      }
    }
    line = "";
  };

  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];

    if (inLineComment) {
      if (ch === "\n") { inLineComment = false; pushLine(); }
      else line += ch;
      i++; continue;
    }
    if (inBlockComment) {
      line += ch;
      if (ch === "*" && next === "/") { line += "/"; i += 2; inBlockComment = false; continue; }
      i++; continue;
    }
    if (inStr) {
      line += ch;
      if (ch === "\\") { line += next; i += 2; continue; }
      if (ch === inStr) inStr = null;
      i++; continue;
    }
    if (ch === "/" && next === "/") { inLineComment = true; line += "//"; i += 2; continue; }
    if (ch === "/" && next === "*") { inBlockComment = true; line += "/*"; i += 2; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; line += ch; i++; continue; }

    if (ch === "{") {
      if (opts.nextLineBrace) {
        pushLine();
        out += indent.repeat(Math.max(0, depth)) + "{\n";
      } else {
        line = line.replace(/\s+$/, "") + " {";
        pushLine();
      }
      depth++;
      i++; continue;
    }
    if (ch === "}") {
      pushLine();
      depth = Math.max(0, depth - 1);
      out += indent.repeat(depth) + "}\n";
      i++; continue;
    }
    if (ch === ";") {
      line += ";";
      pushLine();
      i++; continue;
    }
    if (ch === "\n") { pushLine(); i++; continue; }
    line += ch;
    i++;
  }
  if (line.trim()) pushLine();
  // collapse extra blank lines
  out = out.replace(/\n{3,}/g, opts.compact ? "\n" : "\n\n");
  return out.trimEnd() + "\n";
}

// ---------- JSON ----------
function formatJSON(code: string, indent: string, opts: { compact?: boolean }) {
  try {
    const obj = JSON.parse(code);
    return opts.compact ? JSON.stringify(obj) : JSON.stringify(obj, null, indent) + "\n";
  } catch {
    return code;
  }
}

// ---------- XML / HTML ----------
function formatXmlLike(code: string, indent: string) {
  const src = code.replace(/>\s+</g, "><").trim();
  let depth = 0;
  let out = "";
  const voidTags = new Set(["area","base","br","col","embed","hr","img","input","link","meta","source","track","wbr"]);
  const tokens = src.split(/(<[^>]+>)/g).filter(Boolean);
  for (let t of tokens) {
    if (!t.startsWith("<")) {
      const text = t.trim();
      if (text) out += indent.repeat(depth) + text + "\n";
      continue;
    }
    const isClose = /^<\//.test(t);
    const isSelf = /\/>$/.test(t) || (() => {
      const name = t.match(/^<\s*([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase();
      return name ? voidTags.has(name) : false;
    })();
    const isDecl = /^<[!?]/.test(t);
    const isComment = /^<!--/.test(t);
    if (isClose) depth = Math.max(0, depth - 1);
    out += indent.repeat(depth) + t + "\n";
    if (!isClose && !isSelf && !isDecl && !isComment) depth++;
  }
  return out.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

// ---------- CSS / SCSS ----------
function formatCss(code: string, indent: string, opts: { compact?: boolean }) {
  if (opts.compact) {
    return code.replace(/\s*\{\s*/g, "{").replace(/;\s*/g, ";").replace(/\s*\}\s*/g, "}").trim();
  }
  let out = "";
  let depth = 0;
  const src = code.replace(/\s*\{\s*/g, " {\n").replace(/;\s*/g, ";\n").replace(/\s*\}\s*/g, "\n}\n");
  for (const raw of src.split("\n")) {
    const ln = raw.trim();
    if (!ln) continue;
    if (ln === "}") { depth = Math.max(0, depth - 1); out += indent.repeat(depth) + "}\n"; continue; }
    out += indent.repeat(depth) + ln + "\n";
    if (ln.endsWith("{")) depth++;
  }
  return out.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

// ---------- YAML / Markdown / Python / Plain ----------
function normalizeIndent(code: string, indent: string) {
  const lines = code.replace(/\r\n/g, "\n").split("\n");
  // detect existing
  const style = analyzeStyle(code);
  const from = style.indent;
  if (from === indent) return code.trimEnd() + "\n";
  return lines.map((l) => {
    const m = l.match(/^((?:\t| {2,})+)/);
    if (!m) return l;
    const lead = m[1];
    let level = 0;
    if (from === "\t") level = (lead.match(/\t/g) || []).length;
    else level = Math.floor(lead.replace(/\t/g, " ".repeat(from.length)).length / from.length);
    return indent.repeat(level) + l.slice(lead.length);
  }).join("\n").trimEnd() + "\n";
}

function formatSql(code: string, indent: string) {
  const keywords = ["SELECT","FROM","WHERE","AND","OR","INNER JOIN","LEFT JOIN","RIGHT JOIN","JOIN","ON","GROUP BY","ORDER BY","HAVING","LIMIT","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","UNION","UNION ALL"];
  let s = code.replace(/\s+/g, " ").trim();
  for (const kw of keywords) {
    const re = new RegExp(`\\s*\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    s = s.replace(re, "\n" + kw.toUpperCase());
  }
  s = s.replace(/,\s*/g, ",\n" + indent);
  s = s.replace(/;\s*/g, ";\n\n");
  return s.split("\n").map((l) => l.replace(/^\s+/, "")).join("\n").trim() + "\n";
}

// ---------- Public format ----------
export function formatCode(code: string, lang: Lang, opts: FormatOpts): string {
  const { mode } = opts;
  let indent = opts.indent;
  if (mode === "preserve") return code; // untouched
  if (mode === "majority") {
    const style = analyzeStyle(code);
    indent = style.indent;
  }
  const compact = mode === "compact";
  const expanded = mode === "expanded";
  const nextLineBrace = mode === "strict" && (lang === "c" || lang === "cpp" || lang === "csharp");

  try {
    switch (lang) {
      case "json":
        return formatJSON(code, indent, { compact });
      case "html":
      case "xml":
        return formatXmlLike(code, indent);
      case "css":
      case "scss":
        return formatCss(code, indent, { compact });
      case "yaml":
      case "markdown":
      case "python":
      case "bash":
      case "plaintext":
        return normalizeIndent(code, indent);
      case "sql":
        return formatSql(code, indent);
      case "javascript":
      case "typescript":
      case "jsx":
      case "tsx":
      case "java":
      case "c":
      case "cpp":
      case "csharp":
      case "php":
        return formatBracey(code, indent, { compact, expanded, nextLineBrace });
      default:
        return code;
    }
  } catch (e) {
    return code;
  }
}

export function bytesOf(s: string): string {
  const n = new Blob([s]).size;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function extToLang(name: string): Lang | null {
  const ext = name.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  for (const l of LANGUAGES) if (l.ext.includes(ext)) return l.id;
  return null;
}
