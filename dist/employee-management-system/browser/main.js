import {
  PermissionsService
} from "./chunk-IHXGN32L.js";
import {
  AuthService,
  TokenService
} from "./chunk-NM5HLFNR.js";
import "./chunk-AQHQM5CI.js";
import {
  provideCharts,
  withDefaultRegisterables
} from "./chunk-46HWQF6E.js";
import {
  ThemeService
} from "./chunk-RJ4TKVLL.js";
import {
  ToastService
} from "./chunk-EKXE6HEF.js";
import {
  toSignal
} from "./chunk-HMEP4754.js";
import {
  AuthStateService
} from "./chunk-CSWEOAXU.js";
import "./chunk-37SAZOU5.js";
import {
  HttpContextToken,
  HttpErrorResponse,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  bootstrapApplication,
  provideHttpClient,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withInterceptors,
  withPreloading
} from "./chunk-WJRWGGLF.js";
import "./chunk-I2TBGIDF.js";
import {
  TitleCasePipe
} from "./chunk-XBOA52FZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ENVIRONMENT_INITIALIZER,
  ErrorHandler,
  Injectable,
  Input,
  Pipe,
  catchError,
  computed,
  effect,
  filter,
  finalize,
  fromEvent,
  inject,
  input,
  merge,
  of,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  setClassMetadata,
  shareReplay,
  signal,
  startWith,
  switchMap,
  throttleTime,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefinePipe,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/core/guards/auth.guard.ts
var authGuard = (_route, state) => {
  const authState = inject(AuthStateService);
  const tokens = inject(TokenService);
  const router = inject(Router);
  return authState.isAuthenticated() && tokens.hasTokens() ? true : router.createUrlTree(["/auth/login"], { queryParams: { returnUrl: state.url } });
};

// src/app/core/guards/guest.guard.ts
var guestGuard = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const role = authState.role();
  if (!authState.isAuthenticated() || !role) {
    return true;
  }
  return router.createUrlTree([role === "Admin" ? "/admin/dashboard" : "/employee/dashboard"]);
};

// src/app/core/guards/role.guard.ts
var roleGuard = (route) => {
  const permissions = inject(PermissionsService);
  const router = inject(Router);
  const roles = route.data?.["roles"] ?? [];
  return permissions.hasRole(roles) ? true : router.createUrlTree(["/403"]);
};

