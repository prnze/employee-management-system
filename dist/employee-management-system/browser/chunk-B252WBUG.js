import {
  BaseChartDirective
} from "./chunk-46HWQF6E.js";
import {
  ThemeService
} from "./chunk-RJ4TKVLL.js";
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  Input,
  computed,
  delay,
  inject,
  input,
  of,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵstyleProp,
  ɵɵtext
} from "./chunk-BJMLPQUZ.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/core/services/analytics.service.ts
function lastMonthLabels(n) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = /* @__PURE__ */ new Date();
  return Array.from({ length: n }, (_, i) => months[(now.getMonth() - (n - 1 - i) + 12) % 12]);
}
function lastWeekLabels(n) {
  return Array.from({ length: n }, (_, i) => `W${i + 1}`);
}
var AnalyticsService = class _AnalyticsService {
  adminAnalytics() {
    const labels = lastMonthLabels(6);
    return of({
      employeeGrowth: [
        { label: labels[0], value: 28 },
        { label: labels[1], value: 31 },
        { label: labels[2], value: 35 },
        { label: labels[3], value: 38 },
        { label: labels[4], value: 41 },
        { label: labels[5], value: 44 }
      ],
      departmentDistribution: [
        { label: "Engineering", value: 18, color: "#0f6cbd" },
        { label: "Product", value: 8, color: "#198754" },
        { label: "People", value: 6, color: "#fd7e14" },
        { label: "Finance", value: 7, color: "#6f42c1" },
        { label: "Design", value: 5, color: "#d63384" }
      ],
      monthlyActivity: [
        { label: labels[0], value: 142 },
        { label: labels[1], value: 178 },
        { label: labels[2], value: 165 },
        { label: labels[3], value: 210 },
        { label: labels[4], value: 198 },
        { label: labels[5], value: 231 }
      ],
      statusBreakdown: [
        { label: "Active", value: 38, color: "#198754" },
        { label: "On Leave", value: 4, color: "#fd7e14" },
        { label: "Inactive", value: 2, color: "#dc3545" }
      ]
    }).pipe(delay(250));
  }
  employeeAnalytics() {
    const weeks = lastWeekLabels(8);
    return of({
      attendanceTrend: [
        { label: weeks[0], value: 100 },
        { label: weeks[1], value: 80 },
        { label: weeks[2], value: 100 },
        { label: weeks[3], value: 60 },
        { label: weeks[4], value: 100 },
        { label: weeks[5], value: 100 },
        { label: weeks[6], value: 80 },
        { label: weeks[7], value: 100 }
      ],
      taskCompletionTrend: [
        { label: weeks[0], value: 3 },
        { label: weeks[1], value: 5 },
        { label: weeks[2], value: 2 },
        { label: weeks[3], value: 7 },
        { label: weeks[4], value: 4 },
        { label: weeks[5], value: 6 },
        { label: weeks[6], value: 3 },
        { label: weeks[7], value: 8 }
      ],
      summary: {
        totalPresent: 19,
        totalAbsent: 3,
        tasksCompleted: 38,
        tasksPending: 5,
        leaveBalance: 12
      }
    }).pipe(delay(200));
  }
  static \u0275fac = function AnalyticsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnalyticsService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AnalyticsService, factory: _AnalyticsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnalyticsService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/services/chart-config.service.ts
var ChartConfigService = class _ChartConfigService {
  theme = inject(ThemeService);
  // Reactive color palette that updates when dark mode is toggled
  get textColor() {
    return this.theme.theme() === "dark" ? "#eef2f7" : "#172033";
  }
  get gridColor() {
    return this.theme.theme() === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  }
  get tooltipBg() {
    return this.theme.theme() === "dark" ? "#1e2d42" : "#ffffff";
  }
  /** Shared options base applied to all chart types. */
  baseOptions(type) {
    const text = this.textColor;
    const grid = this.gridColor;
    const tooltipBg = this.tooltipBg;
    const fontSpec = { size: 12 };
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: {
          display: type === "doughnut",
          labels: { color: text, font: fontSpec, padding: 16, usePointStyle: true }
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: text,
          bodyColor: text,
          borderColor: grid,
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 12, weight: "bold" },
          bodyFont: fontSpec
        }
      }
    };
  }
  /** Line chart options. */
  lineOptions(yLabel = "Value") {
    const text = this.textColor;
    const grid = this.gridColor;
    const fontSpec = { size: 11 };
    return __spreadProps(__spreadValues({}, this.baseOptions("line")), {
      scales: {
        x: {
          grid: { color: grid },
          ticks: { color: text, font: fontSpec }
        },
        y: {
          beginAtZero: true,
          grid: { color: grid },
          ticks: { color: text, font: fontSpec },
          title: { display: !!yLabel, text: yLabel, color: text, font: fontSpec }
        }
      }
    });
  }
  /** Bar chart options. */
  barOptions(yLabel = "Value") {
    const text = this.textColor;
    const grid = this.gridColor;
    const fontSpec = { size: 11 };
    return __spreadProps(__spreadValues({}, this.baseOptions("bar")), {
      scales: {
        x: {
          grid: { color: "transparent" },
          ticks: { color: text, font: fontSpec }
        },
        y: {
          beginAtZero: true,
          grid: { color: grid },
          ticks: { color: text, font: fontSpec },
          title: { display: !!yLabel, text: yLabel, color: text, font: fontSpec }
        }
      }
    });
  }
  /** Doughnut chart options. */
  doughnutOptions() {
    return __spreadProps(__spreadValues({}, this.baseOptions("doughnut")), {
      cutout: "65%"
    });
  }
  /** Standard brand-consistent dataset colors. */
  palette = [
    "#0f6cbd",
    "#198754",
    "#fd7e14",
    "#6f42c1",
    "#d63384",
    "#0dcaf0",
    "#ffc107",
    "#20c997",
    "#6610f2",
    "#dc3545"
  ];
  /** Build a semi-transparent fill color from a hex. */
  fillColor(hex, alpha = 0.15) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  static \u0275fac = function ChartConfigService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChartConfigService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ChartConfigService, factory: _ChartConfigService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChartConfigService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/shared/components/charts/line-chart/line-chart.component.ts
