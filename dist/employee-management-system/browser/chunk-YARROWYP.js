import {
  Pipe,
  setClassMetadata,
  ɵɵdefinePipe
} from "./chunk-BJMLPQUZ.js";

// src/app/shared/pipes/phone-format.pipe.ts
var PhoneFormatPipe = class _PhoneFormatPipe {
  transform(value) {
    const digits = (value ?? "").replace(/\D/g, "");
    return digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : value ?? "";
  }
  static \u0275fac = function PhoneFormatPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PhoneFormatPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "phoneFormat", type: _PhoneFormatPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PhoneFormatPipe, [{
    type: Pipe,
    args: [{ name: "phoneFormat", standalone: true }]
  }], null, null);
})();

export {
  PhoneFormatPipe
};
//# sourceMappingURL=chunk-YARROWYP.js.map
