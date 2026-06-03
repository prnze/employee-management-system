import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <h1 class="h3 mb-3">{{ 'TASKS_TITLE' | translate }}</h1>
    <div class="accordion" id="tasksAccordion">
      @for (task of tasks; track task.id) {
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button"
              data-bs-toggle="collapse" [attr.data-bs-target]="'#task' + task.id">
              {{ task.title }}
            </button>
          </h2>
          <div class="accordion-collapse collapse" [id]="'task' + task.id" data-bs-parent="#tasksAccordion">
            <div class="accordion-body">
              {{ task.description }}
              <span class="badge text-bg-secondary">{{ task.status }}</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {
  readonly tasks = [
    { id: '1', title: 'Complete self review',   description: 'Submit quarterly self review.',       status: 'Open' },
    { id: '2', title: 'Update tax declaration', description: 'Review finance portal declaration.', status: 'Pending' }
  ];
}
