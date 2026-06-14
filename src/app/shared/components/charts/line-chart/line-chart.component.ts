import {
  ChangeDetectionStrategy, Component, computed, effect, inject, input, signal
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { TranslatePipe } from '@ngx-translate/core';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import { MonthlyDataPoint } from '@core/models/analytics.models';
import { ChartConfigService } from '@core/services/chart-config.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslatePipe],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
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
