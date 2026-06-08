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
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
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
