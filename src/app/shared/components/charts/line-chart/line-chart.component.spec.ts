import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { TranslateModule } from '@ngx-translate/core';
import { LineChartComponent } from './line-chart.component';
import { MonthlyDataPoint } from '@core/models/analytics.models';

const SAMPLE_POINTS: MonthlyDataPoint[] = [
  { label: 'Jan', value: 10 },
  { label: 'Feb', value: 15 },
  { label: 'Mar', value: 12 }
];

describe('LineChartComponent', () => {
  let fixture: ComponentFixture<LineChartComponent>;
  let component: LineChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent, TranslateModule.forRoot()],
      providers: [provideCharts(withDefaultRegisterables())]
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentRef.setInput('dataPoints', SAMPLE_POINTS) as unknown as LineChartComponent;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should derive chart data from dataPoints input', () => {
    fixture.componentRef.setInput('dataPoints', SAMPLE_POINTS);
    fixture.detectChanges();
    const data = component.chartData();
    expect(data.labels).toEqual(['Jan', 'Feb', 'Mar']);
    expect(data.datasets[0].data).toEqual([10, 15, 12]);
  });

  it('should apply the color input to the dataset', () => {
    fixture.componentRef.setInput('dataPoints', SAMPLE_POINTS);
    fixture.componentRef.setInput('color', '#ff0000');
    fixture.detectChanges();
    expect(component.chartData().datasets[0].borderColor).toBe('#ff0000');
  });

  it('should show empty state when dataPoints is empty', () => {
    fixture.componentRef.setInput('dataPoints', []);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('COMMON_NO_DATA');
  });

  it('should show loading state when loading is true', () => {
    fixture.componentRef.setInput('dataPoints', SAMPLE_POINTS);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('CHART_LOADING');
  });
});
