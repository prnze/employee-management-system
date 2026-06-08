import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchPasswordValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordKey)?.value;
    const confirmControl = control.get(confirmPasswordKey);
    const confirm = confirmControl?.value;

    if (confirmControl) {
      const currentErrors = confirmControl.errors;
      if (password !== confirm) {
        confirmControl.setErrors({ ...currentErrors, passwordMismatch: true });
      } else if (currentErrors) {
        const { passwordMismatch, ...remainingErrors } = currentErrors;
        confirmControl.setErrors(Object.keys(remainingErrors).length > 0 ? remainingErrors : null);
      }
    }

    return password === confirm ? null : { passwordMismatch: true };
  };
}
