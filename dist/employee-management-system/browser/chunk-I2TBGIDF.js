import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-BJMLPQUZ.js";

// src/app/core/constants/storage-keys.constant.ts
var STORAGE_KEYS = {
  accessToken: "ems.accessToken",
  accessTokenExpiresAt: "ems.accessTokenExpiresAt",
  refreshToken: "ems.refreshToken",
  user: "ems.user",
  rememberMe: "ems.rememberMe",
  theme: "ems.theme"
};

// src/app/core/services/storage.service.ts
var StorageService = class _StorageService {
  get(key, storage = localStorage) {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  set(key, value, storage = localStorage) {
    storage.setItem(key, JSON.stringify(value));
  }
  remove(key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
  static \u0275fac = function StorageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StorageService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _StorageService, factory: _StorageService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StorageService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  STORAGE_KEYS,
  StorageService
};
//# sourceMappingURL=chunk-I2TBGIDF.js.map
