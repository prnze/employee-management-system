import { computed, Injectable, signal } from '@angular/core';
import { AppNotification, NotificationCategory, NotificationFilter, NotificationPriority } from '@core/models/notification.models';

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1', title: 'System maintenance scheduled',
    message: 'The system will undergo maintenance on June 10 from 02:00–04:00 UTC. Please save your work.',
    type: 'Warning', category: 'System', priority: 'High', read: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 'n2', title: 'New login from unknown device',
    message: 'A login was detected from a new device (Windows 11 / Chrome 125) in Bengaluru, India.',
    type: 'Error', category: 'Security', priority: 'Critical', read: false,
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(), link: '/account/change-password'
  },
  {
    id: 'n3', title: 'Maya Patel profile updated',
    message: 'Employee EMP-1001 updated their designation from Senior Engineer to Frontend Lead.',
    type: 'Info', category: 'Employee', priority: 'Low', read: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), link: '/admin/employees/e1'
  },
  {
    id: 'n4', title: 'Attendance anomaly detected',
    message: 'Dev Nair (EMP-1004) has not checked in for 3 consecutive working days.',
    type: 'Warning', category: 'Attendance', priority: 'Medium', read: false,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'n5', title: 'Q2 self-review due in 7 days',
    message: 'The quarterly self-review submission deadline is June 10. Please complete yours.',
    type: 'Info', category: 'Tasks', priority: 'Medium', read: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), link: '/employee/tasks'
  },
  {
    id: 'n6', title: 'Payroll processed successfully',
    message: 'May 2026 payroll for 44 employees has been processed and credited.',
    type: 'Success', category: 'System', priority: 'Low', read: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'n7', title: '3 new employees onboarded',
    message: 'Priya Sharma, Arjun Reddy, and Kavya Nambiar have completed onboarding.',
    type: 'Success', category: 'Employee', priority: 'Low', read: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'n8', title: 'Password policy update',
    message: 'The organisation\'s password policy now requires a minimum of 12 characters. Please update yours.',
    type: 'Warning', category: 'Security', priority: 'High', read: false,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), link: '/account/change-password'
  },
  {
    id: 'n9', title: 'Leave request approved',
    message: 'Your leave request for June 20–22 has been approved by your manager.',
    type: 'Success', category: 'Attendance', priority: 'Low', read: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'n10', title: 'Safety compliance training overdue',
    message: 'Annual safety compliance training was due on May 31. Please complete it immediately.',
    type: 'Error', category: 'Tasks', priority: 'Critical', read: false,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), link: '/employee/tasks'
  },
  {
    id: 'n11', title: 'Database backup completed',
    message: 'Weekly database backup completed successfully at 03:00 UTC.',
    type: 'Success', category: 'System', priority: 'Low', read: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'n12', title: 'Bulk status update performed',
    message: 'Admin Avery updated the status of 5 employees to On Leave.',
    type: 'Info', category: 'Employee', priority: 'Medium', read: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly store = signal<AppNotification[]>(SEED_NOTIFICATIONS);

  // ── Read-only views ──────────────────────────────────────────────────────────
  readonly all       = this.store.asReadonly();
  readonly unread    = computed(() => this.store().filter((n) => !n.read));
  readonly unreadCount = computed(() => this.unread().length);

  // ── Filtering ────────────────────────────────────────────────────────────────
  filtered(filter: NotificationFilter): AppNotification[] {
    const q    = filter.query.trim().toLowerCase();
    return this.store().filter((n) => {
      if (q && !`${n.title} ${n.message}`.toLowerCase().includes(q)) return false;
      if (filter.category && n.category !== filter.category) return false;
      if (filter.priority && n.priority !== filter.priority) return false;
      if (filter.status === 'read'   && !n.read)  return false;
      if (filter.status === 'unread' &&  n.read)  return false;
      return true;
    });
  }

  // ── Mutations ────────────────────────────────────────────────────────────────
  markRead(id: string): void {
    this.store.update((items) => items.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  markAllRead(): void {
    this.store.update((items) => items.map((n) => ({ ...n, read: true })));
  }

  delete(id: string): void {
    this.store.update((items) => items.filter((n) => n.id !== id));
  }

  deleteAll(ids: string[]): void {
    this.store.update((items) => items.filter((n) => !ids.includes(n.id)));
  }

  /** Push a new notification (used by other services to inject live events). */
  push(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): void {
    const n: AppNotification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false
    };
    this.store.update((items) => [n, ...items]);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  static priorityOrder(p: NotificationPriority): number {
    return { Critical: 4, High: 3, Medium: 2, Low: 1 }[p] ?? 0;
  }
}
