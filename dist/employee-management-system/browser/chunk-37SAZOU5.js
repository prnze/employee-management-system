import {
  Injectable,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-BJMLPQUZ.js";

// src/app/core/services/audit.service.ts
var AuditService = class _AuditService {
  logsSignal = signal([
    { id: "a1", actor: "Avery Admin", action: "LOGIN", entity: "Auth", createdAt: "2026-06-02T08:30:00Z", ipAddress: "10.0.0.8" },
    { id: "a2", actor: "Avery Admin", action: "UPDATE", entity: "Employee EMP-1001", createdAt: "2026-06-02T08:40:00Z", ipAddress: "10.0.0.8" }
  ], ...ngDevMode ? [{ debugName: "logsSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  logs = this.logsSignal.asReadonly();
  record(actor, action, entity) {
    const entry = {
      id: crypto.randomUUID(),
      actor,
      action,
      entity,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      ipAddress: "127.0.0.1"
    };
    this.logsSignal.update((logs) => [entry, ...logs].slice(0, 100));
  }
  static \u0275fac = function AuditService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuditService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuditService, factory: _AuditService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuditService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  AuditService
};
//# sourceMappingURL=chunk-37SAZOU5.js.map
