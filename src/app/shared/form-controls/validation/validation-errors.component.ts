import { Component, Input, inject } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-validation-errors',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    @if (shouldShowErrors()) {
      <div class="text-danger small mt-1">
        {{ errorMessage() | translate: errorParams() }}
      </div>
    }
  `
})
export class ValidationErrorsComponent {
  @Input({ required: true }) control: AbstractControl | null = null;
  private readonly formGroupDirective = inject(FormGroupDirective, { optional: true });

  shouldShowErrors(): boolean {
    if (!this.control) return false;
    const isSubmitted = this.formGroupDirective?.submitted ?? false;
    return this.control.invalid && (this.control.touched || isSubmitted);
  }

  errorMessage(): string {
    if (!this.control || !this.control.errors) return '';
    const errorKeys = Object.keys(this.control.errors);
    if (errorKeys.length === 0) return '';

    const firstKey = errorKeys[0];
    const keyMapping: Record<string, string> = {
      required: 'VALIDATION_REQUIRED',
      email: 'VALIDATION_EMAIL',
      minlength: 'VALIDATION_MIN_LENGTH',
      maxlength: 'VALIDATION_MAX_LENGTH',
      pattern: 'VALIDATION_PATTERN'
    };

    return keyMapping[firstKey] ?? `VALIDATION_${firstKey.toUpperCase()}`;
  }

  errorParams(): any {
    if (!this.control || !this.control.errors) return null;
    const errorKeys = Object.keys(this.control.errors);
    if (errorKeys.length === 0) return null;

    const firstKey = errorKeys[0];
    return this.control.errors[firstKey];
  }
}
