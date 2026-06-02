import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messagesSignal = signal<ToastMessage[]>([]);
  readonly messages = this.messagesSignal.asReadonly();

  show(message: Omit<ToastMessage, 'id'>): void {
    const toast = { ...message, id: crypto.randomUUID() };
    this.messagesSignal.update((items) => [toast, ...items].slice(0, 5));
    setTimeout(() => this.dismiss(toast.id), 5000);
  }

  dismiss(id: string): void {
    this.messagesSignal.update((items) => items.filter((item) => item.id !== id));
  }
}
