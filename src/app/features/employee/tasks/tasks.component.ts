import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { APP_ICONS } from '@core/constants/icon.constants';
import { ToastService } from '@core/services/toast.service';
import { AppDatePipe } from '@shared/pipes/app-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';

interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  status: 'todo' | 'in_progress' | 'completed';
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [IconComponent, AppDatePipe, TranslatePipe],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {
  readonly APP_ICONS = APP_ICONS;
  private readonly toast = inject(ToastService);

  // Reactive task list signal
  readonly tasksSignal = signal<TaskItem[]>([
    { id: 't1', title: 'Submit Q2 self-review', description: 'Submit Q2 performance evaluation self-review report via HR Portal.', dueDate: '2026-06-10', priority: 'High', category: 'HR', status: 'todo' },
    { id: 't2', title: 'Update tax declaration', description: 'Review finance portal and declare investments for the current financial cycle.', dueDate: '2026-06-15', priority: 'High', category: 'Finance', status: 'in_progress' },
    { id: 't3', title: 'Complete safety training', description: 'Mandatory annual workplace safety and compliance course module completion.', dueDate: '2026-06-20', priority: 'Medium', category: 'Compliance', status: 'todo' },
    { id: 't4', title: 'Team retrospective prep', description: 'Gather notes and prepare agenda slides for the monthly project retrospective.', dueDate: '2026-06-25', priority: 'Medium', category: 'Team', status: 'completed' },
    { id: 't5', title: 'Update emergency contacts', description: 'Verify and update home address and secondary phone details in profile.', dueDate: '2026-06-30', priority: 'Low', category: 'Profile', status: 'completed' }
  ]);

  // Computed task statistics
  readonly totalCount = computed(() => this.tasksSignal().length);
  readonly todoCount = computed(() => this.tasksSignal().filter(t => t.status === 'todo').length);
  readonly inProgressCount = computed(() => this.tasksSignal().filter(t => t.status === 'in_progress').length);
  readonly completedCount = computed(() => this.tasksSignal().filter(t => t.status === 'completed').length);
  
  readonly progressPercent = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  // Filters for board columns
  readonly todoTasks = computed(() => this.tasksSignal().filter(t => t.status === 'todo'));
  readonly inProgressTasks = computed(() => this.tasksSignal().filter(t => t.status === 'in_progress'));
  readonly completedTasks = computed(() => this.tasksSignal().filter(t => t.status === 'completed'));

  moveTask(taskId: string, newStatus: 'todo' | 'in_progress' | 'completed'): void {
    this.tasksSignal.update(tasks =>
      tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );
    this.toast.showToast('Task status updated successfully', 'success');
  }
}
