import {
  ThemeService
} from "./chunk-RJ4TKVLL.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NumberValueAccessor,
  ReactiveFormsModule,
  ɵNgNoValidate
} from "./chunk-L5Z3R3HU.js";
import "./chunk-I2TBGIDF.js";
import "./chunk-XBOA52FZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵtext
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/admin/settings/settings.component.ts
var SettingsComponent = class _SettingsComponent {
  theme = inject(ThemeService);
  form = inject(FormBuilder).nonNullable.group({ organization: ["Acme People Ops"], timeout: [20] });
  static \u0275fac = function SettingsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SettingsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SettingsComponent, selectors: [["app-settings"]], decls: 14, vars: 1, consts: [[1, "h3", "mb-3"], [1, "surface", "p-3", "row", "g-3", 3, "formGroup"], [1, "col-md-6"], [1, "form-label"], ["formControlName", "organization", 1, "form-control"], ["type", "number", "formControlName", "timeout", 1, "form-control"], [1, "col-12"], ["type", "button", 1, "btn", "btn-outline-primary", 3, "click"]], template: function SettingsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1", 0);
      \u0275\u0275text(1, "Settings");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "form", 1)(3, "div", 2)(4, "label", 3);
      \u0275\u0275text(5, "Organization name");
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "input", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 2)(8, "label", 3);
      \u0275\u0275text(9, "Session timeout minutes");
      \u0275\u0275elementEnd();
      \u0275\u0275element(10, "input", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 6)(12, "button", 7);
      \u0275\u0275listener("click", function SettingsComponent_Template_button_click_12_listener() {
        return ctx.theme.toggle();
      });
      \u0275\u0275text(13, "Toggle theme");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("formGroup", ctx.form);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SettingsComponent, [{
    type: Component,
    args: [{
      selector: "app-settings",
      standalone: true,
      imports: [ReactiveFormsModule],
      template: `
    <h1 class="h3 mb-3">Settings</h1>
    <form class="surface p-3 row g-3" [formGroup]="form">
      <div class="col-md-6"><label class="form-label">Organization name</label><input class="form-control" formControlName="organization" /></div>
      <div class="col-md-6"><label class="form-label">Session timeout minutes</label><input class="form-control" type="number" formControlName="timeout" /></div>
      <div class="col-12"><button class="btn btn-outline-primary" type="button" (click)="theme.toggle()">Toggle theme</button></div>
    </form>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SettingsComponent, { className: "SettingsComponent", filePath: "src/app/features/admin/settings/settings.component.ts", lineNumber: 19 });
})();
export {
  SettingsComponent
};
//# sourceMappingURL=chunk-H22DMK6E.js.map
