import {
  Injectable,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-BJMLPQUZ.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/services/toast.service.ts
var ToastService = class _ToastService {
  messagesSignal = signal([], ...ngDevMode ? [{ debugName: "messagesSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  messages = this.messagesSignal.asReadonly();
  show(message) {
    const toast = __spreadProps(__spreadValues({}, message), { id: crypto.randomUUID() });
    this.messagesSignal.update((items) => [toast, ...items].slice(0, 5));
    setTimeout(() => this.dismiss(toast.id), 5e3);
  }
  dismiss(id) {
    this.messagesSignal.update((items) => items.filter((item) => item.id !== id));
  }
  static \u0275fac = function ToastService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ToastService, factory: _ToastService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  ToastService
};
//# sourceMappingURL=chunk-EKXE6HEF.js.map
