# EMS Enterprise Standards Plan

This document identifies opportunities to align EMS codebase style, type safety rules, error-handling conventions, and accessibility protocols with modern enterprise-grade Angular standards.

---

## 1. Core Enterprise Guidelines

### 1.1 Generic Injection Tokens
To decouple reusable assets from core code modules, dependencies will reside behind Injection Tokens:
```typescript
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
export const AUTH_TOKEN_KEY = new InjectionToken<string>('AUTH_TOKEN_KEY');
```

### 1.2 Typed API Response Formats
We will standardize backend data wrappers to prevent `any` castings inside components:
```typescript
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
  errors?: string[];
}
```

---

## 2. Infrastructure Standards

### 2.1 Error Handling Layer
* Implement a `GlobalErrorHandler` that intercepts unhandled runtime exceptions.
* Standardize HTTP error mappings using translation keys, formatting network failures into developer-friendly logs and user-facing toasts.

### 2.2 Theme Tokens
* Consolidate HSL/Hex variables inside a central `:root` declaration block in CSS, mapping them to clear semantic tokens (e.g. `--app-bg`, `--app-surface`, `--app-brand`).

### 2.3 Accessibility Improvements
* Provide explicit `aria-label` bindings on custom buttons (e.g., sort, page buttons, modal close triggers).
* Configure semantic layout landmarks (e.g., `<header>`, `<nav>`, `<main>`, `<aside>`) to ensure compatibility with screen readers.
* Integrate keyboard navigation hooks (e.g., pressing `Escape` closes active dialog overlays).

### 2.4 Translation Quality Guards
* Standardize translation key definitions using English fallback dictionaries.
* Prevent compiling raw strings in templates; enforce verification checks to verify language keys exist in JSON dictionaries.
