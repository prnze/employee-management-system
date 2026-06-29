import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Copy, RefreshCw, Eye, EyeOff, Sparkles, Command as CmdIcon, Star, Download,
} from "lucide-react";
import { Slider } from "@shared/components/ui/slider";
import { Input } from "@shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@shared/components/ui/tabs";
import { springPanel } from "@shared/animations/motion";
import { GlassTopBar } from "@shared/layout/GlassTopBar";
import { generatePassword, buildPool, entropy, strengthLabel } from "@/lib/passwordEngine";
import { usePassStore } from "@/store/usePassStore";
import { useThemeAccent } from "@/hooks/useThemeAccent";
import { ThemeSwitcher } from "@/components/passx/ThemeSwitcher";
import { AccentPicker } from "@/components/passx/AccentPicker";
import { OptionRow } from "@/components/passx/OptionRow";
import { Stats } from "@/components/passx/Stats";
import { History } from "@/components/passx/History";
import { CommandPalette } from "@/components/passx/CommandPalette";
import { AmbientBackground } from "@/components/passx/AmbientBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PassX — Premium Password Generator" },
      { name: "description", content: "Generate ultra-secure passwords with a luxury Apple-inspired interface. Glassmorphic. Customizable. Fast." },
    ],
  }),
  component: PassX,
  ssr: false,
});

