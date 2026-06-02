import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, delay, map, of } from 'rxjs';

const USED_EMAILS = ['admin@ems.local', 'employee@ems.local'];

export function uniqueEmailValidator(): AsyncValidatorFn {
  return (control: AbstractControl<string>): Observable<ValidationErrors | null> =>
    of(USED_EMAILS.includes((control.value ?? '').toLowerCase())).pipe(
      delay(250),
      map((exists) => (exists ? { uniqueEmail: true } : null))
    );
}