var _c0 = () => [];
function LineChartComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "div", 4);
    \u0275\u0275text(2, " Loading chart\u2026 ");
    \u0275\u0275elementEnd();
  }
}
function LineChartComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1, " No data available ");
    \u0275\u0275elementEnd();
  }
}
function LineChartComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "canvas", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("type", "line")("data", ctx_r0.chartData())("options", ctx_r0.options())("plugins", \u0275\u0275pureFunction0(4, _c0));
  }
}
var LineChartComponent = class _LineChartComponent {
  dataPoints = input.required(...ngDevMode ? [{ debugName: "dataPoints" }] : (
    /* istanbul ignore next */
    []
  ));
  label = input("", ...ngDevMode ? [{ debugName: "label" }] : (
    /* istanbul ignore next */
    []
  ));
  color = input("#0f6cbd", ...ngDevMode ? [{ debugName: "color" }] : (
    /* istanbul ignore next */
    []
  ));
  yLabel = input("", ...ngDevMode ? [{ debugName: "yLabel" }] : (
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
  fill = input(true, ...ngDevMode ? [{ debugName: "fill" }] : (
    /* istanbul ignore next */
    []
  ));
  cfg = inject(ChartConfigService);
  theme = inject(ThemeService);
  /** Re-derive options whenever the theme changes. */
  options = computed(() => {
    this.theme.theme();
    return this.cfg.lineOptions(this.yLabel());
  }, ...ngDevMode ? [{ debugName: "options" }] : (
    /* istanbul ignore next */
    []
  ));
  chartData = computed(() => {
    const pts = this.dataPoints();
    const col = this.color();
    const fill = this.fill();
    const dataset = {
      label: this.label(),
      data: pts.map((p) => p.value),
      borderColor: col,
      backgroundColor: fill ? this.cfg.fillColor(col) : "transparent",
      pointBackgroundColor: col,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill
    };
    return { labels: pts.map((p) => p.label), datasets: [dataset] };
  }, ...ngDevMode ? [{ debugName: "chartData" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function LineChartComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LineChartComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LineChartComponent, selectors: [["app-line-chart"]], inputs: { dataPoints: [1, "dataPoints"], label: [1, "label"], color: [1, "color"], yLabel: [1, "yLabel"], height: [1, "height"], loading: [1, "loading"], fill: [1, "fill"] }, decls: 4, vars: 3, consts: [[1, "chart-wrapper", "position-relative"], [1, "d-flex", "align-items-center", "justify-content-center", "h-100", "text-body-secondary"], [1, "d-flex", "align-items-center", "justify-content-center", "h-100", "text-body-secondary", "fst-italic"], ["baseChart", "", "aria-label", "Line chart", 3, "type", "data", "options", "plugins"], ["role", "status", "aria-hidden", "true", 1, "spinner-border", "spinner-border-sm", "me-2"]], template: function LineChartComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, LineChartComponent_Conditional_1_Template, 3, 0, "div", 1)(2, LineChartComponent_Conditional_2_Template, 2, 0, "div", 2)(3, LineChartComponent_Conditional_3_Template, 1, 5, "canvas", 3);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LineChartComponent, [{
    type: Component,
    args: [{
      selector: "app-line-chart",
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
          [type]="'line'"
          [data]="chartData()"
          [options]="options()"
          [plugins]="[]"
          aria-label="Line chart">
        </canvas>
      }
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, { dataPoints: [{ type: Input, args: [{ isSignal: true, alias: "dataPoints", required: true }] }], label: [{ type: Input, args: [{ isSignal: true, alias: "label", required: false }] }], color: [{ type: Input, args: [{ isSignal: true, alias: "color", required: false }] }], yLabel: [{ type: Input, args: [{ isSignal: true, alias: "yLabel", required: false }] }], height: [{ type: Input, args: [{ isSignal: true, alias: "height", required: false }] }], loading: [{ type: Input, args: [{ isSignal: true, alias: "loading", required: false }] }], fill: [{ type: Input, args: [{ isSignal: true, alias: "fill", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LineChartComponent, { className: "LineChartComponent", filePath: "src/app/shared/components/charts/line-chart/line-chart.component.ts", lineNumber: 38 });
})();

// src/app/shared/components/charts/bar-chart/bar-chart.component.ts
var _c02 = () => [];
function BarChartComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "div", 4);
    \u0275\u0275text(2, " Loading chart\u2026 ");
    \u0275\u0275elementEnd();
  }
}
function BarChartComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1, " No data available ");
    \u0275\u0275elementEnd();
  }
}
function BarChartComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "canvas", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("type", "bar")("data", ctx_r0.chartData())("options", ctx_r0.options())("plugins", \u0275\u0275pureFunction0(4, _c02));
  }
}
var BarChartComponent = class _BarChartComponent {
  dataPoints = input.required(...ngDevMode ? [{ debugName: "dataPoints" }] : (
    /* istanbul ignore next */
    []
  ));
  label = input("", ...ngDevMode ? [{ debugName: "label" }] : (
    /* istanbul ignore next */
    []
  ));
  colors = input([], ...ngDevMode ? [{ debugName: "colors" }] : (
    /* istanbul ignore next */
    []
  ));
  yLabel = input("", ...ngDevMode ? [{ debugName: "yLabel" }] : (
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
    return this.cfg.barOptions(this.yLabel());
  }, ...ngDevMode ? [{ debugName: "options" }] : (
    /* istanbul ignore next */
    []
  ));
  chartData = computed(() => {
    const pts = this.dataPoints();
    const cols = this.colors();
    const palette = this.cfg.palette;
    const backgroundColors = pts.map((_, i) => cols[i] ?? palette[i % palette.length]);
    const dataset = {
      label: this.label(),
      data: pts.map((p) => p.value),
      backgroundColor: backgroundColors,
      borderColor: backgroundColors,
      borderRadius: 6,
      borderSkipped: false
    };
    return { labels: pts.map((p) => p.label), datasets: [dataset] };
  }, ...ngDevMode ? [{ debugName: "chartData" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function BarChartComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BarChartComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BarChartComponent, selectors: [["app-bar-chart"]], inputs: { dataPoints: [1, "dataPoints"], label: [1, "label"], colors: [1, "colors"], yLabel: [1, "yLabel"], height: [1, "height"], loading: [1, "loading"] }, decls: 4, vars: 3, consts: [[1, "chart-wrapper", "position-relative"], [1, "d-flex", "align-items-center", "justify-content-center", "h-100", "text-body-secondary"], [1, "d-flex", "align-items-center", "justify-content-center", "h-100", "text-body-secondary", "fst-italic"], ["baseChart", "", "aria-label", "Bar chart", 3, "type", "data", "options", "plugins"], ["role", "status", "aria-hidden", "true", 1, "spinner-border", "spinner-border-sm", "me-2"]], template: function BarChartComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, BarChartComponent_Conditional_1_Template, 3, 0, "div", 1)(2, BarChartComponent_Conditional_2_Template, 2, 0, "div", 2)(3, BarChartComponent_Conditional_3_Template, 1, 5, "canvas", 3);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BarChartComponent, [{
    type: Component,
    args: [{
      selector: "app-bar-chart",
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
          [type]="'bar'"
          [data]="chartData()"
          [options]="options()"
          [plugins]="[]"
          aria-label="Bar chart">
        </canvas>
      }
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, { dataPoints: [{ type: Input, args: [{ isSignal: true, alias: "dataPoints", required: true }] }], label: [{ type: Input, args: [{ isSignal: true, alias: "label", required: false }] }], colors: [{ type: Input, args: [{ isSignal: true, alias: "colors", required: false }] }], yLabel: [{ type: Input, args: [{ isSignal: true, alias: "yLabel", required: false }] }], height: [{ type: Input, args: [{ isSignal: true, alias: "height", required: false }] }], loading: [{ type: Input, args: [{ isSignal: true, alias: "loading", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BarChartComponent, { className: "BarChartComponent", filePath: "src/app/shared/components/charts/bar-chart/bar-chart.component.ts", lineNumber: 38 });
})();

export {
  AnalyticsService,
  ChartConfigService,
  LineChartComponent,
  BarChartComponent
};
//# sourceMappingURL=chunk-B252WBUG.js.map
