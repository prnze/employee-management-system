import { Injectable } from '@angular/core';
import { ACCENTS } from '../constants/formatx.constants';

@Injectable({ providedIn: 'root' })
export class FormatxAccentService {
  readonly accents = ACCENTS;
}
