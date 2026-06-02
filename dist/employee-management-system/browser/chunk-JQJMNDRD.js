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

// src/app/features/auth/forgot-password/forgot-password.component.ts
function ForgotPasswordComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1, "If the account exists, reset instructions were sent.");
    \u0275\u0275elementEnd();
  }
}
var ForgotPasswordComponent = class _ForgotPasswordComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  sent = signal(false, ...ngDevMode ? [{ debugName: "sent" }] : (
    /* istanbul ignore next */
    []
  ));
  form = this.fb.nonNullable.group({ email: ["", [Validators.required, Validators.email]] });
  submit() {
    this.auth.forgotPassword(this.form.controls.email.value).subscribe(() => this.sent.set(true));
  }
  static \u0275fac = function ForgotPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ForgotPasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ForgotPasswordComponent, selectors: [["app-forgot-password"]], decls: 11, vars: 3, consts: [[1, "h3"], [1, "alert", "alert-success"], [3, "ngSubmit", "formGroup"], ["for", "email", 1, "form-label"], ["id", "email", "type", "email", "formControlName", "email", 1, "form-control", "mb-3"], ["type", "submit", 1, "btn", "btn-primary", "w-100", 3, "disabled"], ["routerLink", "/auth/login", 1, "btn", "btn-link", "w-100", "mt-2"]], template: function ForgotPasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1", 0);
      \u0275\u0275text(1, "Forgot password");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(2, ForgotPasswordComponent_Conditional_2_Template, 2, 0, "div", 1);
      \u0275\u0275elementStart(3, "form", 2);
      \u0275\u0275listener("ngSubmit", function ForgotPasswordComponent_Template_form_ngSubmit_3_listener() {
        return ctx.submit();
      });
      \u0275\u0275elementStart(4, "label", 3);
      \u0275\u0275text(5, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "input", 4);
      \u0275\u0275elementStart(7, "button", 5);
      \u0275\u0275text(8, "Send reset link");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "a", 6);
      \u0275\u0275text(10, "Back to login");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.sent() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.form.invalid);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ForgotPasswordComponent, [{
    type: Component,
    args: [{
      selector: "app-forgot-password",
      standalone: true,
      imports: [ReactiveFormsModule, RouterLink],
      template: `
    <h1 class="h3">Forgot password</h1>
    @if (sent()) { <div class="alert alert-success">If the account exists, reset instructions were sent.</div> }
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label class="form-label" for="email">Email</label>
      <input id="email" class="form-control mb-3" type="email" formControlName="email" />
      <button class="btn btn-primary w-100" type="submit" [disabled]="form.invalid">Send reset link</button>
      <a class="btn btn-link w-100 mt-2" routerLink="/auth/login">Back to login</a>
    </form>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ForgotPasswordComponent, { className: "ForgotPasswordComponent", filePath: "src/app/features/auth/forgot-password/forgot-password.component.ts", lineNumber: 22 });
})();
export {
  ForgotPasswordComponent
};
//# sourceMappingURL=chunk-JQJMNDRD.js.map
