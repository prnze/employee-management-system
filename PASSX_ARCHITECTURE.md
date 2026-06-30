# PassX Angular Architecture

Target: `src/app/features/passx`

## Route

```ts
export const PASSX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/passx/passx.component').then((m) => m.PassxComponent)
  }
];
```

App route:

```ts
{
  path: 'passx',
  loadChildren: () => import('@features/passx/passx.routes').then((m) => m.PASSX_ROUTES)
}
```

Final URL: `http://localhost:4200/passx`

## Folder Structure

```text
src/app/features/passx
├── animations/
├── components/
│   ├── accent-picker/
│   ├── ambient-background/
│   ├── command-palette/
│   ├── history/
│   ├── option-row/
│   ├── stats/
│   └── theme-switcher/
├── constants/
├── models/
├── pages/
│   └── passx/
├── services/
├── store/
├── directives/
├── interfaces/
├── pipes/
├── themes/
└── utils/
```

`directives`, `interfaces`, `pipes`, `themes`, and `utils` are reserved for future extracted pieces; current migration keeps logic in typed models, constants, store, services, animations, components, and page.

## Store Design

- `PassxStore` replaces Zustand with Angular Signals.
- Primary state is a private `signal<PassxState>`.
- Public read state uses `computed`.
- Persistence is handled by an `effect` writing to `localStorage`.
- Theme/accent application is handled by the same effect.

## Services

- `password.service.ts`: direct Angular port of React `passwordEngine` generation and pool logic.
- `entropy.service.ts`: entropy, strength label, crack time, and character distribution.
- `history.service.ts`: history list mutation helpers.
- `theme.service.ts`: applies document theme classes and CSS accent variable.
- `accent.service.ts`: resolves accent keys/custom color.
- `clipboard.service.ts`: browser-safe clipboard abstraction with fallback.
- `storage.service.ts`: SSR-safe `localStorage` JSON reads/writes.

## Component Mapping

| React | Angular |
| --- | --- |
| `PassX` route | `PassxComponent` |
| `ThemeSwitcher` | `ThemeSwitcherComponent` |
| `AccentPicker` | `AccentPickerComponent` |
| `OptionRow` | `OptionRowComponent` |
| `History` | `HistoryComponent` |
| `Stats` | `StatsComponent` |
| `CommandPalette` | `CommandPaletteComponent` |
| `AmbientBackground` | `AmbientBackgroundComponent` |
| `passwordEngine.ts` | `PasswordService` + `EntropyService` |
| `usePassStore` | `PassxStore` |
| `useThemeAccent` | `PassxStore` effect + `PassxThemeService` |

## Animation Mapping

| React / Framer Motion | Angular / CSS |
| --- | --- |
| Page/card fade up | `passxFadeUp` animation trigger |
| Command palette scale/translate | `passxScale` animation trigger |
| Password text transition | CSS `password-enter` keyframes |
| Strength spring scale | CSS transform transition |
| Stats hover lift | CSS hover transform |
| Option row hover scale | CSS hover transform |
| Ambient orbs | CSS keyframes |
| Reduced motion | component-level `prefers-reduced-motion` |

## SSR Compatibility

- Route is standalone and lazy loaded.
- Storage and clipboard services guard browser APIs.
- Password generation runs from component effects in the browser route context.
- DOM theme operations are contained in a service; storage reads return defaults during SSR.

## Feature Parity Surface

- Modes: standard, pronounceable, passphrase, memorable, pin.
- Options: length, uppercase, lowercase, numbers, symbols, extended symbols, spaces, exclude similar, exclude ambiguous, no duplicates, no sequential, no repeated, enforce each.
- Persistence: theme, accent, custom accent, options, history, favorites.
- History: add on copy, copy, clear, delete, restore settings.
- Favorites: save, apply, remove.
- Clipboard: async copy plus toast.
- Export: JSON settings download.
- UI: glass topbar, hero, password card, strength meter, tabs, options, side panels, stats, footer, ambient background.
