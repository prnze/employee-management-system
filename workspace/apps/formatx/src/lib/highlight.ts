import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markup"; // html, xml
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";

import type { Lang } from "./formatters";

const langMap: Record<Lang, string> = {
  javascript: "javascript",
  typescript: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  html: "markup",
  xml: "markup",
  css: "css",
  scss: "scss",
  json: "json",
  yaml: "yaml",
  markdown: "markdown",
  python: "python",
  java: "java",
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  php: "php",
  sql: "sql",
  bash: "bash",
  plaintext: "plaintext",
};

export function highlight(code: string, lang: Lang): string {
  const grammar = (Prism.languages as any)[langMap[lang]];
  if (!grammar) return escapeHtml(code);
  try {
    return Prism.highlight(code, grammar, langMap[lang]);
  } catch {
    return escapeHtml(code);
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
}

export function useHighlighted(code: string, lang: Lang) {
  return useMemo(() => highlight(code, lang), [code, lang]);
}

// Re-export hooks barrel-style for convenience
export { useEffect, useMemo, useRef, useState, useCallback };
