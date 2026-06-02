import { computed, Injectable, signal } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Employee, EmployeeFilter, EmployeeRequest, EmployeeStatus, SortEntry } from '@core/models/employee.models';
import { PagedResult } from '@core/models/table.models';
import { AuthStateService } from '@core/auth/auth-state.service';
import { AuditService } from './audit.service';

const EMPLOYEES: Employee[] = [
  { id: 'e1', employeeCode: 'EMP-1001', firstName: 'Maya',    lastName: 'Patel',    email: 'maya.patel@ems.local',    phone: '9876543210', department: 'Engineering', designation: 'Frontend Lead',       manager: 'Avery Admin', location: 'Bengaluru', status: 'Active',   joinedAt: '2021-04-12', salary: 1650000 },
  { id: 'e2', employeeCode: 'EMP-1002', firstName: 'Rohan',   lastName: 'Mehta',    email: 'rohan.mehta@ems.local',   phone: '9123456789', department: 'Product',     designation: 'Product Manager',    manager: 'Avery Admin', location: 'Mumbai',    status: 'Active',   joinedAt: '2020-08-03', salary: 1800000 },
  { id: 'e3', employeeCode: 'EMP-1003', firstName: 'Sara',    lastName: 'Khan',     email: 'sara.khan@ems.local',     phone: '9988776655', department: 'People',      designation: 'HR Business Partner', manager: 'Avery Admin', location: 'Delhi',     status: 'On Leave', joinedAt: '2022-01-24', salary: 1200000 },
  { id: 'e4', employeeCode: 'EMP-1004', firstName: 'Dev',     lastName: 'Nair',     email: 'dev.nair@ems.local',      phone: '9090909090', department: 'Finance',     designation: 'Finance Analyst',    manager: 'Rohan Mehta', location: 'Pune',      status: 'Inactive', joinedAt: '2019-11-19', salary: 980000  },
  { id: 'e5', employeeCode: 'EMP-1005', firstName: 'Priya',   lastName: 'Sharma',   email: 'priya.sharma@ems.local',  phone: '9812345678', department: 'Engineering', designation: 'Backend Engineer',   manager: 'Maya Patel',  location: 'Bengaluru', status: 'Active',   joinedAt: '2023-03-07', salary: 1350000 },
  { id: 'e6', employeeCode: 'EMP-1006', firstName: 'Arjun',   lastName: 'Reddy',    email: 'arjun.reddy@ems.local',   phone: '9701234567', department: 'Design',      designation: 'UI/UX Designer',     manager: 'Avery Admin', location: 'Hyderabad', status: 'Active',   joinedAt: '2022-09-15', salary: 1150000 },
  { id: 'e7', employeeCode: 'EMP-1007', firstName: 'Kavya',   lastName: 'Nambiar',  email: 'kavya.nambiar@ems.local', phone: '9654321098', department: 'Engineering', designation: 'DevOps Engineer',    manager: 'Maya Patel',  location: 'Bengaluru', status: 'Active',   joinedAt: '2021-11-20', salary: 1450000 },
  { id: 'e8', employeeCode: 'EMP-1008', firstName: 'Aarav',   lastName: 'Singh',    email: 'aarav.singh@ems.local',   phone: '9543210987', department: 'Finance',     designation: 'Finance Manager',    manager: 'Avery Admin', location: 'Mumbai',    status: 'Active',   joinedAt: '2018-06-01', salary: 2100000 },
  { id: 'e9', employeeCode: 'EMP-1009', firstName: 'Diya',    lastName: 'Verma',    email: 'diya.verma@ems.local',    phone: '9432109876', department: 'People',      designation: 'Recruiter',          manager: 'Sara Khan',   location: 'Delhi',     status: 'On Leave', joinedAt: '2023-07-10', salary: 900000  },
  { id: 'e10',employeeCode: 'EMP-1010', firstName: 'Vikas',   lastName: 'Iyer',     email: 'vikas.iyer@ems.local',    phone: '9321098765', department: 'Product',     designation: 'Product Analyst',    manager: 'Rohan Mehta', location: 'Chennai',   status: 'Active',   joinedAt: '2024-01-15', salary: 1050000 }
];

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly employeesSignal = signal<Employee[]>(EMPLOYEES);
  readonly employees   = this.employeesSignal.asReadonly();
  readonly departments = computed(() => Array.from(new Set(this.employeesSignal().map((e) => e.department))).sort());
  readonly locations   = computed(() => Array.from(new Set(this.employeesSignal().map((e) => e.location))).sort());
  readonly designations = computed(() => Array.from(new Set(this.employeesSignal().map((e) => e.designation))).sort());

  constructor(
    private readonly audit: AuditService,
    private readonly authState: AuthStateService
  ) {}

  list(filter: EmployeeFilter): Observable<PagedResult<Employee>> {
    let rows = [...this.employeesSignal()];
    const query = filter.query.trim().toLowerCase();

    // Global search (code, name, email, designation, department, location)
    if (query) {
      rows = rows.filter((e) =>
        [e.employeeCode, e.firstName, e.lastName, e.email, e.designation, e.department, e.location]
          .join(' ').toLowerCase().includes(query)
      );
    }

    if (filter.department)  rows = rows.filter((e) => e.department === filter.department);
    if (filter.status)      rows = rows.filter((e) => e.status === filter.status);
    if (filter.location)    rows = rows.filter((e) => e.location === filter.location);
    if (filter.designation) rows = rows.filter((e) => e.designation === filter.designation);
    if (filter.joinedFrom)  rows = rows.filter((e) => e.joinedAt >= filter.joinedFrom);
    if (filter.joinedTo)    rows = rows.filter((e) => e.joinedAt <= filter.joinedTo);

    // Multi-column sort (sortStack takes precedence)
    const stack: SortEntry[] = filter.sortStack?.length
      ? filter.sortStack
      : [{ field: filter.sortBy, direction: filter.sortDirection }];

    rows.sort((a, b) => {
      for (const entry of stack) {
        const left  = String(a[entry.field]).toLowerCase();
        const right = String(b[entry.field]).toLowerCase();
        const cmp   = left.localeCompare(right);
        if (cmp !== 0) return entry.direction === 'asc' ? cmp : -cmp;
      }
      return 0;
    });

    const start = (filter.page - 1) * filter.pageSize;
    return of({
      items: rows.slice(start, start + filter.pageSize),
      total: rows.length,
      page: filter.page,
      pageSize: filter.pageSize
    }).pipe(delay(200));
  }

  getById(id: string): Observable<Employee> {
    const employee = this.employeesSignal().find((item) => item.id === id);
    return employee ? of(employee).pipe(delay(200)) : throwError(() => new Error('Employee not found'));
  }

  create(request: EmployeeRequest): Observable<Employee> {
    const employee: Employee = { ...request, id: crypto.randomUUID(), employeeCode: `EMP-${1000 + this.employeesSignal().length + 1}` };
    this.employeesSignal.update((items) => [employee, ...items]);
    this.audit.record(this.actor(), 'CREATE', `Employee ${employee.employeeCode}`);
    return of(employee).pipe(delay(250));
  }

  update(id: string, request: EmployeeRequest): Observable<Employee> {
    const existing = this.employeesSignal().find((item) => item.id === id);
    if (!existing) return throwError(() => new Error('Employee not found'));
    const updated: Employee = { ...existing, ...request };
    this.employeesSignal.update((items) => items.map((item) => (item.id === id ? updated : item)));
    this.audit.record(this.actor(), 'UPDATE', `Employee ${updated.employeeCode}`);
    return of(updated).pipe(delay(250));
  }

  delete(id: string): Observable<boolean> {
    const employee = this.employeesSignal().find((item) => item.id === id);
    this.employeesSignal.update((items) => items.filter((item) => item.id !== id));
    this.audit.record(this.actor(), 'DELETE', `Employee ${employee?.employeeCode ?? id}`);
    return of(true).pipe(delay(200));
  }

  bulkDelete(ids: string[]): Observable<boolean> {
    this.employeesSignal.update((items) => items.filter((item) => !ids.includes(item.id)));
    this.audit.record(this.actor(), 'BULK_DELETE', `${ids.length} employee records`);
    return of(true).pipe(delay(250));
  }

  bulkUpdateStatus(ids: string[], status: EmployeeStatus): Observable<boolean> {
    this.employeesSignal.update((items) =>
      items.map((item) => (ids.includes(item.id) ? { ...item, status } : item))
    );
    this.audit.record(this.actor(), 'BULK_STATUS_UPDATE', `${ids.length} employees → ${status}`);
    return of(true).pipe(delay(250));
  }

  private actor(): string {
    return this.authState.user()?.fullName ?? 'System';
  }
}
