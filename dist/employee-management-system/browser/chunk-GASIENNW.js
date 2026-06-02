import {
  PhoneFormatPipe
} from "./chunk-YARROWYP.js";
import {
  EmployeeService
} from "./chunk-VEQERCC5.js";
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
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/admin/employees/employee-detail/employee-detail.component.ts
var _c0 = (a0) => ["/admin/employees", a0, "edit"];
var EmployeeDetailComponent = class _EmployeeDetailComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  employeeService = inject(EmployeeService);
  employee = this.route.snapshot.data["employee"];
  delete() {
    if (window.confirm("Delete this employee?")) {
      this.employeeService.delete(this.employee.id).subscribe(() => void this.router.navigateByUrl("/admin/employees"));
    }
  }
  static \u0275fac = function EmployeeDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmployeeDetailComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmployeeDetailComponent, selectors: [["app-employee-detail"]], decls: 35, vars: 13, consts: [[1, "surface", "p-3"], [1, "d-flex", "justify-content-between", "gap-2", "mb-3"], [1, "h3"], [1, "btn", "btn-outline-primary", "me-2", 3, "routerLink"], ["type", "button", 1, "btn", "btn-outline-danger", 3, "click"], [1, "row"], [1, "col-sm-3"], [1, "col-sm-9"]], template: function EmployeeDetailComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "article", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "a", 3);
      \u0275\u0275text(6, "Edit");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "button", 4);
      \u0275\u0275listener("click", function EmployeeDetailComponent_Template_button_click_7_listener() {
        return ctx.delete();
      });
      \u0275\u0275text(8, "Delete");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(9, "dl", 5)(10, "dt", 6);
      \u0275\u0275text(11, "Code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "dd", 7);
      \u0275\u0275text(13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "dt", 6);
      \u0275\u0275text(15, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "dd", 7);
      \u0275\u0275text(17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "dt", 6);
      \u0275\u0275text(19, "Phone");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "dd", 7);
      \u0275\u0275text(21);
      \u0275\u0275pipe(22, "phoneFormat");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "dt", 6);
      \u0275\u0275text(24, "Department");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "dd", 7);
      \u0275\u0275text(26);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "dt", 6);
      \u0275\u0275text(28, "Designation");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "dd", 7);
      \u0275\u0275text(30);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "dt", 6);
      \u0275\u0275text(32, "Status");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "dd", 7);
      \u0275\u0275text(34);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate2("", ctx.employee.firstName, " ", ctx.employee.lastName);
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(11, _c0, ctx.employee.id));
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.employee.employeeCode);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.employee.email);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(22, 9, ctx.employee.phone));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.employee.department);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.employee.designation);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.employee.status);
    }
  }, dependencies: [RouterLink, PhoneFormatPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmployeeDetailComponent, [{
    type: Component,
    args: [{
      selector: "app-employee-detail",
      standalone: true,
      imports: [RouterLink, PhoneFormatPipe],
      template: `
    <article class="surface p-3">
      <div class="d-flex justify-content-between gap-2 mb-3">
        <h1 class="h3">{{ employee.firstName }} {{ employee.lastName }}</h1>
        <div><a class="btn btn-outline-primary me-2" [routerLink]="['/admin/employees', employee.id, 'edit']">Edit</a><button class="btn btn-outline-danger" type="button" (click)="delete()">Delete</button></div>
      </div>
      <dl class="row">
        <dt class="col-sm-3">Code</dt><dd class="col-sm-9">{{ employee.employeeCode }}</dd>
        <dt class="col-sm-3">Email</dt><dd class="col-sm-9">{{ employee.email }}</dd>
        <dt class="col-sm-3">Phone</dt><dd class="col-sm-9">{{ employee.phone | phoneFormat }}</dd>
        <dt class="col-sm-3">Department</dt><dd class="col-sm-9">{{ employee.department }}</dd>
        <dt class="col-sm-3">Designation</dt><dd class="col-sm-9">{{ employee.designation }}</dd>
        <dt class="col-sm-3">Status</dt><dd class="col-sm-9">{{ employee.status }}</dd>
      </dl>
    </article>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmployeeDetailComponent, { className: "EmployeeDetailComponent", filePath: "src/app/features/admin/employees/employee-detail/employee-detail.component.ts", lineNumber: 29 });
})();
export {
  EmployeeDetailComponent
};
//# sourceMappingURL=chunk-GASIENNW.js.map
