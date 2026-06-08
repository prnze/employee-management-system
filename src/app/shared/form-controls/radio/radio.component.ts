import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormControl } from '../base-form-control';

export interface RadioOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent extends BaseFormControl<any> {
  @Input() options: RadioOption[] = [];
  @Input() name = ''; // Name for the radio group
  @Input() inline = false;
  @Input() id = '';
}
