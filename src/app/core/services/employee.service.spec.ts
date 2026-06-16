import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EmployeeService } from './employee.service';
import { SupabaseService } from './supabase.service';
import { AuditService } from './audit.service';

const SEED_EMPLOYEES_DB = [
  { id: 'e1', employee_code: 'EMP-1001', first_name: 'Maya',    last_name: 'Patel',    email: 'maya.patel@ems.local',    phone: '9876543210', department: 'Engineering', designation: 'Frontend Lead',       manager: 'Avery Admin', location: 'Bengaluru', status: 'ACTIVE',   joined_at: '2021-04-12', salary: 1650000 },
  { id: 'e2', employee_code: 'EMP-1002', first_name: 'Rohan',   last_name: 'Mehta',    email: 'rohan.mehta@ems.local',   phone: '9123456789', department: 'Product',     designation: 'Product Manager',    manager: 'Avery Admin', location: 'Mumbai',    status: 'ACTIVE',   joined_at: '2020-08-03', salary: 1800000 },
  { id: 'e3', employee_code: 'EMP-1003', first_name: 'Sara',    last_name: 'Khan',     email: 'sara.khan@ems.local',     phone: '9988776655', department: 'People',      designation: 'HR Business Partner', manager: 'Avery Admin', location: 'Delhi',     status: 'ON_LEAVE', joined_at: '2022-01-24', salary: 1200000 },
  { id: 'e4', employee_code: 'EMP-1004', first_name: 'Dev',     last_name: 'Nair',     email: 'dev.nair@ems.local',      phone: '9090909090', department: 'Finance',     designation: 'Finance Analyst',    manager: 'Rohan Mehta', location: 'Pune',      status: 'INACTIVE', joined_at: '2019-11-19', salary: 980000  },
  { id: 'e5', employee_code: 'EMP-1005', first_name: 'Priya',   last_name: 'Sharma',   email: 'priya.sharma@ems.local',  phone: '9812345678', department: 'Engineering', designation: 'Backend Engineer',   manager: 'Maya Patel',  location: 'Bengaluru', status: 'ACTIVE',   joined_at: '2023-03-07', salary: 1350000 }
];

class MockSupabaseService {
  readonly client = {
    from: (table: string) => {
      return {
        select: () => Promise.resolve({ data: JSON.parse(JSON.stringify(SEED_EMPLOYEES_DB)), error: null }),
        insert: (fields: any) => {
          return {
            select: () => {
              return {
                single: () => {
                  const created = { ...fields, id: 'new-id' };
                  return Promise.resolve({ data: created, error: null });
                }
              };
            }
          };
        },
        update: (fields: any) => {
          return {
            eq: (col: string, val: any) => {
              return {
                select: () => {
                  return {
                    single: () => {
                      const found = SEED_EMPLOYEES_DB.find((u) => u.id === val);
                      const updated = found ? { ...found, ...fields } : null;
                      return Promise.resolve({ data: updated, error: null });
                    }
                  };
                }
              };
            },
            in: (col: string, vals: any[]) => {
              return Promise.resolve({ error: null });
            }
          };
        },
        delete: () => {
          return {
            eq: (col: string, val: any) => {
              return Promise.resolve({ error: null });
            },
            in: (col: string, vals: any[]) => {
              return Promise.resolve({ error: null });
            }
          };
        }
      };
    }
  };
}

class MockAuditService {
  readonly logs = () => [];
  readonly totalCount = () => 0;
  readonly actors = () => [];
  readonly actions = () => [];
  record() {}
  filtered() { return []; }
}

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useClass: MockSupabaseService },
        { provide: AuditService, useClass: MockAuditService }
      ]
    });
    service = TestBed.inject(EmployeeService);
    tick(); // resolve loadEmployees promise
  }));

  it('should be created', () => expect(service).toBeTruthy());

  it('filters and paginates employees', (done) => {
    service
      .list({ query: 'maya', department: '', status: '', location: '', designation: '', joinedFrom: '', joinedTo: '', page: 1, pageSize: 10, sortBy: 'employeeCode', sortDirection: 'asc', sortStack: [] })
      .subscribe((result) => {
        expect(result.total).toBe(1);
        expect(result.items[0].email).toContain('maya');
        done();
      });
  });

  it('creates an employee', fakeAsync(() => {
    let created: any;
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
        created = employee;
      });
    tick();
    expect(created.employeeCode).toContain('EMP-');
    expect(service.employees().some((item) => item.id === created.id)).toBeTrue();
  }));

  it('updates an employee', fakeAsync(() => {
    const id = service.employees()[0].id;
    let updated: any;
    service
      .update(id, {
        firstName: 'Maya2',
        lastName: 'Patel',
        email: 'maya.patel@ems.local',
        phone: '9876543210',
        department: 'Engineering',
        designation: 'Frontend Lead',
        manager: 'Avery Admin',
        location: 'Bengaluru',
        status: 'Active',
        joinedAt: '2021-04-12',
        salary: 1650000
      })
      .subscribe((employee) => {
        updated = employee;
      });
    tick();
    expect(updated.firstName).toBe('Maya2');
  }));

  it('deletes an employee', fakeAsync(() => {
    const id = service.employees()[0].id;
    const before = service.employees().length;
    let deleted = false;
    service.delete(id).subscribe((res) => {
      deleted = res;
    });
    tick();
    expect(deleted).toBeTrue();
    expect(service.employees().length).toBe(before - 1);
  }));

  it('bulk deletes employees', fakeAsync(() => {
    const ids = service.employees().slice(0, 2).map((item) => item.id);
    const before = service.employees().length;
    let deleted = false;
    service.bulkDelete(ids).subscribe((res) => {
      deleted = res;
    });
    tick();
    expect(deleted).toBeTrue();
    expect(service.employees().length).toBe(before - 2);
  }));

  it('bulk updates status', fakeAsync(() => {
    const ids = service.employees().slice(0, 2).map((item) => item.id);
    let updated = false;
    service.bulkUpdateStatus(ids, 'Inactive').subscribe((res) => {
      updated = res;
    });
    tick();
    expect(updated).toBeTrue();
    const checked = service.employees().filter((item) => ids.includes(item.id));
    expect(checked.every((item) => item.status === 'Inactive')).toBeTrue();
  }));
});
