import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should seed 12 notifications', () => {
    expect(service.all().length).toBe(12);
  });

  it('should compute unreadCount correctly', () => {
    const unread = service.all().filter((n) => !n.read).length;
    expect(service.unreadCount()).toBe(unread);
  });

  it('should mark a notification as read', () => {
    const id = service.all().find((n) => !n.read)!.id;
    service.markRead(id);
    expect(service.all().find((n) => n.id === id)?.read).toBeTrue();
  });

  it('should mark all notifications as read', () => {
    service.markAllRead();
    expect(service.unreadCount()).toBe(0);
    expect(service.all().every((n) => n.read)).toBeTrue();
  });

  it('should delete a notification by id', () => {
    const id = service.all()[0].id;
    const before = service.all().length;
    service.delete(id);
    expect(service.all().length).toBe(before - 1);
    expect(service.all().find((n) => n.id === id)).toBeUndefined();
  });

  it('should push a new notification', () => {
    const before = service.all().length;
    service.push({
      title: 'Test notification',
      message: 'Test message',
      type: 'Info',
      category: 'System',
      priority: 'Low'
    });
    expect(service.all().length).toBe(before + 1);
    expect(service.all()[0].title).toBe('Test notification');
    expect(service.all()[0].read).toBeFalse();
  });

  it('should filter by category', () => {
    const result = service.filtered({ query: '', category: 'Security', priority: '', status: 'all' });
    expect(result.every((n) => n.category === 'Security')).toBeTrue();
  });

  it('should filter by status unread', () => {
    const result = service.filtered({ query: '', category: '', priority: '', status: 'unread' });
    expect(result.every((n) => !n.read)).toBeTrue();
  });

  it('should filter by query string', () => {
    const result = service.filtered({ query: 'payroll', category: '', priority: '', status: 'all' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((n) => n.title.toLowerCase().includes('payroll') || n.message.toLowerCase().includes('payroll'))).toBeTrue();
  });

  it('priorityOrder should return correct ordering', () => {
    expect(NotificationService.priorityOrder('Critical')).toBe(4);
    expect(NotificationService.priorityOrder('High')).toBe(3);
    expect(NotificationService.priorityOrder('Medium')).toBe(2);
    expect(NotificationService.priorityOrder('Low')).toBe(1);
  });
});
