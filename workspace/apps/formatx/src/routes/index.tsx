import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Download, Trash2, Upload, Sparkles, Wand2, Settings as SettingsIcon,
  Sun, Moon, Circle, ChevronDown, Check, Command as CmdIcon, FileCode2,
  Maximize2, Minimize2, RotateCcw, RotateCw, Search, X, Info, Zap,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  detectLanguage, analyzeStyle, formatCode, bytesOf, extToLang,
  LANGUAGES, type Lang, type FormatMode, type DetectedStyle,
} from "@/lib/formatters";
import { highlight } from "@/lib/highlight";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FormatX — AI-powered Code Formatter & Beautifier" },
      { name: "description", content: "Premium AI code formatter. Beautify, analyze, and convert JavaScript, TypeScript, HTML, CSS, JSON, Python and more with Apple-grade design." },
      { property: "og:title", content: "FormatX — AI Code Formatter" },
      { property: "og:description", content: "Beautify code in 19+ languages with smart style detection and a VisionOS-inspired interface." },
    ],
  }),
  component: FormatXApp,
});

type Theme = "light" | "dark" | "pitch";

const ACCENTS: { name: string; value: string }[] = [
  { name: "Blue", value: "oklch(0.62 0.2 255)" },
  { name: "Purple", value: "oklch(0.6 0.24 295)" },
  { name: "Pink", value: "oklch(0.7 0.22 350)" },
  { name: "Orange", value: "oklch(0.72 0.2 50)" },
  { name: "Green", value: "oklch(0.7 0.18 150)" },
  { name: "Red", value: "oklch(0.62 0.24 25)" },
  { name: "Yellow", value: "oklch(0.85 0.18 95)" },
  { name: "Cyan", value: "oklch(0.78 0.14 200)" },
  { name: "White", value: "oklch(0.97 0 0)" },
];

const MODES: { id: FormatMode; label: string; hint: string }[] = [
  { id: "majority", label: "Majority Lines", hint: "Match dominant style" },
  { id: "standard", label: "Standard", hint: "Industry defaults" },
  { id: "compact", label: "Compact", hint: "Minimal spacing" },
  { id: "expanded", label: "Expanded", hint: "Maximum readability" },
  { id: "strict", label: "Strict", hint: "Language conventions" },
  { id: "preserve", label: "Preserve", hint: "Keep original style" },
];

const SAMPLE = `function greet(name){const message='Hello, '+name+'!';
if(name){console.log(message);return message;}else{return null;}}
const user={name:'Ada',role:'admin',perms:['read','write']};
greet(user.name);`;

