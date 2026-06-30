import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-passx-option-row',
  standalone: true,
  templateUrl: './option-row.component.html',
  styleUrl: './option-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionRowComponent {
  @Input({ required: true }) label = '';
  @Input() hint = '';
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();
}