// src/app/layouts/layout-components/breadcrumb/breadcrumb.component.ts
var _forTrack0 = ($index, $item) => $item.url;
function BreadcrumbComponent_For_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "titlecase");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const crumb_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, crumb_r1.label));
  }
}
function BreadcrumbComponent_For_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 4);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "titlecase");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const crumb_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", crumb_r1.url);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, crumb_r1.label));
  }
}
function BreadcrumbComponent_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 3);
    \u0275\u0275conditionalCreate(1, BreadcrumbComponent_For_3_Conditional_1_Template, 3, 3, "span")(2, BreadcrumbComponent_For_3_Conditional_2_Template, 3, 4, "a", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const crumb_r1 = ctx.$implicit;
    \u0275\u0275classProp("active", crumb_r1.active);
    \u0275\u0275advance();
    \u0275\u0275conditional(crumb_r1.active ? 1 : 2);
  }
}
var BreadcrumbComponent = class _BreadcrumbComponent {
  router = inject(Router);
  navigation = toSignal(this.router.events.pipe(filter((event) => event instanceof NavigationEnd), startWith(null)));
  crumbs = computed(() => {
    this.navigation();
    const parts = this.router.url.split("?")[0].split("/").filter(Boolean);
    return parts.map((label, index) => ({
      label,
      url: `/${parts.slice(0, index + 1).join("/")}`,
      active: index === parts.length - 1
    }));
  }, ...ngDevMode ? [{ debugName: "crumbs" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function BreadcrumbComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BreadcrumbComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BreadcrumbComponent, selectors: [["app-breadcrumb"]], decls: 4, vars: 0, consts: [["aria-label", "Breadcrumb", 1, "px-3", "py-2", "bg-body"], [1, "breadcrumb", "mb-0"], [1, "breadcrumb-item", 3, "active"], [1, "breadcrumb-item"], [3, "routerLink"]], template: function BreadcrumbComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 0)(1, "ol", 1);
      \u0275\u0275repeaterCreate(2, BreadcrumbComponent_For_3_Template, 3, 3, "li", 2, _forTrack0);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.crumbs());
    }
  }, dependencies: [RouterLink, TitleCasePipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreadcrumbComponent, [{
    type: Component,
    args: [{
      selector: "app-breadcrumb",
      standalone: true,
      imports: [RouterLink, TitleCasePipe],
      template: `
    <nav aria-label="Breadcrumb" class="px-3 py-2 bg-body">
      <ol class="breadcrumb mb-0">
        @for (crumb of crumbs(); track crumb.url) {
          <li class="breadcrumb-item" [class.active]="crumb.active">
            @if (crumb.active) {
              <span>{{ crumb.label | titlecase }}</span>
            } @else {
              <a [routerLink]="crumb.url">{{ crumb.label | titlecase }}</a>
            }
          </li>
        }
      </ol>
    </nav>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BreadcrumbComponent, { className: "BreadcrumbComponent", filePath: "src/app/layouts/layout-components/breadcrumb/breadcrumb.component.ts", lineNumber: 28 });
})();

// src/app/layouts/layout-components/footer/footer.component.ts
var FooterComponent = class _FooterComponent {
  static \u0275fac = function FooterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FooterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FooterComponent, selectors: [["app-footer"]], decls: 2, vars: 0, consts: [[1, "border-top", "bg-body", "px-3", "py-2", "small", "text-body-secondary"]], template: function FooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "footer", 0);
      \u0275\u0275text(1, "Employee Management System \xA9 2026");
      \u0275\u0275domElementEnd();
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FooterComponent, [{
    type: Component,
    args: [{
      selector: "app-footer",
      standalone: true,
      template: `<footer class="border-top bg-body px-3 py-2 small text-body-secondary">Employee Management System \xA9 2026</footer>`,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FooterComponent, { className: "FooterComponent", filePath: "src/app/layouts/layout-components/footer/footer.component.ts", lineNumber: 9 });
})();

// src/app/layouts/layout-components/sidebar/sidebar.component.ts
var _forTrack02 = ($index, $item) => $item.path;
function SidebarComponent_For_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r1.icon);
  }
}
function SidebarComponent_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 3);
    \u0275\u0275conditionalCreate(1, SidebarComponent_For_5_Conditional_1_Template, 2, 1, "span", 4);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275property("routerLink", item_r1.path);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r1.icon ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r1.label, " ");
  }
}
var SidebarComponent = class _SidebarComponent {
  items = input.required(...ngDevMode ? [{ debugName: "items" }] : (
    /* istanbul ignore next */
    []
  ));
  perms = inject(PermissionsService);
  /** Filter items by permission; items without a permission field are always shown. */
  visibleItems = computed(() => this.items().filter((item) => !item.permission || this.perms.hasPermission(item.permission)), ...ngDevMode ? [{ debugName: "visibleItems" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function SidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarComponent, selectors: [["app-sidebar"]], inputs: { items: [1, "items"] }, decls: 6, vars: 0, consts: [["aria-label", "Primary navigation", 1, "sidebar", "border-end", "bg-body-tertiary", "p-3", "d-flex", "flex-column"], ["routerLink", "/", 1, "navbar-brand", "fw-bold", "d-block", "mb-4", "text-primary", "text-decoration-none", "fs-5"], [1, "nav", "nav-pills", "flex-column", "gap-1", "flex-grow-1"], ["routerLinkActive", "active", 1, "nav-link", "d-flex", "align-items-center", "gap-2", 3, "routerLink"], [1, "nav-icon"]], template: function SidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "aside", 0)(1, "a", 1);
      \u0275\u0275text(2, " \u26A1 EMS ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "nav", 2);
      \u0275\u0275repeaterCreate(4, SidebarComponent_For_5_Template, 3, 3, "a", 3, _forTrack02);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.visibleItems());
    }
  }, dependencies: [RouterLink, RouterLinkActive], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.sidebar[_ngcontent-%COMP%] {\n  min-height: 100%;\n}\n.nav-link[_ngcontent-%COMP%] {\n  border-radius: 0.5rem;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.nav-link.active[_ngcontent-%COMP%] {\n  background: var(--bs-primary);\n  color: #fff;\n}\n.nav-icon[_ngcontent-%COMP%] {\n  width: 1.25rem;\n  text-align: center;\n}\n/*# sourceMappingURL=sidebar.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarComponent, [{
    type: Component,
    args: [{ selector: "app-sidebar", standalone: true, imports: [RouterLink, RouterLinkActive], template: `
    <aside class="sidebar border-end bg-body-tertiary p-3 d-flex flex-column" aria-label="Primary navigation">
      <a class="navbar-brand fw-bold d-block mb-4 text-primary text-decoration-none fs-5" routerLink="/">
        \u26A1 EMS
      </a>
      <nav class="nav nav-pills flex-column gap-1 flex-grow-1">
        @for (item of visibleItems(); track item.path) {
          <a class="nav-link d-flex align-items-center gap-2" [routerLink]="item.path" routerLinkActive="active">
            @if (item.icon) {
              <span class="nav-icon">{{ item.icon }}</span>
            }
            {{ item.label }}
          </a>
        }
      </nav>
    </aside>
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ["/* angular:styles/component:scss;537409ae6dbc009fa60d989ebe04c213df8732e9b0650080c71a7cfc54f60c85;C:/Users/princ/Downloads/personal project/src/app/layouts/layout-components/sidebar/sidebar.component.ts */\n:host {\n  display: block;\n}\n.sidebar {\n  min-height: 100%;\n}\n.nav-link {\n  border-radius: 0.5rem;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.nav-link.active {\n  background: var(--bs-primary);\n  color: #fff;\n}\n.nav-icon {\n  width: 1.25rem;\n  text-align: center;\n}\n/*# sourceMappingURL=sidebar.component.css.map */\n"] }]
  }], null, { items: [{ type: Input, args: [{ isSignal: true, alias: "items", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "src/app/layouts/layout-components/sidebar/sidebar.component.ts", lineNumber: 49 });
})();

// src/app/shared/pipes/initials.pipe.ts
var InitialsPipe = class _InitialsPipe {
  transform(value) {
    return (value ?? "").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
  }
  static \u0275fac = function InitialsPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InitialsPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "initials", type: _InitialsPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InitialsPipe, [{
    type: Pipe,
    args: [{ name: "initials", standalone: true }]
  }], null, null);
})();

