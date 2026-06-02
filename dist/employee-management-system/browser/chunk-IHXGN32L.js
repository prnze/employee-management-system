import {
  ROLE_PERMISSIONS
} from "./chunk-AQHQM5CI.js";
import {
  AuthStateService
} from "./chunk-CSWEOAXU.js";
import {
  Injectable,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-BJMLPQUZ.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/auth/permissions.service.ts
var PermissionsService = class _PermissionsService {
  authState;
  /** Mutable permission map — admin UI writes here; guards read from it. */
  permissionMapSignal = signal(__spreadValues({}, ROLE_PERMISSIONS), ...ngDevMode ? [{ debugName: "permissionMapSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  permissionMap = this.permissionMapSignal.asReadonly();
  /** All unique permission strings available across all roles. */
  allPermissions = computed(() => {
    const seen = /* @__PURE__ */ new Set();
    Object.values(this.permissionMapSignal()).forEach((perms) => perms.forEach((p) => seen.add(p)));
    return Array.from(seen).sort();
  }, ...ngDevMode ? [{ debugName: "allPermissions" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor(authState) {
    this.authState = authState;
  }
  hasRole(roles) {
    const role = this.authState.role();
    return Boolean(role && roles.includes(role));
  }
  hasPermission(permission) {
    const role = this.authState.role();
    if (!role)
      return false;
    return (this.permissionMapSignal()[role] ?? []).includes(permission);
  }
  /** Returns the permission list for a given role. */
  getPermissions(role) {
    return this.permissionMapSignal()[role] ?? [];
  }
  /** Admin UI: toggle a single permission on a role. */
  togglePermission(role, permission) {
    this.permissionMapSignal.update((map) => {
      const current = map[role] ?? [];
      const next = current.includes(permission) ? current.filter((p) => p !== permission) : [...current, permission];
      return __spreadProps(__spreadValues({}, map), { [role]: next });
    });
  }
  /** Admin UI: replace the entire permission list for a role. */
  setPermissions(role, permissions) {
    this.permissionMapSignal.update((map) => __spreadProps(__spreadValues({}, map), { [role]: [...permissions] }));
  }
  static \u0275fac = function PermissionsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PermissionsService)(\u0275\u0275inject(AuthStateService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PermissionsService, factory: _PermissionsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PermissionsService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: AuthStateService }], null);
})();

export {
  PermissionsService
};
//# sourceMappingURL=chunk-IHXGN32L.js.map