function FormatXApp() {
  // ---- state ----
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState(ACCENTS[0].value);
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState<Lang>("javascript");
  const [autoLang, setAutoLang] = useState(true);
  const [confidence, setConfidence] = useState(0);
  const [mode, setMode] = useState<FormatMode>("majority");
  const [indent, setIndent] = useState("  ");
  const [style, setStyle] = useState<DetectedStyle | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [history, setHistory] = useState<string[]>([SAMPLE]);
  const [histIdx, setHistIdx] = useState(0);
  const dropRef = useRef<HTMLDivElement>(null);

  // ---- load prefs ----
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("formatx-prefs") || "{}");
      if (saved.theme) setTheme(saved.theme);
      if (saved.accent) setAccent(saved.accent);
      if (saved.indent) setIndent(saved.indent);
      if (saved.mode) setMode(saved.mode);
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("formatx-prefs", JSON.stringify({ theme, accent, indent, mode }));
  }, [theme, accent, indent, mode]);

  // ---- theme application ----
  useEffect(() => {
    const el = document.documentElement;
    el.classList.remove("dark", "pitch");
    if (theme === "dark") el.classList.add("dark");
    if (theme === "pitch") el.classList.add("pitch");
    el.style.setProperty("--accent-color", accent);
    el.style.setProperty("--accent-foreground", theme === "light" ? "oklch(0.99 0 0)" : "oklch(0.1 0 0)");
  }, [theme, accent]);

  // ---- detect lang on input ----
  useEffect(() => {
    if (!autoLang) return;
    const { lang: l, confidence: c } = detectLanguage(input);
    setLang(l);
    setConfidence(c);
  }, [input, autoLang]);

  useEffect(() => { setStyle(analyzeStyle(input)); }, [input]);

  // ---- format ----
  const runFormat = useCallback(() => {
    const result = formatCode(input, lang, { mode, indent });
    setOutput(result);
    toast.success("Formatted", { description: `${lang.toUpperCase()} · ${MODES.find((m) => m.id === mode)?.label}` });
  }, [input, lang, mode, indent]);

  // initial format
  useEffect(() => { setOutput(formatCode(input, lang, { mode, indent })); /* eslint-disable-next-line */ }, []);

  // ---- history ----
  const pushHistory = (val: string) => {
    const next = history.slice(0, histIdx + 1);
    next.push(val);
    if (next.length > 50) next.shift();
    setHistory(next);
    setHistIdx(next.length - 1);
  };
  const undo = () => { if (histIdx > 0) { const i = histIdx - 1; setHistIdx(i); setInput(history[i]); } };
  const redo = () => { if (histIdx < history.length - 1) { const i = histIdx + 1; setHistIdx(i); setInput(history[i]); } };

  // ---- file ops ----
  const handleFile = async (file: File) => {
    const text = await file.text();
    setInput(text);
    pushHistory(text);
    const l = extToLang(file.name);
    if (l) { setLang(l); setAutoLang(false); }
    toast.success("File loaded", { description: file.name });
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove("ring-2");
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };
  const downloadOutput = () => {
    const ext = LANGUAGES.find((l) => l.id === lang)?.ext[0] || "txt";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `formatx.${ext}`; a.click();
    URL.revokeObjectURL(url);
  };
  const clearAll = () => { setInput(""); setOutput(""); pushHistory(""); };

  // ---- shortcuts ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); setShowPalette((v) => !v); }
      if (mod && e.shiftKey && e.key.toLowerCase() === "f") { e.preventDefault(); runFormat(); }
      if (mod && !e.shiftKey && e.key.toLowerCase() === "s") { e.preventDefault(); downloadOutput(); }
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (mod && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) { e.preventDefault(); redo(); }
      if (e.key === "Escape") { setShowPalette(false); setShowSettings(false); setShowAbout(false); setShowLangPicker(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runFormat, output, histIdx, history]);

  const inputStats = useMemo(() => {
    const lines = input.split("\n").length;
    const chars = input.length;
    return { lines, chars, size: bytesOf(input) };
  }, [input]);
  const outputStats = useMemo(() => {
    const lines = output.split("\n").length;
    const chars = output.length;
    return { lines, chars, size: bytesOf(output) };
  }, [output]);

  const highlighted = useMemo(() => highlight(output || " ", lang), [output, lang]);
  const currentLang = LANGUAGES.find((l) => l.id === lang)!;

  return (
    <div className={fullscreen ? "fixed inset-0 z-50 bg-background" : "min-h-screen relative"}>
      <AmbientBackground />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--glass-strong)",
            color: "var(--foreground)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(28px) saturate(180%)",
          },
        }}
      />

      {/* NAV */}
      <header className="sticky top-0 z-30 px-4 pt-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="glass-strong mx-auto flex max-w-[1400px] items-center gap-3 rounded-2xl px-4 py-2.5"
        >
          <Logo />
          <span className="hidden text-[15px] font-semibold tracking-tight sm:block">FormatX</span>
          <span className="ml-2 hidden rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground md:block">
            AI Beautifier
          </span>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setShowPalette(true)}
              className="hidden items-center gap-2 rounded-xl border border-glass-border bg-foreground/[0.03] px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-foreground/[0.06] md:flex"
            >
              <Search className="h-3.5 w-3.5" /> Search…
              <kbd className="ml-2 rounded-md bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>
            <ThemeSwitcher theme={theme} onChange={setTheme} />
            <AccentPicker value={accent} onChange={setAccent} />
            <IconBtn onClick={() => setShowSettings(true)} aria-label="Settings"><SettingsIcon className="h-4 w-4" /></IconBtn>
            <IconBtn onClick={() => setShowAbout(true)} aria-label="About"><Info className="h-4 w-4" /></IconBtn>
          </div>
        </motion.nav>
      </header>

      <main className="relative z-10 mx-auto max-w-[1400px] px-4 py-6 md:py-10">
        {/* HERO */}
        {!fullscreen && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center md:mb-12"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-glass-border bg-foreground/[0.04] px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
              <Sparkles className="h-3 w-3" /> AI-powered formatting
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Beautiful code,{" "}
              <span className="bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent">
                instantly.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-sm text-muted-foreground md:text-base">
              Paste, drop, or upload. FormatX detects your language, learns your style, and ships pixel-perfect code in 19 languages.
            </p>
          </motion.section>
        )}

        {/* TOOLBAR */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass mb-4 flex flex-wrap items-center gap-2 rounded-2xl p-2"
        >
          <LangBadge
            lang={currentLang.label}
            confidence={autoLang ? confidence : 1}
            auto={autoLang}
            onClick={() => setShowLangPicker(true)}
          />
          <button
            onClick={() => setAutoLang((v) => !v)}
            className={`rounded-xl border border-glass-border px-2.5 py-1.5 text-[11px] font-medium transition ${
              autoLang ? "accent-bg" : "bg-foreground/[0.05] text-muted-foreground hover:bg-foreground/[0.08]"
            }`}
          >
            Auto-detect
          </button>

          <div className="mx-1 hidden h-6 w-px bg-glass-border md:block" />

          <ModePicker value={mode} onChange={setMode} />
          <IndentPicker value={indent} onChange={setIndent} />

          <div className="ml-auto flex items-center gap-1.5">
            <IconBtn onClick={undo} aria-label="Undo"><RotateCcw className="h-4 w-4" /></IconBtn>
            <IconBtn onClick={redo} aria-label="Redo"><RotateCw className="h-4 w-4" /></IconBtn>
            <IconBtn onClick={() => setFullscreen((v) => !v)} aria-label="Fullscreen">
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </IconBtn>
            <PrimaryBtn onClick={runFormat}>
              <Wand2 className="h-4 w-4" /> Format
              <kbd className="ml-1 hidden rounded-md bg-black/20 px-1.5 py-0.5 font-mono text-[10px] md:inline">⌘⇧F</kbd>
            </PrimaryBtn>
          </div>
        </motion.div>

        {/* EDITORS */}
        <div
          ref={dropRef}
          onDragOver={(e) => { e.preventDefault(); dropRef.current?.classList.add("ring-2"); }}
          onDragLeave={() => dropRef.current?.classList.remove("ring-2")}
          onDrop={onDrop}
          className="grid grid-cols-1 gap-4 transition-all duration-300 lg:grid-cols-2"
          style={{ ["--tw-ring-color" as any]: "var(--accent-color)" }}
        >
          {/* INPUT */}
          <Panel
            title="Input"
            icon={<FileCode2 className="h-4 w-4" />}
            stats={inputStats}
            actions={
              <>
                <FileUploadBtn onFile={handleFile} />
                <IconBtn onClick={clearAll} aria-label="Clear"><Trash2 className="h-4 w-4" /></IconBtn>
              </>
            }
          >
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); pushHistory(e.target.value); }}
              spellCheck={false}
              className="code-area scroll-thin h-[58vh] w-full resize-none bg-transparent p-5 text-[13px] leading-[1.65] outline-none placeholder:text-muted-foreground"
              placeholder="// Paste, drop or upload code here…"
            />
          </Panel>

          {/* OUTPUT */}
          <Panel
            title="Output"
            icon={<Sparkles className="h-4 w-4 accent-text" />}
            stats={outputStats}
            actions={
              <>
                <IconBtn onClick={copyOutput} aria-label="Copy"><Copy className="h-4 w-4" /></IconBtn>
                <IconBtn onClick={downloadOutput} aria-label="Download"><Download className="h-4 w-4" /></IconBtn>
              </>
            }
          >
            <pre className="scroll-thin h-[58vh] w-full overflow-auto p-5 text-[13px] leading-[1.65]">
              <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>
          </Panel>
        </div>

        {/* INSIGHTS */}
        {style && !fullscreen && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            <StatCard label="Indentation" value={style.indentLabel} icon={<Zap className="h-3.5 w-3.5" />} />
            <StatCard label="Quote Style" value={style.quotes} />
            <StatCard label="Semicolons" value={style.semicolons ? "Yes" : "No"} />
            <StatCard label="Brace Style" value={style.braceStyle} />
            <StatCard label="Trailing Commas" value={style.trailingCommas ? "Yes" : "No"} />
            <StatCard label="Naming" value={style.naming} />
            <StatCard label="Detection" value={`${Math.round(confidence * 100)}%`} accent />
            <StatCard label="Mode" value={MODES.find((m) => m.id === mode)!.label} accent />
          </motion.section>
        )}

        {!fullscreen && <Footer />}
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} {...{ theme, setTheme, accent, setAccent, indent, setIndent }} />}
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
        {showLangPicker && <LangPicker onClose={() => setShowLangPicker(false)} value={lang} onSelect={(l) => { setLang(l); setAutoLang(false); setShowLangPicker(false); }} />}
        {showPalette && <CommandPalette onClose={() => setShowPalette(false)} actions={{ format: runFormat, copy: copyOutput, download: downloadOutput, clear: clearAll, settings: () => { setShowSettings(true); setShowPalette(false); }, about: () => { setShowAbout(true); setShowPalette(false); }, theme: setTheme, accent: setAccent }} />}
      </AnimatePresence>
    </div>
  );
}

