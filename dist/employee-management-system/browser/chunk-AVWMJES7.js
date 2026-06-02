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

// src/app/features/errors/server-error/server-error.component.ts
var ServerErrorComponent = class _ServerErrorComponent {
  static \u0275fac = function ServerErrorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ServerErrorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ServerErrorComponent, selectors: [["app-server-error"]], decls: 7, vars: 0, consts: [[1, "container", "py-5", "text-center"], ["routerLink", "/", 1, "btn", "btn-primary"]], template: function ServerErrorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "main", 0)(1, "h1");
      \u0275\u0275text(2, "500");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "The server could not complete the request.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "a", 1);
      \u0275\u0275text(6, "Go home");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [RouterLink], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ServerErrorComponent, [{
    type: Component,
    args: [{
      selector: "app-server-error",
      standalone: true,
      imports: [RouterLink],
      template: `<main class="container py-5 text-center"><h1>500</h1><p>The server could not complete the request.</p><a class="btn btn-primary" routerLink="/">Go home</a></main>`,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ServerErrorComponent, { className: "ServerErrorComponent", filePath: "src/app/features/errors/server-error/server-error.component.ts", lineNumber: 11 });
})();
export {
  ServerErrorComponent
};
//# sourceMappingURL=chunk-AVWMJES7.js.map