// src/app/layouts/layout-components/top-navbar/top-navbar.component.ts
var _forTrack03 = ($index, $item) => $item.id;
function TopNavbarComponent_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 13)(2, "strong", 14);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 15);
    \u0275\u0275listener("click", function TopNavbarComponent_For_21_Template_button_click_4_listener() {
      const toast_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toasts.dismiss(toast_r2.id));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const toast_r2 = ctx.$implicit;
    \u0275\u0275classMap(\u0275\u0275interpolate1("toast show text-bg-", toast_r2.type));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(toast_r2.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(toast_r2.message);
  }
}
var TopNavbarComponent = class _TopNavbarComponent {
  authState = inject(AuthStateService);
  theme = inject(ThemeService);
  toasts = inject(ToastService);
  auth = inject(AuthService);
  router = inject(Router);
  logout() {
    this.auth.logout();
    void this.router.navigateByUrl("/auth/login");
  }
  static \u0275fac = function TopNavbarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TopNavbarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TopNavbarComponent, selectors: [["app-top-navbar"]], decls: 22, vars: 5, consts: [[1, "navbar", "navbar-expand", "bg-body", "border-bottom", "px-3"], ["type", "button", "data-bs-toggle", "offcanvas", "data-bs-target", "#mobileSidebar", "aria-label", "Open navigation", 1, "btn", "btn-outline-secondary", "d-lg-none", "me-2"], [1, "ms-auto", "d-flex", "align-items-center", "gap-2"], ["type", "button", "aria-label", "Toggle theme", 1, "btn", "btn-outline-secondary", 3, "click"], [1, "dropdown"], ["type", "button", "data-bs-toggle", "dropdown", "aria-expanded", "false", 1, "btn", "btn-outline-primary", "dropdown-toggle"], [1, "badge", "rounded-pill", "text-bg-primary", "me-1"], [1, "dropdown-menu", "dropdown-menu-end"], ["routerLink", "/account/change-password", 1, "dropdown-item"], ["type", "button", 1, "dropdown-item", 3, "click"], [1, "toast-container", "position-fixed", "top-0", "end-0", "p-3"], ["role", "status", "aria-live", "polite", 3, "class"], ["role", "status", "aria-live", "polite"], [1, "toast-header"], [1, "me-auto"], ["type", "button", "aria-label", "Dismiss", 1, "btn-close", 3, "click"], [1, "toast-body"]], template: function TopNavbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "button", 1);
      \u0275\u0275text(2, "\u2630");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2)(4, "button", 3);
      \u0275\u0275listener("click", function TopNavbarComponent_Template_button_click_4_listener() {
        return ctx.theme.toggle();
      });
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 4)(7, "button", 5)(8, "span", 6);
      \u0275\u0275text(9);
      \u0275\u0275pipe(10, "initials");
      \u0275\u0275elementEnd();
      \u0275\u0275text(11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "ul", 7)(13, "li")(14, "a", 8);
      \u0275\u0275text(15, "Change password");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "li")(17, "button", 9);
      \u0275\u0275listener("click", function TopNavbarComponent_Template_button_click_17_listener() {
        return ctx.logout();
      });
      \u0275\u0275text(18, "Logout");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(19, "div", 10);
      \u0275\u0275repeaterCreate(20, TopNavbarComponent_For_21_Template, 7, 5, "div", 11, _forTrack03);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1(" ", ctx.theme.theme() === "light" ? "Dark" : "Light", " ");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 3, (tmp_1_0 = ctx.authState.user()) == null ? null : tmp_1_0.fullName));
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", (tmp_2_0 = ctx.authState.user()) == null ? null : tmp_2_0.fullName, " ");
      \u0275\u0275advance(9);
      \u0275\u0275repeater(ctx.toasts.messages());
    }
  }, dependencies: [RouterLink, InitialsPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TopNavbarComponent, [{
    type: Component,
    args: [{
      selector: "app-top-navbar",
      standalone: true,
      imports: [InitialsPipe, RouterLink],
      template: `
    <header class="navbar navbar-expand bg-body border-bottom px-3">
      <button class="btn btn-outline-secondary d-lg-none me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar" aria-label="Open navigation">\u2630</button>
      <div class="ms-auto d-flex align-items-center gap-2">
        <button class="btn btn-outline-secondary" type="button" aria-label="Toggle theme" (click)="theme.toggle()">
          {{ theme.theme() === 'light' ? 'Dark' : 'Light' }}
        </button>
        <div class="dropdown">
          <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="badge rounded-pill text-bg-primary me-1">{{ authState.user()?.fullName | initials }}</span>
            {{ authState.user()?.fullName }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" routerLink="/account/change-password">Change password</a></li>
            <li><button class="dropdown-item" type="button" (click)="logout()">Logout</button></li>
          </ul>
        </div>
      </div>
    </header>
    <div class="toast-container position-fixed top-0 end-0 p-3">
      @for (toast of toasts.messages(); track toast.id) {
        <div class="toast show text-bg-{{ toast.type }}" role="status" aria-live="polite">
          <div class="toast-header">
            <strong class="me-auto">{{ toast.title }}</strong>
            <button type="button" class="btn-close" aria-label="Dismiss" (click)="toasts.dismiss(toast.id)"></button>
          </div>
          <div class="toast-body">{{ toast.message }}</div>
        </div>
      }
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TopNavbarComponent, { className: "TopNavbarComponent", filePath: "src/app/layouts/layout-components/top-navbar/top-navbar.component.ts", lineNumber: 46 });
})();

// src/app/layouts/admin-layout/admin-layout.component.ts
var AdminLayoutComponent = class _AdminLayoutComponent {
  items = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "\u{1F4CA}", permission: "dashboard:view" },
    { label: "Employees", path: "/admin/employees", icon: "\u{1F465}", permission: "employees:read" },
    { label: "Users", path: "/admin/users", icon: "\u{1F464}", permission: "users:manage" },
    { label: "Roles", path: "/admin/roles", icon: "\u{1F511}", permission: "roles:manage" },
    { label: "Reports", path: "/admin/reports", icon: "\u{1F4C4}", permission: "reports:view" },
    { label: "Notifications", path: "/admin/notifications", icon: "\u{1F514}" },
    { label: "Audit Logs", path: "/admin/audit-logs", icon: "\u{1F50D}", permission: "audit:view" },
    { label: "Settings", path: "/admin/settings", icon: "\u2699\uFE0F", permission: "settings:manage" }
  ];
  static \u0275fac = function AdminLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminLayoutComponent, selectors: [["app-admin-layout"]], decls: 16, vars: 2, consts: [[1, "shell", "d-flex"], [1, "desktop-sidebar", "d-none", "d-lg-block"], [3, "items"], ["tabindex", "-1", "id", "mobileSidebar", "aria-labelledby", "mobileSidebarLabel", 1, "offcanvas", "offcanvas-start"], [1, "offcanvas-header"], ["id", "mobileSidebarLabel", 1, "offcanvas-title", "fs-5"], ["type", "button", "data-bs-dismiss", "offcanvas", "aria-label", "Close", 1, "btn-close"], [1, "offcanvas-body", "p-0"], [1, "flex-grow-1", "d-flex", "flex-column", "min-vh-100"], ["id", "main-content", 1, "app-page", "flex-grow-1"]], template: function AdminLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "app-sidebar", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "h2", 5);
      \u0275\u0275text(6, "Navigation");
      \u0275\u0275elementEnd();
      \u0275\u0275element(7, "button", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 7);
      \u0275\u0275element(9, "app-sidebar", 2);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 8);
      \u0275\u0275element(11, "app-top-navbar")(12, "app-breadcrumb");
      \u0275\u0275elementStart(13, "main", 9);
      \u0275\u0275element(14, "router-outlet");
      \u0275\u0275elementEnd();
      \u0275\u0275element(15, "app-footer");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("items", ctx.items);
      \u0275\u0275advance(7);
      \u0275\u0275property("items", ctx.items);
    }
  }, dependencies: [RouterOutlet, SidebarComponent, TopNavbarComponent, BreadcrumbComponent, FooterComponent], styles: ["\n.shell[_ngcontent-%COMP%] {\n  min-height: 100vh;\n}\n.desktop-sidebar[_ngcontent-%COMP%] {\n  width: var(--app-sidebar-width);\n}\n/*# sourceMappingURL=admin-layout.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminLayoutComponent, [{
    type: Component,
    args: [{ selector: "app-admin-layout", standalone: true, imports: [RouterOutlet, SidebarComponent, TopNavbarComponent, BreadcrumbComponent, FooterComponent], template: `
    <div class="shell d-flex">
      <div class="desktop-sidebar d-none d-lg-block"><app-sidebar [items]="items" /></div>
      <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileSidebar" aria-labelledby="mobileSidebarLabel">
        <div class="offcanvas-header">
          <h2 class="offcanvas-title fs-5" id="mobileSidebarLabel">Navigation</h2>
          <button class="btn-close" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body p-0"><app-sidebar [items]="items" /></div>
      </div>
      <div class="flex-grow-1 d-flex flex-column min-vh-100">
        <app-top-navbar />
        <app-breadcrumb />
        <main id="main-content" class="app-page flex-grow-1"><router-outlet /></main>
        <app-footer />
      </div>
    </div>
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ["/* angular:styles/component:scss;3e49083097dad854df9a6012cdf663da4a3e6c23d9206e287c7fef26f1fa4821;C:/Users/princ/Downloads/personal project/src/app/layouts/admin-layout/admin-layout.component.ts */\n.shell {\n  min-height: 100vh;\n}\n.desktop-sidebar {\n  width: var(--app-sidebar-width);\n}\n/*# sourceMappingURL=admin-layout.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminLayoutComponent, { className: "AdminLayoutComponent", filePath: "src/app/layouts/admin-layout/admin-layout.component.ts", lineNumber: 36 });
})();

// src/app/layouts/employee-layout/employee-layout.component.ts
var EmployeeLayoutComponent = class _EmployeeLayoutComponent {
  items = [
    { label: "Dashboard", path: "/employee/dashboard", icon: "\u{1F4CA}", permission: "dashboard:view" },
    { label: "Profile", path: "/employee/profile", icon: "\u{1FAAA}", permission: "profile:update" },
    { label: "Attendance", path: "/employee/attendance", icon: "\u{1F4C5}", permission: "attendance:view" },
    { label: "Tasks", path: "/employee/tasks", icon: "\u2705", permission: "tasks:view" },
    { label: "Notifications", path: "/employee/notifications", icon: "\u{1F514}", permission: "notifications:view" }
  ];
  static \u0275fac = function EmployeeLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmployeeLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmployeeLayoutComponent, selectors: [["app-employee-layout"]], decls: 16, vars: 2, consts: [[1, "d-flex", "min-vh-100"], [1, "desktop-sidebar", "d-none", "d-lg-block"], [3, "items"], ["tabindex", "-1", "id", "mobileSidebar", "aria-labelledby", "mobileSidebarLabel", 1, "offcanvas", "offcanvas-start"], [1, "offcanvas-header"], ["id", "mobileSidebarLabel", 1, "offcanvas-title", "fs-5"], ["type", "button", "data-bs-dismiss", "offcanvas", "aria-label", "Close", 1, "btn-close"], [1, "offcanvas-body", "p-0"], [1, "flex-grow-1", "d-flex", "flex-column"], ["id", "main-content", 1, "app-page", "flex-grow-1"]], template: function EmployeeLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "app-sidebar", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "h2", 5);
      \u0275\u0275text(6, "Navigation");
      \u0275\u0275elementEnd();
      \u0275\u0275element(7, "button", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 7);
      \u0275\u0275element(9, "app-sidebar", 2);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 8);
      \u0275\u0275element(11, "app-top-navbar")(12, "app-breadcrumb");
      \u0275\u0275elementStart(13, "main", 9);
      \u0275\u0275element(14, "router-outlet");
      \u0275\u0275elementEnd();
      \u0275\u0275element(15, "app-footer");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("items", ctx.items);
      \u0275\u0275advance(7);
      \u0275\u0275property("items", ctx.items);
    }
  }, dependencies: [RouterOutlet, SidebarComponent, TopNavbarComponent, BreadcrumbComponent, FooterComponent], styles: ["\n.desktop-sidebar[_ngcontent-%COMP%] {\n  width: var(--app-sidebar-width);\n}\n/*# sourceMappingURL=employee-layout.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmployeeLayoutComponent, [{
    type: Component,
    args: [{ selector: "app-employee-layout", standalone: true, imports: [RouterOutlet, SidebarComponent, TopNavbarComponent, BreadcrumbComponent, FooterComponent], template: `
    <div class="d-flex min-vh-100">
      <div class="desktop-sidebar d-none d-lg-block"><app-sidebar [items]="items" /></div>
      <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileSidebar" aria-labelledby="mobileSidebarLabel">
        <div class="offcanvas-header">
          <h2 class="offcanvas-title fs-5" id="mobileSidebarLabel">Navigation</h2>
          <button class="btn-close" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body p-0"><app-sidebar [items]="items" /></div>
      </div>
      <div class="flex-grow-1 d-flex flex-column">
        <app-top-navbar />
        <app-breadcrumb />
        <main id="main-content" class="app-page flex-grow-1"><router-outlet /></main>
        <app-footer />
      </div>
    </div>
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ["/* angular:styles/component:scss;6de7b30976f948574d741dcc1068ab40fe9ffe191dee5d1e74b17a58863a1989;C:/Users/princ/Downloads/personal project/src/app/layouts/employee-layout/employee-layout.component.ts */\n.desktop-sidebar {\n  width: var(--app-sidebar-width);\n}\n/*# sourceMappingURL=employee-layout.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmployeeLayoutComponent, { className: "EmployeeLayoutComponent", filePath: "src/app/layouts/employee-layout/employee-layout.component.ts", lineNumber: 33 });
})();

// src/app/layouts/public-layout/public-layout.component.ts
var PublicLayoutComponent = class _PublicLayoutComponent {
  static \u0275fac = function PublicLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PublicLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicLayoutComponent, selectors: [["app-public-layout"]], decls: 3, vars: 0, consts: [["id", "main-content", 1, "container", "min-vh-100", "d-flex", "align-items-center", "justify-content-center", "py-4"], [1, "surface", "p-4", "w-100", 2, "max-width", "30rem"]], template: function PublicLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "main", 0)(1, "section", 1);
      \u0275\u0275element(2, "router-outlet");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [RouterOutlet], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicLayoutComponent, [{
    type: Component,
    args: [{
      selector: "app-public-layout",
      standalone: true,
      imports: [RouterOutlet],
      template: `
    <main id="main-content" class="container min-vh-100 d-flex align-items-center justify-content-center py-4">
      <section class="surface p-4 w-100" style="max-width: 30rem;">
        <router-outlet />
      </section>
    </main>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicLayoutComponent, { className: "PublicLayoutComponent", filePath: "src/app/layouts/public-layout/public-layout.component.ts", lineNumber: 17 });
})();

// src/app/app.routes.ts
var routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "auth/login"
  },
  {
    path: "auth",
    component: PublicLayoutComponent,
    canActivate: [guestGuard],
    loadChildren: () => import("./chunk-GLVPWD3R.js").then((m) => m.AUTH_ROUTES)
  },
  {
    path: "admin",
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ["Admin"], preload: true },
    loadChildren: () => import("./chunk-HFX43SS4.js").then((m) => m.ADMIN_ROUTES)
  },
  {
    path: "employee",
    component: EmployeeLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ["Employee"], preload: true },
    loadChildren: () => import("./chunk-LVUT3VZ4.js").then((m) => m.EMPLOYEE_ROUTES)
  },
  {
    path: "account/change-password",
    canActivate: [authGuard],
    loadComponent: () => import("./chunk-EQ5XJFLV.js").then((m) => m.ChangePasswordComponent)
  },
  {
    path: "403",
    loadComponent: () => import("./chunk-J5IOECTY.js").then((m) => m.ForbiddenComponent)
  },
  {
    path: "500",
    loadComponent: () => import("./chunk-AVWMJES7.js").then((m) => m.ServerErrorComponent)
  },
  {
    path: "**",
    loadComponent: () => import("./chunk-CIUKAT7S.js").then((m) => m.NotFoundComponent)
  }
];