// ============== Sub-components ==============

function Logo() {
  return (
    <motion.div
      whileHover={{ rotate: 12, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative grid h-8 w-8 place-items-center rounded-xl"
      style={{ background: "var(--accent-color)" }}
    >
      <span className="text-[14px] font-bold text-[var(--accent-foreground)]">{"{}"}</span>
      <span className="absolute -inset-px rounded-xl border border-white/30" />
    </motion.div>
  );
}

function AmbientBackground() {
  return (
    <div className="ambient-bg">
      <motion.div
        className="blob"
        style={{ background: "var(--ambient-1)", width: 600, height: 600, top: "-10%", left: "-10%" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob"
        style={{ background: "var(--ambient-2)", width: 500, height: 500, top: "20%", right: "-8%" }}
        animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob"
        style={{ background: "var(--ambient-3)", width: 550, height: 550, bottom: "-15%", left: "30%" }}
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function IconBtn({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -1 }}
      {...(rest as any)}
      className="grid h-9 w-9 place-items-center rounded-xl border border-glass-border bg-foreground/[0.04] text-foreground transition hover:bg-foreground/[0.09]"
    >
      {children}
    </motion.button>
  );
}

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="accent-bg inline-flex h-9 items-center gap-2 rounded-xl px-3.5 text-[13px] font-semibold shadow-lg shadow-[var(--accent-color)]/30 transition"
      style={{ boxShadow: "0 8px 24px -8px color-mix(in oklab, var(--accent-color) 60%, transparent)" }}
    >
      {children}
    </motion.button>
  );
}

function ThemeSwitcher({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  const items: { id: Theme; icon: React.ReactNode; label: string }[] = [
    { id: "light", icon: <Sun className="h-3.5 w-3.5" />, label: "Light" },
    { id: "dark", icon: <Moon className="h-3.5 w-3.5" />, label: "Dark" },
    { id: "pitch", icon: <Circle className="h-3.5 w-3.5 fill-current" />, label: "Pitch" },
  ];
  return (
    <div className="relative flex items-center rounded-xl border border-glass-border bg-foreground/[0.04] p-0.5">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onChange(it.id)}
          aria-label={it.label}
          className="relative grid h-8 w-8 place-items-center rounded-[10px] text-foreground/80 transition hover:text-foreground"
        >
          {theme === it.id && (
            <motion.div
              layoutId="theme-pill"
              className="absolute inset-0 rounded-[10px]"
              style={{ background: "var(--accent-color)", opacity: 0.18 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative">{it.icon}</span>
        </button>
      ))}
    </div>
  );
}

function AccentPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Accent color"
        className="grid h-9 w-9 place-items-center rounded-xl border border-glass-border bg-foreground/[0.04] transition hover:bg-foreground/[0.09]"
      >
        <span className="block h-4 w-4 rounded-full ring-2 ring-white/30" style={{ background: value }} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="glass-strong absolute right-0 top-11 z-50 w-64 rounded-2xl p-3"
            >
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Accent</div>
              <div className="grid grid-cols-5 gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.name}
                    onClick={() => { onChange(a.value); setOpen(false); }}
                    title={a.name}
                    className="relative grid aspect-square place-items-center rounded-xl border border-glass-border transition hover:scale-110"
                    style={{ background: a.value }}
                  >
                    {value === a.value && <Check className="h-4 w-4 text-black/70" />}
                  </button>
                ))}
              </div>
              <label className="mt-3 flex items-center gap-2 rounded-xl border border-glass-border bg-foreground/[0.04] px-3 py-2 text-xs">
                <span className="text-muted-foreground">Custom</span>
                <input type="color" className="ml-auto h-6 w-10 cursor-pointer rounded border-0 bg-transparent" onChange={(e) => onChange(e.target.value)} />
              </label>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function LangBadge({ lang, confidence, auto, onClick }: { lang: string; confidence: number; auto: boolean; onClick: () => void }) {
  const pct = Math.round(confidence * 100);
  return (
    <motion.button
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-glass-border bg-foreground/[0.04] px-3 py-1.5 text-[12px] font-medium transition hover:bg-foreground/[0.08]"
    >
      <span className="grid h-5 w-5 place-items-center rounded-md accent-bg text-[10px] font-bold">{lang[0]}</span>
      <span>{lang}</span>
      {auto && <span className="text-muted-foreground">· {pct}%</span>}
      <ChevronDown className="h-3 w-3 opacity-60" />
    </motion.button>
  );
}

