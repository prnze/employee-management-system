import { computed, inject, Injectable, signal } from '@angular/core';
import { TaskItem, TaskStatus } from '@core/models/task.models';
import { TaskService } from '@core/services/task.service';
import { CurrentEmployeeService } from '@core/services/current-employee.service';
import { ToastService } from '@core/services/toast.service';
import { switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly taskService = inject(TaskService);
  private readonly currentEmployee = inject(CurrentEmployeeService);
  private readonly toast = inject(ToastService);
  private hasLoaded = false;

  readonly loading = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly tasksSignal = this.taskService.tasks;

  readonly totalCount = computed(() => this.tasksSignal().length);
  readonly todoCount = computed(() => this.tasksSignal().filter((task) => task.status === 'todo').length);
  readonly inProgressCount = computed(() => this.tasksSignal().filter((task) => task.status === 'in_progress').length);
  readonly completedCount = computed(() => this.tasksSignal().filter((task) => task.status === 'completed').length);

  readonly progressPercent = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  readonly todoTasks = computed(() => this.sortByDueDate(this.tasksSignal().filter((task) => task.status === 'todo')));
  readonly inProgressTasks = computed(() => this.sortByDueDate(this.tasksSignal().filter((task) => task.status === 'in_progress')));
  readonly completedTasks = computed(() => this.sortByDueDate(this.tasksSignal().filter((task) => task.status === 'completed')));

  loadTasks(force = false): void {
    if (this.hasLoaded && !force) return;
    this.loading.set(true);
    this.error.set('');
    this.currentEmployee.resolve().pipe(
      switchMap((employeeId) => this.taskService.getTasks(employeeId))
    ).subscribe({
      next: () => {
        this.hasLoaded = true;
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  moveTask(taskId: string, newStatus: TaskStatus): void {
    this.taskService.updateTask(taskId, { status: newStatus }).subscribe({
      next: () => this.toast.showToast('Task status updated successfully', 'success'),
      error: (err: Error) => this.toast.showToast(err.message, 'error')
    });
  }

  private sortByDueDate(tasks: TaskItem[]): TaskItem[] {
    return [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }
}
