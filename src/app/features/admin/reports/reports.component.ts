import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const REPORT_NAMES = ['REPORTS_HEADCOUNT', 'REPORTS_ATTENDANCE', 'REPORTS_PAYROLL', 'REPORTS_ATTRITION'] as const;

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <h1 class="h3 mb-3">{{ 'REPORTS_TITLE' | translate }}</h1>
    <section class="row g-3">
      @for (key of reportKeys; track key) {
        <article class="col-md-6 col-xl-3">
          <div class="surface p-3">
            <h2 class="h5">{{ key | translate }}</h2>
            <p class="text-body-secondary">{{ 'REPORTS_MOCK_DESC' | translate }}</p>
            <button class="btn btn-outline-primary">{{ 'REPORTS_GENERATE' | translate }}</button>
          </div>
        </article>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {
  readonly reportKeys = REPORT_NAMES;
}