function ModePicker({ value, onChange }: { value: FormatMode; onChange: (v: FormatMode) => void }) {
  const [open, setOpen] = useState(false);
  const current = MODES.find((m) => m.id === value)!;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-glass-border bg-foreground/[0.04] px-3 py-1.5 text-[12px] font-medium transition hover:bg-foreground/[0.08]"
      >
        <Sparkles className="h-3.5 w-3.5 accent-text" />
        {current.label}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              className="glass-strong absolute left-0 top-11 z-50 w-64 rounded-2xl p-1.5"
            >
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { onChange(m.id); setOpen(false); }}
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition ${
                    value === m.id ? "bg-foreground/[0.08]" : "hover:bg-foreground/[0.05]"
                  }`}
                >
                  <div className="mt-0.5 grid h-6 w-6 place-items-center rounded-lg accent-bg text-[10px]">
                    {value === m.id ? <Check className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground">{m.hint}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function IndentPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const opts = [
    { v: "  ", l: "2sp" },
    { v: "    ", l: "4sp" },
    { v: "\t", l: "Tab" },
  ];
  return (
    <div className="hidden items-center rounded-xl border border-glass-border bg-foreground/[0.04] p-0.5 md:flex">
      {opts.map((o) => (
        <button
          key={o.l}
          onClick={() => onChange(o.v)}
          className={`relative rounded-[10px] px-2.5 py-1 text-[11px] font-medium transition ${
            value === o.v ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {value === o.v && (
            <motion.div
              layoutId="indent-pill"
              className="absolute inset-0 rounded-[10px]"
              style={{ background: "var(--accent-color)", opacity: 0.18 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            />
          )}
          <span className="relative">{o.l}</span>
        </button>
      ))}
    </div>
  );
}