// src/environments/environment.ts
var environment = {
  production: false,
  apiBaseUrl: "/api",
  accessTokenTtlMinutes: 15,
  idleTimeoutMinutes: 20
};

// src/app/core/interceptors/jwt.interceptor.ts
var jwtInterceptor = (request, next) => {
  const token = inject(TokenService).accessToken();
  const isApiRequest = request.url.startsWith(environment.apiBaseUrl) || request.url.startsWith("/api");
  if (!token || !isApiRequest) {
    return next(request);
  }
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};

// src/app/core/constants/http-context.tokens.ts
var REFRESH_ATTEMPTED = new HttpContextToken(() => false);

// src/app/core/interceptors/refresh-token.interceptor.ts
var refreshRequest$ = null;
var refreshTokenInterceptor = (request, next) => {
  const auth = inject(AuthService);
  const tokens = inject(TokenService);
  return next(request).pipe(catchError((error) => {
    if (error instanceof HttpErrorResponse && error.status === 401 && tokens.refreshToken() && !request.context.get(REFRESH_ATTEMPTED)) {
      refreshRequest$ ??= auth.refreshToken().pipe(finalize(() => {
        refreshRequest$ = null;
      }), shareReplay({ bufferSize: 1, refCount: false }));
      return refreshRequest$.pipe(switchMap(({ accessToken, expiresAt }) => {
        tokens.updateAccessToken(accessToken, expiresAt);
        return next(request.clone({
          context: request.context.set(REFRESH_ATTEMPTED, true),
          setHeaders: { Authorization: `Bearer ${accessToken}` }
        }));
      }));
    }
    return throwError(() => error);
  }));
};

