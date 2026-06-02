import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  template: `
    <h1 class="h3 mb-3">Reports</h1>
    <section class="row g-3">
      @for (report of ['Headcount', 'Attendance', 'Payroll', 'Attrition']; track report) {
        <article class="col-md-6 col-xl-3"><div class="surface p-3"><h2 class="h5">{{ report }}</h2><p class="text-body-secondary">Exportable business report with mock data.</p><button class="btn btn-outline-primary">Generate</button></div></article>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {}
