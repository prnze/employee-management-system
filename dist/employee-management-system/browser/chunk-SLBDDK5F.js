import {
  PhoneFormatPipe
} from "./chunk-YARROWYP.js";
import {
  ToastService
} from "./chunk-EKXE6HEF.js";
import {
  toSignal
} from "./chunk-HMEP4754.js";
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
  ReactiveFormsModule,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-L5Z3R3HU.js";
import "./chunk-CSWEOAXU.js";
import "./chunk-37SAZOU5.js";
import {
  RouterLink
} from "./chunk-WJRWGGLF.js";
import "./chunk-I2TBGIDF.js";
import {
  DatePipe
} from "./chunk-XBOA52FZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  Input,
  Output,
  Pipe,
  computed,
  debounceTime,
  inject,
  input,
  output,
  setClassMetadata,
  signal,
  startWith,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefinePipe,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-BJMLPQUZ.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/services/export.service.ts
var ExportService = class _ExportService {
  downloadCsv(rows, filename) {
    const headers = Object.keys(rows[0] ?? {});
    const body = rows.map((row) => {
      const record = row;
      return headers.map((header) => this.csvCell(record[header])).join(",");
    });
    this.download([headers.join(","), ...body].join("\n"), `${filename}.csv`, "text/csv");
  }
  downloadExcel(rows, filename) {
    const html = `<table>${rows.map((row) => `<tr>${Object.values(row).map((value) => `<td>${this.escapeHtml(this.safeSpreadsheetValue(value))}</td>`).join("")}</tr>`).join("")}</table>`;
    this.download(html, `${filename}.xls`, "application/vnd.ms-excel");
  }
  csvCell(value) {
    return JSON.stringify(this.safeSpreadsheetValue(value));
  }
  safeSpreadsheetValue(value) {
    const text = String(value ?? "");
    return /^[=+\-@]/.test(text) ? `'${text}` : text;
  }
  escapeHtml(value) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
  download(content, filename, type) {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  static \u0275fac = function ExportService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ExportService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ExportService, factory: _ExportService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExportService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/shared/components/modal/modal.component.ts
var _c0 = ["*"];
function ModalComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "section", 2)(3, "header", 3)(4, "h2", 4);
    \u0275\u0275text(5);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "button", 5);
    \u0275\u0275domListener("click", function ModalComponent_Conditional_0_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closed.emit());
    });
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(7, "div", 6);
    \u0275\u0275projection(8);
    \u0275\u0275domElementEnd()()()();
    \u0275\u0275domElement(9, "div", 7);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.title());
  }
}
var ModalComponent = class _ModalComponent {
  open = input(false, ...ngDevMode ? [{ debugName: "open" }] : (
    /* istanbul ignore next */
    []
  ));
  title = input("Dialog", ...ngDevMode ? [{ debugName: "title" }] : (
    /* istanbul ignore next */
    []
  ));
  closed = output();
  static \u0275fac = function ModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ModalComponent, selectors: [["app-modal"]], inputs: { open: [1, "open"], title: [1, "title"] }, outputs: { closed: "closed" }, ngContentSelectors: _c0, decls: 1, vars: 1, consts: [["tabindex", "-1", "role", "dialog", "aria-modal", "true", 1, "modal", "d-block"], [1, "modal-dialog"], [1, "modal-content"], [1, "modal-header"], [1, "modal-title", "fs-5"], ["type", "button", "aria-label", "Close", 1, "btn-close", 3, "click"], [1, "modal-body"], [1, "modal-backdrop", "show"]], template: function ModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275conditionalCreate(0, ModalComponent_Conditional_0_Template, 10, 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.open() ? 0 : -1);
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalComponent, [{
    type: Component,
    args: [{
      selector: "app-modal",
      standalone: true,
      template: `
    @if (open()) {
      <div class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
        <div class="modal-dialog">
          <section class="modal-content">
            <header class="modal-header">
              <h2 class="modal-title fs-5">{{ title() }}</h2>
              <button type="button" class="btn-close" aria-label="Close" (click)="closed.emit()"></button>
            </header>
            <div class="modal-body"><ng-content /></div>
          </section>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    }
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }], title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: false }] }], closed: [{ type: Output, args: ["closed"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ModalComponent, { className: "ModalComponent", filePath: "src/app/shared/components/modal/modal.component.ts", lineNumber: 24 });
})();

// src/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts
var ConfirmationDialogComponent = class _ConfirmationDialogComponent {
  open = input(false, ...ngDevMode ? [{ debugName: "open" }] : (
    /* istanbul ignore next */
    []
  ));
  title = input("Confirm action", ...ngDevMode ? [{ debugName: "title" }] : (
    /* istanbul ignore next */
    []
  ));
  message = input("Are you sure?", ...ngDevMode ? [{ debugName: "message" }] : (
    /* istanbul ignore next */
    []
  ));
  confirm = output();
  cancel = output();
  static \u0275fac = function ConfirmationDialogComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConfirmationDialogComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConfirmationDialogComponent, selectors: [["app-confirmation-dialog"]], inputs: { open: [1, "open"], title: [1, "title"], message: [1, "message"] }, outputs: { confirm: "confirm", cancel: "cancel" }, decls: 8, vars: 3, consts: [[3, "closed", "open", "title"], [1, "d-flex", "justify-content-end", "gap-2"], ["type", "button", 1, "btn", "btn-outline-secondary", 3, "click"], ["type", "button", 1, "btn", "btn-danger", 3, "click"]], template: function ConfirmationDialogComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-modal", 0);
      \u0275\u0275listener("closed", function ConfirmationDialogComponent_Template_app_modal_closed_0_listener() {
        return ctx.cancel.emit();
      });
      \u0275\u0275elementStart(1, "p");
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 1)(4, "button", 2);
      \u0275\u0275listener("click", function ConfirmationDialogComponent_Template_button_click_4_listener() {
        return ctx.cancel.emit();
      });
      \u0275\u0275text(5, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "button", 3);
      \u0275\u0275listener("click", function ConfirmationDialogComponent_Template_button_click_6_listener() {
        return ctx.confirm.emit();
      });
      \u0275\u0275text(7, "Confirm");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275property("open", ctx.open())("title", ctx.title());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.message());
    }
  }, dependencies: [ModalComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfirmationDialogComponent, [{
    type: Component,
    args: [{
      selector: "app-confirmation-dialog",
      standalone: true,
      imports: [ModalComponent],
      template: `
    <app-modal [open]="open()" [title]="title()" (closed)="cancel.emit()">
      <p>{{ message() }}</p>
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-outline-secondary" type="button" (click)="cancel.emit()">Cancel</button>
        <button class="btn btn-danger" type="button" (click)="confirm.emit()">Confirm</button>
      </div>
    </app-modal>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }], title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: false }] }], message: [{ type: Input, args: [{ isSignal: true, alias: "message", required: false }] }], confirm: [{ type: Output, args: ["confirm"] }], cancel: [{ type: Output, args: ["cancel"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConfirmationDialogComponent, { className: "ConfirmationDialogComponent", filePath: "src/app/shared/components/confirmation-dialog/confirmation-dialog.component.ts", lineNumber: 19 });
})();

