import { AccentPicker as SharedAccentPicker } from "@shared/theme/AccentPicker";
import { usePassStore } from "@/store/usePassStore";

export function AccentPicker() {
  const { accent, setAccent, customAccent, setCustomAccent } = usePassStore();
  return (
    <SharedAccentPicker
      accent={accent}
      customAccent={customAccent}
      onAccentChange={setAccent}
      onCustomAccentChange={setCustomAccent}
    />
  );
}