// src/app/core/interceptors/error.interceptor.ts
var errorInterceptor = (request, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);
  return next(request).pipe(catchError((error) => {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 403) {
        void router.navigateByUrl("/403");
      }
      if (error.status >= 500) {
        void router.navigateByUrl("/500");
      }
      toast.show({ title: "Request failed", message: error.message, type: "danger" });
    }
    return throwError(() => error);
  }));
};

// src/app/core/services/loading.service.ts
var LoadingService = class _LoadingService {
  pending = signal(0, ...ngDevMode ? [{ debugName: "pending" }] : (
    /* istanbul ignore next */
    []
  ));
  isLoading = computed(() => this.pending() > 0, ...ngDevMode ? [{ debugName: "isLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  start() {
    this.pending.update((value) => value + 1);
  }
  stop() {
    this.pending.update((value) => Math.max(0, value - 1));
  }
  static \u0275fac = function LoadingService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoadingService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LoadingService, factory: _LoadingService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoadingService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/interceptors/loading.interceptor.ts
var loadingInterceptor = (request, next) => {
  const loading = inject(LoadingService);
  loading.start();
  return next(request).pipe(finalize(() => loading.stop()));
};

// src/app/core/error-handling/global-error.handler.ts
var GlobalErrorHandler = class _GlobalErrorHandler {
  toast;
  constructor(toast) {
    this.toast = toast;
  }
  handleError(error) {
    console.error(error);
    this.toast.show({
      title: "Application error",
      message: "A recoverable application error occurred.",
      type: "danger"
    });
  }
  static \u0275fac = function GlobalErrorHandler_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GlobalErrorHandler)(\u0275\u0275inject(ToastService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GlobalErrorHandler, factory: _GlobalErrorHandler.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GlobalErrorHandler, [{
    type: Injectable
  }], () => [{ type: ToastService }], null);
})();

// src/app/core/services/role-preloading.strategy.ts
var RolePreloadingStrategy = class _RolePreloadingStrategy {
  authState;
  constructor(authState) {
    this.authState = authState;
  }
  preload(route, load) {
    const shouldPreload = route.data?.["preload"] === true && this.authState.isAuthenticated();
    return shouldPreload ? load() : of(null);
  }
  static \u0275fac = function RolePreloadingStrategy_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RolePreloadingStrategy)(\u0275\u0275inject(AuthStateService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RolePreloadingStrategy, factory: _RolePreloadingStrategy.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RolePreloadingStrategy, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: AuthStateService }], null);
})();

