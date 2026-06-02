import {
  ChangeDetectionStrategy, Component, computed, inject, input
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DistributionPoint } from '@core/models/analytics.models';
import { ChartConfigService } from '@core/services/chart-config.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="chart-wrapper position-relative" [style.height]="height()">
      @if (loading()) {
        <div class="d-flex align-items-center justify-content-center h-100 text-body-secondary">
          <div class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
          Loading chart…
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
})
export class DoughnutChartComponent {
  readonly dataPoints = input.required<DistributionPoint[]>();
  readonly height     = input<string>('220px');
  readonly loading    = input<boolean>(false);

  private readonly cfg   = inject(ChartConfigService);
  private readonly theme = inject(ThemeService);

  readonly options = computed<ChartConfiguration<'doughnut'>['options']>(() => {
    this.theme.theme();
    return this.cfg.doughnutOptions();
  });

  readonly chartData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const pts = this.dataPoints();
    const palette = this.cfg.palette;
    return {
      labels: pts.map((p) => p.label),
      datasets: [{
        data: pts.map((p) => p.value),
        backgroundColor: pts.map((p, i) => p.color ?? palette[i % palette.length]),
        hoverOffset: 6,
        borderWidth: 2,
        borderColor: 'transparent'
      }]
    };
  });
}
