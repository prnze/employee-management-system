import {
  STORAGE_KEYS,
  StorageService
} from "./chunk-I2TBGIDF.js";
import {
  Injectable,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-BJMLPQUZ.js";

// src/app/core/auth/auth-state.service.ts
var AuthStateService = class _AuthStateService {
  storage;
  userSignal = signal(null, ...ngDevMode ? [{ debugName: "userSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  user = this.userSignal.asReadonly();
  isAuthenticated = computed(() => Boolean(this.userSignal()), ...ngDevMode ? [{ debugName: "isAuthenticated" }] : (
    /* istanbul ignore next */
    []
  ));
  role = computed(() => this.userSignal()?.role ?? null, ...ngDevMode ? [{ debugName: "role" }] : (
    /* istanbul ignore next */
    []
  ));
  permissions = computed(() => this.userSignal()?.permissions ?? [], ...ngDevMode ? [{ debugName: "permissions" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor(storage) {
    this.storage = storage;
    this.userSignal.set(this.storage.get(STORAGE_KEYS.user, localStorage) ?? this.storage.get(STORAGE_KEYS.user, sessionStorage));
  }
  setUser(user, rememberMe) {
    this.userSignal.set(user);
    this.storage.remove(STORAGE_KEYS.user);
    this.storage.set(STORAGE_KEYS.user, user, rememberMe ? localStorage : sessionStorage);
  }
  clear() {
    this.userSignal.set(null);
    this.storage.remove(STORAGE_KEYS.user);
  }
  static \u0275fac = function AuthStateService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthStateService)(\u0275\u0275inject(StorageService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthStateService, factory: _AuthStateService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthStateService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: StorageService }], null);
})();

export {
  AuthStateService
};
//# sourceMappingURL=chunk-CSWEOAXU.js.map