// src/app/core/auth/session.service.ts
var SessionService = class _SessionService {
  document = inject(DOCUMENT);
  auth = inject(AuthService);
  authState = inject(AuthStateService);
  router = inject(Router);
  lastActivity = signal(Date.now(), ...ngDevMode ? [{ debugName: "lastActivity" }] : (
    /* istanbul ignore next */
    []
  ));
  timer = null;
  activitySubscription = null;
  constructor() {
    effect(() => {
      if (this.authState.isAuthenticated()) {
        this.start();
      } else {
        this.stop();
      }
    });
  }
  start() {
    if (this.timer) {
      return;
    }
    this.lastActivity.set(Date.now());
    this.activitySubscription = merge(fromEvent(this.document, "mousemove"), fromEvent(this.document, "keydown"), fromEvent(this.document, "click"), fromEvent(this.document, "touchstart")).pipe(throttleTime(1e3)).subscribe(() => this.lastActivity.set(Date.now()));
    this.timer = setInterval(() => this.checkIdle(), 3e4);
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.activitySubscription?.unsubscribe();
    this.activitySubscription = null;
  }
  checkIdle() {
    const idleMs = Date.now() - this.lastActivity();
    if (idleMs > environment.idleTimeoutMinutes * 6e4) {
      this.auth.logout();
      void this.router.navigateByUrl("/auth/login");
    }
  }
  static \u0275fac = function SessionService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SessionService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SessionService, factory: _SessionService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SessionService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withPreloading(RolePreloadingStrategy), withInMemoryScrolling({ scrollPositionRestoration: "enabled", anchorScrolling: "enabled" })),
    provideHttpClient(withInterceptors([jwtInterceptor, refreshTokenInterceptor, errorInterceptor, loadingInterceptor])),
    provideCharts(withDefaultRegisterables()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => inject(SessionService)
    }
  ]
};

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  theme = inject(ThemeService);
  constructor() {
    this.theme.initialize();
  }
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 3, vars: 0, consts: [["href", "#main-content", 1, "skip-link", "btn", "btn-primary"]], template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275text(1, "Skip to main content");
      \u0275\u0275elementEnd();
      \u0275\u0275element(2, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{
      selector: "app-root",
      standalone: true,
      imports: [RouterOutlet],
      template: `
    <a class="skip-link btn btn-primary" href="#main-content">Skip to main content</a>
    <router-outlet />
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 15 });
})();

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((error) => console.error(error));
//# sourceMappingURL=main.js.map
