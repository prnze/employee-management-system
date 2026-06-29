import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = "light" | "dark" | "pitch";
export type JobStatus =
  | "queued"
  | "uploading"
  | "converting"
  | "paused"
  | "done"
  | "error"
  | "canceled";

export type Category = "image" | "audio" | "video" | "pdf" | "archive" | "unsupported";

export type Stage =
  | "queued"
  | "uploading"
  | "preparing"
  | "analyzing"
  | "converting"
  | "compressing"
  | "packaging"
  | "preview"
  | "finalizing"
  | "completed";

export interface Job {
  id: string;
  fileName: string;
  fileSize: number;
  fromExt: string;
  toExt: string;
  category: Category;
  status: JobStatus;
  progress: number;
  stage?: Stage;
  startedAt?: number;
  finishedAt?: number;
  etaSec?: number;
  speedLabel?: string;
  errorMessage?: string;
  resultBlob?: Blob;
  resultName?: string;
  resultSize?: number;
  needsBackend?: boolean;
  options?: Record<string, unknown>;
  sourceFile?: File;
  abortController?: AbortController;
}

export interface HistoryEntry {
  id: string;
  fileName: string;
  fromExt: string;
  toExt: string;
  category: Category;
  inSize: number;
  outSize: number;
  durationMs: number;
  finishedAt: number;
}

interface FxState {
  theme: Theme;
  setTheme: (t: Theme) => void;

  jobs: Job[];
  addJobs: (jobs: Job[]) => void;
  updateJob: (id: string, patch: Partial<Job>) => void;
  removeJob: (id: string) => void;
  clearCompleted: () => void;

  selectedIds: string[];
  toggleSelected: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;

  inspectorId: string | null;
  setInspector: (id: string | null) => void;

  history: HistoryEntry[];
  pushHistory: (e: HistoryEntry) => void;
  clearHistory: () => void;

  favorites: string[];
  toggleFavorite: (k: string) => void;

  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
}

export const useFx = create<FxState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (t) => set({ theme: t }),

      jobs: [],
      addJobs: (newJobs) => set((s) => ({ jobs: [...newJobs, ...s.jobs] })),
      updateJob: (id, patch) =>
        set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) })),
      removeJob: (id) =>
        set((s) => ({
          jobs: s.jobs.filter((j) => j.id !== id),
          selectedIds: s.selectedIds.filter((x) => x !== id),
          inspectorId: s.inspectorId === id ? null : s.inspectorId,
        })),
      clearCompleted: () =>
        set((s) => ({ jobs: s.jobs.filter((j) => j.status !== "done" && j.status !== "canceled") })),

      selectedIds: [],
      toggleSelected: (id) =>
        set((s) => ({
          selectedIds: s.selectedIds.includes(id) ? s.selectedIds.filter((x) => x !== id) : [...s.selectedIds, id],
        })),
      selectAll: () => set((s) => ({ selectedIds: s.jobs.map((j) => j.id) })),
      clearSelection: () => set({ selectedIds: [] }),

      inspectorId: null,
      setInspector: (id) => set({ inspectorId: id }),

      history: [],
      pushHistory: (e) => set((s) => ({ history: [e, ...s.history].slice(0, 200) })),
      clearHistory: () => set({ history: [] }),

      favorites: [],
      toggleFavorite: (k) =>
        set((s) => ({
          favorites: s.favorites.includes(k) ? s.favorites.filter((x) => x !== k) : [...s.favorites, k],
        })),

      commandOpen: false,
      setCommandOpen: (v) => set({ commandOpen: v }),
    }),
    {
      name: "filex-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        theme: s.theme,
        history: s.history,
        favorites: s.favorites,
      }),
    },
  ),
);
