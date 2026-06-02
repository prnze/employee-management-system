import {
  PermissionsService
} from "./chunk-IHXGN32L.js";
import {
  APP_ROLES
} from "./chunk-AQHQM5CI.js";
import {
  ToastService
} from "./chunk-EKXE6HEF.js";
import "./chunk-CSWEOAXU.js";
import "./chunk-I2TBGIDF.js";
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/shared/directives/permission.directive.ts
var PermissionDirective = class _PermissionDirective {
  appPermission = input.required(...ngDevMode ? [{ debugName: "appPermission" }] : (
    /* istanbul ignore next */
    []
  ));
  template = inject(TemplateRef);
  view = inject(ViewContainerRef);
  permissions = inject(PermissionsService);
  rendered = false;
  constructor() {
    effect(() => {
      const allowed = this.permissions.hasPermission(this.appPermission());
      if (allowed && !this.rendered) {
        this.view.createEmbeddedView(this.template);
        this.rendered = true;
      }
      if (!allowed && this.rendered) {
        this.view.clear();
        this.rendered = false;
      }
    });
  }
  static \u0275fac = function PermissionDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PermissionDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _PermissionDirective, selectors: [["", "appPermission", ""]], inputs: { appPermission: [1, "appPermission"] } });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PermissionDirective, [{
    type: Directive,
    args: [{ selector: "[appPermission]", standalone: true }]
  }], () => [], { appPermission: [{ type: Input, args: [{ isSignal: true, alias: "appPermission", required: true }] }] });
})();

