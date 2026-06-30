import { Injectable } from '@angular/core';
import { HistoryEntry } from '../models/passx.models';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  add(history: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
    return [entry, ...history].slice(0, 50);
  }

  delete(history: HistoryEntry[], id: string): HistoryEntry[] {
    return history.filter((entry) => entry.id !== id);
  }
}
