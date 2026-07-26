# Tools Navigation Report

## Implementation summary

The portfolio header navigation now includes a compact **🛠 Tools** dropdown after the existing portfolio links. The existing About, Experience, Work, Skills, Contact, and call-to-action links were not changed. On mobile, the same group expands within the existing hamburger menu.

## Files modified

- `src/app/core/models/tool-navigation.models.ts`
- `src/app/core/services/tool-navigation.service.ts`
- `src/app/core/services/tool-favicon.service.ts`
- `src/app/app.component.ts`
- `src/app/features/landing/landing.component.ts`
- `src/app/features/landing/landing.component.html`
- `src/app/features/landing/landing.component.scss`
- `src/assets/tool-icons/ems.svg`
- `src/assets/tool-icons/sharex.svg`
- `src/assets/tool-icons/passx.svg`
- `src/assets/tool-icons/formatx.svg`

## Reusable URL helper

`ToolNavigationService` is the sole source of tool URLs and uses `window.location.hostname` through Angular's injected `DOCUMENT`.

- `localhost` and `127.0.0.1` resolve to `http://localhost:4200`.
- Any other hostname resolves to `https://prnze.in`.
- The model supplies each tool's label, URL path, and branded favicon source without duplicated URL logic.

`ToolFaviconService` observes successful Angular navigations and updates the browser tab's icon for every tool route. This makes direct links and links opened in a new tab show EMS, ShareX, PassX, or FormatX branding instead of the portfolio favicon.

## Tool links and favicon sources

| Tool | Local destination | Production destination | Favicon source |
| --- | --- | --- | --- |
| EMS | `http://localhost:4200/ems` | `https://prnze.in/ems` | `assets/tool-icons/ems.svg` |
| ShareX | `http://localhost:4200/sharex` | `https://prnze.in/sharex` | `assets/tool-icons/sharex.svg` |
| PassX | `http://localhost:4200/passx` | `https://prnze.in/passx` | `assets/tool-icons/passx.svg` |
| FormatX | `http://localhost:4200/formatx` | `https://prnze.in/formatx` | `assets/tool-icons/formatx.svg` |

The production `/ems/favicon.ico`, `/sharex/favicon.ico`, `/passx/favicon.ico`, and `/formatx/favicon.ico` endpoints currently return HTML fallback documents rather than image content. Individual SVG fallbacks were therefore added so every menu item has a distinct, crisp, non-broken icon.

## Accessibility

- The Tools control is a keyboard-operable button with `aria-expanded` and `aria-controls`.
- Each external link has a translated `aria-label`, a `title`, `target="_blank"`, and `rel="noopener noreferrer"`.
- Decorative favicon images use empty alt text; link labels remain the accessible names.
- Existing focus behavior is retained and extended to the Tools control and links.
- Escape and outside clicks close the menu.

## Responsive and theme behavior

- Desktop: compact dropdown positioned below the Tools control.
- Mobile (including 320px and 375px): inline expandable group in the existing menu.
- Tablet and desktop (768px, 1024px, 1440px, 1920px): it follows the existing header's responsive layout.
- Dark and light themes inherit existing portfolio CSS variables; no palette or typography changes were introduced.
- Favicons reserve fixed 16×16px space, lazy-load, and use SVG for retina clarity and zero layout shift.

## Verification

- `npm run build` completed successfully.
- English and German translation JSON parsed successfully.
- Production favicon endpoint checks confirmed they are HTML fallbacks; the SVG fallback assets replace them.
- Browser screenshots could not be captured because the connected browser session failed to initialize in this environment. No screenshots have been fabricated.
