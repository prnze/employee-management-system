import {
  ChangeDetectionStrategy,
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/admin/reports/reports.component.ts
var _c0 = () => ["Headcount", "Attendance", "Payroll", "Attrition"];
function ReportsComponent_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "article", 2)(1, "div", 3)(2, "h2", 4);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(4, "p", 5);
    \u0275\u0275text(5, "Exportable business report with mock data.");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "button", 6);
    \u0275\u0275text(7, "Generate");
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const report_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(report_r1);
  }
}
var ReportsComponent = class _ReportsComponent {
  static \u0275fac = function ReportsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReportsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReportsComponent, selectors: [["app-reports"]], decls: 5, vars: 1, consts: [[1, "h3", "mb-3"], [1, "row", "g-3"], [1, "col-md-6", "col-xl-3"], [1, "surface", "p-3"], [1, "h5"], [1, "text-body-secondary"], [1, "btn", "btn-outline-primary"]], template: function ReportsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "h1", 0);
      \u0275\u0275text(1, "Reports");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "section", 1);
      \u0275\u0275repeaterCreate(3, ReportsComponent_For_4_Template, 8, 1, "article", 2, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c0));
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReportsComponent, [{
    type: Component,
    args: [{
      selector: "app-reports",
      standalone: true,
      template: `
    <h1 class="h3 mb-3">Reports</h1>
    <section class="row g-3">
      @for (report of ['Headcount', 'Attendance', 'Payroll', 'Attrition']; track report) {
        <article class="col-md-6 col-xl-3"><div class="surface p-3"><h2 class="h5">{{ report }}</h2><p class="text-body-secondary">Exportable business report with mock data.</p><button class="btn btn-outline-primary">Generate</button></div></article>
      }
    </section>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReportsComponent, { className: "ReportsComponent", filePath: "src/app/features/admin/reports/reports.component.ts", lineNumber: 16 });
})();
export {
  ReportsComponent
};
//# sourceMappingURL=chunk-SNEMT7EN.js.map
