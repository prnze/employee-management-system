import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { TaskStatus } from '@core/models/task.models';
import { TasksStore } from './tasks.store';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [IconComponent, AppDatePipe, TranslatePipe],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {
  readonly APP_ICONS = APP_ICONS;
  private readonly store = inject(TasksStore);

  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly tasksSignal = this.store.tasksSignal;
  readonly totalCount = this.store.totalCount;
  readonly todoCount = this.store.todoCount;
  readonly inProgressCount = this.store.inProgressCount;
  readonly completedCount = this.store.completedCount;
  readonly progressPercent = this.store.progressPercent;
  readonly todoTasks = this.store.todoTasks;
  readonly inProgressTasks = this.store.inProgressTasks;
  readonly completedTasks = this.store.completedTasks;

  ngOnInit(): void {
    this.store.loadTasks();
  }

  moveTask(taskId: string, newStatus: TaskStatus): void {
    this.store.moveTask(taskId, newStatus);
  }
}
