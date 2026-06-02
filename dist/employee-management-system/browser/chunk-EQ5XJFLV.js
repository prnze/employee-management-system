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

// src/app/features/auth/change-password/change-password.component.ts
function ChangePasswordComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1, "Password updated.");
    \u0275\u0275elementEnd();
  }
}
var ChangePasswordComponent = class _ChangePasswordComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  saved = signal(false, ...ngDevMode ? [{ debugName: "saved" }] : (
    /* istanbul ignore next */
    []
  ));
  form = this.fb.nonNullable.group({
    currentPassword: ["", Validators.required],
    newPassword: ["", [Validators.required, passwordStrengthValidator()]],
    confirmPassword: ["", Validators.required]
  }, { validators: matchPasswordValidator("newPassword", "confirmPassword") });
  submit() {
    const { currentPassword, newPassword } = this.form.getRawValue();
    this.auth.changePassword({ currentPassword, newPassword }).subscribe(() => this.saved.set(true));
  }
  static \u0275fac = function ChangePasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChangePasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChangePasswordComponent, selectors: [["app-change-password"]], decls: 14, vars: 3, consts: [[1, "surface", "p-3"], [1, "h4"], [1, "alert", "alert-success"], [1, "row", "g-3", 3, "ngSubmit", "formGroup"], [1, "col-12"], ["type", "password", "placeholder", "Current password", "formControlName", "currentPassword", 1, "form-control"], [1, "col-md-6"], ["type", "password", "placeholder", "New password", "formControlName", "newPassword", 1, "form-control"], ["type", "password", "placeholder", "Confirm password", "formControlName", "confirmPassword", 1, "form-control"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"]], template: function ChangePasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Change password");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, ChangePasswordComponent_Conditional_3_Template, 2, 0, "div", 2);
      \u0275\u0275elementStart(4, "form", 3);
      \u0275\u0275listener("ngSubmit", function ChangePasswordComponent_Template_form_ngSubmit_4_listener() {
        return ctx.submit();
      });
      \u0275\u0275elementStart(5, "div", 4);
      \u0275\u0275element(6, "input", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 6);
      \u0275\u0275element(8, "input", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 6);
      \u0275\u0275element(10, "input", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 4)(12, "button", 9);
      \u0275\u0275text(13, "Save password");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.saved() ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(8);
      \u0275\u0275property("disabled", ctx.form.invalid);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChangePasswordComponent, [{
    type: Component,
    args: [{
      selector: "app-change-password",
      standalone: true,
      imports: [ReactiveFormsModule],
      template: `
    <section class="surface p-3">
      <h1 class="h4">Change password</h1>
      @if (saved()) { <div class="alert alert-success">Password updated.</div> }
      <form [formGroup]="form" (ngSubmit)="submit()" class="row g-3">
        <div class="col-12"><input class="form-control" type="password" placeholder="Current password" formControlName="currentPassword" /></div>
        <div class="col-md-6"><input class="form-control" type="password" placeholder="New password" formControlName="newPassword" /></div>
        <div class="col-md-6"><input class="form-control" type="password" placeholder="Confirm password" formControlName="confirmPassword" /></div>
        <div class="col-12"><button class="btn btn-primary" type="submit" [disabled]="form.invalid">Save password</button></div>
      </form>
    </section>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChangePasswordComponent, { className: "ChangePasswordComponent", filePath: "src/app/features/auth/change-password/change-password.component.ts", lineNumber: 25 });
})();
export {
  ChangePasswordComponent
};
//# sourceMappingURL=chunk-EQ5XJFLV.js.map
