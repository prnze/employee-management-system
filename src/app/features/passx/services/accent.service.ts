import { Injectable } from '@angular/core';
import { ACCENTS } from '../constants/passx.constants';
import { AccentKey } from '../models/passx.models';

@Injectable({ providedIn: 'root' })
export class AccentService {
  readonly accents = ACCENTS;

  resolveAccentColor(accent: AccentKey, customAccent: string): string {
    return accent === 'custom' ? customAccent : ACCENTS[accent];
  }
}
