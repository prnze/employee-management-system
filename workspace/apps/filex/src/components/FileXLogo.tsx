import { motion } from "framer-motion";

export function FileXLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      <motion.div
        initial={{ rotate: -8, scale: 0.9, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative grid place-items-center rounded-xl glass-strong"
        style={{ width: size + 8, height: size + 8 }}
      >
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
          <path d="M5 3h9l5 5v13a0 0 0 0 1 0 0H5a0 0 0 0 1 0 0V3Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 14l6 4M15 14l-6 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </motion.div>
      <span
        className="font-semibold tracking-tight text-foreground"
        style={{ fontFamily: '"SF Pro Display", "Inter", system-ui, sans-serif', fontSize: size * 0.72 }}
      >
        FileX
      </span>
    </div>
  );
}