// src/app/features/admin/roles/roles.component.ts
var _forTrack0 = ($index, $item) => $item.scope;
var _forTrack1 = ($index, $item) => $item.raw;
function RolesComponent_span_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1, "Live editing enabled");
    \u0275\u0275elementEnd();
  }
}
function RolesComponent_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 5)(1, "button", 14);
    \u0275\u0275listener("click", function RolesComponent_For_9_Template_button_click_1_listener() {
      const role_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectedRole.set(role_r2));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementStart(3, "span", 15);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const role_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r2.selectedRole() === role_r2);
    \u0275\u0275attribute("aria-selected", ctx_r2.selectedRole() === role_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", role_r2, " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("text-bg-primary", ctx_r2.selectedRole() === role_r2)("text-bg-secondary", ctx_r2.selectedRole() !== role_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.permissionsService.getPermissions(role_r2).length, " ");
  }
}
function RolesComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "button", 17);
    \u0275\u0275listener("click", function RolesComponent_div_14_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.grantAll());
    });
    \u0275\u0275text(2, "Grant all");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 18);
    \u0275\u0275listener("click", function RolesComponent_div_14_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.revokeAll());
    });
    \u0275\u0275text(4, "Revoke all");
    \u0275\u0275elementEnd()();
  }
}
function RolesComponent_For_16_For_7_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1, "\u2713");
    \u0275\u0275elementEnd();
  }
}
function RolesComponent_For_16_For_7_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1, "\u2717");
    \u0275\u0275elementEnd();
  }
}
function RolesComponent_For_16_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23)(2, "div", 24)(3, "input", 25);
    \u0275\u0275listener("change", function RolesComponent_For_16_For_7_Template_input_change_3_listener() {
      const entry_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggle(entry_r6.raw));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "label", 26)(5, "span", 27);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "code", 28);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, RolesComponent_For_16_For_7_Conditional_9_Template, 2, 0, "span", 29)(10, RolesComponent_For_16_For_7_Conditional_10_Template, 2, 0, "span", 30);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const entry_r6 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("permission-card--granted", ctx_r2.isGranted(entry_r6.raw))("permission-card--denied", !ctx_r2.isGranted(entry_r6.raw));
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "perm-" + entry_r6.raw + "-" + ctx_r2.selectedRole())("checked", ctx_r2.isGranted(entry_r6.raw));
    \u0275\u0275attribute("aria-label", "Toggle " + entry_r6.raw + " for " + ctx_r2.selectedRole());
    \u0275\u0275advance();
    \u0275\u0275property("for", "perm-" + entry_r6.raw + "-" + ctx_r2.selectedRole());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entry_r6.action);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entry_r6.raw);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isGranted(entry_r6.raw) ? 9 : 10);
  }
}
function RolesComponent_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "h3", 19)(2, "span", 20);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 21);
    \u0275\u0275repeaterCreate(6, RolesComponent_For_16_For_7_Template, 11, 11, "div", 22, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const group_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.scopeIcon(group_r7.scope));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", group_r7.scope, " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(group_r7.entries);
  }
}
function RolesComponent_For_19_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const perm_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(perm_r8);
  }
}
function RolesComponent_For_19_ForEmpty_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1, "No permissions assigned");
    \u0275\u0275elementEnd();
  }
}
function RolesComponent_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 31)(2, "h3", 32);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 33);
    \u0275\u0275repeaterCreate(5, RolesComponent_For_19_For_6_Template, 2, 1, "span", 34, \u0275\u0275repeaterTrackByIdentity, false, RolesComponent_For_19_ForEmpty_7_Template, 2, 0, "span", 35);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const role_r9 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(role_r9);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.permissionsService.getPermissions(role_r9));
  }
}
var RolesComponent = class _RolesComponent {
  permissionsService = inject(PermissionsService);
  toast = inject(ToastService);
  roles = [APP_ROLES.admin, APP_ROLES.employee];
  selectedRole = signal(APP_ROLES.admin, ...ngDevMode ? [{ debugName: "selectedRole" }] : (
    /* istanbul ignore next */
    []
  ));
  /** All known permissions, parsed and grouped by scope. */
  groupedPermissions = computed(() => {
    const all = this.permissionsService.allPermissions();
    const map = /* @__PURE__ */ new Map();
    for (const raw of all) {
      const [scope, action] = raw.split(":");
      const key = scope ?? raw;
      if (!map.has(key))
        map.set(key, []);
      map.get(key).push({ raw, scope: key, action: action ?? raw });
    }
    return Array.from(map.entries()).map(([scope, entries]) => ({ scope, entries }));
  }, ...ngDevMode ? [{ debugName: "groupedPermissions" }] : (
    /* istanbul ignore next */
    []
  ));
  isGranted(permission) {
    return this.permissionsService.getPermissions(this.selectedRole()).includes(permission);
  }
  toggle(permission) {
    this.permissionsService.togglePermission(this.selectedRole(), permission);
    const granted = this.permissionsService.getPermissions(this.selectedRole()).includes(permission);
    this.toast.show({
      title: granted ? "Permission granted" : "Permission revoked",
      message: `${permission} \u2192 ${this.selectedRole()}`,
      type: granted ? "success" : "info"
    });
  }
  grantAll() {
    const all = this.permissionsService.allPermissions();
    this.permissionsService.setPermissions(this.selectedRole(), all);
    this.toast.show({ title: "All permissions granted", message: `Role: ${this.selectedRole()}`, type: "success" });
  }
  revokeAll() {
    this.permissionsService.setPermissions(this.selectedRole(), []);
    this.toast.show({ title: "All permissions revoked", message: `Role: ${this.selectedRole()}`, type: "warning" });
  }
  scopeIcon(scope) {
    const icons = {
      dashboard: "\u{1F4CA}",
      employees: "\u{1F465}",
      users: "\u{1F464}",
      roles: "\u{1F511}",
      reports: "\u{1F4C4}",
      audit: "\u{1F50D}",
      settings: "\u2699\uFE0F",
      profile: "\u{1FAAA}",
      attendance: "\u{1F4C5}",
      tasks: "\u2705",
      notifications: "\u{1F514}"
    };
    return icons[scope] ?? "\u{1F512}";
  }
  static \u0275fac = function RolesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RolesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RolesComponent, selectors: [["app-roles"]], decls: 20, vars: 3, consts: [[1, "d-flex", "align-items-center", "justify-content-between", "mb-4"], [1, "h3", "mb-1"], [1, "text-body-secondary", "mb-0"], ["class", "badge text-bg-success fs-6", 4, "appPermission"], ["role", "tablist", 1, "nav", "nav-tabs", "mb-4"], ["role", "presentation", 1, "nav-item"], [1, "surface", "p-4"], [1, "d-flex", "justify-content-between", "align-items-center", "mb-3"], [1, "h5", "mb-0"], ["class", "d-flex gap-2", 4, "appPermission"], [1, "mb-4"], [1, "row", "g-3", "mt-2"], [1, "col-md-6"], [1, "badge", "text-bg-success", "fs-6"], ["type", "button", "role", "tab", 1, "nav-link", 3, "click"], [1, "badge", "ms-2"], [1, "d-flex", "gap-2"], ["type", "button", 1, "btn", "btn-sm", "btn-outline-success", 3, "click"], ["type", "button", 1, "btn", "btn-sm", "btn-outline-danger", 3, "click"], [1, "h6", "text-uppercase", "text-body-secondary", "border-bottom", "pb-2", "mb-3"], [1, "me-2"], [1, "row", "g-2"], [1, "col-sm-6", "col-lg-4"], [1, "permission-card", "d-flex", "align-items-center", "gap-3", "p-3", "rounded", "border"], [1, "form-check", "form-switch", "mb-0"], ["type", "checkbox", "role", "switch", 1, "form-check-input", 3, "change", "id", "checked"], [1, "mb-0", "flex-grow-1", 3, "for"], [1, "fw-semibold", "d-block"], [1, "small", "text-body-secondary"], [1, "badge", "text-bg-success"], [1, "badge", "text-bg-secondary"], [1, "surface", "p-3", "h-100"], [1, "h6", "fw-semibold", "mb-2"], [1, "d-flex", "flex-wrap", "gap-1"], [1, "badge", "text-bg-primary"], [1, "text-body-secondary", "fst-italic", "small"]], template: function RolesComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
      \u0275\u0275text(3, "Roles & Permissions");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 2);
      \u0275\u0275text(5, "Toggle permissions per role. Changes apply immediately.");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(6, RolesComponent_span_6_Template, 2, 0, "span", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "ul", 4);
      \u0275\u0275repeaterCreate(8, RolesComponent_For_9_Template, 5, 9, "li", 5, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 6)(11, "div", 7)(12, "h2", 8);
      \u0275\u0275text(13);
      \u0275\u0275elementEnd();
      \u0275\u0275template(14, RolesComponent_div_14_Template, 5, 0, "div", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(15, RolesComponent_For_16_Template, 8, 2, "div", 10, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 11);
      \u0275\u0275repeaterCreate(18, RolesComponent_For_19_Template, 8, 2, "div", 12, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("appPermission", "roles:manage");
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.roles);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("", ctx.selectedRole(), " permissions");
      \u0275\u0275advance();
      \u0275\u0275property("appPermission", "roles:manage");
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.groupedPermissions());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.roles);
    }
  }, dependencies: [PermissionDirective], styles: ["\n.permission-card[_ngcontent-%COMP%] {\n  transition: background-color 0.2s ease, border-color 0.2s ease;\n  cursor: default;\n}\n.permission-card--granted[_ngcontent-%COMP%] {\n  background-color: var(--bs-success-bg-subtle);\n  border-color: var(--bs-success-border-subtle) !important;\n}\n.permission-card--denied[_ngcontent-%COMP%] {\n  background-color: var(--bs-body-bg);\n  border-color: var(--bs-border-color) !important;\n}\n.form-check-input[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n/*# sourceMappingURL=roles.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RolesComponent, [{
    type: Component,
    args: [{ selector: "app-roles", standalone: true, imports: [PermissionDirective], template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="h3 mb-1">Roles &amp; Permissions</h1>
        <p class="text-body-secondary mb-0">Toggle permissions per role. Changes apply immediately.</p>
      </div>
      <span *appPermission="'roles:manage'" class="badge text-bg-success fs-6">Live editing enabled</span>
    </div>

    <!-- Role tabs -->
    <ul class="nav nav-tabs mb-4" role="tablist">
      @for (role of roles; track role) {
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            [class.active]="selectedRole() === role"
            type="button"
            role="tab"
            [attr.aria-selected]="selectedRole() === role"
            (click)="selectedRole.set(role)"
          >
            {{ role }}
            <span class="badge ms-2" [class.text-bg-primary]="selectedRole() === role" [class.text-bg-secondary]="selectedRole() !== role">
              {{ permissionsService.getPermissions(role).length }}
            </span>
          </button>
        </li>
      }
    </ul>

    <!-- Permission matrix -->
    <div class="surface p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">{{ selectedRole() }} permissions</h2>
        <div class="d-flex gap-2" *appPermission="'roles:manage'">
          <button class="btn btn-sm btn-outline-success" type="button" (click)="grantAll()">Grant all</button>
          <button class="btn btn-sm btn-outline-danger" type="button" (click)="revokeAll()">Revoke all</button>
        </div>
      </div>

      @for (group of groupedPermissions(); track group.scope) {
        <div class="mb-4">
          <h3 class="h6 text-uppercase text-body-secondary border-bottom pb-2 mb-3">
            <span class="me-2">{{ scopeIcon(group.scope) }}</span>{{ group.scope }}
          </h3>
          <div class="row g-2">
            @for (entry of group.entries; track entry.raw) {
              <div class="col-sm-6 col-lg-4">
                <div
                  class="permission-card d-flex align-items-center gap-3 p-3 rounded border"
                  [class.permission-card--granted]="isGranted(entry.raw)"
                  [class.permission-card--denied]="!isGranted(entry.raw)"
                >
                  <div class="form-check form-switch mb-0">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      [id]="'perm-' + entry.raw + '-' + selectedRole()"
                      [checked]="isGranted(entry.raw)"
                      [attr.aria-label]="'Toggle ' + entry.raw + ' for ' + selectedRole()"
                      (change)="toggle(entry.raw)"
                    />
                  </div>
                  <label class="mb-0 flex-grow-1" [for]="'perm-' + entry.raw + '-' + selectedRole()">
                    <span class="fw-semibold d-block">{{ entry.action }}</span>
                    <code class="small text-body-secondary">{{ entry.raw }}</code>
                  </label>
                  @if (isGranted(entry.raw)) {
                    <span class="badge text-bg-success">\u2713</span>
                  } @else {
                    <span class="badge text-bg-secondary">\u2717</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- Summary panel -->
    <div class="row g-3 mt-2">
      @for (role of roles; track role) {
        <div class="col-md-6">
          <div class="surface p-3 h-100">
            <h3 class="h6 fw-semibold mb-2">{{ role }}</h3>
            <div class="d-flex flex-wrap gap-1">
              @for (perm of permissionsService.getPermissions(role); track perm) {
                <span class="badge text-bg-primary">{{ perm }}</span>
              } @empty {
                <span class="text-body-secondary fst-italic small">No permissions assigned</span>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ["/* angular:styles/component:scss;06b6b0ea87c60715d3ac2be55c2a45a316a638f8283298f41cf8304b76f6f3f5;C:/Users/princ/Downloads/personal project/src/app/features/admin/roles/roles.component.ts */\n.permission-card {\n  transition: background-color 0.2s ease, border-color 0.2s ease;\n  cursor: default;\n}\n.permission-card--granted {\n  background-color: var(--bs-success-bg-subtle);\n  border-color: var(--bs-success-border-subtle) !important;\n}\n.permission-card--denied {\n  background-color: var(--bs-body-bg);\n  border-color: var(--bs-border-color) !important;\n}\n.form-check-input {\n  cursor: pointer;\n}\n/*# sourceMappingURL=roles.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RolesComponent, { className: "RolesComponent", filePath: "src/app/features/admin/roles/roles.component.ts", lineNumber: 136 });
})();
export {
  RolesComponent
};
//# sourceMappingURL=chunk-ZDFHJARP.js.map
