# EMS State Management Plan

This document maps out the state management architecture of EMS, leveraging Angular Signals for synchronous state and RxJS for asynchronous event/data pipelines.

---

## 1. State Store Architecture

To prevent massive monolithic service structures, the application will distribute state across focused stores.

```text
+----------------------- App State -----------------------+
|                                                         |
|  [SessionStore] ---> Auth & Login credentials           |
|  [UserStore]    ---> Active User profiles & details      |
|  [ShellStore]   ---> Viewport sizes & sidebar toggles   |
|  [NotifStore]   ---> Alert listings & message queues    |
|                                                         |
+---------------------------------------------------------+
```

---

## 2. Shared Store Implementation Specifications

### 2.1 Session Store (`SessionStore`)
Manages authentication credentials and active tokens:
```typescript
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly tokenSignal = signal<string | null>(null);
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.token());

  setSession(token: string): void {
    this.tokenSignal.set(token);
  }

  clearSession(): void {
    this.tokenSignal.set(null);
  }
}
```

### 2.2 Shell Store (`ShellStore`)
Tracks active view heights, titles, and layout configuration signals:
```typescript
@Injectable({ providedIn: 'root' })
export class ShellStore {
  readonly title = signal<string>('EMS');
  readonly sidebarOpen = signal<boolean>(true);
}
```

---

## 3. Feature Facades Pattern

For dense business logic domains (like Employees and User Management), EMS will introduce **Feature Facades**. The facade orchestrates service calls and keeps components thin:

```typescript
@Injectable()
export class EmployeeFacade {
  private readonly state = signal<{ items: Employee[]; loading: boolean }>({ items: [], loading: false });
  readonly employees = computed(() => this.state().items);
  readonly loading = computed(() => this.state().loading);

  constructor(private readonly api: EmployeeService) {}

  loadEmployees(filter: any): void {
    this.state.update(s => ({ ...s, loading: true }));
    this.api.queryEmployees(filter).subscribe({
      next: (items) => this.state.set({ items, loading: false }),
      error: () => this.state.update(s => ({ ...s, loading: false }))
    });
  }
}
```
* **Benefits**: Decouples presentation components from complex API services. Makes testing components simple by mocking the Facade.
