import {
  matchPasswordValidator,
  passwordStrengthValidator
} from "./chunk-E67RJVJH.js";
import {
  AuthService
} from "./chunk-NM5HLFNR.js";
import "./chunk-AQHQM5CI.js";
import {
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
  RouterLink
} from "./chunk-WJRWGGLF.js";
import "./chunk-I2TBGIDF.js";
import "./chunk-XBOA52FZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵtext
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/auth/reset-password/reset-password.component.ts
function ResetPasswordComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1, "Password reset successfully.");
    \u0275\u0275elementEnd();
  }
}
var ResetPasswordComponent = class _ResetPasswordComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  done = signal(false, ...ngDevMode ? [{ debugName: "done" }] : (
    /* istanbul ignore next */
    []
  ));
  form = this.fb.nonNullable.group({
    password: ["", [Validators.required, passwordStrengthValidator()]],
    confirmPassword: ["", Validators.required]
  }, { validators: matchPasswordValidator("password", "confirmPassword") });
  submit() {
    this.auth.resetPassword({ token: "mock-token", password: this.form.controls.password.value }).subscribe(() => this.done.set(true));
  }
  static \u0275fac = function ResetPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResetPasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ResetPasswordComponent, selectors: [["app-reset-password"]], decls: 10, vars: 3, consts: [[1, "h3"], [1, "alert", "alert-success"], [3, "ngSubmit", "formGroup"], ["type", "password", "placeholder", "New password", "formControlName", "password", 1, "form-control", "mb-3"], ["type", "password", "placeholder", "Confirm password", "formControlName", "confirmPassword", 1, "form-control", "mb-3"], ["type", "submit", 1, "btn", "btn-primary", "w-100", 3, "disabled"], ["routerLink", "/auth/login", 1, "btn", "btn-link", "w-100", "mt-2"]], template: function ResetPasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1", 0);
      \u0275\u0275text(1, "Reset password");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(2, ResetPasswordComponent_Conditional_2_Template, 2, 0, "div", 1);
      \u0275\u0275elementStart(3, "form", 2);
      \u0275\u0275listener("ngSubmit", function ResetPasswordComponent_Template_form_ngSubmit_3_listener() {
        return ctx.submit();
      });
      \u0275\u0275element(4, "input", 3)(5, "input", 4);
      \u0275\u0275elementStart(6, "button", 5);
      \u0275\u0275text(7, "Reset password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "a", 6);
      \u0275\u0275text(9, "Back to login");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.done() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", ctx.form.invalid);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResetPasswordComponent, [{
    type: Component,
    args: [{
      selector: "app-reset-password",
      standalone: true,
      imports: [ReactiveFormsModule, RouterLink],
      template: `
    <h1 class="h3">Reset password</h1>
    @if (done()) { <div class="alert alert-success">Password reset successfully.</div> }
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input class="form-control mb-3" type="password" placeholder="New password" formControlName="password" />
      <input class="form-control mb-3" type="password" placeholder="Confirm password" formControlName="confirmPassword" />
      <button class="btn btn-primary w-100" type="submit" [disabled]="form.invalid">Reset password</button>
      <a class="btn btn-link w-100 mt-2" routerLink="/auth/login">Back to login</a>
    </form>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ResetPasswordComponent, { className: "ResetPasswordComponent", filePath: "src/app/features/auth/reset-password/reset-password.component.ts", lineNumber: 24 });
})();
export {
  ResetPasswordComponent
};
//# sourceMappingURL=chunk-ZQ72E45U.js.map
