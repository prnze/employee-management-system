import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACCENTS, type AccentKey } from "@shared/theme/accent";
import type { PassOptions } from "@/lib/passwordEngine";

export type Theme = "light" | "dark" | "black";
export { ACCENTS, type AccentKey };

export interface HistoryEntry {
  id: string;
  password: string;
  at: number;
  entropy: number;
}

interface State {
  theme: Theme;
  accent: AccentKey;
  customAccent: string;
  options: PassOptions;
  history: HistoryEntry[];
  favorites: { id: string; name: string; options: PassOptions }[];
  setTheme: (t: Theme) => void;
  setAccent: (a: AccentKey) => void;
  setCustomAccent: (c: string) => void;
  setOptions: (o: Partial<PassOptions>) => void;
  addHistory: (e: HistoryEntry) => void;
  clearHistory: () => void;
  addFavorite: (name: string) => void;
  removeFavorite: (id: string) => void;
  applyFavorite: (id: string) => void;
}

const defaultOptions: PassOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  extendedSymbols: false,
  spaces: false,
  excludeAmbiguous: false,
  excludeSimilar: true,
  excludeDuplicates: false,
  avoidSequential: false,
  avoidRepeated: false,
  enforceEach: true,
  mode: "standard",
};

export const usePassStore = create<State>()(
  persist(
    (set, get) => ({
      theme: "dark",
      accent: "blue",
      customAccent: "#5b8def",
      options: defaultOptions,
      history: [],
      favorites: [],
      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setCustomAccent: (customAccent) => set({ customAccent }),
      setOptions: (o) => set({ options: { ...get().options, ...o } }),
      addHistory: (e) => set({ history: [e, ...get().history].slice(0, 50) }),
      clearHistory: () => set({ history: [] }),
      addFavorite: (name) =>
        set({
          favorites: [
            ...get().favorites,
            { id: crypto.randomUUID(), name, options: get().options },
          ],
        }),
      removeFavorite: (id) => set({ favorites: get().favorites.filter(f => f.id !== id) }),
      applyFavorite: (id) => {
        const f = get().favorites.find(f => f.id === id);
        if (f) set({ options: f.options });
      },
    }),
    { name: "passx-store" }
  )
);
