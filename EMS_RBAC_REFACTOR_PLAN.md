# EMS RBAC Refactor Plan

This document details the refactoring path to transition the Employee Management System (EMS) authorization model into a robust, route metadata-driven Permission Guard and Directive structure.

---

## 1. Route Metadata Driven Permissions

We will transition the routing setup away from parsing URLs to determine modules and actions, and instead define explicit permission object declarations on routes.

### Target Routing Configuration Model
```typescript
export const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [permissionGuard],
    data: {
      permission: {
        module: 'users',
        action: 'manage'
      },
      title: 'USERS_PAGE_TITLE'
    }
  },
  {
    path: 'employees/create',
    component: EmployeeCreateComponent,
    canActivate: [permissionGuard],
    data: {
      permission: {
        module: 'employees',
        action: 'create'
      }
    }
  }
];
```

---

## 2. Refactored Authorization Components

### 2.1 Permission Service Contracts
The `PermissionService` will resolve permissions based on the active role structure:
```typescript
export interface UserPermission {
  module: string;
  action: 'read' | 'create' | 'update' | 'delete' | 'manage';
}

@Injectable({ providedIn: 'root' })
export class PermissionService {
  constructor(private readonly authState: AuthStateService) {}

  can(module: string, action: string): boolean {
    const role = this.authState.role();
    if (role === 'Admin' || role === 'Super Admin') return true; // Wildcard bypass
    
    const permissions = this.getRolePermissions(role);
    return permissions.includes(`${module}:${action}`) || permissions.includes(`${module}:manage`);
  }

  private getRolePermissions(role: string | null): string[] {
    // Queries mapping matrices...
    return [];
  }
}
```

### 2.2 Structural Directive (`*emsCan`)
We will create a structured directive `*emsCan` to toggle UI element rendering based on module/action permissions:
```typescript
@Directive({
  selector: '[emsCan]',
  standalone: true
})
export class EmsCanDirective {
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly permissionService = inject(PermissionService);

  @Input() set emsCan(permission: { module: string; action: string }) {
    const hasAccess = this.permissionService.can(permission.module, permission.action);
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

---

## 3. Permission Guard Strategy

* **Routing Guard**: The `permissionGuard` will intercept routing operations, read the `permission` configuration metadata object from route snapshots, and call `PermissionService.can(module, action)`.
* **Unauthorized Redirect**: Users lacking required permissions are immediately redirected to `/403` (Forbidden) views instead of being blocked on blank views.
* **Side-Menu Integration**: The `SidebarComponent` will filter navigation configurations dynamically using `PermissionService.can(...)` queries.
