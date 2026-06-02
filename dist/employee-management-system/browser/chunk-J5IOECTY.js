import {
  RouterLink
} from "./chunk-WJRWGGLF.js";
import "./chunk-XBOA52FZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/errors/forbidden/forbidden.component.ts
var ForbiddenComponent = class _ForbiddenComponent {
  static \u0275fac = function ForbiddenComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ForbiddenComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ForbiddenComponent, selectors: [["app-forbidden"]], decls: 7, vars: 0, consts: [[1, "container", "py-5", "text-center"], ["routerLink", "/", 1, "btn", "btn-primary"]], template: function ForbiddenComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "main", 0)(1, "h1");
      \u0275\u0275text(2, "403");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "You do not have permission to access this page.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "a", 1);
      \u0275\u0275text(6, "Go home");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [RouterLink], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ForbiddenComponent, [{
    type: Component,
    args: [{
      selector: "app-forbidden",
      standalone: true,
      imports: [RouterLink],
      template: `<main class="container py-5 text-center"><h1>403</h1><p>You do not have permission to access this page.</p><a class="btn btn-primary" routerLink="/">Go home</a></main>`,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ForbiddenComponent, { className: "ForbiddenComponent", filePath: "src/app/features/errors/forbidden/forbidden.component.ts", lineNumber: 11 });
})();
export {
  ForbiddenComponent
};
//# sourceMappingURL=chunk-J5IOECTY.js.map
