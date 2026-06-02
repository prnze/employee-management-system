import {
  permissionGuard,
  unsavedChangesGuard
} from "./chunk-42ZZSNEF.js";
import {
  AdminDataService
} from "./chunk-3GT75SN2.js";
import "./chunk-IHXGN32L.js";
import "./chunk-AQHQM5CI.js";
import {
  EmployeeService
} from "./chunk-VEQERCC5.js";
import "./chunk-CSWEOAXU.js";
import "./chunk-37SAZOU5.js";
import "./chunk-WJRWGGLF.js";
import "./chunk-I2TBGIDF.js";
import "./chunk-XBOA52FZ.js";
import {
  inject
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/core/resolvers/dashboard.resolver.ts
var dashboardResolver = () => inject(AdminDataService).dashboard();

// src/app/core/resolvers/employee-detail.resolver.ts
var employeeDetailResolver = (route) => inject(EmployeeService).getById(route.paramMap.get("id") ?? "");

// src/app/features/admin/admin.routes.ts
var ADMIN_ROUTES = [
  { path: "", pathMatch: "full", redirectTo: "dashboard" },
  {
    path: "dashboard",
    resolve: { stats: dashboardResolver },
    data: { permission: "dashboard:view" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-W2WA2QDZ.js").then((m) => m.AdminDashboardComponent)
  },
  {
    path: "employees",
    data: { permission: "employees:read" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-SLBDDK5F.js").then((m) => m.EmployeeListComponent)
  },
  {
    path: "employees/create",
    data: { permission: "employees:create" },
    canActivate: [permissionGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import("./chunk-CYB5GZCE.js").then((m) => m.EmployeeFormComponent)
  },
  {
    path: "employees/:id",
    resolve: { employee: employeeDetailResolver },
    data: { permission: "employees:read" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-GASIENNW.js").then((m) => m.EmployeeDetailComponent)
  },
  {
    path: "employees/:id/edit",
    resolve: { employee: employeeDetailResolver },
    data: { permission: "employees:update" },
    canActivate: [permissionGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import("./chunk-CYB5GZCE.js").then((m) => m.EmployeeFormComponent)
  },
  {
    path: "users",
    data: { permission: "users:manage" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-56W3YA52.js").then((m) => m.UsersComponent)
  },
  {
    path: "roles",
    data: { permission: "roles:manage" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-ZDFHJARP.js").then((m) => m.RolesComponent)
  },
  {
    path: "reports",
    data: { permission: "reports:view" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-SNEMT7EN.js").then((m) => m.ReportsComponent)
  },
  {
    path: "notifications",
    loadComponent: () => import("./chunk-WSIXLOYA.js").then((m) => m.AdminNotificationsComponent)
  },
  {
    path: "audit-logs",
    data: { permission: "audit:view" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-Q4XPSFKK.js").then((m) => m.AuditLogsComponent)
  },
  {
    path: "settings",
    data: { permission: "settings:manage" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-H22DMK6E.js").then((m) => m.SettingsComponent)
  }
];
export {
  ADMIN_ROUTES
};
//# sourceMappingURL=chunk-HFX43SS4.js.map
