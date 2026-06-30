# PassX React Analysis

Source analyzed: `workspace/apps/passx`

## Component Tree

```text
Route /
└── PassX
    ├── AmbientBackground
    ├── Toaster
    ├── CommandPalette
    ├── GlassTopBar
    │   ├── AccentPicker
    │   └── ThemeSwitcher
    ├── Password card
    │   ├── visibility button
    │   ├── regenerate button
    │   ├── copy button
    │   └── strength meter
    ├── Mode tabs
    ├── Options panel
    │   ├── length number input
    │   ├── length slider
    │   └── OptionRow x12
    ├── History
    ├── Favorites panel
    ├── Stats
    └── Footer
```

## Components

- `PassX`: main page in `src/routes/index.tsx`; owns current generated password, visibility, copied state, favorite form state, export, copy, and regeneration orchestration.
- `ThemeSwitcher`: wraps shared segmented theme switcher with Light, Graphite, and OLED themes.
- `AccentPicker`: wraps shared accent picker and persists selected/custom accent through the store.
- `OptionRow`: animated row with label, hint, and switch.
- `History`: displays local password history, clear action, and per-item copy action.
- `Stats`: renders length, entropy, strength, crack time, and character distribution.
- `CommandPalette`: keyboard driven actions and theme switching with `Cmd/Ctrl+K` and `Cmd/Ctrl+R`.
- `AmbientBackground`: two animated brand-color blurred orbs plus grid SVG.
- `IconButton`: local helper inside the route for icon-only controls.
- Shared dependencies: `GlassTopBar`, shared UI `Input`, `Slider`, `Tabs`, `Switch`, shared theme/accent utilities.

## Pages

- Single route/page: `/`, implemented by `src/routes/index.tsx`.

## Hooks

- `useThemeAccent`: applies document theme classes and resolved accent color using `applyDocumentTheme` and `resolveAccentColor`.
- React built-ins: `useState`, `useEffect`, `useMemo`, `useCallback`.

## Stores

- `usePassStore` Zustand store with `persist` middleware and storage key `passx-store`.
- State: `theme`, `accent`, `customAccent`, `options`, `history`, `favorites`.
- Actions: theme/accent setters, option merging, history add/clear, favorite add/remove/apply.

## Utilities

- `passwordEngine.ts`
  - `buildPool`
  - `generatePassword`
  - `entropy`
  - `strengthLabel`
  - `crackTime`
  - `charDistribution`

## Services

- No explicit React service classes. Service-like concerns are handled by the password engine, shared theme helpers, `navigator.clipboard`, `Blob`/download APIs, `crypto.getRandomValues`, `crypto.randomUUID`, and Zustand persistence.

## Persistence

- `localStorage`: Zustand persist key `passx-store`, storing theme, accent, custom accent, options, history, and favorites.
- `sessionStorage`: not used.
- Cookies: not used.

## Password Engine

- Character sets: uppercase, lowercase, numbers, base symbols, extended symbols, spaces, ambiguous, similar.
- Modes:
  - `standard`: builds a filtered unique pool, generates random chars, optionally prevents repeats/sequential/duplicates, and enforces at least one selected core set.
  - `pin`: numeric-only random digits.
  - `passphrase`: 3-12 words based on `length / 6`, hyphen separated, optional capitalization and numeric suffix.
  - `pronounceable`: alternating consonant/vowel sequence, optional first-letter uppercase and numeric suffix, sliced to requested length.
  - `memorable`: two capitalized dictionary words, random number, exclamation mark, sliced to at least 10 chars.
- Entropy: `password.length * log2(poolSize)`, rounded to one decimal.
- Strength labels: Very Weak `<28`, Weak `<50`, Fair `<80`, Strong `<120`, Excellent otherwise.
- Crack time: assumes `10^11` guesses/second and formats seconds through centuries.

## Animations

- Framer Motion entrance fade/translate for hero and password card.
- Password text enter/exit fade and y-offset.
- Strength bar spring scale.
- Option row hover scale.
- Stats card hover lift.
- Character distribution spring width animation.
- Command palette backdrop fade and panel spring scale/translate.
- Ambient orbs infinite x/y motion.
- Copy button tap scale and copied icon swap.
- Regenerate icon tap rotation.

## Themes

- `light`: bright Apple-like glass surface.
- `dark`: graphite theme used as default.
- `black`: OLED black theme.
- Theme CSS variables include background, foreground, card, popover, muted, accent, destructive, border, input, brand, glass, and glass border.

## Color Systems

- Accent keys come from shared `ACCENTS`, with default `blue` and `customAccent` default `#5b8def`.
- Brand color is exposed as `--brand`/`--accent-color`.
- Strength colors are fixed OKLCH values per strength band.

## Dependency Graph

```text
PassX route
├── usePassStore
│   └── password options/history/favorites/theme/accent state
├── useThemeAccent
│   ├── resolveAccentColor
│   └── applyDocumentTheme
├── passwordEngine
│   ├── crypto.getRandomValues
│   └── WORDS/SETS constants
├── presentational components
│   ├── ThemeSwitcher -> shared SegmentedThemeSwitcher
│   ├── AccentPicker -> shared AccentPicker
│   ├── OptionRow -> shared Switch
│   ├── History -> navigator.clipboard + sonner toast
│   ├── Stats -> passwordEngine metrics
│   └── CommandPalette -> cmdk + store actions
└── shared UI/animation/layout
```

## Feature Inventory

- Generate password on settings change.
- Copy password and add copied password to history.
- Show/hide password.
- Regenerate password.
- Export options/favorites JSON.
- Command palette actions and theme switching.
- Theme switching and persistence.
- Accent switching, custom accent, and persistence.
- Length number input and slider.
- Twelve option toggles.
- Five generation modes.
- Password history clear/copy/restore settings.
- Favorites save/apply/remove.
- Stats and distribution.
- Responsive single-column/mobile and multi-column/desktop layout.
- Glassmorphism and ambient background.