// src/app/shared/components/pagination/pagination.component.ts
function PaginationComponent_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "li", 3)(1, "button", 7);
    \u0275\u0275domListener("click", function PaginationComponent_For_8_Template_button_click_1_listener() {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.goTo(item_r2));
    });
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", item_r2 === ctx_r2.page());
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", "Go to page " + item_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r2);
  }
}
var PaginationComponent = class _PaginationComponent {
  page = input.required(...ngDevMode ? [{ debugName: "page" }] : (
    /* istanbul ignore next */
    []
  ));
  pageSize = input.required(...ngDevMode ? [{ debugName: "pageSize" }] : (
    /* istanbul ignore next */
    []
  ));
  total = input.required(...ngDevMode ? [{ debugName: "total" }] : (
    /* istanbul ignore next */
    []
  ));
  pageChange = output();
  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())), ...ngDevMode ? [{ debugName: "totalPages" }] : (
    /* istanbul ignore next */
    []
  ));
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1).slice(0, 7), ...ngDevMode ? [{ debugName: "pages" }] : (
    /* istanbul ignore next */
    []
  ));
  goTo(page) {
    if (page >= 1 && page <= this.totalPages() && page !== this.page()) {
      this.pageChange.emit(page);
    }
  }
  static \u0275fac = function PaginationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaginationComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaginationComponent, selectors: [["app-pagination"]], inputs: { page: [1, "page"], pageSize: [1, "pageSize"], total: [1, "total"] }, outputs: { pageChange: "pageChange" }, decls: 12, vars: 6, consts: [["aria-label", "Table pagination", 1, "d-flex", "align-items-center", "justify-content-between", "gap-3", "flex-wrap"], [1, "text-body-secondary"], [1, "pagination", "mb-0"], [1, "page-item"], ["type", "button", "aria-label", "Previous page", 1, "page-link", 3, "click"], [1, "page-item", 3, "active"], ["type", "button", "aria-label", "Next page", 1, "page-link", 3, "click"], ["type", "button", 1, "page-link", 3, "click"]], template: function PaginationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "nav", 0)(1, "small", 1);
      \u0275\u0275text(2);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "ul", 2)(4, "li", 3)(5, "button", 4);
      \u0275\u0275domListener("click", function PaginationComponent_Template_button_click_5_listener() {
        return ctx.goTo(ctx.page() - 1);
      });
      \u0275\u0275text(6, "Previous");
      \u0275\u0275domElementEnd()();
      \u0275\u0275repeaterCreate(7, PaginationComponent_For_8_Template, 3, 4, "li", 5, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275domElementStart(9, "li", 3)(10, "button", 6);
      \u0275\u0275domListener("click", function PaginationComponent_Template_button_click_10_listener() {
        return ctx.goTo(ctx.page() + 1);
      });
      \u0275\u0275text(11, "Next");
      \u0275\u0275domElementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate2("Page ", ctx.page(), " of ", ctx.totalPages());
      \u0275\u0275advance(2);
      \u0275\u0275classProp("disabled", ctx.page() === 1);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.pages());
      \u0275\u0275advance(2);
      \u0275\u0275classProp("disabled", ctx.page() === ctx.totalPages());
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaginationComponent, [{
    type: Component,
    args: [{
      selector: "app-pagination",
      standalone: true,
      template: `
    <nav aria-label="Table pagination" class="d-flex align-items-center justify-content-between gap-3 flex-wrap">
      <small class="text-body-secondary">Page {{ page() }} of {{ totalPages() }}</small>
      <ul class="pagination mb-0">
        <li class="page-item" [class.disabled]="page() === 1">
          <button class="page-link" type="button" aria-label="Previous page" (click)="goTo(page() - 1)">Previous</button>
        </li>
        @for (item of pages(); track item) {
          <li class="page-item" [class.active]="item === page()">
            <button class="page-link" type="button" [attr.aria-label]="'Go to page ' + item" (click)="goTo(item)">{{ item }}</button>
          </li>
        }
        <li class="page-item" [class.disabled]="page() === totalPages()">
          <button class="page-link" type="button" aria-label="Next page" (click)="goTo(page() + 1)">Next</button>
        </li>
      </ul>
    </nav>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, { page: [{ type: Input, args: [{ isSignal: true, alias: "page", required: true }] }], pageSize: [{ type: Input, args: [{ isSignal: true, alias: "pageSize", required: true }] }], total: [{ type: Input, args: [{ isSignal: true, alias: "total", required: true }] }], pageChange: [{ type: Output, args: ["pageChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaginationComponent, { className: "PaginationComponent", filePath: "src/app/shared/components/pagination/pagination.component.ts", lineNumber: 26 });
})();

// src/app/shared/pipes/app-date.pipe.ts
var AppDatePipe = class _AppDatePipe {
  datePipe = new DatePipe("en-IN");
  transform(value, format = "mediumDate") {
    return this.datePipe.transform(value, format) ?? "";
  }
  static \u0275fac = function AppDatePipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppDatePipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "appDate", type: _AppDatePipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppDatePipe, [{
    type: Pipe,
    args: [{ name: "appDate", standalone: true }]
  }], null, null);
})();

// src/app/features/admin/employees/employee-list/employee-list.component.ts
var _c02 = (a0) => ["/admin/employees", a0];
var _c1 = (a0) => ["/admin/employees", a0, "edit"];
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.field;
function EmployeeListComponent_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "label", 34)(2, "input", 35);
    \u0275\u0275listener("change", function EmployeeListComponent_For_12_Template_input_change_2_listener() {
      const col_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleColumn(col_r2));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const col_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", col_r2.visible);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", col_r2.label, " ");
  }
}
function EmployeeListComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_35_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.filterForm.controls.query.setValue(""));
    });
    \u0275\u0275text(1, "\u2715");
    \u0275\u0275elementEnd();
  }
}
function EmployeeListComponent_For_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const dept_r5 = ctx.$implicit;
    \u0275\u0275property("value", dept_r5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(dept_r5);
  }
}
function EmployeeListComponent_For_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const loc_r6 = ctx.$implicit;
    \u0275\u0275property("value", loc_r6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(loc_r6);
  }
}
function EmployeeListComponent_Conditional_61_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r8 = ctx.$implicit;
    \u0275\u0275property("value", d_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r8);
  }
}
function EmployeeListComponent_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 37)(2, "select", 38)(3, "option", 21);
    \u0275\u0275text(4, "All designations");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, EmployeeListComponent_Conditional_61_For_6_Template, 2, 2, "option", 22, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 39);
    \u0275\u0275element(8, "input", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 39);
    \u0275\u0275element(10, "input", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 39)(12, "select", 42)(13, "option", 43);
    \u0275\u0275text(14, "5 per page");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 43);
    \u0275\u0275text(16, "10 per page");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "option", 43);
    \u0275\u0275text(18, "25 per page");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "option", 43);
    \u0275\u0275text(20, "50 per page");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 44)(22, "button", 45);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_61_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.resetFilters());
    });
    \u0275\u0275text(23, "Reset");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 46);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_61_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.saveCurrentFilter());
    });
    \u0275\u0275text(25, "Save filter");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.designations());
    \u0275\u0275advance(8);
    \u0275\u0275property("ngValue", 5);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngValue", 10);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngValue", 25);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngValue", 50);
  }
}
function EmployeeListComponent_Conditional_62_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48)(1, "button", 49);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_62_For_4_Template_button_click_1_listener() {
      const sf_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.applyFilter(sf_r10));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 50);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_62_For_4_Template_button_click_3_listener() {
      const sf_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.removeSavedFilter(sf_r10.id));
    });
    \u0275\u0275text(4, "\u2715");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const sf_r10 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(sf_r10.name);
  }
}
function EmployeeListComponent_Conditional_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "small", 47);
    \u0275\u0275text(2, "Saved:");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, EmployeeListComponent_Conditional_62_For_4_Template, 5, 1, "div", 48, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.savedFilters());
  }
}
function EmployeeListComponent_Conditional_63_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 51);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_63_For_2_Template_button_click_2_listener() {
      const chip_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.clearChip(chip_r13.key));
    });
    \u0275\u0275text(3, "\u2715");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const chip_r13 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", chip_r13.label, " ");
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", "Remove " + chip_r13.label + " filter");
  }
}
function EmployeeListComponent_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275repeaterCreate(1, EmployeeListComponent_Conditional_63_For_2_Template, 4, 2, "span", 48, _forTrack0);
    \u0275\u0275elementStart(3, "button", 25);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_63_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.resetFilters());
    });
    \u0275\u0275text(4, "Clear all");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.activeChips());
  }
}
function EmployeeListComponent_Conditional_64_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 54);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_64_For_4_Template_button_click_2_listener() {
      const \u0275$index_193_r16 = \u0275\u0275restoreView(_r15).$index;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.removeSortEntry(\u0275$index_193_r16));
    });
    \u0275\u0275text(3, "\u2715");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const entry_r17 = ctx.$implicit;
    const \u0275$index_193_r16 = ctx.$index;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" #", \u0275$index_193_r16 + 1, " ", entry_r17.field, " ", entry_r17.direction === "asc" ? "\u2191" : "\u2193", " ");
  }
}
function EmployeeListComponent_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "small", 52);
    \u0275\u0275text(2, "Sort:");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, EmployeeListComponent_Conditional_64_For_4_Template, 4, 3, "span", 53, _forTrack2);
    \u0275\u0275elementStart(5, "button", 25);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_64_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.clearSort());
    });
    \u0275\u0275text(6, "Clear sort");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.sortStack());
  }
}
function EmployeeListComponent_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 55)(4, "button", 56);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_65_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.bulkSetStatus("Active"));
    });
    \u0275\u0275text(5, "\u2705 Activate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 56);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_65_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.bulkSetStatus("Inactive"));
    });
    \u0275\u0275text(7, "\u26D4 Deactivate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 56);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_65_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.bulkSetStatus("On Leave"));
    });
    \u0275\u0275text(9, "\u{1F3D6}\uFE0F On Leave");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 57);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_65_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.confirmDialog.set("delete"));
    });
    \u0275\u0275text(11, "\u{1F5D1} Delete");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 58);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_65_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectedIds.set([]));
    });
    \u0275\u0275text(13, "Deselect all");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r2.selectedIds().length, " selected");
  }
}
function EmployeeListComponent_Conditional_66_For_7_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 71);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.primarySortDir() === "asc" ? "\u2191" : "\u2193");
  }
}
function EmployeeListComponent_Conditional_66_For_7_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "sup", 72);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const col_r21 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.sortStackIndex(col_r21.key));
  }
}
function EmployeeListComponent_Conditional_66_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "th", 64)(1, "button", 70);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_66_For_7_Template_button_click_1_listener() {
      const col_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.addSort(col_r21.key));
    });
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, EmployeeListComponent_Conditional_66_For_7_Conditional_3_Template, 2, 1, "span", 71);
    \u0275\u0275conditionalCreate(4, EmployeeListComponent_Conditional_66_For_7_Conditional_4_Template, 2, 1, "sup", 72);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const col_r21 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", "Sort by " + col_r21.label);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", col_r21.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.primarySortKey() === col_r21.key ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.sortStackIndex(col_r21.key) > 0 ? 4 : -1);
  }
}
function EmployeeListComponent_Conditional_66_For_12_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td")(1, "code", 75);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const emp_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(emp_r23.employeeCode);
  }
}
function EmployeeListComponent_Conditional_66_For_12_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td")(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const emp_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", emp_r23.firstName, " ", emp_r23.lastName);
  }
}
function EmployeeListComponent_Conditional_66_For_12_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 74);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emp_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(emp_r23.email);
  }
}
function EmployeeListComponent_Conditional_66_For_12_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 74);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "phoneFormat");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emp_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, emp_r23.phone));
  }
}
function EmployeeListComponent_Conditional_66_For_12_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td")(1, "span", 79);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const emp_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(emp_r23.department);
  }
}
function EmployeeListComponent_Conditional_66_For_12_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 75);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emp_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(emp_r23.designation);
  }
}
function EmployeeListComponent_Conditional_66_For_12_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 75);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emp_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(emp_r23.location);
  }
}
function EmployeeListComponent_Conditional_66_For_12_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td")(1, "span", 80);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const emp_r23 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r2.statusClass(emp_r23.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(emp_r23.status);
  }
}
function EmployeeListComponent_Conditional_66_For_12_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 75);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "appDate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emp_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, emp_r23.joinedAt));
  }
}
function EmployeeListComponent_Conditional_66_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "input", 73);
    \u0275\u0275listener("change", function EmployeeListComponent_Conditional_66_For_12_Template_input_change_2_listener() {
      const emp_r23 = \u0275\u0275restoreView(_r22).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleRow(emp_r23.id));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(3, EmployeeListComponent_Conditional_66_For_12_Conditional_3_Template, 3, 1, "td");
    \u0275\u0275conditionalCreate(4, EmployeeListComponent_Conditional_66_For_12_Conditional_4_Template, 3, 2, "td");
    \u0275\u0275conditionalCreate(5, EmployeeListComponent_Conditional_66_For_12_Conditional_5_Template, 2, 1, "td", 74);
    \u0275\u0275conditionalCreate(6, EmployeeListComponent_Conditional_66_For_12_Conditional_6_Template, 3, 3, "td", 74);
    \u0275\u0275conditionalCreate(7, EmployeeListComponent_Conditional_66_For_12_Conditional_7_Template, 3, 1, "td");
    \u0275\u0275conditionalCreate(8, EmployeeListComponent_Conditional_66_For_12_Conditional_8_Template, 2, 1, "td", 75);
    \u0275\u0275conditionalCreate(9, EmployeeListComponent_Conditional_66_For_12_Conditional_9_Template, 2, 1, "td", 75);
    \u0275\u0275conditionalCreate(10, EmployeeListComponent_Conditional_66_For_12_Conditional_10_Template, 3, 3, "td");
    \u0275\u0275conditionalCreate(11, EmployeeListComponent_Conditional_66_For_12_Conditional_11_Template, 3, 3, "td", 75);
    \u0275\u0275elementStart(12, "td", 76)(13, "a", 77);
    \u0275\u0275text(14, "View");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "a", 78);
    \u0275\u0275text(16, "Edit");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const emp_r23 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("row-selected", ctx_r2.selectedIds().includes(emp_r23.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", ctx_r2.selectedIds().includes(emp_r23.id));
    \u0275\u0275attribute("aria-label", "Select " + emp_r23.firstName + " " + emp_r23.lastName);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.colVisible("employeeCode") ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.colVisible("firstName") ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.colVisible("email") ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.colVisible("phone") ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.colVisible("department") ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.colVisible("designation") ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.colVisible("location") ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.colVisible("status") ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.colVisible("joinedAt") ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(15, _c02, emp_r23.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(17, _c1, emp_r23.id));
  }
}
function EmployeeListComponent_Conditional_66_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 81)(2, "div", 52)(3, "div", 82);
    \u0275\u0275text(4, "\u{1F50D}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6, "No employees found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 83);
    \u0275\u0275text(8, "Try adjusting your filters");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r2.visibleColumns().length + 2);
  }
}
function EmployeeListComponent_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 59)(1, "table", 60)(2, "thead", 61)(3, "tr")(4, "th", 62)(5, "input", 63);
    \u0275\u0275listener("change", function EmployeeListComponent_Conditional_66_Template_input_change_5_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.togglePageSelection());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(6, EmployeeListComponent_Conditional_66_For_7_Template, 5, 4, "th", 64, _forTrack0);
    \u0275\u0275elementStart(8, "th", 65);
    \u0275\u0275text(9, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "tbody");
    \u0275\u0275repeaterCreate(11, EmployeeListComponent_Conditional_66_For_12_Template, 17, 19, "tr", 66, _forTrack1, false, EmployeeListComponent_Conditional_66_ForEmpty_13_Template, 9, 1, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 67)(15, "div", 68);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "app-pagination", 69);
    \u0275\u0275listener("pageChange", function EmployeeListComponent_Conditional_66_Template_app_pagination_pageChange_17_listener($event) {
      \u0275\u0275restoreView(_r19);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.setPage($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const paged_r24 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("checked", ctx_r2.allPageSelected())("indeterminate", ctx_r2.somePageSelected());
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.visibleColumns());
    \u0275\u0275advance(5);
    \u0275\u0275repeater(paged_r24.items);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate3(" Showing ", ctx_r2.rangeStart(paged_r24), "\u2013", ctx_r2.rangeEnd(paged_r24), " of ", paged_r24.total, " ");
    \u0275\u0275advance();
    \u0275\u0275property("page", ctx_r2.filterForm.controls.page.value)("pageSize", ctx_r2.filterForm.controls.pageSize.value)("total", paged_r24.total);
  }
}
function EmployeeListComponent_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 84)(2, "span", 85);
    \u0275\u0275text(3, "Loading\u2026");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "p", 86);
    \u0275\u0275text(5, "Loading employees\u2026");
    \u0275\u0275elementEnd()();
  }
}
function EmployeeListComponent_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 87)(2, "div", 88)(3, "div", 89)(4, "h5", 90);
    \u0275\u0275text(5, "Save filter");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 91);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_70_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.showSaveDialog.set(false));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 92)(8, "input", 93, 0);
    \u0275\u0275listener("input", function EmployeeListComponent_Conditional_70_Template_input_input_8_listener() {
      \u0275\u0275restoreView(_r25);
      const filterNameInput_r26 = \u0275\u0275reference(9);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.filterNameDraft.set(filterNameInput_r26.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 94)(11, "button", 95);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_70_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.showSaveDialog.set(false));
    });
    \u0275\u0275text(12, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 96);
    \u0275\u0275listener("click", function EmployeeListComponent_Conditional_70_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.confirmSaveFilter());
    });
    \u0275\u0275text(14, "Save");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275property("value", ctx_r2.filterNameDraft());
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", !ctx_r2.filterNameDraft().trim());
  }
}
var EmployeeListComponent = class _EmployeeListComponent {
  fb = inject(FormBuilder);
  employeeService = inject(EmployeeService);
  exportService = inject(ExportService);
  toast = inject(ToastService);
  // ── Service data ────────────────────────────────────
  departments = this.employeeService.departments;
  locations = this.employeeService.locations;
  designations = this.employeeService.designations;
  allEmployees = this.employeeService.employees;
  // ── UI state signals ────────────────────────────────
  selectedIds = signal([], ...ngDevMode ? [{ debugName: "selectedIds" }] : (
    /* istanbul ignore next */
    []
  ));
  confirmDialog = signal(null, ...ngDevMode ? [{ debugName: "confirmDialog" }] : (
    /* istanbul ignore next */
    []
  ));
  pendingStatus = signal("Active", ...ngDevMode ? [{ debugName: "pendingStatus" }] : (
    /* istanbul ignore next */
    []
  ));
  sortStack = signal([], ...ngDevMode ? [{ debugName: "sortStack" }] : (
    /* istanbul ignore next */
    []
  ));
  showAdvanced = signal(false, ...ngDevMode ? [{ debugName: "showAdvanced" }] : (
    /* istanbul ignore next */
    []
  ));
  savedFilters = signal([], ...ngDevMode ? [{ debugName: "savedFilters" }] : (
    /* istanbul ignore next */
    []
  ));
  showSaveDialog = signal(false, ...ngDevMode ? [{ debugName: "showSaveDialog" }] : (
    /* istanbul ignore next */
    []
  ));
  filterNameDraft = signal("", ...ngDevMode ? [{ debugName: "filterNameDraft" }] : (
    /* istanbul ignore next */
    []
  ));
  // ── Columns ─────────────────────────────────────────
  columns = [
    { key: "employeeCode", label: "Code", sortable: true, visible: true },
    { key: "firstName", label: "Name", sortable: true, visible: true },
    { key: "email", label: "Email", sortable: true, visible: true },
    { key: "phone", label: "Phone", sortable: false, visible: true },
    { key: "department", label: "Department", sortable: true, visible: true },
    { key: "designation", label: "Designation", sortable: true, visible: false },
    { key: "location", label: "Location", sortable: true, visible: true },
    { key: "status", label: "Status", sortable: true, visible: true },
    { key: "joinedAt", label: "Joined", sortable: true, visible: true }
  ];
  visibleColumns = computed(() => this.columns.filter((c) => c.visible), ...ngDevMode ? [{ debugName: "visibleColumns" }] : (
    /* istanbul ignore next */
    []
  ));
  // ── Filter form ─────────────────────────────────────
  filterForm = this.fb.nonNullable.group({
    query: [""],
    department: [""],
    status: [""],
    location: [""],
    designation: [""],
    joinedFrom: [""],
    joinedTo: [""],
    page: [1],
    pageSize: [10],
    sortBy: ["employeeCode"],
    sortDirection: ["asc"]
  });
  // ── Paged result as signal ───────────────────────────
  pagedResult$ = this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue()), debounceTime(220), switchMap(() => {
    const raw = this.filterForm.getRawValue();
    return this.employeeService.list(__spreadProps(__spreadValues({}, raw), { sortStack: this.sortStack() }));
  }));
  paged = toSignal(this.pagedResult$);
  // ── Derived display ──────────────────────────────────
  totalText = computed(() => {
    const p = this.paged();
    return p ? `${p.total} employee${p.total !== 1 ? "s" : ""}` : "";
  }, ...ngDevMode ? [{ debugName: "totalText" }] : (
    /* istanbul ignore next */
    []
  ));
  primarySortKey = computed(() => this.sortStack()[0]?.field ?? this.filterForm.controls.sortBy.value, ...ngDevMode ? [{ debugName: "primarySortKey" }] : (
    /* istanbul ignore next */
    []
  ));
  primarySortDir = computed(() => this.sortStack()[0]?.direction ?? this.filterForm.controls.sortDirection.value, ...ngDevMode ? [{ debugName: "primarySortDir" }] : (
    /* istanbul ignore next */
    []
  ));
  allPageSelected = computed(() => {
    const items = this.paged()?.items ?? [];
    return items.length > 0 && items.every((e) => this.selectedIds().includes(e.id));
  }, ...ngDevMode ? [{ debugName: "allPageSelected" }] : (
    /* istanbul ignore next */
    []
  ));
  somePageSelected = computed(() => {
    const items = this.paged()?.items ?? [];
    const sel = this.selectedIds();
    const count = items.filter((e) => sel.includes(e.id)).length;
    return count > 0 && count < items.length;
  }, ...ngDevMode ? [{ debugName: "somePageSelected" }] : (
    /* istanbul ignore next */
    []
  ));
  /** Active filter chips for display. */
  activeChips = computed(() => {
    const f = this.filterForm.getRawValue();
    const chips = [];
    if (f.query)
      chips.push({ key: "query", label: `"${f.query}"` });
    if (f.department)
      chips.push({ key: "department", label: `Dept: ${f.department}` });
    if (f.status)
      chips.push({ key: "status", label: `Status: ${f.status}` });
    if (f.location)
      chips.push({ key: "location", label: `Location: ${f.location}` });
    if (f.designation)
      chips.push({ key: "designation", label: `Role: ${f.designation}` });
    if (f.joinedFrom)
      chips.push({ key: "joinedFrom", label: `From: ${f.joinedFrom}` });
    if (f.joinedTo)
      chips.push({ key: "joinedTo", label: `To: ${f.joinedTo}` });
    return chips;
  }, ...ngDevMode ? [{ debugName: "activeChips" }] : (
    /* istanbul ignore next */
    []
  ));
  // ── Column visibility ────────────────────────────────
  toggleColumn(col) {
    col.visible = !col.visible;
  }
  colVisible(key) {
    return this.columns.find((c) => c.key === key)?.visible ?? false;
  }
  // ── Sort ────────────────────────────────────────────
  addSort(field) {
    this.sortStack.update((stack) => {
      const existing = stack.findIndex((e) => e.field === field);
      if (existing === -1) {
        return [...stack, { field, direction: "asc" }];
      }
      return stack.map((e, i) => i === existing ? __spreadProps(__spreadValues({}, e), { direction: e.direction === "asc" ? "desc" : "asc" }) : e);
    });
    this.filterForm.patchValue({ page: 1 });
  }
  removeSortEntry(index) {
    this.sortStack.update((s) => s.filter((_, i) => i !== index));
  }
  clearSort() {
    this.sortStack.set([]);
  }
  sortStackIndex(field) {
    return this.sortStack().findIndex((e) => e.field === field) + 1;
  }
  // ── Selection ────────────────────────────────────────
  toggleRow(id) {
    this.selectedIds.update((ids) => ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]);
  }
  togglePageSelection() {
    const items = this.paged()?.items ?? [];
    if (this.allPageSelected()) {
      this.selectedIds.update((ids) => ids.filter((id) => !items.some((e) => e.id === id)));
    } else {
      this.selectedIds.update((ids) => Array.from(/* @__PURE__ */ new Set([...ids, ...items.map((e) => e.id)])));
    }
  }
  // ── Filters ──────────────────────────────────────────
  setPage(page) {
    this.filterForm.patchValue({ page });
  }
  resetFilters() {
    this.filterForm.patchValue({
      query: "",
      department: "",
      status: "",
      location: "",
      designation: "",
      joinedFrom: "",
      joinedTo: "",
      page: 1
    });
    this.sortStack.set([]);
  }
  clearChip(key) {
    this.filterForm.patchValue({ [key]: "", page: 1 });
  }
  // ── Saved filters ────────────────────────────────────
  saveCurrentFilter() {
    this.filterNameDraft.set("");
    this.showSaveDialog.set(true);
  }
  confirmSaveFilter() {
    const name = this.filterNameDraft().trim();
    if (!name)
      return;
    const saved = {
      id: crypto.randomUUID(),
      name,
      filter: __spreadProps(__spreadValues({}, this.filterForm.getRawValue()), { sortStack: this.sortStack() }),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.savedFilters.update((sf) => [...sf, saved]);
    this.showSaveDialog.set(false);
    this.toast.show({ title: "Filter saved", message: `"${name}" saved as preset`, type: "success" });
  }
  applyFilter(sf) {
    const f = sf.filter;
    this.filterForm.patchValue({
      query: f.query ?? "",
      department: f.department ?? "",
      status: f.status ?? "",
      location: f.location ?? "",
      designation: f.designation ?? "",
      joinedFrom: f.joinedFrom ?? "",
      joinedTo: f.joinedTo ?? "",
      page: 1,
      pageSize: f.pageSize ?? 10
    });
    if (f.sortStack)
      this.sortStack.set(f.sortStack);
    this.toast.show({ title: "Filter applied", message: `Loaded "${sf.name}"`, type: "info" });
  }
  removeSavedFilter(id) {
    this.savedFilters.update((sf) => sf.filter((f) => f.id !== id));
  }
  // ── Bulk actions ─────────────────────────────────────
  bulkSetStatus(status) {
    this.pendingStatus.set(status);
    this.confirmDialog.set("status");
  }
  executeBulkDelete() {
    const ids = this.selectedIds();
    this.employeeService.bulkDelete(ids).subscribe(() => {
      this.toast.show({ title: "Deleted", message: `${ids.length} employee(s) deleted`, type: "success" });
      this.selectedIds.set([]);
      this.confirmDialog.set(null);
      this.filterForm.patchValue({ page: 1 });
    });
  }
  executeBulkStatus() {
    const ids = this.selectedIds();
    const status = this.pendingStatus();
    this.employeeService.bulkUpdateStatus(ids, status).subscribe(() => {
      this.toast.show({ title: "Status updated", message: `${ids.length} employee(s) set to ${status}`, type: "success" });
      this.selectedIds.set([]);
      this.confirmDialog.set(null);
    });
  }
  // ── Export ───────────────────────────────────────────
  exportCsv() {
    this.exportService.downloadCsv(this.allEmployees(), "employees-all");
  }
  exportExcel() {
    this.exportService.downloadExcel(this.allEmployees(), "employees-all");
  }
  exportFiltered() {
    const paged = this.paged();
    if (!paged?.items.length) {
      this.toast.show({ title: "Nothing to export", message: "No records match the current filters", type: "warning" });
      return;
    }
    const raw = __spreadProps(__spreadValues({}, this.filterForm.getRawValue()), { page: 1, pageSize: 9999, sortStack: this.sortStack() });
    this.employeeService.list(raw).subscribe((result) => {
      this.exportService.downloadCsv(result.items, "employees-filtered");
      this.toast.show({ title: "Export ready", message: `${result.total} records exported`, type: "success" });
    });
  }
  // ── Helpers ──────────────────────────────────────────
  statusClass(status) {
    return { Active: "text-bg-success", Inactive: "text-bg-danger", "On Leave": "text-bg-warning text-dark" }[status] ?? "text-bg-secondary";
  }
  rangeStart(paged) {
    return (paged.page - 1) * paged.pageSize + 1;
  }
  rangeEnd(paged) {
    return (paged.page - 1) * paged.pageSize + paged.items.length;
  }
  static \u0275fac = function EmployeeListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmployeeListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmployeeListComponent, selectors: [["app-employee-list"]], decls: 71, vars: 15, consts: [["filterNameInput", ""], [1, "d-flex", "flex-wrap", "align-items-center", "justify-content-between", "gap-2", "mb-3"], [1, "h3", "mb-0"], [1, "text-body-secondary", "small", "mb-0"], [1, "d-flex", "flex-wrap", "gap-2"], [1, "dropdown"], ["type", "button", "data-bs-toggle", "dropdown", "aria-label", "Toggle columns", 1, "btn", "btn-outline-secondary", "btn-sm", "dropdown-toggle"], [1, "dropdown-menu", "p-2", 2, "min-width", "160px"], ["type", "button", "data-bs-toggle", "dropdown", "aria-label", "Export", 1, "btn", "btn-outline-secondary", "btn-sm", "dropdown-toggle"], [1, "dropdown-menu"], ["type", "button", 1, "dropdown-item", 3, "click"], ["routerLink", "/admin/employees/create", 1, "btn", "btn-primary", "btn-sm"], ["aria-label", "Employee filters", 1, "surface", "p-3", "mb-3", 3, "formGroup"], [1, "row", "g-2", "mb-2"], [1, "col-12", "col-md-4"], [1, "input-group", "input-group-sm"], [1, "input-group-text"], ["placeholder", "Search name, email, code, dept\u2026", "formControlName", "query", "aria-label", "Search employees", 1, "form-control"], ["type", "button", "aria-label", "Clear search", 1, "btn", "btn-outline-secondary"], [1, "col-6", "col-md-2"], ["formControlName", "department", "aria-label", "Filter by department", 1, "form-select", "form-select-sm"], ["value", ""], [3, "value"], ["formControlName", "status", "aria-label", "Filter by status", 1, "form-select", "form-select-sm"], ["formControlName", "location", "aria-label", "Filter by location", 1, "form-select", "form-select-sm"], ["type", "button", 1, "btn", "btn-link", "btn-sm", "p-0", 3, "click"], [1, "d-flex", "flex-wrap", "gap-2", "mt-2", "pt-2", "border-top"], [1, "d-flex", "flex-wrap", "gap-2", "mb-3"], [1, "d-flex", "flex-wrap", "gap-2", "mb-3", "align-items-center"], [1, "bulk-bar", "mb-3", "d-flex", "flex-wrap", "align-items-center", "gap-3"], [1, "surface", "p-5", "text-center", "text-body-secondary"], ["title", "Delete employees", 3, "cancel", "confirm", "open", "message"], ["title", "Update status", 3, "cancel", "confirm", "open", "message"], ["tabindex", "-1", 1, "modal", "d-block", 2, "background", "rgba(0,0,0,.4)"], [1, "dropdown-item", "d-flex", "align-items-center", "gap-2", "col-visible-toggle", 2, "cursor", "pointer"], ["type", "checkbox", 3, "change", "checked"], ["type", "button", "aria-label", "Clear search", 1, "btn", "btn-outline-secondary", 3, "click"], [1, "col-md-3"], ["formControlName", "designation", "aria-label", "Filter by designation", 1, "form-select", "form-select-sm"], [1, "col-md-2"], ["type", "date", "formControlName", "joinedFrom", "aria-label", "Joined from date", 1, "form-control", "form-control-sm"], ["type", "date", "formControlName", "joinedTo", "aria-label", "Joined to date", 1, "form-control", "form-control-sm"], ["formControlName", "pageSize", "aria-label", "Rows per page", 1, "form-select", "form-select-sm"], [3, "ngValue"], [1, "col-md-3", "d-flex", "gap-2"], ["type", "button", 1, "btn", "btn-outline-secondary", "btn-sm", "flex-fill", 3, "click"], ["type", "button", 1, "btn", "btn-outline-primary", "btn-sm", "flex-fill", 3, "click"], [1, "text-body-secondary", "align-self-center"], [1, "chip"], ["type", "button", 2, "background", "none", "border", "none", "padding", "0", "color", "inherit", "font-size", ".8rem", 3, "click"], ["type", "button", "aria-label", "Remove saved filter", 1, "chip-close", 3, "click"], ["type", "button", 1, "chip-close", 3, "click"], [1, "text-body-secondary"], [1, "badge", "text-bg-secondary", "sort-stack-badge", "d-flex", "align-items-center", "gap-1"], ["type", "button", "aria-label", "Remove sort", 2, "background", "none", "border", "none", "color", "inherit", "padding", "0", "line-height", "1", "font-size", ".7rem", 3, "click"], [1, "d-flex", "flex-wrap", "gap-2", "ms-auto"], ["type", "button", 1, "btn", "btn-sm", "btn-light", 3, "click"], ["type", "button", 1, "btn", "btn-sm", "btn-danger", 3, "click"], ["type", "button", 1, "btn", "btn-sm", "btn-outline-light", 3, "click"], [1, "surface", "table-responsive", "mb-3"], [1, "table", "table-hover", "align-middle", "mb-0"], [1, "table-light"], ["scope", "col", 2, "width", "2.5rem"], ["type", "checkbox", "aria-label", "Select all rows on page", 1, "form-check-input", 3, "change", "checked", "indeterminate"], ["scope", "col"], ["scope", "col", 1, "text-end"], [3, "row-selected"], [1, "d-flex", "justify-content-between", "align-items-center", "flex-wrap", "gap-3"], [1, "small", "text-body-secondary"], [3, "pageChange", "page", "pageSize", "total"], ["type", "button", 1, "sort-btn", 3, "click"], [1, "sort-indicator"], [1, "sort-stack-badge", "text-primary"], ["type", "checkbox", 1, "form-check-input", 3, "change", "checked"], [1, "text-body-secondary", "small"], [1, "small"], [1, "text-end"], [1, "btn", "btn-sm", "btn-outline-primary", "me-1", 3, "routerLink"], [1, "btn", "btn-sm", "btn-outline-secondary", 3, "routerLink"], [1, "badge", "text-bg-secondary"], [1, "badge"], [1, "text-center", "py-5"], [1, "fs-2", "mb-2"], [1, "mb-0", "small"], ["role", "status", 1, "spinner-border", "mb-3"], [1, "visually-hidden"], [1, "mb-0"], [1, "modal-dialog", "modal-sm"], [1, "modal-content"], [1, "modal-header"], [1, "modal-title"], ["type", "button", "aria-label", "Close", 1, "btn-close", 3, "click"], [1, "modal-body"], ["placeholder", "Filter name\u2026", 1, "form-control", 3, "input", "value"], [1, "modal-footer"], ["type", "button", 1, "btn", "btn-outline-secondary", "btn-sm", 3, "click"], ["type", "button", 1, "btn", "btn-primary", "btn-sm", 3, "click", "disabled"]], template: function EmployeeListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1)(1, "div")(2, "h1", 2);
      \u0275\u0275text(3, "Employees");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "button", 6);
      \u0275\u0275text(9, " Columns ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "ul", 7);
      \u0275\u0275repeaterCreate(11, EmployeeListComponent_For_12_Template, 4, 2, "li", null, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 5)(14, "button", 8);
      \u0275\u0275text(15, " Export ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "ul", 9)(17, "li")(18, "button", 10);
      \u0275\u0275listener("click", function EmployeeListComponent_Template_button_click_18_listener() {
        return ctx.exportCsv();
      });
      \u0275\u0275text(19, "\u{1F4C4} CSV");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "li")(21, "button", 10);
      \u0275\u0275listener("click", function EmployeeListComponent_Template_button_click_21_listener() {
        return ctx.exportExcel();
      });
      \u0275\u0275text(22, "\u{1F4CA} Excel (XLS)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "li")(24, "button", 10);
      \u0275\u0275listener("click", function EmployeeListComponent_Template_button_click_24_listener() {
        return ctx.exportFiltered();
      });
      \u0275\u0275text(25, "\u{1F50D} Filtered CSV");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(26, "a", 11);
      \u0275\u0275text(27, "+ New Employee");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(28, "form", 12)(29, "div", 13)(30, "div", 14)(31, "div", 15)(32, "span", 16);
      \u0275\u0275text(33, "\u{1F50D}");
      \u0275\u0275elementEnd();
      \u0275\u0275element(34, "input", 17);
      \u0275\u0275conditionalCreate(35, EmployeeListComponent_Conditional_35_Template, 2, 0, "button", 18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(36, "div", 19)(37, "select", 20)(38, "option", 21);
      \u0275\u0275text(39, "All departments");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(40, EmployeeListComponent_For_41_Template, 2, 2, "option", 22, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(42, "div", 19)(43, "select", 23)(44, "option", 21);
      \u0275\u0275text(45, "All statuses");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "option");
      \u0275\u0275text(47, "Active");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "option");
      \u0275\u0275text(49, "Inactive");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "option");
      \u0275\u0275text(51, "On Leave");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(52, "div", 19)(53, "select", 24)(54, "option", 21);
      \u0275\u0275text(55, "All locations");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(56, EmployeeListComponent_For_57_Template, 2, 2, "option", 22, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "div", 19)(59, "button", 25);
      \u0275\u0275listener("click", function EmployeeListComponent_Template_button_click_59_listener() {
        return ctx.showAdvanced.update((v) => !v);
      });
      \u0275\u0275text(60);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(61, EmployeeListComponent_Conditional_61_Template, 26, 4, "div", 13);
      \u0275\u0275conditionalCreate(62, EmployeeListComponent_Conditional_62_Template, 5, 0, "div", 26);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(63, EmployeeListComponent_Conditional_63_Template, 5, 0, "div", 27);
      \u0275\u0275conditionalCreate(64, EmployeeListComponent_Conditional_64_Template, 7, 0, "div", 28);
      \u0275\u0275conditionalCreate(65, EmployeeListComponent_Conditional_65_Template, 14, 1, "div", 29);
      \u0275\u0275conditionalCreate(66, EmployeeListComponent_Conditional_66_Template, 18, 9)(67, EmployeeListComponent_Conditional_67_Template, 6, 0, "div", 30);
      \u0275\u0275elementStart(68, "app-confirmation-dialog", 31);
      \u0275\u0275listener("cancel", function EmployeeListComponent_Template_app_confirmation_dialog_cancel_68_listener() {
        return ctx.confirmDialog.set(null);
      })("confirm", function EmployeeListComponent_Template_app_confirmation_dialog_confirm_68_listener() {
        return ctx.executeBulkDelete();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "app-confirmation-dialog", 32);
      \u0275\u0275listener("cancel", function EmployeeListComponent_Template_app_confirmation_dialog_cancel_69_listener() {
        return ctx.confirmDialog.set(null);
      })("confirm", function EmployeeListComponent_Template_app_confirmation_dialog_confirm_69_listener() {
        return ctx.executeBulkStatus();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(70, EmployeeListComponent_Conditional_70_Template, 15, 2, "div", 33);
    }
    if (rf & 2) {
      let tmp_12_0;
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.totalText());
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.columns);
      \u0275\u0275advance(17);
      \u0275\u0275property("formGroup", ctx.filterForm);
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.filterForm.controls.query.value ? 35 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.departments());
      \u0275\u0275advance(16);
      \u0275\u0275repeater(ctx.locations());
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", ctx.showAdvanced() ? "\u25B2 Less" : "\u25BC More filters", " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showAdvanced() ? 61 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.savedFilters().length > 0 ? 62 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeChips().length > 0 ? 63 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.sortStack().length > 0 ? 64 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.selectedIds().length > 0 ? 65 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_12_0 = ctx.paged()) ? 66 : 67, tmp_12_0);
      \u0275\u0275advance(2);
      \u0275\u0275property("open", ctx.confirmDialog() === "delete")("message", "Permanently delete " + ctx.selectedIds().length + " employee record(s). This cannot be undone.");
      \u0275\u0275advance();
      \u0275\u0275property("open", ctx.confirmDialog() === "status")("message", "Set " + ctx.selectedIds().length + " employee(s) to " + ctx.pendingStatus() + "?");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showSaveDialog() ? 70 : -1);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink, PaginationComponent, ConfirmationDialogComponent, PhoneFormatPipe, AppDatePipe], styles: ["\n.sort-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  padding: 0;\n  font-weight: 600;\n  cursor: pointer;\n  white-space: nowrap;\n  color: inherit;\n}\n.sort-btn[_ngcontent-%COMP%]:hover {\n  color: var(--bs-primary);\n}\n.sort-indicator[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n  opacity: 0.7;\n}\n.sort-stack-badge[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n}\n.chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.3rem;\n  padding: 0.2rem 0.6rem;\n  border-radius: 2rem;\n  background: var(--bs-primary-bg-subtle);\n  color: var(--bs-primary);\n  border: 1px solid var(--bs-primary-border-subtle);\n  font-size: 0.8rem;\n}\n.chip-close[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  padding: 0;\n  line-height: 1;\n  cursor: pointer;\n  color: inherit;\n}\n.row-selected[_ngcontent-%COMP%] {\n  background: var(--bs-primary-bg-subtle) !important;\n}\n.bulk-bar[_ngcontent-%COMP%] {\n  background: var(--bs-primary);\n  color: #fff;\n  border-radius: 0.5rem;\n  padding: 0.5rem 1rem;\n}\n.col-visible-toggle[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n}\n/*# sourceMappingURL=employee-list.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmployeeListComponent, [{
    type: Component,
    args: [{ selector: "app-employee-list", standalone: true, imports: [ReactiveFormsModule, RouterLink, PaginationComponent, ConfirmationDialogComponent, PhoneFormatPipe, AppDatePipe], template: `
    <!-- \u2500\u2500 Header \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <div>
        <h1 class="h3 mb-0">Employees</h1>
        <p class="text-body-secondary small mb-0">{{ totalText() }}</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <!-- Column visibility toggle -->
        <div class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-label="Toggle columns">
            Columns
          </button>
          <ul class="dropdown-menu p-2" style="min-width:160px">
            @for (col of columns; track col.key) {
              <li>
                <label class="dropdown-item d-flex align-items-center gap-2 col-visible-toggle" style="cursor:pointer">
                  <input type="checkbox" [checked]="col.visible" (change)="toggleColumn(col)" />
                  {{ col.label }}
                </label>
              </li>
            }
          </ul>
        </div>

        <!-- Export -->
        <div class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-label="Export">
            Export
          </button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" type="button" (click)="exportCsv()">\u{1F4C4} CSV</button></li>
            <li><button class="dropdown-item" type="button" (click)="exportExcel()">\u{1F4CA} Excel (XLS)</button></li>
            <li><button class="dropdown-item" type="button" (click)="exportFiltered()">\u{1F50D} Filtered CSV</button></li>
          </ul>
        </div>

        <a class="btn btn-primary btn-sm" routerLink="/admin/employees/create">+ New Employee</a>
      </div>
    </div>

    <!-- \u2500\u2500 Filter panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
    <form [formGroup]="filterForm" class="surface p-3 mb-3" aria-label="Employee filters">
      <div class="row g-2 mb-2">
        <!-- Global search -->
        <div class="col-12 col-md-4">
          <div class="input-group input-group-sm">
            <span class="input-group-text">\u{1F50D}</span>
            <input class="form-control" placeholder="Search name, email, code, dept\u2026" formControlName="query" aria-label="Search employees" />
            @if (filterForm.controls.query.value) {
              <button class="btn btn-outline-secondary" type="button" (click)="filterForm.controls.query.setValue('')" aria-label="Clear search">\u2715</button>
            }
          </div>
        </div>

        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="department" aria-label="Filter by department">
            <option value="">All departments</option>
            @for (dept of departments(); track dept) { <option [value]="dept">{{ dept }}</option> }
          </select>
        </div>

        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="status" aria-label="Filter by status">
            <option value="">All statuses</option>
            <option>Active</option><option>Inactive</option><option>On Leave</option>
          </select>
        </div>

        <div class="col-6 col-md-2">
          <select class="form-select form-select-sm" formControlName="location" aria-label="Filter by location">
            <option value="">All locations</option>
            @for (loc of locations(); track loc) { <option [value]="loc">{{ loc }}</option> }
          </select>
        </div>

        <div class="col-6 col-md-2">
          <button class="btn btn-link btn-sm p-0" type="button" (click)="showAdvanced.update(v => !v)">
            {{ showAdvanced() ? '\u25B2 Less' : '\u25BC More filters' }}
          </button>
        </div>
      </div>

      @if (showAdvanced()) {
        <div class="row g-2 mb-2">
          <div class="col-md-3">
            <select class="form-select form-select-sm" formControlName="designation" aria-label="Filter by designation">
              <option value="">All designations</option>
              @for (d of designations(); track d) { <option [value]="d">{{ d }}</option> }
            </select>
          </div>
          <div class="col-md-2">
            <input class="form-control form-control-sm" type="date" formControlName="joinedFrom" aria-label="Joined from date" />
          </div>
          <div class="col-md-2">
            <input class="form-control form-control-sm" type="date" formControlName="joinedTo" aria-label="Joined to date" />
          </div>
          <div class="col-md-2">
            <select class="form-select form-select-sm" formControlName="pageSize" aria-label="Rows per page">
              <option [ngValue]="5">5 per page</option>
              <option [ngValue]="10">10 per page</option>
              <option [ngValue]="25">25 per page</option>
              <option [ngValue]="50">50 per page</option>
            </select>
          </div>
          <div class="col-md-3 d-flex gap-2">
            <button class="btn btn-outline-secondary btn-sm flex-fill" type="button" (click)="resetFilters()">Reset</button>
            <button class="btn btn-outline-primary btn-sm flex-fill" type="button" (click)="saveCurrentFilter()">Save filter</button>
          </div>
        </div>
      }

      <!-- Saved filter presets -->
      @if (savedFilters().length > 0) {
        <div class="d-flex flex-wrap gap-2 mt-2 pt-2 border-top">
          <small class="text-body-secondary align-self-center">Saved:</small>
          @for (sf of savedFilters(); track sf.id) {
            <div class="chip">
              <button type="button" style="background:none;border:none;padding:0;color:inherit;font-size:.8rem" (click)="applyFilter(sf)">{{ sf.name }}</button>
              <button class="chip-close" type="button" (click)="removeSavedFilter(sf.id)" aria-label="Remove saved filter">\u2715</button>
            </div>
          }
        </div>
      }
    </form>

    <!-- \u2500\u2500 Active filter chips \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
    @if (activeChips().length > 0) {
      <div class="d-flex flex-wrap gap-2 mb-3">
        @for (chip of activeChips(); track chip.key) {
          <span class="chip">
            {{ chip.label }}
            <button class="chip-close" type="button" (click)="clearChip(chip.key)" [attr.aria-label]="'Remove ' + chip.label + ' filter'">\u2715</button>
          </span>
        }
        <button class="btn btn-link btn-sm p-0" type="button" (click)="resetFilters()">Clear all</button>
      </div>
    }

    <!-- \u2500\u2500 Sort stack badges \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
    @if (sortStack().length > 0) {
      <div class="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <small class="text-body-secondary">Sort:</small>
        @for (entry of sortStack(); track entry.field; let i = $index) {
          <span class="badge text-bg-secondary sort-stack-badge d-flex align-items-center gap-1">
            #{{ i + 1 }} {{ entry.field }} {{ entry.direction === 'asc' ? '\u2191' : '\u2193' }}
            <button style="background:none;border:none;color:inherit;padding:0;line-height:1;font-size:.7rem" type="button" (click)="removeSortEntry(i)" aria-label="Remove sort">\u2715</button>
          </span>
        }
        <button class="btn btn-link btn-sm p-0" type="button" (click)="clearSort()">Clear sort</button>
      </div>
    }

    <!-- \u2500\u2500 Bulk action bar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
    @if (selectedIds().length > 0) {
      <div class="bulk-bar mb-3 d-flex flex-wrap align-items-center gap-3">
        <strong>{{ selectedIds().length }} selected</strong>
        <div class="d-flex flex-wrap gap-2 ms-auto">
          <button class="btn btn-sm btn-light" type="button" (click)="bulkSetStatus('Active')">\u2705 Activate</button>
          <button class="btn btn-sm btn-light" type="button" (click)="bulkSetStatus('Inactive')">\u26D4 Deactivate</button>
          <button class="btn btn-sm btn-light" type="button" (click)="bulkSetStatus('On Leave')">\u{1F3D6}\uFE0F On Leave</button>
          <button class="btn btn-sm btn-danger" type="button" (click)="confirmDialog.set('delete')">\u{1F5D1} Delete</button>
          <button class="btn btn-sm btn-outline-light" type="button" (click)="selectedIds.set([])">Deselect all</button>
        </div>
      </div>
    }

    <!-- \u2500\u2500 Table \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
    @if (paged(); as paged) {
      <div class="surface table-responsive mb-3">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" style="width:2.5rem">
                <input class="form-check-input" type="checkbox" aria-label="Select all rows on page"
                  [checked]="allPageSelected()"
                  [indeterminate]="somePageSelected()"
                  (change)="togglePageSelection()" />
              </th>
              @for (col of visibleColumns(); track col.key) {
                <th scope="col">
                  <button class="sort-btn" type="button" [attr.aria-label]="'Sort by ' + col.label" (click)="addSort(col.key)">
                    {{ col.label }}
                    @if (primarySortKey() === col.key) {
                      <span class="sort-indicator">{{ primarySortDir() === 'asc' ? '\u2191' : '\u2193' }}</span>
                    }
                    @if (sortStackIndex(col.key) > 0) {
                      <sup class="sort-stack-badge text-primary">{{ sortStackIndex(col.key) }}</sup>
                    }
                  </button>
                </th>
              }
              <th scope="col" class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (emp of paged.items; track emp.id) {
              <tr [class.row-selected]="selectedIds().includes(emp.id)">
                <td>
                  <input class="form-check-input" type="checkbox" [attr.aria-label]="'Select ' + emp.firstName + ' ' + emp.lastName"
                    [checked]="selectedIds().includes(emp.id)"
                    (change)="toggleRow(emp.id)" />
                </td>
                @if (colVisible('employeeCode'))  { <td><code class="small">{{ emp.employeeCode }}</code></td> }
                @if (colVisible('firstName'))     { <td><strong>{{ emp.firstName }} {{ emp.lastName }}</strong></td> }
                @if (colVisible('email'))         { <td class="text-body-secondary small">{{ emp.email }}</td> }
                @if (colVisible('phone'))         { <td class="text-body-secondary small">{{ emp.phone | phoneFormat }}</td> }
                @if (colVisible('department'))    { <td><span class="badge text-bg-secondary">{{ emp.department }}</span></td> }
                @if (colVisible('designation'))   { <td class="small">{{ emp.designation }}</td> }
                @if (colVisible('location'))      { <td class="small">{{ emp.location }}</td> }
                @if (colVisible('status'))        { <td><span class="badge" [class]="statusClass(emp.status)">{{ emp.status }}</span></td> }
                @if (colVisible('joinedAt'))      { <td class="small">{{ emp.joinedAt | appDate }}</td> }
                <td class="text-end">
                  <a class="btn btn-sm btn-outline-primary me-1" [routerLink]="['/admin/employees', emp.id]">View</a>
                  <a class="btn btn-sm btn-outline-secondary" [routerLink]="['/admin/employees', emp.id, 'edit']">Edit</a>
                </td>
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="visibleColumns().length + 2" class="text-center py-5">
                  <div class="text-body-secondary">
                    <div class="fs-2 mb-2">\u{1F50D}</div>
                    <strong>No employees found</strong>
                    <p class="mb-0 small">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- \u2500\u2500 Pagination footer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div class="small text-body-secondary">
          Showing {{ rangeStart(paged) }}\u2013{{ rangeEnd(paged) }} of {{ paged.total }}
        </div>
        <app-pagination
          [page]="filterForm.controls.page.value"
          [pageSize]="filterForm.controls.pageSize.value"
          [total]="paged.total"
          (pageChange)="setPage($event)" />
      </div>
    } @else {
      <div class="surface p-5 text-center text-body-secondary">
        <div class="spinner-border mb-3" role="status"><span class="visually-hidden">Loading\u2026</span></div>
        <p class="mb-0">Loading employees\u2026</p>
      </div>
    }

    <!-- \u2500\u2500 Dialogs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
    <app-confirmation-dialog
      [open]="confirmDialog() === 'delete'"
      title="Delete employees"
      [message]="'Permanently delete ' + selectedIds().length + ' employee record(s). This cannot be undone.'"
      (cancel)="confirmDialog.set(null)"
      (confirm)="executeBulkDelete()" />

    <app-confirmation-dialog
      [open]="confirmDialog() === 'status'"
      title="Update status"
      [message]="'Set ' + selectedIds().length + ' employee(s) to ' + pendingStatus() + '?'"
      (cancel)="confirmDialog.set(null)"
      (confirm)="executeBulkStatus()" />

    <!-- \u2500\u2500 Save filter dialog (inline) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
    @if (showSaveDialog()) {
      <div class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,.4)">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Save filter</h5>
              <button class="btn-close" type="button" (click)="showSaveDialog.set(false)" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <input #filterNameInput class="form-control" placeholder="Filter name\u2026" [value]="filterNameDraft()" (input)="filterNameDraft.set(filterNameInput.value)" />
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-secondary btn-sm" type="button" (click)="showSaveDialog.set(false)">Cancel</button>
              <button class="btn btn-primary btn-sm" type="button" [disabled]="!filterNameDraft().trim()" (click)="confirmSaveFilter()">Save</button>
            </div>
          </div>
        </div>
      </div>
    }
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ["/* angular:styles/component:scss;0fe73d3f661c3bae261e7e5bdbe5fab301fbadc14a3293e4dfcfeb3cc6c27932;C:/Users/princ/Downloads/personal project/src/app/features/admin/employees/employee-list/employee-list.component.ts */\n.sort-btn {\n  background: none;\n  border: none;\n  padding: 0;\n  font-weight: 600;\n  cursor: pointer;\n  white-space: nowrap;\n  color: inherit;\n}\n.sort-btn:hover {\n  color: var(--bs-primary);\n}\n.sort-indicator {\n  font-size: 0.65rem;\n  opacity: 0.7;\n}\n.sort-stack-badge {\n  font-size: 0.65rem;\n}\n.chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.3rem;\n  padding: 0.2rem 0.6rem;\n  border-radius: 2rem;\n  background: var(--bs-primary-bg-subtle);\n  color: var(--bs-primary);\n  border: 1px solid var(--bs-primary-border-subtle);\n  font-size: 0.8rem;\n}\n.chip-close {\n  background: none;\n  border: none;\n  padding: 0;\n  line-height: 1;\n  cursor: pointer;\n  color: inherit;\n}\n.row-selected {\n  background: var(--bs-primary-bg-subtle) !important;\n}\n.bulk-bar {\n  background: var(--bs-primary);\n  color: #fff;\n  border-radius: 0.5rem;\n  padding: 0.5rem 1rem;\n}\n.col-visible-toggle {\n  font-size: 0.75rem;\n}\n/*# sourceMappingURL=employee-list.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmployeeListComponent, { className: "EmployeeListComponent", filePath: "src/app/features/admin/employees/employee-list/employee-list.component.ts", lineNumber: 328 });
})();
export {
  EmployeeListComponent
};
//# sourceMappingURL=chunk-SLBDDK5F.js.map
