import {
  STORAGE_KEYS,
  StorageService
} from "./chunk-I2TBGIDF.js";
import {
  DOCUMENT,
  Injectable,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-BJMLPQUZ.js";

// src/app/core/services/theme.service.ts
var ThemeService = class _ThemeService {
  document = inject(DOCUMENT);
  storage = inject(StorageService);
  themeSignal = signal("light", ...ngDevMode ? [{ debugName: "themeSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  theme = this.themeSignal.asReadonly();
  constructor() {
    effect(() => {
      const theme = this.themeSignal();
      this.document.documentElement.setAttribute("data-bs-theme", theme);
      this.storage.set(STORAGE_KEYS.theme, theme, localStorage);
    });
  }
  initialize() {
    this.themeSignal.set(this.storage.get(STORAGE_KEYS.theme, localStorage) ?? "light");
  }
  toggle() {
    this.themeSignal.update((theme) => theme === "light" ? "dark" : "light");
  }
  static \u0275fac = function ThemeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

export {
  ThemeService
};
//# sourceMappingURL=chunk-RJ4TKVLL.js.map
