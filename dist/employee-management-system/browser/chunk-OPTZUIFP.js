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

// src/app/features/employee/notifications/employee-notifications.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function EmployeeNotificationsComponent_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "button", 2)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "p", 3);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.message);
  }
}
var EmployeeNotificationsComponent = class _EmployeeNotificationsComponent {
  items = [
    { id: "1", title: "Leave approved", message: "Your leave request was approved." },
    { id: "2", title: "Task due", message: "Self review is due this week." }
  ];
  static \u0275fac = function EmployeeNotificationsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmployeeNotificationsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmployeeNotificationsComponent, selectors: [["app-employee-notifications"]], decls: 5, vars: 0, consts: [[1, "h3", "mb-3"], [1, "list-group"], ["type", "button", 1, "list-group-item", "list-group-item-action"], [1, "mb-0"]], template: function EmployeeNotificationsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "h1", 0);
      \u0275\u0275text(1, "Notifications");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "div", 1);
      \u0275\u0275repeaterCreate(3, EmployeeNotificationsComponent_For_4_Template, 5, 2, "button", 2, _forTrack0);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.items);
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmployeeNotificationsComponent, [{
    type: Component,
    args: [{
      selector: "app-employee-notifications",
      standalone: true,
      template: `
    <h1 class="h3 mb-3">Notifications</h1>
    <div class="list-group">
      @for (item of items; track item.id) {
        <button class="list-group-item list-group-item-action" type="button"><strong>{{ item.title }}</strong><p class="mb-0">{{ item.message }}</p></button>
      }
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmployeeNotificationsComponent, { className: "EmployeeNotificationsComponent", filePath: "src/app/features/employee/notifications/employee-notifications.component.ts", lineNumber: 16 });
})();
export {
  EmployeeNotificationsComponent
};
//# sourceMappingURL=chunk-OPTZUIFP.js.map
