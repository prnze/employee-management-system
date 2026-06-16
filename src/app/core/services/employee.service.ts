import { computed, inject, Injectable, signal } from '@angular/core';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
import { Employee, EmployeeFilter, EmployeeRequest, EmployeeStatus, SortEntry } from '@core/models/employee.models';
import { PagedResult } from '@core/models/table.models';
import { AuthStateService } from '@core/auth/auth-state.service';
import { AuditService } from './audit.service';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly employeesSignal = signal<Employee[]>([]);
  private readonly supabase = inject(SupabaseService);
  private readonly audit = inject(AuditService);
  private readonly authState = inject(AuthStateService);

  readonly employees   = this.employeesSignal.asReadonly();
  readonly departments = computed(() => Array.from(new Set(this.employeesSignal().map((e) => e.department))).sort());
  readonly locations   = computed(() => Array.from(new Set(this.employeesSignal().map((e) => e.location))).sort());
  readonly designations = computed(() => Array.from(new Set(this.employeesSignal().map((e) => e.designation))).sort());

  constructor() {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    from(
      this.supabase.client
        .from('employees')
        .select('*')
    ).subscribe({
      next: ({ data, error }) => {
        if (error) {
          console.error('Failed to load employees from Supabase:', error);
        } else if (data) {
          this.employeesSignal.set(data.map((item: any) => this.mapDbToEmployee(item)));
        }
      },
      error: (err) => {
        console.error('Failed to load employees:', err);
      }
    });
  }

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
    });
  }

  getById(id: string): Observable<Employee> {
    const employee = this.employeesSignal().find((item) => item.id === id);
    if (employee) return of(employee);
    return from(
      this.supabase.client
        .from('employees')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error('Employee not found'));
        }
        return of(this.mapDbToEmployee(data));
      })
    );
  }

  create(request: EmployeeRequest): Observable<Employee> {
    const codeNumber = 1000 + this.employeesSignal().length + 1;
    const employeeCode = `EMP-${codeNumber}`;
    const dbData = {
      ...this.mapEmployeeToDb(request),
      employee_code: employeeCode
    };

    return from(
      this.supabase.client
        .from('employees')
        .insert(dbData)
        .select()
        .single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const createdEmployee = this.mapDbToEmployee(data);
        this.employeesSignal.update((items) => [createdEmployee, ...items]);
        this.audit.record(this.actor(), 'CREATE', `Employee ${createdEmployee.employeeCode}`);
        return of(createdEmployee);
      })
    );
  }

  update(id: string, request: EmployeeRequest): Observable<Employee> {
    const dbFields = this.mapEmployeeToDb(request);
    return from(
      this.supabase.client
        .from('employees')
        .update(dbFields)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        const updated = this.mapDbToEmployee(data);
        this.employeesSignal.update((items) => items.map((item) => (item.id === id ? updated : item)));
        this.audit.record(this.actor(), 'UPDATE', `Employee ${updated.employeeCode}`);
        return of(updated);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    const employee = this.employeesSignal().find((item) => item.id === id);
    return from(
      this.supabase.client
        .from('employees')
        .delete()
        .eq('id', id)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.employeesSignal.update((items) => items.filter((item) => item.id !== id));
        this.audit.record(this.actor(), 'DELETE', `Employee ${employee?.employeeCode ?? id}`);
        return of(true);
      })
    );
  }

  bulkDelete(ids: string[]): Observable<boolean> {
    return from(
      this.supabase.client
        .from('employees')
        .delete()
        .in('id', ids)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.employeesSignal.update((items) => items.filter((item) => !ids.includes(item.id)));
        this.audit.record(this.actor(), 'BULK_DELETE', `${ids.length} employee records`);
        return of(true);
      })
    );
  }

  bulkUpdateStatus(ids: string[], status: EmployeeStatus): Observable<boolean> {
    const dbStatus = status === 'Active' ? 'ACTIVE' : (status === 'On Leave' ? 'ON_LEAVE' : 'INACTIVE');
    return from(
      this.supabase.client
        .from('employees')
        .update({ status: dbStatus })
        .in('id', ids)
    ).pipe(
      switchMap(({ error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        this.employeesSignal.update((items) =>
          items.map((item) => (ids.includes(item.id) ? { ...item, status } : item))
        );
        this.audit.record(this.actor(), 'BULK_STATUS_UPDATE', `${ids.length} employees → ${status}`);
        return of(true);
      })
    );
  }

  // ── Mappers ────────────────────────────────────────────────────────────────
  private mapDbToEmployee(dbEmployee: any): Employee {
    return {
      id: dbEmployee.id,
      employeeCode: dbEmployee.employee_code,
      firstName: dbEmployee.first_name,
      lastName: dbEmployee.last_name,
      email: dbEmployee.email,
      phone: dbEmployee.phone,
      department: dbEmployee.department,
      designation: dbEmployee.designation,
      manager: dbEmployee.manager,
      location: dbEmployee.location,
      status: dbEmployee.status === 'ACTIVE' ? 'Active' : (dbEmployee.status === 'ON_LEAVE' ? 'On Leave' : 'Inactive'),
      joinedAt: dbEmployee.joined_at,
      salary: dbEmployee.salary
    };
  }

  private mapEmployeeToDb(req: Partial<EmployeeRequest>): any {
    const dbFields: any = {};
    if (req.firstName !== undefined) dbFields.first_name = req.firstName;
    if (req.lastName !== undefined) dbFields.last_name = req.lastName;
    if (req.email !== undefined) dbFields.email = req.email;
    if (req.phone !== undefined) dbFields.phone = req.phone;
    if (req.department !== undefined) dbFields.department = req.department;
    if (req.designation !== undefined) dbFields.designation = req.designation;
    if (req.manager !== undefined) dbFields.manager = req.manager;
    if (req.location !== undefined) dbFields.location = req.location;
    if (req.status !== undefined) {
      dbFields.status = req.status === 'Active' ? 'ACTIVE' : (req.status === 'On Leave' ? 'ON_LEAVE' : 'INACTIVE');
    }
    if (req.joinedAt !== undefined) dbFields.joined_at = req.joinedAt;
    if (req.salary !== undefined) dbFields.salary = req.salary;
    return dbFields;
  }

  private actor(): string {
    return this.authState.user()?.fullName ?? 'System';
  }
}
