import { effect, inject, Injectable } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ThemeService } from '@core/services/theme.service';

type FontSpec = { size?: number; weight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number };

/** Central chart configuration factory — produces Chart.js options consistent with the app theme. */
@Injectable({ providedIn: 'root' })
export class ChartConfigService {
  private readonly theme = inject(ThemeService);

  // Reactive color palette that updates when dark mode is toggled
  private get textColor(): string {
    return this.theme.theme() === 'dark' ? '#eef2f7' : '#172033';
  }

  private get gridColor(): string {
    return this.theme.theme() === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  }

  private get tooltipBg(): string {
    return this.theme.theme() === 'dark' ? '#1e2d42' : '#ffffff';
  }

  /** Shared options base applied to all chart types. */
  private baseOptions<T extends 'line' | 'bar' | 'doughnut'>(
    type: T
  ): ChartConfiguration<T>['options'] {
    const text = this.textColor;
    const grid = this.gridColor;
    const tooltipBg = this.tooltipBg;

    const fontSpec: FontSpec = { size: 12 };

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: {
          display: type === 'doughnut',
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
          titleFont: { size: 12, weight: 'bold' } as FontSpec,
          bodyFont: fontSpec
        }
      }
    } as ChartConfiguration<T>['options'];
  }

  /** Line chart options. */
  lineOptions(yLabel = 'Value'): ChartOptions<'line'> {
    const text = this.textColor;
    const grid = this.gridColor;
    const fontSpec: FontSpec = { size: 11 };
    return {
      ...this.baseOptions('line'),
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
    } as ChartOptions<'line'>;
  }

  /** Bar chart options. */
  barOptions(yLabel = 'Value'): ChartOptions<'bar'> {
    const text = this.textColor;
    const grid = this.gridColor;
    const fontSpec: FontSpec = { size: 11 };
    return {
      ...this.baseOptions('bar'),
      scales: {
        x: {
          grid: { color: 'transparent' },
          ticks: { color: text, font: fontSpec }
        },
        y: {
          beginAtZero: true,
          grid: { color: grid },
          ticks: { color: text, font: fontSpec },
          title: { display: !!yLabel, text: yLabel, color: text, font: fontSpec }
        }
      }
    } as ChartOptions<'bar'>;
  }

  /** Doughnut chart options. */
  doughnutOptions(): ChartOptions<'doughnut'> {
    return {
      ...this.baseOptions('doughnut'),
      cutout: '65%'
    } as ChartOptions<'doughnut'>;
  }

  /** Standard brand-consistent dataset colors. */
  readonly palette = [
    '#0f6cbd', '#198754', '#fd7e14', '#6f42c1', '#d63384',
    '#0dcaf0', '#ffc107', '#20c997', '#6610f2', '#dc3545'
  ] as const;

  /** Build a semi-transparent fill color from a hex. */
  fillColor(hex: string, alpha = 0.15): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
}
