import {
  EmployeeService
} from "./chunk-VEQERCC5.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-L5Z3R3HU.js";
import "./chunk-CSWEOAXU.js";
import "./chunk-37SAZOU5.js";
import {
  ActivatedRoute,
  Router
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
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/admin/employees/employee-form/employee-form.component.ts
var EmployeeFormComponent = class _EmployeeFormComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  employeeService = inject(EmployeeService);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : (
    /* istanbul ignore next */
    []
  ));
  employee = this.route.snapshot.data["employee"];
  form = this.fb.nonNullable.group({
    firstName: [this.employee?.firstName ?? "", Validators.required],
    lastName: [this.employee?.lastName ?? "", Validators.required],
    email: [this.employee?.email ?? "", [Validators.required, Validators.email]],
    phone: [this.employee?.phone ?? "", Validators.required],
    department: [this.employee?.department ?? "", Validators.required],
    designation: [this.employee?.designation ?? "", Validators.required],
    manager: [this.employee?.manager ?? "", Validators.required],
    location: [this.employee?.location ?? "", Validators.required],
    status: [this.employee?.status ?? "Active", Validators.required],
    joinedAt: [this.employee?.joinedAt ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), Validators.required],
    salary: [this.employee?.salary ?? 0, [Validators.required, Validators.min(1)]]
  });
  hasUnsavedChanges() {
    return this.form.dirty && !this.saving();
  }
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const request = this.form.getRawValue();
    const save$ = this.employee ? this.employeeService.update(this.employee.id, request) : this.employeeService.create(request);
    save$.subscribe((employee) => {
      this.form.markAsPristine();
      void this.router.navigate(["/admin/employees", employee.id]);
    });
  }
  cancel() {
    void this.router.navigateByUrl("/admin/employees");
  }
  static \u0275fac = function EmployeeFormComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmployeeFormComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmployeeFormComponent, selectors: [["app-employee-form"]], decls: 59, vars: 4, consts: [[1, "surface", "p-3"], [1, "h3"], [1, "row", "g-3", 3, "ngSubmit", "formGroup"], [1, "col-md-6"], [1, "form-label"], ["formControlName", "firstName", 1, "form-control"], ["formControlName", "lastName", 1, "form-control"], ["type", "email", "formControlName", "email", 1, "form-control"], ["formControlName", "phone", 1, "form-control"], [1, "col-md-4"], ["formControlName", "department", 1, "form-control"], ["formControlName", "designation", 1, "form-control"], ["formControlName", "manager", 1, "form-control"], ["formControlName", "location", 1, "form-control"], ["formControlName", "status", 1, "form-select"], ["type", "date", "formControlName", "joinedAt", 1, "form-control"], ["type", "number", "formControlName", "salary", 1, "form-control"], [1, "col-12", "d-flex", "justify-content-end", "gap-2"], ["type", "button", 1, "btn", "btn-outline-secondary", 3, "click"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"]], template: function EmployeeFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "h1", 1);
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "form", 2);
      \u0275\u0275listener("ngSubmit", function EmployeeFormComponent_Template_form_ngSubmit_3_listener() {
        return ctx.submit();
      });
      \u0275\u0275elementStart(4, "div", 3)(5, "label", 4);
      \u0275\u0275text(6, "First name");
      \u0275\u0275elementEnd();
      \u0275\u0275element(7, "input", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 3)(9, "label", 4);
      \u0275\u0275text(10, "Last name");
      \u0275\u0275elementEnd();
      \u0275\u0275element(11, "input", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 3)(13, "label", 4);
      \u0275\u0275text(14, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275element(15, "input", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 3)(17, "label", 4);
      \u0275\u0275text(18, "Phone");
      \u0275\u0275elementEnd();
      \u0275\u0275element(19, "input", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "div", 9)(21, "label", 4);
      \u0275\u0275text(22, "Department");
      \u0275\u0275elementEnd();
      \u0275\u0275element(23, "input", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 9)(25, "label", 4);
      \u0275\u0275text(26, "Designation");
      \u0275\u0275elementEnd();
      \u0275\u0275element(27, "input", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "div", 9)(29, "label", 4);
      \u0275\u0275text(30, "Manager");
      \u0275\u0275elementEnd();
      \u0275\u0275element(31, "input", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div", 9)(33, "label", 4);
      \u0275\u0275text(34, "Location");
      \u0275\u0275elementEnd();
      \u0275\u0275element(35, "input", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "div", 9)(37, "label", 4);
      \u0275\u0275text(38, "Status");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "select", 14)(40, "option");
      \u0275\u0275text(41, "Active");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "option");
      \u0275\u0275text(43, "Inactive");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "option");
      \u0275\u0275text(45, "On Leave");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(46, "div", 9)(47, "label", 4);
      \u0275\u0275text(48, "Joined");
      \u0275\u0275elementEnd();
      \u0275\u0275element(49, "input", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "div", 9)(51, "label", 4);
      \u0275\u0275text(52, "Salary");
      \u0275\u0275elementEnd();
      \u0275\u0275element(53, "input", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "div", 17)(55, "button", 18);
      \u0275\u0275listener("click", function EmployeeFormComponent_Template_button_click_55_listener() {
        return ctx.cancel();
      });
      \u0275\u0275text(56, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "button", 19);
      \u0275\u0275text(58);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.employee ? "Edit" : "Create", " employee");
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(54);
      \u0275\u0275property("disabled", ctx.form.invalid || ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.saving() ? "Saving..." : "Save employee");
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmployeeFormComponent, [{
    type: Component,
    args: [{
      selector: "app-employee-form",
      standalone: true,
      imports: [ReactiveFormsModule],
      template: `
    <section class="surface p-3">
      <h1 class="h3">{{ employee ? 'Edit' : 'Create' }} employee</h1>
      <form [formGroup]="form" (ngSubmit)="submit()" class="row g-3">
        <div class="col-md-6"><label class="form-label">First name</label><input class="form-control" formControlName="firstName" /></div>
        <div class="col-md-6"><label class="form-label">Last name</label><input class="form-control" formControlName="lastName" /></div>
        <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" type="email" formControlName="email" /></div>
        <div class="col-md-6"><label class="form-label">Phone</label><input class="form-control" formControlName="phone" /></div>
        <div class="col-md-4"><label class="form-label">Department</label><input class="form-control" formControlName="department" /></div>
        <div class="col-md-4"><label class="form-label">Designation</label><input class="form-control" formControlName="designation" /></div>
        <div class="col-md-4"><label class="form-label">Manager</label><input class="form-control" formControlName="manager" /></div>
        <div class="col-md-4"><label class="form-label">Location</label><input class="form-control" formControlName="location" /></div>
        <div class="col-md-4"><label class="form-label">Status</label><select class="form-select" formControlName="status"><option>Active</option><option>Inactive</option><option>On Leave</option></select></div>
        <div class="col-md-4"><label class="form-label">Joined</label><input class="form-control" type="date" formControlName="joinedAt" /></div>
        <div class="col-md-4"><label class="form-label">Salary</label><input class="form-control" type="number" formControlName="salary" /></div>
        <div class="col-12 d-flex justify-content-end gap-2"><button class="btn btn-outline-secondary" type="button" (click)="cancel()">Cancel</button><button class="btn btn-primary" type="submit" [disabled]="form.invalid || saving()">{{ saving() ? 'Saving...' : 'Save employee' }}</button></div>
      </form>
    </section>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmployeeFormComponent, { className: "EmployeeFormComponent", filePath: "src/app/features/admin/employees/employee-form/employee-form.component.ts", lineNumber: 33 });
})();
export {
  EmployeeFormComponent
};
//# sourceMappingURL=chunk-CYB5GZCE.js.map
