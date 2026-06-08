import { Injectable, TemplateRef, computed, signal } from '@angular/core';

export interface ToastMessage {
  textOrTpl: string | TemplateRef<unknown>;
  visible: boolean;
  delay: number;
  classname: string;
  params?: Record<string, unknown>;
}

type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();
  readonly isToastActive = computed(() => this.toastsSignal().some((t) => t.visible));

  show(
    textOrTpl: string | TemplateRef<unknown>,
    options: { delay?: number; classname?: string; params?: Record<string, unknown> } = {}
  ): void {
    const toast: ToastMessage = {
      textOrTpl,
      visible: true,
      delay: options.delay || 5000,
      classname: options.classname || '',
      params: options.params
    };

    this.toastsSignal.update((items) => {
      const updated = [...items, toast];
      if (updated.length > 5) {
        return updated.slice(updated.length - 5);
      }
      return updated;
    });

    setTimeout(() => {
      toast.visible = false;
      this.toastsSignal.update((items) => [...items]);

      setTimeout(() => {
        this.remove(toast);
      }, 300);
    }, toast.delay);
  }

  showToast(messageKey: string, type: ToastType = 'info', params?: Record<string, unknown>): void {
    const classname =
      type === 'info'
        ? 'infotoast'
        : type === 'success'
          ? 'successtoast'
          : type === 'warning'
            ? 'warningtoast'
            : 'removedtoast';

    this.show(messageKey, {
      classname,
      delay: 3000,
      params
    });
  }

  remove(toast: ToastMessage): void {
    this.toastsSignal.update((items) => items.filter((item) => item !== toast));
  }

  clear(): void {
    this.toastsSignal.set([]);
  }

  isTemplate(value: string | TemplateRef<unknown>): value is TemplateRef<unknown> {
    return value instanceof TemplateRef;
  }
}
