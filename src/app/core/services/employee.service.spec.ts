import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeService);
  });

  it('filters and paginates employees', (done) => {
    service
      .list({ query: 'maya', department: '', status: '', location: '', designation: '', joinedFrom: '', joinedTo: '', page: 1, pageSize: 10, sortBy: 'employeeCode', sortDirection: 'asc', sortStack: [] })
      .subscribe((result) => {
        expect(result.total).toBe(1);
        expect(result.items[0].email).toContain('maya');
        done();
      });
  });

  it('creates an employee', (done) => {
    service
      .create({
        firstName: 'Isha',
        lastName: 'Rao',
        email: 'isha.rao@ems.local',
        phone: '9000000000',
        department: 'Engineering',
        designation: 'QA Lead',
        manager: 'Maya Patel',
        location: 'Hyderabad',
        status: 'Active',
        joinedAt: '2026-06-02',
        salary: 1400000
      })
      .subscribe((employee) => {
        expect(employee.employeeCode).toContain('EMP-');
        expect(service.employees().some((item) => item.id === employee.id)).toBeTrue();
        done();
      });
  });
});
