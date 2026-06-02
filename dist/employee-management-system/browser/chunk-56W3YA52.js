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

// src/app/features/admin/users/users.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function UsersComponent_For_20_Template(rf, ctx) {
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
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(11, "td", 3)(12, "button", 4);
    \u0275\u0275text(13, "Reset password");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(14, "button", 5);
    \u0275\u0275text(15, "Lock");
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const user_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r1.fullName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r1.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r1.role);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r1.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r1.lastLoginAt);
  }
}
var UsersComponent = class _UsersComponent {
  users$ = inject(AdminDataService).users();
  static \u0275fac = function UsersComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UsersComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UsersComponent, selectors: [["app-users"]], decls: 22, vars: 2, consts: [[1, "h3", "mb-3"], [1, "surface", "table-responsive"], [1, "table", "table-hover", "mb-0"], [1, "text-end"], [1, "btn", "btn-sm", "btn-outline-secondary", "me-1"], [1, "btn", "btn-sm", "btn-outline-warning"]], template: function UsersComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "h1", 0);
      \u0275\u0275text(1, "User management");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "div", 1)(3, "table", 2)(4, "thead")(5, "tr")(6, "th");
      \u0275\u0275text(7, "Name");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(8, "th");
      \u0275\u0275text(9, "Email");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(10, "th");
      \u0275\u0275text(11, "Role");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(12, "th");
      \u0275\u0275text(13, "Status");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(14, "th");
      \u0275\u0275text(15, "Last login");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(16, "th", 3);
      \u0275\u0275text(17, "Actions");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(18, "tbody");
      \u0275\u0275repeaterCreate(19, UsersComponent_For_20_Template, 16, 5, "tr", null, _forTrack0);
      \u0275\u0275pipe(21, "async");
      \u0275\u0275domElementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(19);
      \u0275\u0275repeater(\u0275\u0275pipeBind1(21, 0, ctx.users$));
    }
  }, dependencies: [AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UsersComponent, [{
    type: Component,
    args: [{
      selector: "app-users",
      standalone: true,
      imports: [AsyncPipe],
      template: `
    <h1 class="h3 mb-3">User management</h1>
    <div class="surface table-responsive">
      <table class="table table-hover mb-0">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th class="text-end">Actions</th></tr></thead>
        <tbody>
          @for (user of users$ | async; track user.id) {
            <tr><td>{{ user.fullName }}</td><td>{{ user.email }}</td><td>{{ user.role }}</td><td>{{ user.status }}</td><td>{{ user.lastLoginAt }}</td><td class="text-end"><button class="btn btn-sm btn-outline-secondary me-1">Reset password</button><button class="btn btn-sm btn-outline-warning">Lock</button></td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UsersComponent, { className: "UsersComponent", filePath: "src/app/features/admin/users/users.component.ts", lineNumber: 24 });
})();
export {
  UsersComponent
};
//# sourceMappingURL=chunk-56W3YA52.js.map
