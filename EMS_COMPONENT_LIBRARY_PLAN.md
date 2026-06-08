# EMS Component Library Plan

This document establishes the architecture for a standardized shared component library within the EMS application, migrating duplicate UI components to reusable primitives.

---

## 1. Directory Structure

The `src/app/shared` directory will be reorganized into domain sub-folders:

```text
src/app/shared/
├── components/           # Core presentation components
│   ├── icon/
│   ├── toast/
│   ├── modal/
│   ├── table/
│   ├── search/
│   ├── pagination/
│   ├── empty-state/
│   ├── loading/
│   ├── filter-chips/
│   └── profile/
├── directives/           # Shared directives (permission, scroll grab)
├── pipes/                # Format pipes (app-date, initials, formatters)
├── services/             # Local shared utility services (e.g. list persist)
├── constants/            # Common app constants
├── models/               # Universal models (TableColumn, Pagination)
└── layouts/              # Shared sub-layouts or cards
```

---

## 2. Reusable Primitives Definition

| Reusable Asset | Current State in EMS | Proposed Framework-Level Blueprint | Priority |
|---|---|---|---|
| **IconComponent** | Standalone Component | Central Material Symbol component using input-driven icons and sizes. | P1 |
| **ToastComponent** | Custom signal-bound Toast | Abstract toast component managed via `ToastService` queues. | P1 |
| **ModalComponent** | Custom inline modal code | Dynamically instantiated wrapper backed by `NgbActiveModal`. | P1 |
| **TableComponent** | Unused stub component | Standard list wrapper with column setups and custom action hooks. | P1 |
| **SearchComponent** | Hardcoded in tables | Self-clearing search input emitting string arrays or debounce events. | P2 |
| **Form Controls** | Basic HTML control blocks | Reusable inputs (text, select, date, checkbox) implementing `ControlValueAccessor`. | P1 |
| **LoadingComponent** | Custom skeleton elements | Overlay loaders and localized inline spinners. | P2 |
| **EmptyState** | LOCAL empty states | Generic display for "no records found" with icon, title, and action hooks. | P2 |
| **Pagination** | Custom component | Standard pagination element managing page indexes and records page size. | P2 |
| **FilterChips** | Local chips layouts | Reusable chip-list rendering active filters. | P2 |
| **ProfileHoverCard** | Duplicated navbar overlay | Floating profile and hover dropdown card. | P2 |

---

## 3. Implementation Specification

### 3.1 Custom Inputs (ControlValueAccessor) (P1)
Custom form controls will implement standard validation hooks to ensure seamless form integration:
```typescript
@Component({
  selector: 'app-input',
  standalone: true,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: InputComponent, multi: true }
  ],
  template: `
    <div class="form-group">
      <label [for]="id">{{ label() }}</label>
      <input [id]="id" [type]="type()" class="form-control" [formControl]="control" />
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly type = input<string>('text');
  // CVA boilerplate...
}
```

### 3.2 Common Modal Wrapper (P1)
Establish a unified `DialogService` mapping overlay templates to components:
* Modal templates will be isolated. Components will inject dynamic modal inputs directly.
* A standard Confirmation Modal will accept a common schema: `{ title: string, message: string, confirmLabel: string }`.
