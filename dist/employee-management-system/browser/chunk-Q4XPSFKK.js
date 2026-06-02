import {
  AdminDataService
} from "./chunk-3GT75SN2.js";
import "./chunk-AQHQM5CI.js";
import "./chunk-37SAZOU5.js";
import {
  AsyncPipe
} from "./chunk-XBOA52FZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/admin/audit-logs/audit-logs.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function AuditLogsComponent_For_18_Template(rf, ctx) {
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
    \u0275\u0275domElementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const log_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r1.actor);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r1.action);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r1.entity);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r1.createdAt);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(log_r1.ipAddress);
  }
}
var AuditLogsComponent = class _AuditLogsComponent {
  logs$ = inject(AdminDataService).auditLogs();
  static \u0275fac = function AuditLogsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuditLogsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuditLogsComponent, selectors: [["app-audit-logs"]], decls: 20, vars: 2, consts: [[1, "h3", "mb-3"], [1, "surface", "table-responsive"], [1, "table", "mb-0"]], template: function AuditLogsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "h1", 0);
      \u0275\u0275text(1, "Audit logs");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "div", 1)(3, "table", 2)(4, "thead")(5, "tr")(6, "th");
      \u0275\u0275text(7, "Actor");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(8, "th");
      \u0275\u0275text(9, "Action");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(10, "th");
      \u0275\u0275text(11, "Entity");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(12, "th");
      \u0275\u0275text(13, "Time");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(14, "th");
      \u0275\u0275text(15, "IP");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(16, "tbody");
      \u0275\u0275repeaterCreate(17, AuditLogsComponent_For_18_Template, 11, 5, "tr", null, _forTrack0);
      \u0275\u0275pipe(19, "async");
      \u0275\u0275domElementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(17);
      \u0275\u0275repeater(\u0275\u0275pipeBind1(19, 0, ctx.logs$));
    }
  }, dependencies: [AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuditLogsComponent, [{
    type: Component,
    args: [{
      selector: "app-audit-logs",
      standalone: true,
      imports: [AsyncPipe],
      template: `
    <h1 class="h3 mb-3">Audit logs</h1>
    <div class="surface table-responsive">
      <table class="table mb-0">
        <thead><tr><th>Actor</th><th>Action</th><th>Entity</th><th>Time</th><th>IP</th></tr></thead>
        <tbody>@for (log of logs$ | async; track log.id) { <tr><td>{{ log.actor }}</td><td>{{ log.action }}</td><td>{{ log.entity }}</td><td>{{ log.createdAt }}</td><td>{{ log.ipAddress }}</td></tr> }</tbody>
      </table>
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuditLogsComponent, { className: "AuditLogsComponent", filePath: "src/app/features/admin/audit-logs/audit-logs.component.ts", lineNumber: 20 });
})();
export {
  AuditLogsComponent
};
//# sourceMappingURL=chunk-Q4XPSFKK.js.map
