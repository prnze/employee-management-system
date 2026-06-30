import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { EntropyService } from '../../services/entropy.service';

@Component({
  selector: 'app-passx-stats',
  standalone: true,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent {
  @Input({ required: true }) password = '';
  @Input({ required: true }) entropy = 0;
  @Input({ required: true }) poolSize = 0;

  private readonly entropyService = inject(EntropyService);

  strength() {
    return this.entropyService.strengthLabel(this.entropy);
  }

  crackTime(): string {
    return this.entropyService.crackTime(this.entropy);
  }

  distributionBars(): { key: string; value: number }[] {
    const dist = this.entropyService.charDistribution(this.password);
    return [
      { key: 'A-Z', value: dist.upper },
      { key: 'a-z', value: dist.lower },
      { key: '0-9', value: dist.number },
      { key: '#@!', value: dist.symbol }
    ];
  }

  percentage(value: number): number {
    return (value / Math.max(1, this.password.length)) * 100;
  }
}