function PassX() {
  useThemeAccent();
  const { options, setOptions, addHistory, favorites, addFavorite, applyFavorite, removeFavorite } = usePassStore();
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [favName, setFavName] = useState("");
  const [showFav, setShowFav] = useState(false);

  const poolSize = useMemo(() => buildPool(options).length || 26, [options]);
  const ent = useMemo(() => entropy(password, poolSize), [password, poolSize]);
  const s = strengthLabel(ent);

  const regenerate = useCallback(() => {
    const p = generatePassword(options);
    setPassword(p);
  }, [options]);

  useEffect(() => { regenerate(); /* eslint-disable-next-line */ }, [options]);

  const copy = useCallback(() => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied", { description: `${password.length} chars · ${ent} bits` });
    addHistory({ id: crypto.randomUUID(), password, at: Date.now(), entropy: ent });
    setTimeout(() => setCopied(false), 1400);
  }, [password, ent, addHistory]);

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify({ options, favorites }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "passx-settings.json"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Settings exported");
  };

  return (
    <div className="relative min-h-screen text-foreground">
      <AmbientBackground />
      <Toaster position="bottom-right" toastOptions={{ className: "font-mono text-xs" }} />
      <CommandPalette
        onRegenerate={regenerate}
        onCopy={copy}
        onToggleVisibility={() => setVisible(v => !v)}
      />

      <GlassTopBar
        brand={
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl brand-bg">
              <Sparkles className="h-4 w-4 text-white mix-blend-difference" />
            </div>
            <div className="font-display text-lg font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              PassX
            </div>
            <span className="ml-1 hidden rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground sm:inline">
              v1.0
            </span>
          </div>
        }
        actions={
          <>
            <button
              onClick={exportSettings}
              className="glass-panel hidden h-10 items-center gap-2 rounded-full px-3 text-[11px] text-muted-foreground hover:text-foreground sm:flex"
              aria-label="Export settings"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button
              onClick={() => { const e = new KeyboardEvent("keydown", { key: "k", metaKey: true }); window.dispatchEvent(e); }}
              className="glass-panel hidden h-10 items-center gap-2 rounded-full px-3 text-[11px] text-muted-foreground sm:flex"
            >
              <CmdIcon className="h-3.5 w-3.5" /> <span>⌘K</span>
            </button>
            <AccentPicker />
            <ThemeSwitcher />
          </>
        }
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        {/* Hero */}
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-semibold tracking-tight sm:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Passwords, perfected.
          </motion.h1>
          <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
            Cryptographically random. Beautifully crafted. Engineered for serious security.
          </p>
        </div>

        {/* Password card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={springPanel}
          className="glass-panel relative overflow-hidden rounded-3xl p-5 sm:p-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full brand-bg animate-pulse" />
              Live · {s.label}
            </div>
            <div className="text-[11px] text-muted-foreground">{ent} bits</div>
          </div>

          <div className="relative">
            <div className="min-h-[3.5rem] break-all rounded-2xl bg-muted/40 px-4 py-4 pr-28 font-mono text-lg sm:text-2xl">
              <AnimatePresence mode="wait">
                <motion.span
                  key={password}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="inline-block"
                >
                  {visible ? (password || "—") : "•".repeat(Math.min(password.length, 64))}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <IconButton onClick={() => setVisible(v => !v)} label={visible ? "Hide" : "Show"}>
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </IconButton>
              <IconButton onClick={regenerate} label="Regenerate">
                <motion.span whileTap={{ rotate: 360 }} transition={{ duration: 0.4 }}>
                  <RefreshCw className="h-4 w-4" />
                </motion.span>
              </IconButton>
              <motion.button
                onClick={copy}
                whileTap={{ scale: 0.94 }}
                className="flex h-10 items-center gap-1.5 rounded-xl brand-bg px-3 text-xs font-medium text-white mix-blend-difference"
                aria-label="Copy"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✓</motion.span>
                  ) : (
                    <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Copy className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
                <span>{copied ? "Copied" : "Copy"}</span>
              </motion.button>
            </div>
          </div>

          {/* Strength bar */}
          <div className="mt-4 flex items-center gap-2">
            {[1,2,3,4,5].map(i => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i <= s.score ? 1 : 0.15 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 200, damping: 22 }}
                className="h-1.5 flex-1 origin-left rounded-full"
                style={{ background: i <= s.score ? s.color : "var(--muted)" }}
              />
            ))}
          </div>
        </motion.div>

        {/* Mode tabs */}
        <div className="mt-6 flex justify-center">
          <Tabs value={options.mode} onValueChange={(v) => setOptions({ mode: v as any })}>
            <TabsList className="glass-panel rounded-full p-1">
              {(["standard","pronounceable","passphrase","memorable","pin"] as const).map(m => (
                <TabsTrigger
                  key={m}
                  value={m}
                  className="rounded-full px-3 text-[11px] data-[state=active]:brand-bg data-[state=active]:text-white data-[state=active]:mix-blend-difference"
                >
                  {m}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Length + options */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="glass-card p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Length</div>
              <div className="flex items-center gap-2">
                <Input
                  type="number" min={4} max={256}
                  value={options.length}
                  onChange={(e) => setOptions({ length: Math.max(4, Math.min(256, Number(e.target.value) || 4)) })}
                  className="h-8 w-20 text-center font-mono text-sm"
                />
              </div>
            </div>
            <Slider
              min={4} max={256} step={1}
              value={[options.length]}
              onValueChange={([v]) => setOptions({ length: v })}
              className="[&_[role=slider]]:brand-bg [&_[role=slider]]:border-0 [&>span:first-child>span]:brand-bg"
            />
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>4</span><span>64</span><span>128</span><span>192</span><span>256</span>
            </div>

            <div className="mt-6 grid gap-1 sm:grid-cols-2">
              <OptionRow label="Uppercase" hint="A–Z" checked={options.uppercase} onCheckedChange={(v) => setOptions({ uppercase: v })} />
              <OptionRow label="Lowercase" hint="a–z" checked={options.lowercase} onCheckedChange={(v) => setOptions({ lowercase: v })} />
              <OptionRow label="Numbers" hint="0–9" checked={options.numbers} onCheckedChange={(v) => setOptions({ numbers: v })} />
              <OptionRow label="Symbols" hint="!@#$%^&*" checked={options.symbols} onCheckedChange={(v) => setOptions({ symbols: v })} />
              <OptionRow label="Extended symbols" hint="()[]{}|;:," checked={options.extendedSymbols} onCheckedChange={(v) => setOptions({ extendedSymbols: v })} />
              <OptionRow label="Spaces" hint="word-style" checked={options.spaces} onCheckedChange={(v) => setOptions({ spaces: v })} />
              <OptionRow label="Exclude similar" hint="0/O · 1/l/I" checked={options.excludeSimilar} onCheckedChange={(v) => setOptions({ excludeSimilar: v })} />
              <OptionRow label="Exclude ambiguous" hint="{}[]()/\\" checked={options.excludeAmbiguous} onCheckedChange={(v) => setOptions({ excludeAmbiguous: v })} />
              <OptionRow label="No duplicates" hint="unique chars only" checked={options.excludeDuplicates} onCheckedChange={(v) => setOptions({ excludeDuplicates: v })} />
              <OptionRow label="No sequential" hint="ab, 12 disallowed" checked={options.avoidSequential} onCheckedChange={(v) => setOptions({ avoidSequential: v })} />
              <OptionRow label="No repeated" hint="aa, 11 disallowed" checked={options.avoidRepeated} onCheckedChange={(v) => setOptions({ avoidRepeated: v })} />
              <OptionRow label="Enforce each" hint="at least one per set" checked={options.enforceEach} onCheckedChange={(v) => setOptions({ enforceEach: v })} />
            </div>
          </div>

          <div className="space-y-4">
            <History />
            <div className="glass-card p-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                  <Star className="h-3 w-3" /> Favorites
                </div>
                <button
                  onClick={() => setShowFav(s => !s)}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  {showFav ? "Cancel" : "+ Save"}
                </button>
              </div>
              {showFav && (
                <div className="mb-3 flex gap-2">
                  <Input
                    placeholder="Preset name"
                    value={favName}
                    onChange={(e) => setFavName(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <button
                    onClick={() => { if (favName) { addFavorite(favName); setFavName(""); setShowFav(false); toast.success("Saved"); } }}
                    className="rounded-md brand-bg px-2 text-[11px] text-white mix-blend-difference"
                  >Save</button>
                </div>
              )}
              <div className="space-y-1">
                {favorites.length === 0 && <div className="py-4 text-center text-[11px] text-muted-foreground">No favorites</div>}
                {favorites.map(f => (
                  <div key={f.id} className="group flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-accent/50">
                    <button onClick={() => applyFavorite(f.id)} className="flex-1 truncate text-left text-[12px]">
                      {f.name} <span className="text-muted-foreground">· {f.options.length}c</span>
                    </button>
                    <button onClick={() => removeFavorite(f.id)} className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6">
          <Stats password={password} entropy={ent} poolSize={poolSize} />
        </div>

        <footer className="mt-12 pb-6 text-center text-[10px] text-muted-foreground">
          PassX · Generated entirely on-device using <span className="brand-text">crypto.getRandomValues</span> · Press ⌘K for commands
        </footer>
      </main>
    </div>
  );
}

function IconButton({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -1 }}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {children}
    </motion.button>
  );
}
