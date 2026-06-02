import {
  permissionGuard,
  unsavedChangesGuard
} from "./chunk-42ZZSNEF.js";
import "./chunk-IHXGN32L.js";
import "./chunk-AQHQM5CI.js";
import "./chunk-CSWEOAXU.js";
import "./chunk-WJRWGGLF.js";
import "./chunk-I2TBGIDF.js";
import "./chunk-XBOA52FZ.js";
import "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/employee/employee.routes.ts
var EMPLOYEE_ROUTES = [
  { path: "", pathMatch: "full", redirectTo: "dashboard" },
  {
    path: "dashboard",
    data: { permission: "dashboard:view" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-B74TSB5Q.js").then((m) => m.EmployeeDashboardComponent)
  },
  {
    path: "profile",
    data: { permission: "profile:update" },
    canActivate: [permissionGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import("./chunk-GKPYBADS.js").then((m) => m.ProfileComponent)
  },
  {
    path: "attendance",
    data: { permission: "attendance:view" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-KQL2ITXI.js").then((m) => m.AttendanceComponent)
  },
  {
    path: "tasks",
    data: { permission: "tasks:view" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-A56LYW5S.js").then((m) => m.TasksComponent)
  },
  {
    path: "notifications",
    data: { permission: "notifications:view" },
    canActivate: [permissionGuard],
    loadComponent: () => import("./chunk-OPTZUIFP.js").then((m) => m.EmployeeNotificationsComponent)
  }
];
export {
  EMPLOYEE_ROUTES
};
//# sourceMappingURL=chunk-LVUT3VZ4.js.map
