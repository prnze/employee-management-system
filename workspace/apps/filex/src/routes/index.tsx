import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { FileXLogo } from "@/components/FileXLogo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Hero } from "@/components/Hero";
import { UploadZone } from "@/components/UploadZone";
import { Queue } from "@/components/Queue";
import { HistoryPanel } from "@/components/HistoryPanel";
import { PdfTools } from "@/components/PdfTools";
import { Inspector } from "@/components/Inspector";
import { QueueStats } from "@/components/QueueStats";



import { CommandPalette } from "@/components/CommandPalette";
import { ThemeManager } from "@/components/ThemeManager";
import { useFx } from "@/lib/store";
import { Command as CmdIcon, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FileX — Convert Anything. Preserve Everything." },
      { name: "description", content: "Premium universal file converter that runs entirely in your browser. Images, audio, video, PDFs and archives — converted on-device with WebAssembly." },
      { property: "og:title", content: "FileX — Convert Anything. Preserve Everything." },
      { property: "og:description", content: "On-device, premium universal media converter. Powered by WebAssembly. Nothing uploaded." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const setCommandOpen = useFx((s) => s.setCommandOpen);

  return (
    <div className="min-h-screen relative">
      <ThemeManager />
      <CommandPalette />
      <Inspector />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "glass-strong !font-mono !text-xs",
        }}
      />

      {/* Top nav */}
      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mt-4 glass rounded-2xl px-4 py-2.5 flex items-center gap-3">
            <FileXLogo />
            <nav className="ml-4 hidden md:flex items-center gap-1 text-xs text-muted-foreground">
              <a href="#convert" className="px-2 py-1 rounded-md hover:text-foreground transition-colors">Convert</a>
              <a href="#queue" className="px-2 py-1 rounded-md hover:text-foreground transition-colors">Queue</a>
              <a href="#history" className="px-2 py-1 rounded-md hover:text-foreground transition-colors">History</a>
              <a href="#about" className="px-2 py-1 rounded-md hover:text-foreground transition-colors">About</a>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setCommandOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <CmdIcon className="h-3 w-3" /> Search · ⌘K
              </button>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-32">
        <Hero />

        <section id="convert" className="mt-2">
          <UploadZone />
        </section>

        <section id="queue">
          <QueueStats />
          <Queue />
        </section>

        <section id="history">
          <HistoryPanel />
        </section>

        <PdfTools />

        <FormatGrid />


        <Footer />
      </main>
    </div>
  );
}

function FormatGrid() {
  const groups = [
    { title: "Images", items: ["JPG", "PNG", "WEBP", "AVIF", "GIF", "BMP", "ICO", "SVG", "HEIC*", "TIFF*", "RAW*"] },
    { title: "Audio",  items: ["MP3", "WAV", "FLAC", "AAC", "M4A", "OGG", "OPUS", "AIFF", "WMA*"] },
    { title: "Video",  items: ["MP4", "WEBM", "MKV", "MOV", "AVI", "GIF (anim)"] },
    { title: "Docs",   items: ["PDF", "TXT", "MD", "HTML", "CSV", "DOCX*"] },
    { title: "Archive",items: ["ZIP", "TAR", "RAR*", "7Z*"] },
  ];
  return (
    <section id="about" className="mt-20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-muted-foreground">
          <Sparkles className="h-3 w-3" /> Supported formats
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight" style={{ fontFamily: '"SF Pro Display", system-ui' }}>
          Every format you need, in one place.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">* marked formats require FileX Pro backend.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {groups.map((g) => (
          <div key={g.title} className="glass rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{g.title}</div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((f) => (
                <span
                  key={f}
                  className={`text-[10px] tracking-wider px-2 py-1 rounded-md border ${
                    f.includes("*") ? "border-warning/40 text-warning" : "border-border bg-surface-2"
                  }`}
                >
                  {f.replace("*", "")}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
      <div>FileX · v1 · runs entirely on-device</div>
      <div className="flex items-center gap-3">
        <span>Powered by ffmpeg.wasm · pdf-lib · heic2any · JSZip</span>
      </div>
    </footer>
  );
}
