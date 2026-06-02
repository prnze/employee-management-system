import {
  ROLE_PERMISSIONS
} from "./chunk-AQHQM5CI.js";
import {
  AuditService
} from "./chunk-37SAZOU5.js";
import {
  Injectable,
  delay,
  of,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-BJMLPQUZ.js";

// src/app/core/services/admin-data.service.ts
var AdminDataService = class _AdminDataService {
  audit;
  constructor(audit) {
    this.audit = audit;
  }
  usersSignal = signal([
    { id: "u1", fullName: "Avery Admin", email: "admin@ems.local", role: "Admin", status: "Active", lastLoginAt: "2026-06-02T08:30:00Z" },
    { id: "u2", fullName: "Emerson Employee", email: "employee@ems.local", role: "Employee", status: "Active", lastLoginAt: "2026-06-01T15:45:00Z" }
  ], ...ngDevMode ? [{ debugName: "usersSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  dashboard() {
    return of({ employees: 4, activeUsers: 2, pendingTasks: 9, unreadNotifications: 3 }).pipe(delay(200));
  }
  users() {
    return of(this.usersSignal()).pipe(delay(200));
  }
  roles() {
    const roles = [
      { id: "r1", name: "Admin", description: "Full administrative control", permissions: ROLE_PERMISSIONS.Admin },
      { id: "r2", name: "Employee", description: "Self-service employee access", permissions: ROLE_PERMISSIONS.Employee }
    ];
    return of(roles).pipe(delay(200));
  }
  notifications() {
    const notifications = [
      { id: "n1", title: "Payroll approved", message: "May payroll was approved.", type: "Success", read: false, createdAt: "2026-06-02T09:00:00Z" },
      { id: "n2", title: "Profile update", message: "Sara updated emergency contacts.", type: "Info", read: true, createdAt: "2026-06-01T10:30:00Z" }
    ];
    return of(notifications).pipe(delay(200));
  }
  auditLogs() {
    return of(this.audit.logs()).pipe(delay(200));
  }
  static \u0275fac = function AdminDataService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminDataService)(\u0275\u0275inject(AuditService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminDataService, factory: _AdminDataService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminDataService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: AuditService }], null);
})();

export {
  AdminDataService
};
//# sourceMappingURL=chunk-3GT75SN2.js.map
