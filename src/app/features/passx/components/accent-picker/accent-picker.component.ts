import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ACCENTS } from '../../constants/passx.constants';
import { AccentKey } from '../../models/passx.models';
import { PassxStore } from '../../store/passx.store';

@Component({
  selector: 'app-passx-accent-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './accent-picker.component.html',
  styleUrl: './accent-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccentPickerComponent {
  readonly store = inject(PassxStore);
  readonly accentEntries = (Object.entries(ACCENTS).filter(([key]) => key !== 'custom') as [AccentKey, string][]);
}
