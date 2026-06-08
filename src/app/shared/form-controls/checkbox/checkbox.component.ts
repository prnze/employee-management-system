import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormControl } from '../base-form-control';

let checkboxCounter = 0;

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent extends BaseFormControl<boolean> {
  @Input() label = '';
  @Input() id = `checkbox-control-${checkboxCounter++}`;
}
