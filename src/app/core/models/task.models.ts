export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  category: string;
  status: TaskStatus;
  employeeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskRequest {
  title: string;
  description: string;
  employeeId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}
