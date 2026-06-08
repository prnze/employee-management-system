# Enterprise Component Roadmap

This document outlines the priority and execution plan for the next waves of core framework components.

---

## 1. Roadmap Priorities

```
Phase 1: Table Framework & Advanced Filters (High Priority)
   └── Phase 2: Store & Facade Architecture (State Abstraction)
         └── Phase 3: API Layer Standardization
               └── Phase 4: Command Palette & Dashboard Widgets
```

---

## 2. Component Target Specifications

| System / Candidate | Priority | Scope | Architecture Target |
| :--- | :--- | :--- | :--- |
| **Table Framework** | **High** | Core standard data grid with pagination, sort, selection, and templates. | Reusable component mapping table queries to Signals and supporting custom columns. |
| **Advanced Filters** | **High** | Multi-criteria query builders for lists. | Dynamic form groups emitting serialized API query configurations. |
| **Store & Facade Layer** | **Medium** | Centralized state container. | Light Signal Store pattern using Angular Signals to manage list caches and transactions. |
| **API Layer Standardization** | **Medium** | Unified HTTP client handlers. | Standard base API handler containing request interceptors, retry handlers, and type assertions. |
| **Notification Center** | **Medium** | Sidebar showing system alerts. | ShellStateService-driven panel reading events and updates dynamically. |
| **Command Palette** | **Low** | Global search and quick command bar. | Dynamic overlay mapping app routes and permissions to keyboard shortcuts. |

---

## 3. Wave 2 Immediate Next Steps

### Candidate 1: Table Framework
* **Objective**: Remove duplicate paginator and column sorting HTML blocks from Employee List and User List views.
* **Component Contract**:
  ```html
  <app-table
    [data]="employees()"
    [columns]="columns"
    [total]="totalCount()"
    (sortChange)="onSort($event)"
    (pageChange)="onPage($event)">
  </app-table>
  ```

### Candidate 2: State Abstraction (Store/Facade)
* **Objective**: Eliminate direct Component-to-Service HTTP fetches.
* **Component Contract**:
  ```ts
  @Injectable({ providedIn: 'root' })
  export class EmployeeFacade {
    private readonly store = inject(EmployeeStore);
    readonly list = this.store.list;
    readonly loading = this.store.loading;

    loadAll(): void {
      this.store.loadEmployees();
    }
  }
  ```
