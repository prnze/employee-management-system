import {
  ChangeDetectionStrategy,
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-BJMLPQUZ.js";
import "./chunk-WDMUDEB6.js";

// src/app/features/employee/tasks/tasks.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function TasksComponent_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 2)(1, "h2", 3)(2, "button", 4);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(4, "div", 5)(5, "div", 6);
    \u0275\u0275text(6);
    \u0275\u0275domElementStart(7, "span", 7);
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd()()()();
  }
  if (rf & 2) {
    const task_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-bs-target", "#task" + task_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(task_r1.title);
    \u0275\u0275advance();
    \u0275\u0275domProperty("id", "task" + task_r1.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", task_r1.description, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(task_r1.status);
  }
}
var TasksComponent = class _TasksComponent {
  tasks = [
    { id: "1", title: "Complete self review", description: "Submit quarterly self review.", status: "Open" },
    { id: "2", title: "Update tax declaration", description: "Review finance portal declaration.", status: "Pending" }
  ];
  static \u0275fac = function TasksComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TasksComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TasksComponent, selectors: [["app-tasks"]], decls: 5, vars: 0, consts: [[1, "h3", "mb-3"], ["id", "tasksAccordion", 1, "accordion"], [1, "accordion-item"], [1, "accordion-header"], ["type", "button", "data-bs-toggle", "collapse", 1, "accordion-button", "collapsed"], ["data-bs-parent", "#tasksAccordion", 1, "accordion-collapse", "collapse", 3, "id"], [1, "accordion-body"], [1, "badge", "text-bg-secondary"]], template: function TasksComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "h1", 0);
      \u0275\u0275text(1, "Tasks");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "div", 1);
      \u0275\u0275repeaterCreate(3, TasksComponent_For_4_Template, 9, 5, "div", 2, _forTrack0);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.tasks);
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TasksComponent, [{
    type: Component,
    args: [{
      selector: "app-tasks",
      standalone: true,
      template: `
    <h1 class="h3 mb-3">Tasks</h1>
    <div class="accordion" id="tasksAccordion">
      @for (task of tasks; track task.id) {
        <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" [attr.data-bs-target]="'#task' + task.id">{{ task.title }}</button></h2><div class="accordion-collapse collapse" [id]="'task' + task.id" data-bs-parent="#tasksAccordion"><div class="accordion-body">{{ task.description }} <span class="badge text-bg-secondary">{{ task.status }}</span></div></div></div>
      }
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TasksComponent, { className: "TasksComponent", filePath: "src/app/features/employee/tasks/tasks.component.ts", lineNumber: 16 });
})();
export {
  TasksComponent
};
//# sourceMappingURL=chunk-A56LYW5S.js.map
