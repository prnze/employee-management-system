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
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.scss',
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
