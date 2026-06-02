import {
  ChangeDetectionStrategy,
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/employee/attendance/attendance.component.ts
var _forTrack0 = ($index, $item) => $item.date;
function AttendanceComponent_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(7, "td")(8, "span", 3);
    \u0275\u0275text(9);
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const row_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.date);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.in);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.out);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(row_r1.status);
  }
}
var AttendanceComponent = class _AttendanceComponent {
  rows = [
    { date: "2026-06-02", in: "09:04", out: "18:12", status: "Present" },
    { date: "2026-06-01", in: "09:15", out: "18:01", status: "Present" }
  ];
  static \u0275fac = function AttendanceComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AttendanceComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AttendanceComponent, selectors: [["app-attendance"]], decls: 17, vars: 0, consts: [[1, "h3", "mb-3"], [1, "surface", "table-responsive"], [1, "table", "mb-0"], [1, "badge", "text-bg-success"]], template: function AttendanceComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "h1", 0);
      \u0275\u0275text(1, "Attendance");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "div", 1)(3, "table", 2)(4, "thead")(5, "tr")(6, "th");
      \u0275\u0275text(7, "Date");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(8, "th");
      \u0275\u0275text(9, "Check in");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(10, "th");
      \u0275\u0275text(11, "Check out");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(12, "th");
      \u0275\u0275text(13, "Status");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(14, "tbody");
      \u0275\u0275repeaterCreate(15, AttendanceComponent_For_16_Template, 10, 4, "tr", null, _forTrack0);
      \u0275\u0275domElementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(15);
      \u0275\u0275repeater(ctx.rows);
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttendanceComponent, [{
    type: Component,
    args: [{
      selector: "app-attendance",
      standalone: true,
      template: `
    <h1 class="h3 mb-3">Attendance</h1>
    <div class="surface table-responsive">
      <table class="table mb-0"><thead><tr><th>Date</th><th>Check in</th><th>Check out</th><th>Status</th></tr></thead><tbody>
        @for (row of rows; track row.date) { <tr><td>{{ row.date }}</td><td>{{ row.in }}</td><td>{{ row.out }}</td><td><span class="badge text-bg-success">{{ row.status }}</span></td></tr> }
      </tbody></table>
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AttendanceComponent, { className: "AttendanceComponent", filePath: "src/app/features/employee/attendance/attendance.component.ts", lineNumber: 16 });
})();
export {
  AttendanceComponent
};
//# sourceMappingURL=chunk-KQL2ITXI.js.map
