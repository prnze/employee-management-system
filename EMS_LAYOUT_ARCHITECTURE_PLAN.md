# EMS Layout Architecture Plan

This document establishes the layout shell and navigation standardizations for EMS, aligning desktop fixed viewports, tablet collapsed displays, and mobile drawers.

---

## 1. Fixed Application Shell Structure

The app layouts share a structural wrapper setting viewport bounds to prevent scrollbar leaks:
* **Navbar**: Fixed header height (56px) with dynamic state values.
* **Sidebar**: Fixed width variable (`--sidebar-width: 280px` on desktop, `72px` on tablet, and offcanvas drawer on mobile).
* **Content Area**: Custom height constraints limiting scrollbars to main view regions only.

```text
+-------------------------------------------------------------+
| Navbar (Fixed height, includes Title & Language Selector)   |
+------------------------------+------------------------------+
|                              |                              |
| Sidebar                      | Content Area                 |
| (280px / 72px / Drawer)      | (overflow-y: auto)           |
|                              |                              |
+------------------------------+------------------------------+
```

---

## 2. Layout & Shell State Abstractions

### 2.1 ShellStateService
A central service will coordinate presentation settings instead of relying on local layouts:
```typescript
@Injectable({ providedIn: 'root' })
export class ShellStateService {
  private readonly sidebarExpandedSignal = signal<boolean>(true);
  readonly sidebarExpanded = this.sidebarExpandedSignal.asReadonly();

  toggleSidebar(): void {
    this.sidebarExpandedSignal.update(val => !val);
  }
}
```

### 2.2 Layout Metadata Support
* Routes can inject page metadata fields to override default layout states dynamically.
* E.g., `data: { hideSidebar: true, hideFooter: false, title: 'NAV_SETTINGS' }`.
* The `AppLayout` coordinates view refreshes by subscribing to `NavigationEnd` and reading active metadata properties.

---

## 3. Responsive Navigation Implementation

* **Desktop (>= 992px)**: Sidebar displays statically.
* **Tablet (768px to 991px)**: Collapsed sidebar mode hiding label Spans.
* **Mobile (< 768px)**: Hidden desktop sidebar. Toggle button triggers slide-out offcanvas menu drawer.
* **Viewport Scrolling**: Ensure parent pages use `overflow: hidden` to avoid double page scrollbars.
