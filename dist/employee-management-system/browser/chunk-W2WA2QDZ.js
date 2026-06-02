import {
  AnalyticsService,
  BarChartComponent,
  ChartConfigService,
  LineChartComponent
} from "./chunk-B252WBUG.js";
import {
  BaseChartDirective
} from "./chunk-46HWQF6E.js";
import {
  ThemeService
} from "./chunk-RJ4TKVLL.js";
import {
  toSignal
} from "./chunk-HMEP4754.js";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-WJRWGGLF.js";
import "./chunk-I2TBGIDF.js";
import "./chunk-XBOA52FZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  input,
  map,
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

// src/app/shared/components/charts/doughnut-chart/doughnut-chart.component.ts
var _c0 = () => [];
function DoughnutChartComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "div", 4);
    \u0275\u0275text(2, " Loading chart\u2026 ");
    \u0275\u0275elementEnd();
  }
}
function DoughnutChartComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1, " No data available ");
    \u0275\u0275elementEnd();
  }
}
function DoughnutChartComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "canvas", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("type", "doughnut")("data", ctx_r0.chartData())("options", ctx_r0.options())("plugins", \u0275\u0275pureFunction0(4, _c0));
  }
}
var DoughnutChartComponent = class _DoughnutChartComponent {
  dataPoints = input.required(...ngDevMode ? [{ debugName: "dataPoints" }] : (
    /* istanbul ignore next */
    []
  ));
  height = input("220px", ...ngDevMode ? [{ debugName: "height" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = input(false, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  cfg = inject(ChartConfigService);
  theme = inject(ThemeService);
  options = computed(() => {
    this.theme.theme();
    return this.cfg.doughnutOptions();
  }, ...ngDevMode ? [{ debugName: "options" }] : (
    /* istanbul ignore next */
    []
  ));
  chartData = computed(() => {
    const pts = this.dataPoints();
    const palette = this.cfg.palette;
    return {
      labels: pts.map((p) => p.label),
      datasets: [{
        data: pts.map((p) => p.value),
        backgroundColor: pts.map((p, i) => p.color ?? palette[i % palette.length]),
        hoverOffset: 6,
        borderWidth: 2,
        borderColor: "transparent"
      }]
    };
  }, ...ngDevMode ? [{ debugName: "chartData" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function DoughnutChartComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DoughnutChartComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DoughnutChartComponent, selectors: [["app-doughnut-chart"]], inputs: { dataPoints: [1, "dataPoints"], height: [1, "height"], loading: [1, "loading"] }, decls: 4, vars: 3, consts: [[1, "chart-wrapper", "position-relative"], [1, "d-flex", "align-items-center", "justify-content-center", "h-100", "text-body-secondary"], [1, "d-flex", "align-items-center", "justify-content-center", "h-100", "text-body-secondary", "fst-italic"], ["baseChart", "", "aria-label", "Doughnut chart", 3, "type", "data", "options", "plugins"], ["role", "status", "aria-hidden", "true", 1, "spinner-border", "spinner-border-sm", "me-2"]], template: function DoughnutChartComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, DoughnutChartComponent_Conditional_1_Template, 3, 0, "div", 1)(2, DoughnutChartComponent_Conditional_2_Template, 2, 0, "div", 2)(3, DoughnutChartComponent_Conditional_3_Template, 1, 5, "canvas", 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275styleProp("height", ctx.height());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 1 : ((tmp_1_0 = ctx.chartData().datasets[0]) == null ? null : tmp_1_0.data == null ? null : tmp_1_0.data.length) === 0 ? 2 : 3);
    }
  }, dependencies: [BaseChartDirective], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DoughnutChartComponent, [{
    type: Component,
    args: [{
      selector: "app-doughnut-chart",
      standalone: true,
      imports: [BaseChartDirective],
      template: `
    <div class="chart-wrapper position-relative" [style.height]="height()">
      @if (loading()) {
        <div class="d-flex align-items-center justify-content-center h-100 text-body-secondary">
          <div class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
          Loading chart\u2026
        </div>
      } @else if (chartData().datasets[0]?.data?.length === 0) {
        <div class="d-flex align-items-center justify-content-center h-100 text-body-secondary fst-italic">
          No data available
        </div>
      } @else {
        <canvas baseChart
          [type]="'doughnut'"
          [data]="chartData()"
          [options]="options()"
          [plugins]="[]"
          aria-label="Doughnut chart">
        </canvas>
      }
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, { dataPoints: [{ type: Input, args: [{ isSignal: true, alias: "dataPoints", required: true }] }], height: [{ type: Input, args: [{ isSignal: true, alias: "height", required: false }] }], loading: [{ type: Input, args: [{ isSignal: true, alias: "loading", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DoughnutChartComponent, { className: "DoughnutChartComponent", filePath: "src/app/shared/components/charts/doughnut-chart/doughnut-chart.component.ts", lineNumber: 38 });
})();

// src/app/features/admin/dashboard/admin-dashboard.component.ts
var _c02 = () => [1, 2, 3, 4];
var _c1 = () => [1, 2];
var _forTrack0 = ($index, $item) => $item.label;
function AdminDashboardComponent_Conditional_5_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const card_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(card_r1.trend);
  }
}
function AdminDashboardComponent_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "article", 7)(2, "span", 8);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 9);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong", 10);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, AdminDashboardComponent_Conditional_5_For_2_Conditional_8_Template, 2, 1, "span", 11);
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
    \u0275\u0275conditional(card_r1.trend ? 8 : -1);
  }
}
function AdminDashboardComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 3);
    \u0275\u0275repeaterCreate(1, AdminDashboardComponent_Conditional_5_For_2_Template, 9, 4, "div", 6, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.kpiCards(ctx));
  }
}
function AdminDashboardComponent_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 12);
    \u0275\u0275element(2, "span", 13)(3, "span", 14);
    \u0275\u0275elementEnd()();
  }
}
function AdminDashboardComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 4);
    \u0275\u0275repeaterCreate(1, AdminDashboardComponent_Conditional_6_For_2_Template, 4, 0, "div", 6, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c02));
  }
}
function AdminDashboardComponent_Conditional_7_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 26);
    \u0275\u0275element(1, "span", 41);
    \u0275\u0275elementStart(2, "span", 42);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const dept_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", dept_r3.color);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(dept_r3.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(dept_r3.value);
  }
}
function AdminDashboardComponent_Conditional_7_For_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275element(1, "span", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", s_r4.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", s_r4.label, "\xA0");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r4.value);
  }
}
function AdminDashboardComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 15)(1, "div", 16)(2, "div", 17)(3, "div", 18)(4, "h2", 19);
    \u0275\u0275text(5, "Employee Growth");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 20);
    \u0275\u0275text(7, "Last 6 months");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(8, "app-line-chart", 21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 22)(10, "div", 17)(11, "h2", 23);
    \u0275\u0275text(12, "Department Split");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "app-doughnut-chart", 24);
    \u0275\u0275elementStart(14, "ul", 25);
    \u0275\u0275repeaterCreate(15, AdminDashboardComponent_Conditional_7_For_16_Template, 6, 4, "li", 26, _forTrack0);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(17, "section", 5)(18, "div", 27)(19, "div", 17)(20, "div", 18)(21, "h2", 19);
    \u0275\u0275text(22, "Monthly Activity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 28);
    \u0275\u0275text(24, "Events");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(25, "app-bar-chart", 29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 30)(27, "div", 31)(28, "div", 32)(29, "div", 33)(30, "h2", 23);
    \u0275\u0275text(31, "Employee Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(32, "app-doughnut-chart", 34);
    \u0275\u0275elementStart(33, "div", 35);
    \u0275\u0275repeaterCreate(34, AdminDashboardComponent_Conditional_7_For_35_Template, 5, 4, "span", 36, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(36, "div", 32)(37, "div", 33)(38, "h2", 23);
    \u0275\u0275text(39, "Quick Actions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 37)(41, "a", 38);
    \u0275\u0275text(42, "+ Create Employee");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "a", 39);
    \u0275\u0275text(44, "View Reports");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "a", 40);
    \u0275\u0275text(46, "Audit Logs");
    \u0275\u0275elementEnd()()()()()()();
  }
  if (rf & 2) {
    const a_r5 = ctx;
    \u0275\u0275advance(8);
    \u0275\u0275property("dataPoints", a_r5.employeeGrowth);
    \u0275\u0275advance(5);
    \u0275\u0275property("dataPoints", a_r5.departmentDistribution);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(a_r5.departmentDistribution);
    \u0275\u0275advance(10);
    \u0275\u0275property("dataPoints", a_r5.monthlyActivity);
    \u0275\u0275advance(7);
    \u0275\u0275property("dataPoints", a_r5.statusBreakdown);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(a_r5.statusBreakdown);
  }
}
function AdminDashboardComponent_Conditional_8_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44)(1, "div", 12);
    \u0275\u0275element(2, "span", 45)(3, "div", 46);
    \u0275\u0275elementEnd()();
  }
}
function AdminDashboardComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275repeaterCreate(1, AdminDashboardComponent_Conditional_8_For_2_Template, 4, 0, "div", 44, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c1));
  }
}
var AdminDashboardComponent = class _AdminDashboardComponent {
  route = inject(ActivatedRoute);
  analyticsService = inject(AnalyticsService);
  today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  stats = toSignal(this.route.data.pipe(map((d) => d["stats"])));
  analytics = toSignal(this.analyticsService.adminAnalytics());
  kpiCards(stats) {
    return [
      { icon: "\u{1F465}", label: "Total Employees", value: stats.employees, trend: "+3 this month" },
      { icon: "\u2705", label: "Active Users", value: stats.activeUsers, trend: null },
      { icon: "\u{1F4CB}", label: "Pending Tasks", value: stats.pendingTasks, trend: null },
      { icon: "\u{1F514}", label: "Unread Notifications", value: stats.unreadNotifications, trend: null }
    ];
  }
  static \u0275fac = function AdminDashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminDashboardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminDashboardComponent, selectors: [["app-admin-dashboard"]], decls: 9, vars: 3, consts: [[1, "d-flex", "align-items-center", "justify-content-between", "mb-4"], [1, "h3", "mb-0"], [1, "text-body-secondary", "small"], ["aria-label", "Key metrics", 1, "row", "g-3", "mb-4"], [1, "row", "g-3", "mb-4"], [1, "row", "g-3"], [1, "col-6", "col-xl-3"], [1, "surface", "p-3", "h-100", "d-flex", "flex-column", "gap-1"], [1, "fs-1", "mb-1"], [1, "text-body-secondary", "mb-1", "small"], [1, "fs-3", "lh-1"], [1, "badge", "text-bg-success", "mt-auto", "align-self-start"], ["aria-hidden", "true", 1, "surface", "p-3", "placeholder-glow"], [1, "placeholder", "col-6", "mb-2", "d-block"], [1, "placeholder", "col-4", "fs-3", "d-block"], [1, "row", "g-3", "mb-3"], [1, "col-lg-8"], [1, "surface", "p-3", "h-100"], [1, "d-flex", "justify-content-between", "align-items-center", "mb-3"], [1, "h6", "fw-semibold", "mb-0"], [1, "badge", "text-bg-primary"], ["label", "Headcount", "color", "#0f6cbd", "yLabel", "Employees", "height", "240px", 3, "dataPoints"], [1, "col-lg-4"], [1, "h6", "fw-semibold", "mb-3"], ["height", "240px", 3, "dataPoints"], [1, "list-unstyled", "mt-3", "mb-0", "small"], [1, "d-flex", "align-items-center", "gap-2", "mb-1"], [1, "col-lg-7"], [1, "badge", "text-bg-secondary"], ["label", "Activity events", "yLabel", "Events", "height", "220px", 3, "dataPoints"], [1, "col-lg-5"], [1, "row", "g-3", "h-100"], [1, "col-12"], [1, "surface", "p-3"], ["height", "160px", 3, "dataPoints"], [1, "d-flex", "justify-content-center", "gap-3", "mt-3", "small"], [1, "d-flex", "align-items-center", "gap-1"], [1, "d-grid", "gap-2"], ["routerLink", "/admin/employees/create", 1, "btn", "btn-primary", "btn-sm"], ["routerLink", "/admin/reports", 1, "btn", "btn-outline-primary", "btn-sm"], ["routerLink", "/admin/audit-logs", 1, "btn", "btn-outline-secondary", "btn-sm"], [1, "rounded-circle", "d-inline-block", "flex-shrink-0", 2, "width", "10px", "height", "10px"], [1, "flex-grow-1", "text-body-secondary"], [1, "rounded-circle", "d-inline-block", 2, "width", "8px", "height", "8px"], [1, "col-lg-6"], [1, "placeholder", "col-4", "mb-3", "d-block"], [2, "height", "220px", "background", "var(--app-border)", "border-radius", "0.5rem", "opacity", ".3"]], template: function AdminDashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Admin Dashboard");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "span", 2);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(5, AdminDashboardComponent_Conditional_5_Template, 3, 0, "section", 3)(6, AdminDashboardComponent_Conditional_6_Template, 3, 1, "section", 4);
      \u0275\u0275conditionalCreate(7, AdminDashboardComponent_Conditional_7_Template, 47, 4)(8, AdminDashboardComponent_Conditional_8_Template, 3, 1, "div", 5);
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.today);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_1_0 = ctx.stats()) ? 5 : 6, tmp_1_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_2_0 = ctx.analytics()) ? 7 : 8, tmp_2_0);
    }
  }, dependencies: [RouterLink, LineChartComponent, BarChartComponent, DoughnutChartComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminDashboardComponent, [{
    type: Component,
    args: [{
      selector: "app-admin-dashboard",
      standalone: true,
      imports: [RouterLink, LineChartComponent, BarChartComponent, DoughnutChartComponent],
      template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0">Admin Dashboard</h1>
      <span class="text-body-secondary small">{{ today }}</span>
    </div>

    <!-- KPI cards -->
    @if (stats(); as stats) {
      <section class="row g-3 mb-4" aria-label="Key metrics">
        @for (card of kpiCards(stats); track card.label) {
          <div class="col-6 col-xl-3">
            <article class="surface p-3 h-100 d-flex flex-column gap-1">
              <span class="fs-1 mb-1">{{ card.icon }}</span>
              <p class="text-body-secondary mb-1 small">{{ card.label }}</p>
              <strong class="fs-3 lh-1">{{ card.value }}</strong>
              @if (card.trend) {
                <span class="badge text-bg-success mt-auto align-self-start">{{ card.trend }}</span>
              }
            </article>
          </div>
        }
      </section>
    } @else {
      <!-- KPI skeleton -->
      <section class="row g-3 mb-4">
        @for (i of [1,2,3,4]; track i) {
          <div class="col-6 col-xl-3">
            <div class="surface p-3 placeholder-glow" aria-hidden="true">
              <span class="placeholder col-6 mb-2 d-block"></span>
              <span class="placeholder col-4 fs-3 d-block"></span>
            </div>
          </div>
        }
      </section>
    }

    <!-- Charts row 1 -->
    @if (analytics(); as a) {
      <section class="row g-3 mb-3">
        <!-- Employee Growth (Line) -->
        <div class="col-lg-8">
          <div class="surface p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 fw-semibold mb-0">Employee Growth</h2>
              <span class="badge text-bg-primary">Last 6 months</span>
            </div>
            <app-line-chart
              [dataPoints]="a.employeeGrowth"
              label="Headcount"
              color="#0f6cbd"
              yLabel="Employees"
              height="240px"
            />
          </div>
        </div>

        <!-- Department Distribution (Doughnut) -->
        <div class="col-lg-4">
          <div class="surface p-3 h-100">
            <h2 class="h6 fw-semibold mb-3">Department Split</h2>
            <app-doughnut-chart
              [dataPoints]="a.departmentDistribution"
              height="240px"
            />
            <!-- Legend -->
            <ul class="list-unstyled mt-3 mb-0 small">
              @for (dept of a.departmentDistribution; track dept.label) {
                <li class="d-flex align-items-center gap-2 mb-1">
                  <span class="rounded-circle d-inline-block flex-shrink-0" style="width:10px;height:10px" [style.background]="dept.color"></span>
                  <span class="flex-grow-1 text-body-secondary">{{ dept.label }}</span>
                  <strong>{{ dept.value }}</strong>
                </li>
              }
            </ul>
          </div>
        </div>
      </section>

      <!-- Charts row 2 -->
      <section class="row g-3">
        <!-- Monthly Activity (Bar) -->
        <div class="col-lg-7">
          <div class="surface p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 fw-semibold mb-0">Monthly Activity</h2>
              <span class="badge text-bg-secondary">Events</span>
            </div>
            <app-bar-chart
              [dataPoints]="a.monthlyActivity"
              label="Activity events"
              yLabel="Events"
              height="220px"
            />
          </div>
        </div>

        <!-- Status Breakdown (Doughnut) + Quick Actions -->
        <div class="col-lg-5">
          <div class="row g-3 h-100">
            <div class="col-12">
              <div class="surface p-3">
                <h2 class="h6 fw-semibold mb-3">Employee Status</h2>
                <app-doughnut-chart
                  [dataPoints]="a.statusBreakdown"
                  height="160px"
                />
                <div class="d-flex justify-content-center gap-3 mt-3 small">
                  @for (s of a.statusBreakdown; track s.label) {
                    <span class="d-flex align-items-center gap-1">
                      <span class="rounded-circle d-inline-block" style="width:8px;height:8px" [style.background]="s.color"></span>
                      {{ s.label }}&nbsp;<strong>{{ s.value }}</strong>
                    </span>
                  }
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="surface p-3">
                <h2 class="h6 fw-semibold mb-3">Quick Actions</h2>
                <div class="d-grid gap-2">
                  <a class="btn btn-primary btn-sm" routerLink="/admin/employees/create">+ Create Employee</a>
                  <a class="btn btn-outline-primary btn-sm" routerLink="/admin/reports">View Reports</a>
                  <a class="btn btn-outline-secondary btn-sm" routerLink="/admin/audit-logs">Audit Logs</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    } @else {
      <!-- Charts skeleton -->
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminDashboardComponent, { className: "AdminDashboardComponent", filePath: "src/app/features/admin/dashboard/admin-dashboard.component.ts", lineNumber: 160 });
})();
export {
  AdminDashboardComponent
};
//# sourceMappingURL=chunk-W2WA2QDZ.js.map
