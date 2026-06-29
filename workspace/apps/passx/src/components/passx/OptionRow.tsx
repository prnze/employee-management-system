import { motion } from "framer-motion";
import { Switch } from "@shared/components/ui/switch";

export function OptionRow({
  label, hint, checked, onCheckedChange,
}: { label: string; hint?: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <motion.label
      whileHover={{ scale: 1.005 }}
      className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/50"
    >
      <div className="min-w-0 pr-3">
        <div className="text-[13px] font-medium">{label}</div>
        {hint && <div className="truncate text-[11px] text-muted-foreground">{hint}</div>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:brand-bg"
      />
    </motion.label>
  );
}
