import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LANGUAGES, MODES } from '../../constants/formatx.constants';
import { FormatMode, Lang } from '../../models/formatx.models';

@Component({
  selector: 'app-formatx-toolbar',
  standalone: true,
  imports: [DecimalPipe, FormsModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  @Input({ required: true }) lang: Lang = 'javascript';
  @Input({ required: true }) confidence = 0;
  @Input({ required: true }) autoLang = true;
  @Input({ required: true }) mode: FormatMode = 'majority';
  @Input({ required: true }) indent = '  ';
  @Output() langChange = new EventEmitter<Lang>();
  @Output() autoLangChange = new EventEmitter<boolean>();
  @Output() modeChange = new EventEmitter<FormatMode>();
  @Output() indentChange = new EventEmitter<string>();
  @Output() undo = new EventEmitter<void>();
  @Output() redo = new EventEmitter<void>();
  @Output() fullscreen = new EventEmitter<void>();
  @Output() format = new EventEmitter<void>();

  readonly modes = MODES;
  readonly languages = LANGUAGES;
}
