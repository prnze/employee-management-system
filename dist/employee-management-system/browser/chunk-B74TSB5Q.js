import {
  AnalyticsService,
  BarChartComponent,
  LineChartComponent
} from "./chunk-B252WBUG.js";
import "./chunk-46HWQF6E.js";
import "./chunk-RJ4TKVLL.js";
import {
  toSignal
} from "./chunk-HMEP4754.js";
import {
  AuthStateService
} from "./chunk-CSWEOAXU.js";
import "./chunk-I2TBGIDF.js";
import "./chunk-XBOA52FZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/employee/dashboard/employee-dashboard.component.ts
var _c0 = () => [1, 2, 3, 4];
var _c1 = () => [1, 2];
var _forTrack0 = ($index, $item) => $item.label;
function EmployeeDashboardComponent_Conditional_6_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const card_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(card_r1.sub);
  }
}
function EmployeeDashboardComponent_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "article", 28)(2, "span", 29);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 30);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong", 31);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, EmployeeDashboardComponent_Conditional_6_For_2_Conditional_8_Template, 2, 1, "span", 32);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const card_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(card_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r1.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r1.value);
    \u0275\u0275advance();
    \u0275\u0275conditional(card_r1.sub ? 8 : -1);
  }
}
function EmployeeDashboardComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 3);
    \u0275\u0275repeaterCreate(1, EmployeeDashboardComponent_Conditional_6_For_2_Template, 9, 4, "div", 4, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "section", 5)(4, "div", 6)(5, "div", 7)(6, "div", 8)(7, "h2", 9);
    \u0275\u0275text(8, "Attendance Trend");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 10);
    \u0275\u0275text(10, "Last 8 weeks");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(11, "app-line-chart", 11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 6)(13, "div", 7)(14, "div", 8)(15, "h2", 9);
    \u0275\u0275text(16, "Tasks Completed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 12);
    \u0275\u0275text(18, "Per week");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(19, "app-bar-chart", 13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "section", 14)(21, "h2", 15);
    \u0275\u0275text(22, "Activity Summary");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 16)(24, "div", 17)(25, "div", 18)(26, "div", 19);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 20);
    \u0275\u0275text(29, "Days Present");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 21);
    \u0275\u0275element(31, "div", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 23);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "div", 17)(35, "div", 18)(36, "div", 24);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "div", 20);
    \u0275\u0275text(39, "Tasks Done");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 21);
    \u0275\u0275element(41, "div", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 23);
    \u0275\u0275text(43);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(44, "div", 17)(45, "div", 18)(46, "div", 26);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "div", 20);
    \u0275\u0275text(49, "Leave Balance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "div", 21);
    \u0275\u0275element(51, "div", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "div", 23);
    \u0275\u0275text(53, "of 30 days total");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const a_r2 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.kpiCards(a_r2.summary));
    \u0275\u0275advance(10);
    \u0275\u0275property("dataPoints", a_r2.attendanceTrend);
    \u0275\u0275advance(8);
    \u0275\u0275property("dataPoints", a_r2.taskCompletionTrend);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(a_r2.summary.totalPresent);
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", ctx_r2.attendanceRate(a_r2.summary) + "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r2.attendanceRate(a_r2.summary), "% this month");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(a_r2.summary.tasksCompleted);
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", ctx_r2.taskRate(a_r2.summary) + "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", a_r2.summary.tasksPending, " pending");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(a_r2.summary.leaveBalance);
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", a_r2.summary.leaveBalance / 30 * 100 + "%");
  }
}
function EmployeeDashboardComponent_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 34);
    \u0275\u0275element(2, "span", 35)(3, "span", 36);
    \u0275\u0275elementEnd()();
  }
}
function EmployeeDashboardComponent_Conditional_7_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 34);
    \u0275\u0275element(2, "span", 37)(3, "div", 38);
    \u0275\u0275elementEnd()();
  }
}
function EmployeeDashboardComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 33);
    \u0275\u0275repeaterCreate(1, EmployeeDashboardComponent_Conditional_7_For_2_Template, 4, 0, "div", 4, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 16);
    \u0275\u0275repeaterCreate(4, EmployeeDashboardComponent_Conditional_7_For_5_Template, 4, 0, "div", 6, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c0));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(\u0275\u0275pureFunction0(1, _c1));
  }
}
var EmployeeDashboardComponent = class _EmployeeDashboardComponent {
  analyticsService = inject(AnalyticsService);
  authState = inject(AuthStateService);
  today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  analytics = toSignal(this.analyticsService.employeeAnalytics());
  firstName = computed(() => this.authState.user()?.fullName.split(" ")[0] ?? "there", ...ngDevMode ? [{ debugName: "firstName" }] : (
    /* istanbul ignore next */
    []
  ));
  kpiCards(summary) {
    return [
      { icon: "\u2705", label: "Days Present", value: summary.totalPresent, sub: `${summary.totalAbsent} absent` },
      { icon: "\u{1F4CB}", label: "Tasks Completed", value: summary.tasksCompleted, sub: `${summary.tasksPending} pending` },
      { icon: "\u{1F3D6}\uFE0F", label: "Leave Balance", value: summary.leaveBalance, sub: "days remaining" },
      { icon: "\u{1F4C8}", label: "Attendance Rate", value: this.attendanceRate(summary) + "%", sub: "this month" }
    ];
  }
  attendanceRate(summary) {
    const total = summary.totalPresent + summary.totalAbsent;
    return total ? Math.round(summary.totalPresent / total * 100) : 0;
  }
  taskRate(summary) {
    const total = summary.tasksCompleted + summary.tasksPending;
    return total ? Math.round(summary.tasksCompleted / total * 100) : 0;
  }
  static \u0275fac = function EmployeeDashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmployeeDashboardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmployeeDashboardComponent, selectors: [["app-employee-dashboard"]], decls: 8, vars: 3, consts: [[1, "d-flex", "align-items-center", "justify-content-between", "mb-4"], [1, "h3", "mb-1"], [1, "text-body-secondary", "mb-0", "small"], ["aria-label", "Personal metrics", 1, "row", "g-3", "mb-4"], [1, "col-6", "col-xl-3"], [1, "row", "g-3", "mb-3"], [1, "col-lg-6"], [1, "surface", "p-3", "h-100"], [1, "d-flex", "justify-content-between", "align-items-center", "mb-3"], [1, "h6", "fw-semibold", "mb-0"], [1, "badge", "text-bg-success"], ["label", "Attendance %", "color", "#198754", "yLabel", "%", "height", "220px", 3, "dataPoints"], [1, "badge", "text-bg-primary"], ["label", "Tasks", "yLabel", "Tasks", "height", "220px", 3, "dataPoints"], [1, "surface", "p-3"], [1, "h6", "fw-semibold", "mb-3"], [1, "row", "g-3"], [1, "col-md-4"], [1, "p-3", "rounded", "border", "text-center"], [1, "fs-2", "fw-bold", "text-success"], [1, "text-body-secondary", "small"], [1, "progress", "mt-2", 2, "height", "6px"], [1, "progress-bar", "bg-success"], [1, "text-body-secondary", "small", "mt-1"], [1, "fs-2", "fw-bold", "text-primary"], [1, "progress-bar", "bg-primary"], [1, "fs-2", "fw-bold", "text-warning"], [1, "progress-bar", "bg-warning"], [1, "surface", "p-3", "h-100", "d-flex", "flex-column", "gap-1"], [1, "fs-1", "mb-1"], [1, "text-body-secondary", "mb-1", "small"], [1, "fs-3", "lh-1"], [1, "text-body-secondary", "small", "mt-auto"], [1, "row", "g-3", "mb-4"], ["aria-hidden", "true", 1, "surface", "p-3", "placeholder-glow"], [1, "placeholder", "col-8", "mb-2", "d-block"], [1, "placeholder", "col-4", "fs-3", "d-block"], [1, "placeholder", "col-4", "mb-3", "d-block"], [2, "height", "220px", "background", "var(--app-border)", "border-radius", "0.5rem", "opacity", ".3"]], template: function EmployeeDashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 2);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(6, EmployeeDashboardComponent_Conditional_6_Template, 54, 13)(7, EmployeeDashboardComponent_Conditional_7_Template, 6, 2);
    }
    if (rf & 2) {
      let tmp_2_0;
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("Welcome back, ", ctx.firstName(), " \u{1F44B}");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.today);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.analytics()) ? 6 : 7, tmp_2_0);
    }
  }, dependencies: [LineChartComponent, BarChartComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmployeeDashboardComponent, [{
    type: Component,
    args: [{
      selector: "app-employee-dashboard",
      standalone: true,
      imports: [LineChartComponent, BarChartComponent],
      template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="h3 mb-1">Welcome back, {{ firstName() }} \u{1F44B}</h1>
        <p class="text-body-secondary mb-0 small">{{ today }}</p>
      </div>
    </div>

    <!-- KPI cards -->
    @if (analytics(); as a) {
      <section class="row g-3 mb-4" aria-label="Personal metrics">
        @for (card of kpiCards(a.summary); track card.label) {
          <div class="col-6 col-xl-3">
            <article class="surface p-3 h-100 d-flex flex-column gap-1">
              <span class="fs-1 mb-1">{{ card.icon }}</span>
              <p class="text-body-secondary mb-1 small">{{ card.label }}</p>
              <strong class="fs-3 lh-1">{{ card.value }}</strong>
              @if (card.sub) {
                <span class="text-body-secondary small mt-auto">{{ card.sub }}</span>
              }
            </article>
          </div>
        }
      </section>

      <!-- Charts -->
      <section class="row g-3 mb-3">
        <!-- Attendance trend (Line) -->
        <div class="col-lg-6">
          <div class="surface p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 fw-semibold mb-0">Attendance Trend</h2>
              <span class="badge text-bg-success">Last 8 weeks</span>
            </div>
            <app-line-chart
              [dataPoints]="a.attendanceTrend"
              label="Attendance %"
              color="#198754"
              yLabel="%"
              height="220px"
            />
          </div>
        </div>

        <!-- Task Completion (Bar) -->
        <div class="col-lg-6">
          <div class="surface p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 fw-semibold mb-0">Tasks Completed</h2>
              <span class="badge text-bg-primary">Per week</span>
            </div>
            <app-bar-chart
              [dataPoints]="a.taskCompletionTrend"
              label="Tasks"
              yLabel="Tasks"
              height="220px"
            />
          </div>
        </div>
      </section>

      <!-- Activity summary -->
      <section class="surface p-3">
        <h2 class="h6 fw-semibold mb-3">Activity Summary</h2>
        <div class="row g-3">
          <div class="col-md-4">
            <div class="p-3 rounded border text-center">
              <div class="fs-2 fw-bold text-success">{{ a.summary.totalPresent }}</div>
              <div class="text-body-secondary small">Days Present</div>
              <div class="progress mt-2" style="height:6px">
                <div class="progress-bar bg-success" [style.width]="attendanceRate(a.summary) + '%'"></div>
              </div>
              <div class="text-body-secondary small mt-1">{{ attendanceRate(a.summary) }}% this month</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3 rounded border text-center">
              <div class="fs-2 fw-bold text-primary">{{ a.summary.tasksCompleted }}</div>
              <div class="text-body-secondary small">Tasks Done</div>
              <div class="progress mt-2" style="height:6px">
                <div class="progress-bar bg-primary" [style.width]="taskRate(a.summary) + '%'"></div>
              </div>
              <div class="text-body-secondary small mt-1">{{ a.summary.tasksPending }} pending</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3 rounded border text-center">
              <div class="fs-2 fw-bold text-warning">{{ a.summary.leaveBalance }}</div>
              <div class="text-body-secondary small">Leave Balance</div>
              <div class="progress mt-2" style="height:6px">
                <div class="progress-bar bg-warning" [style.width]="(a.summary.leaveBalance / 30 * 100) + '%'"></div>
              </div>
              <div class="text-body-secondary small mt-1">of 30 days total</div>
            </div>
          </div>
        </div>
      </section>
    } @else {
      <!-- Skeleton loader -->
      <section class="row g-3 mb-4">
        @for (i of [1,2,3,4]; track i) {
          <div class="col-6 col-xl-3">
            <div class="surface p-3 placeholder-glow" aria-hidden="true">
              <span class="placeholder col-8 mb-2 d-block"></span>
              <span class="placeholder col-4 fs-3 d-block"></span>
            </div>
          </div>
        }
      </section>
      <div class="row g-3">
        @for (i of [1,2]; track i) {
          <div class="col-lg-6">
            <div class="surface p-3 placeholder-glow" aria-hidden="true">
              <span class="placeholder col-4 mb-3 d-block"></span>
              <div style="height:220px;background:var(--app-border);border-radius:0.5rem;opacity:.3;"></div>
            </div>
          </div>
        }
      </div>
    }
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmployeeDashboardComponent, { className: "EmployeeDashboardComponent", filePath: "src/app/features/employee/dashboard/employee-dashboard.component.ts", lineNumber: 135 });
})();
export {
  EmployeeDashboardComponent
};
//# sourceMappingURL=chunk-B74TSB5Q.js.map
