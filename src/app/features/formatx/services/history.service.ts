import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatxHistoryService {
  push(history: string[], index: number, value: string): { history: string[]; histIdx: number } {
    const next = history.slice(0, index + 1);
    next.push(value);
    if (next.length > 50) next.shift();
    return { history: next, histIdx: next.length - 1 };
  }
}
