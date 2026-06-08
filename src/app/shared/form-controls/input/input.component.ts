import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFormControl } from '../base-form-control';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends BaseFormControl<any> {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() autocomplete = '';
  @Input() id = '';

  override handleValueChange(value: any): void {
    if (this.disabled()) return;
    if (this.type === 'number') {
      const parsed = value === '' || value === null || value === undefined ? null : Number(value);
      super.handleValueChange(parsed);
    } else {
      super.handleValueChange(value);
    }
  }
}
