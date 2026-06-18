import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  get<T>(key: string, storage: Storage = localStorage): T | null {
    const value = storage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  set<T>(key: string, value: T, storage: Storage = localStorage): void {
    storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}