function Panel({
  title, icon, stats, actions, children,
}: {
  title: string; icon: React.ReactNode;
  stats: { lines: number; chars: number; size: string };
  actions?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass overflow-hidden rounded-2xl"
    >
      <div className="flex items-center gap-2 border-b border-glass-border px-4 py-2.5">
        <div className="grid h-6 w-6 place-items-center rounded-md bg-foreground/[0.06]">{icon}</div>
        <div className="text-[12px] font-semibold">{title}</div>
        <div className="ml-auto flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{stats.lines} lines</span>
          <span className="h-3 w-px bg-glass-border" />
          <span>{stats.chars} chars</span>
          <span className="h-3 w-px bg-glass-border" />
          <span>{stats.size}</span>
          <div className="ml-2 flex items-center gap-1.5">{actions}</div>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: string; icon?: React.ReactNode; accent?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass relative overflow-hidden rounded-xl p-3.5"
    >
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {icon}{label}
      </div>
      <div className={`text-[15px] font-semibold capitalize ${accent ? "accent-text" : ""}`}>{value}</div>
    </motion.div>
  );
}

function FileUploadBtn({ onFile }: { onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      <IconBtn onClick={() => ref.current?.click()} aria-label="Upload"><Upload className="h-4 w-4" /></IconBtn>
    </>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-glass-border pt-8 pb-4 text-center text-xs text-muted-foreground">
      <div className="flex items-center justify-center gap-2">
        <Logo />
        <span className="font-semibold text-foreground">FormatX</span>
      </div>
      <p className="mt-3">Premium code formatting · 19 languages · Built with care</p>
    </footer>
  );
}

