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
import {
  AuthStateService
} from "./chunk-CSWEOAXU.js";
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
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/employee/profile/profile.component.ts
function ProfileComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.avatarError());
  }
}
function ProfileComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "img", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r0.avatarPreview(), \u0275\u0275sanitizeUrl);
  }
}
var ProfileComponent = class _ProfileComponent {
  authState = inject(AuthStateService);
  avatarPreview = signal(null, ...ngDevMode ? [{ debugName: "avatarPreview" }] : (
    /* istanbul ignore next */
    []
  ));
  avatarError = signal("", ...ngDevMode ? [{ debugName: "avatarError" }] : (
    /* istanbul ignore next */
    []
  ));
  form = inject(FormBuilder).nonNullable.group({
    fullName: [this.authState.user()?.fullName ?? "", Validators.required],
    email: [this.authState.user()?.email ?? "", [Validators.required, Validators.email]],
    phone: ["9876543210", Validators.required]
  });
  hasUnsavedChanges() {
    return this.form.dirty;
  }
  save() {
    this.form.markAsPristine();
  }
  onAvatarSelected(event) {
    const input = event.target;
    const file = input.files?.[0];
    this.avatarError.set("");
    this.avatarPreview.set(null);
    if (!file) {
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      this.avatarError.set("Use a PNG, JPEG, or WebP image.");
      input.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.avatarError.set("Profile picture must be 2 MB or smaller.");
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview.set(String(reader.result));
      this.form.markAsDirty();
    };
    reader.readAsDataURL(file);
  }
  static \u0275fac = function ProfileComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileComponent, selectors: [["app-profile"]], decls: 24, vars: 4, consts: [[1, "h3", "mb-3"], [1, "surface", "p-3", "row", "g-3", 3, "ngSubmit", "formGroup"], [1, "col-md-6"], [1, "form-label"], ["formControlName", "fullName", 1, "form-control"], ["type", "email", "formControlName", "email", 1, "form-control"], ["formControlName", "phone", 1, "form-control"], ["for", "avatar", 1, "form-label"], ["id", "avatar", "type", "file", "accept", "image/png,image/jpeg,image/webp", 1, "form-control", 3, "change"], [1, "form-text", "text-danger"], [1, "col-12"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["alt", "Selected profile preview", "width", "96", "height", "96", 1, "rounded-circle", "border", 3, "src"]], template: function ProfileComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1", 0);
      \u0275\u0275text(1, "Profile");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "form", 1);
      \u0275\u0275listener("ngSubmit", function ProfileComponent_Template_form_ngSubmit_2_listener() {
        return ctx.save();
      });
      \u0275\u0275elementStart(3, "div", 2)(4, "label", 3);
      \u0275\u0275text(5, "Full name");
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "input", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 2)(8, "label", 3);
      \u0275\u0275text(9, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275element(10, "input", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 2)(12, "label", 3);
      \u0275\u0275text(13, "Phone");
      \u0275\u0275elementEnd();
      \u0275\u0275element(14, "input", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 2)(16, "label", 7);
      \u0275\u0275text(17, "Profile picture");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "input", 8);
      \u0275\u0275listener("change", function ProfileComponent_Template_input_change_18_listener($event) {
        return ctx.onAvatarSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(19, ProfileComponent_Conditional_19_Template, 2, 1, "div", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(20, ProfileComponent_Conditional_20_Template, 2, 1, "div", 10);
      \u0275\u0275elementStart(21, "div", 10)(22, "button", 11);
      \u0275\u0275text(23, "Save profile");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(17);
      \u0275\u0275conditional(ctx.avatarError() ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.avatarPreview() ? 20 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.form.invalid);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileComponent, [{
    type: Component,
    args: [{
      selector: "app-profile",
      standalone: true,
      imports: [ReactiveFormsModule],
      template: `
    <h1 class="h3 mb-3">Profile</h1>
    <form class="surface p-3 row g-3" [formGroup]="form" (ngSubmit)="save()">
      <div class="col-md-6"><label class="form-label">Full name</label><input class="form-control" formControlName="fullName" /></div>
      <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" type="email" formControlName="email" /></div>
      <div class="col-md-6"><label class="form-label">Phone</label><input class="form-control" formControlName="phone" /></div>
      <div class="col-md-6">
        <label class="form-label" for="avatar">Profile picture</label>
        <input id="avatar" class="form-control" type="file" accept="image/png,image/jpeg,image/webp" (change)="onAvatarSelected($event)" />
        @if (avatarError()) { <div class="form-text text-danger">{{ avatarError() }}</div> }
      </div>
      @if (avatarPreview()) {
        <div class="col-12">
          <img [src]="avatarPreview()" alt="Selected profile preview" class="rounded-circle border" width="96" height="96" />
        </div>
      }
      <div class="col-12"><button class="btn btn-primary" type="submit" [disabled]="form.invalid">Save profile</button></div>
    </form>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileComponent, { className: "ProfileComponent", filePath: "src/app/features/employee/profile/profile.component.ts", lineNumber: 31 });
})();
export {
  ProfileComponent
};
//# sourceMappingURL=chunk-GKPYBADS.js.map
