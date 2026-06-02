import {
  AuthService
} from "./chunk-NM5HLFNR.js";
import "./chunk-AQHQM5CI.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-L5Z3R3HU.js";
import "./chunk-CSWEOAXU.js";
import "./chunk-37SAZOU5.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-WJRWGGLF.js";
import "./chunk-I2TBGIDF.js";
import "./chunk-XBOA52FZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  input,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/shared/components/loader/loader.component.ts
var LoaderComponent = class _LoaderComponent {
  label = input("Loading", ...ngDevMode ? [{ debugName: "label" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function LoaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoaderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoaderComponent, selectors: [["app-loader"]], inputs: { label: [1, "label"] }, decls: 4, vars: 2, consts: [["role", "status", 1, "d-inline-flex", "align-items-center", "gap-2"], [1, "spinner-border", "spinner-border-sm"]], template: function LoaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0);
      \u0275\u0275domElement(1, "span", 1);
      \u0275\u0275domElementStart(2, "span");
      \u0275\u0275text(3);
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275attribute("aria-label", ctx.label());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.label());
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoaderComponent, [{
    type: Component,
    args: [{
      selector: "app-loader",
      standalone: true,
      template: `<div class="d-inline-flex align-items-center gap-2" role="status" [attr.aria-label]="label()"><span class="spinner-border spinner-border-sm"></span><span>{{ label() }}</span></div>`,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, { label: [{ type: Input, args: [{ isSignal: true, alias: "label", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoaderComponent, { className: "LoaderComponent", filePath: "src/app/shared/components/loader/loader.component.ts", lineNumber: 9 });
})();

// src/app/features/auth/login/login.component.ts
function LoginComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function LoginComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-loader", 15);
  }
}
function LoginComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Sign in ");
  }
}
var LoginComponent = class _LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  error = signal("", ...ngDevMode ? [{ debugName: "error" }] : (
    /* istanbul ignore next */
    []
  ));
  form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
    rememberMe: [true]
  });
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set("");
    this.auth.login(this.form.getRawValue()).subscribe({
      next: ({ user }) => {
        const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
        void this.router.navigateByUrl(returnUrl ?? (user.role === "Admin" ? "/admin/dashboard" : "/employee/dashboard"));
      },
      error: (error) => {
        this.error.set(error.message);
        this.loading.set(false);
      }
    });
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 24, vars: 4, consts: [[1, "h3", "mb-1"], [1, "text-body-secondary"], ["role", "alert", 1, "alert", "alert-danger"], ["novalidate", "", 3, "ngSubmit", "formGroup"], [1, "mb-3"], ["for", "email", 1, "form-label"], ["id", "email", "type", "email", "formControlName", "email", "autocomplete", "email", 1, "form-control"], ["for", "password", 1, "form-label"], ["id", "password", "type", "password", "formControlName", "password", "autocomplete", "current-password", 1, "form-control"], [1, "d-flex", "justify-content-between", "align-items-center", "mb-3"], [1, "form-check"], ["type", "checkbox", "formControlName", "rememberMe", 1, "form-check-input"], [1, "form-check-label"], ["routerLink", "/auth/forgot-password"], ["type", "submit", 1, "btn", "btn-primary", "w-100", 3, "disabled"], ["label", "Signing in"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1", 0);
      \u0275\u0275text(1, "Sign in");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "p", 1);
      \u0275\u0275text(3, "Use admin@ems.local / Admin@123 or employee@ems.local / Employee@123");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, LoginComponent_Conditional_4_Template, 2, 1, "div", 2);
      \u0275\u0275elementStart(5, "form", 3);
      \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_5_listener() {
        return ctx.submit();
      });
      \u0275\u0275elementStart(6, "div", 4)(7, "label", 5);
      \u0275\u0275text(8, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275element(9, "input", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 4)(11, "label", 7);
      \u0275\u0275text(12, "Password");
      \u0275\u0275elementEnd();
      \u0275\u0275element(13, "input", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 9)(15, "label", 10);
      \u0275\u0275element(16, "input", 11);
      \u0275\u0275elementStart(17, "span", 12);
      \u0275\u0275text(18, "Remember me");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "a", 13);
      \u0275\u0275text(20, "Forgot password?");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "button", 14);
      \u0275\u0275conditionalCreate(22, LoginComponent_Conditional_22_Template, 1, 0, "app-loader", 15)(23, LoginComponent_Conditional_23_Template, 1, 0);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.error() ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(16);
      \u0275\u0275property("disabled", ctx.form.invalid || ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 22 : 23);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink, LoaderComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{
      selector: "app-login",
      standalone: true,
      imports: [ReactiveFormsModule, RouterLink, LoaderComponent],
      template: `
    <h1 class="h3 mb-1">Sign in</h1>
    <p class="text-body-secondary">Use admin@ems.local / Admin&#64;123 or employee@ems.local / Employee&#64;123</p>
    @if (error()) { <div class="alert alert-danger" role="alert">{{ error() }}</div> }
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input id="email" class="form-control" type="email" formControlName="email" autocomplete="email" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="password">Password</label>
        <input id="password" class="form-control" type="password" formControlName="password" autocomplete="current-password" />
      </div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <label class="form-check"><input class="form-check-input" type="checkbox" formControlName="rememberMe" /> <span class="form-check-label">Remember me</span></label>
        <a routerLink="/auth/forgot-password">Forgot password?</a>
      </div>
      <button class="btn btn-primary w-100" type="submit" [disabled]="form.invalid || loading()">
        @if (loading()) { <app-loader label="Signing in" /> } @else { Sign in }
      </button>
    </form>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/auth/login/login.component.ts", lineNumber: 35 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-WIXIT3OG.js.map
