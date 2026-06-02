import {
  ChangeDetectionStrategy, Component, computed, inject, input
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import { MonthlyDataPoint } from '@core/models/analytics.models';
import { ChartConfigService } from '@core/services/chart-config.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-bar-chart',
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
})
export class BarChartComponent {
  readonly dataPoints = input.required<MonthlyDataPoint[]>();
  readonly label      = input<string>('');
  readonly colors     = input<string[]>([]);
  readonly yLabel     = input<string>('');
  readonly height     = input<string>('220px');
  readonly loading    = input<boolean>(false);

  private readonly cfg   = inject(ChartConfigService);
  private readonly theme = inject(ThemeService);

  readonly options = computed<ChartConfiguration<'bar'>['options']>(() => {
    this.theme.theme();
    return this.cfg.barOptions(this.yLabel());
  });

  readonly chartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const pts    = this.dataPoints();
    const cols   = this.colors();
    const palette = this.cfg.palette;
    const backgroundColors = pts.map((_, i) => cols[i] ?? palette[i % palette.length]);
    const dataset: ChartDataset<'bar'> = {
      label: this.label(),
      data: pts.map((p) => p.value),
      backgroundColor: backgroundColors,
      borderColor: backgroundColors,
      borderRadius: 6,
      borderSkipped: false
    };
    return { labels: pts.map((p) => p.label), datasets: [dataset] };
  });
}
