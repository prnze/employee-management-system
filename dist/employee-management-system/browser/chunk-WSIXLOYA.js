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

// src/app/features/admin/notifications/admin-notifications.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminNotificationsComponent_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "article", 2)(1, "div", 3)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(4, "span", 4);
    \u0275\u0275text(5);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(6, "p", 5);
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const notification_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(notification_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(notification_r1.type);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(notification_r1.message);
  }
}
var AdminNotificationsComponent = class _AdminNotificationsComponent {
  notifications$ = inject(AdminDataService).notifications();
  static \u0275fac = function AdminNotificationsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminNotificationsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminNotificationsComponent, selectors: [["app-admin-notifications"]], decls: 6, vars: 2, consts: [[1, "h3", "mb-3"], [1, "list-group"], [1, "list-group-item"], [1, "d-flex", "justify-content-between"], [1, "badge", "text-bg-secondary"], [1, "mb-0"]], template: function AdminNotificationsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "h1", 0);
      \u0275\u0275text(1, "Notifications");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "div", 1);
      \u0275\u0275repeaterCreate(3, AdminNotificationsComponent_For_4_Template, 8, 3, "article", 2, _forTrack0);
      \u0275\u0275pipe(5, "async");
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275repeater(\u0275\u0275pipeBind1(5, 0, ctx.notifications$));
    }
  }, dependencies: [AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminNotificationsComponent, [{
    type: Component,
    args: [{
      selector: "app-admin-notifications",
      standalone: true,
      imports: [AsyncPipe],
      template: `
    <h1 class="h3 mb-3">Notifications</h1>
    <div class="list-group">
      @for (notification of notifications$ | async; track notification.id) {
        <article class="list-group-item"><div class="d-flex justify-content-between"><strong>{{ notification.title }}</strong><span class="badge text-bg-secondary">{{ notification.type }}</span></div><p class="mb-0">{{ notification.message }}</p></article>
      }
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminNotificationsComponent, { className: "AdminNotificationsComponent", filePath: "src/app/features/admin/notifications/admin-notifications.component.ts", lineNumber: 19 });
})();
export {
  AdminNotificationsComponent
};
//# sourceMappingURL=chunk-WSIXLOYA.js.map
