import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ValidationErrorsComponent } from '../validation/validation-errors.component';

let fieldCounter = 0;

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [TranslatePipe, ValidationErrorsComponent],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent {
  @Input() label?: string;
  @Input() required = false;
  @Input() hint?: string;
  @Input() control: AbstractControl | null = null;
  @Input() id = `form-field-${fieldCounter++}`;
}