// ===== Modals =====

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="glass-strong fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">{title}</h2>
          <IconBtn onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></IconBtn>
        </div>
        {children}
      </motion.div>
    </>
  );
}

function SettingsModal({ onClose, theme, setTheme, accent, setAccent, indent, setIndent }: {
  onClose: () => void; theme: Theme; setTheme: (t: Theme) => void;
  accent: string; setAccent: (v: string) => void; indent: string; setIndent: (v: string) => void;
}) {
  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Appearance</div>
          <ThemeSwitcher theme={theme} onChange={setTheme} />
        </div>
        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Accent Color</div>
          <div className="grid grid-cols-9 gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.name}
                onClick={() => setAccent(a.value)}
                className="relative grid aspect-square place-items-center rounded-lg border border-glass-border transition hover:scale-110"
                style={{ background: a.value }}
              >
                {accent === a.value && <Check className="h-3 w-3 text-black/70" />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Default Indent</div>
          <IndentPicker value={indent} onChange={setIndent} />
        </div>
        <div className="rounded-xl border border-glass-border bg-foreground/[0.03] p-3 text-[11px] text-muted-foreground">
          Preferences are saved locally on this device.
        </div>
      </div>
    </Modal>
  );
}

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="About FormatX" onClose={onClose}>
      <div className="space-y-3 text-[13px] text-muted-foreground">
        <p className="text-foreground">A premium AI-powered code formatter with an Apple-inspired interface.</p>
        <p>Supports 19 languages with intelligent style detection, six formatting modes, and a VisionOS-grade glass UI.</p>
        <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
          {["⌘K Palette","⌘⇧F Format","⌘S Download","⌘Z Undo","⌘Y Redo","Esc Close"].map((s) => (
            <div key={s} className="rounded-lg border border-glass-border bg-foreground/[0.03] px-2.5 py-1.5 font-mono">{s}</div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function LangPicker({ onClose, value, onSelect }: { onClose: () => void; value: Lang; onSelect: (l: Lang) => void }) {
  const [q, setQ] = useState("");
  const filtered = LANGUAGES.filter((l) => l.label.toLowerCase().includes(q.toLowerCase()) || l.id.includes(q.toLowerCase()));
  return (
    <Modal title="Select Language" onClose={onClose}>
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-glass-border bg-foreground/[0.04] px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          autoFocus value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search languages…"
          className="h-10 flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      <div className="scroll-thin max-h-72 overflow-auto pr-1">
        {filtered.map((l) => (
          <button
            key={l.id}
            onClick={() => onSelect(l.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[13px] transition ${
              value === l.id ? "bg-foreground/[0.08]" : "hover:bg-foreground/[0.05]"
            }`}
          >
            <span className="grid h-7 w-7 place-items-center rounded-md accent-bg text-[11px] font-bold">{l.label[0]}</span>
            <span className="flex-1 font-medium">{l.label}</span>
            <span className="font-mono text-[10px] text-muted-foreground">.{l.ext[0]}</span>
            {value === l.id && <Check className="h-4 w-4 accent-text" />}
          </button>
        ))}
      </div>
    </Modal>
  );
}

function CommandPalette({ onClose, actions }: {
  onClose: () => void;
  actions: {
    format: () => void; copy: () => void; download: () => void; clear: () => void;
    settings: () => void; about: () => void;
    theme: (t: Theme) => void; accent: (v: string) => void;
  };
}) {
  const [q, setQ] = useState("");
  const items: { label: string; hint?: string; run: () => void; icon: React.ReactNode }[] = [
    { label: "Format code", hint: "⌘⇧F", run: () => { actions.format(); onClose(); }, icon: <Wand2 className="h-4 w-4" /> },
    { label: "Copy output", run: () => { actions.copy(); onClose(); }, icon: <Copy className="h-4 w-4" /> },
    { label: "Download output", hint: "⌘S", run: () => { actions.download(); onClose(); }, icon: <Download className="h-4 w-4" /> },
    { label: "Clear editor", run: () => { actions.clear(); onClose(); }, icon: <Trash2 className="h-4 w-4" /> },
    { label: "Open settings", run: actions.settings, icon: <SettingsIcon className="h-4 w-4" /> },
    { label: "About FormatX", run: actions.about, icon: <Info className="h-4 w-4" /> },
    { label: "Theme: Light", run: () => { actions.theme("light"); onClose(); }, icon: <Sun className="h-4 w-4" /> },
    { label: "Theme: Dark", run: () => { actions.theme("dark"); onClose(); }, icon: <Moon className="h-4 w-4" /> },
    { label: "Theme: Pitch Black", run: () => { actions.theme("pitch"); onClose(); }, icon: <Circle className="h-4 w-4 fill-current" /> },
    ...ACCENTS.map((a) => ({
      label: `Accent: ${a.name}`,
      run: () => { actions.accent(a.value); onClose(); },
      icon: <span className="block h-3.5 w-3.5 rounded-full" style={{ background: a.value }} />,
    })),
  ];
  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="glass-strong fixed left-1/2 top-[15vh] z-50 w-[92vw] max-w-xl -translate-x-1/2 rounded-2xl"
      >
        <div className="flex items-center gap-3 border-b border-glass-border px-4">
          <CmdIcon className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or search…"
            className="h-12 flex-1 bg-transparent text-sm outline-none"
          />
          <kbd className="rounded-md bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
        </div>
        <div className="scroll-thin max-h-80 overflow-auto p-2">
          {filtered.map((i, idx) => (
            <button
              key={idx}
              onClick={i.run}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[13px] transition hover:bg-foreground/[0.06]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-foreground/[0.06]">{i.icon}</span>
              <span className="flex-1">{i.label}</span>
              {i.hint && <kbd className="font-mono text-[10px] text-muted-foreground">{i.hint}</kbd>}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">No commands found.</div>
          )}
        </div>
      </motion.div>
    </>
  );
}
