import { motion } from "framer-motion";
import { appleEase, heroEntrance } from "@shared/animations/motion";

export function Hero() {
  return (
    <section className="relative pt-14 sm:pt-20 pb-10 text-center overflow-hidden">
      {/* Floating doodles */}
      <Doodle x="8%" y="20%" delay={0}>
        <div className="h-14 w-14 rounded-2xl glass-strong" />
      </Doodle>
      <Doodle x="88%" y="14%" delay={0.4}>
        <div className="h-10 w-10 rounded-full glass" />
      </Doodle>
      <Doodle x="14%" y="78%" delay={0.8}>
        <div className="h-8 w-8 rounded-md glass rotate-12" />
      </Doodle>
      <Doodle x="82%" y="72%" delay={1.2}>
        <div className="h-16 w-16 rounded-[28%] glass-strong" />
      </Doodle>

      <motion.div
        {...heroEntrance}
        className="relative z-10 mx-auto max-w-3xl"
      >
        <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] tracking-widest uppercase text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success pulse-soft" /> v1 · in-browser conversion
        </span>
        <h1
          className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]"
          style={{ fontFamily: '"SF Pro Display", "Inter", system-ui, sans-serif' }}
        >
          Convert Anything.
          <br />
          <span className="text-muted-foreground">Preserve Everything.</span>
        </h1>
        <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          A premium universal media converter that runs entirely in your browser. Images, audio,
          video, PDFs, archives — converted on-device with WebAssembly. Nothing uploaded. Nothing tracked.
        </p>
      </motion.div>
    </section>
  );
}

function Doodle({ x, y, delay, children }: { x: string; y: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: appleEase }}
      style={{ position: "absolute", left: x, top: y }}
      className="float-slow pointer-events-none hidden md:block"
    >
      {children}
    </motion.div>
  );
}
