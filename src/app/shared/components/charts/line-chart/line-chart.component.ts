import {
  ChangeDetectionStrategy, Component, computed, effect, inject, input, signal
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import { MonthlyDataPoint } from '@core/models/analytics.models';
import { ChartConfigService } from '@core/services/chart-config.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-line-chart',
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
})
export class LineChartComponent {
  readonly dataPoints = input.required<MonthlyDataPoint[]>();
  readonly label     = input<string>('');
  readonly color     = input<string>('#0f6cbd');
  readonly yLabel    = input<string>('');
  readonly height    = input<string>('220px');
  readonly loading   = input<boolean>(false);
  readonly fill      = input<boolean>(true);

  private readonly cfg   = inject(ChartConfigService);
  private readonly theme = inject(ThemeService);

  /** Re-derive options whenever the theme changes. */
  readonly options = computed<ChartConfiguration<'line'>['options']>(() => {
    this.theme.theme(); // reactive dependency
    return this.cfg.lineOptions(this.yLabel());
  });

  readonly chartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const pts  = this.dataPoints();
    const col  = this.color();
    const fill = this.fill();
    const dataset: ChartDataset<'line'> = {
      label: this.label(),
      data: pts.map((p) => p.value),
      borderColor: col,
      backgroundColor: fill ? this.cfg.fillColor(col) : 'transparent',
      pointBackgroundColor: col,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: fill
    };
    return { labels: pts.map((p) => p.label), datasets: [dataset] };
  });
}
