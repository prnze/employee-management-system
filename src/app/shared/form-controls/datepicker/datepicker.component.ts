import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormControl } from '../base-form-control';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent extends BaseFormControl<string> {
  @Input() placeholder = '';
  @Input() id = '';
}
