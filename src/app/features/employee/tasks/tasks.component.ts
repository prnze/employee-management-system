import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {
  readonly tasks = [
    { id: '1', title: 'Complete self review',   description: 'Submit quarterly self review.',       status: 'Open' },
    { id: '2', title: 'Update tax declaration', description: 'Review finance portal declaration.', status: 'Pending' }
  ];
}
