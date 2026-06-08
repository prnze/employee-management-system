import { Directive, inject, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive()
export abstract class BaseFormControl<T> implements ControlValueAccessor {
  readonly ngControl = inject(NgControl, { self: true, optional: true });

  // Reactive state tracking using signals
  readonly value = signal<T | null>(null);
  readonly disabled = signal<boolean>(false);
  readonly touched = signal<boolean>(false);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // Placeholders for ControlValueAccessor callback functions
  onChange = (_value: T | null) => {};
  onTouched = () => {};

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Utility handler for subclasses to notify CVA of value changes
  handleValueChange(value: T | null): void {
    if (this.disabled()) return;
    this.value.set(value);
    this.onChange(value);
  }

  // Utility handler for subclasses to notify CVA of blur events
  handleBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
