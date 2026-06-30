import { Injectable } from '@angular/core';
import { CharacterDistribution, StrengthResult } from '../models/passx.models';

@Injectable({ providedIn: 'root' })
export class EntropyService {
  entropy(password: string, poolSize: number): number {
    if (!password || !poolSize) {
      return 0;
    }

    return Number((password.length * Math.log2(poolSize)).toFixed(1));
  }

  strengthLabel(entropy: number): StrengthResult {
    if (entropy < 28) return { label: 'Very Weak', score: 1, color: 'oklch(0.6 0.22 27)' };
    if (entropy < 50) return { label: 'Weak', score: 2, color: 'oklch(0.7 0.18 50)' };
    if (entropy < 80) return { label: 'Fair', score: 3, color: 'oklch(0.75 0.15 85)' };
    if (entropy < 120) return { label: 'Strong', score: 4, color: 'oklch(0.7 0.18 145)' };
    return { label: 'Excellent', score: 5, color: 'oklch(0.7 0.18 160)' };
  }

  crackTime(entropy: number): string {
    let value = Math.pow(2, entropy) / 1e11;
    if (value < 1) {
      return 'instant';
    }

    let label = 'seconds';
    const units: [number, string][] = [
      [60, 'seconds'],
      [60, 'minutes'],
      [24, 'hours'],
      [365, 'days'],
      [100, 'years'],
      [1000, 'centuries']
    ];

    for (const [divisor, unit] of units) {
      if (value < divisor) {
        label = unit;
        break;
      }
      value /= divisor;
      label = unit;
    }

    if (value > 1e9) return 'heat death of universe';
    if (value > 1e6) return `${(value / 1e6).toFixed(1)}M ${label}`;
    if (value > 1e3) return `${(value / 1e3).toFixed(1)}K ${label}`;
    return `${value.toFixed(1)} ${label}`;
  }

  charDistribution(password: string): CharacterDistribution {
    return {
      upper: (password.match(/[A-Z]/g) || []).length,
      lower: (password.match(/[a-z]/g) || []).length,
      number: (password.match(/[0-9]/g) || []).length,
      symbol: (password.match(/[^A-Za-z0-9]/g) || []).length
    };
  }
}
