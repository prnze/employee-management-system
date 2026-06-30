# FormatX Architecture

`src/app/features/formatx` is a standalone Angular 21 feature.

- `formatx.routes.ts`: lazy route entry for `/formatx`.
- `pages/formatx`: application shell, modals, command palette, keyboard shortcuts, drag/drop, and responsive layout.
- `components`: ambient background, toolbar, and editor panel.
- `store/formatx.store.ts`: signal-based state, derived values, history, formatting actions, and preference persistence.
- `services`: formatter, language detector, clipboard, storage, theme, accent, history, upload, and download services.
- `constants` and `models`: shared FormatX types and static app data.

The feature is browser-safe for storage, clipboard, theme application, and DOM interactions. Business logic remains isolated from EMS, ShareX, PassX, and the React workspace.
