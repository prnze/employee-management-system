import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Employee } from '@core/models/employee.models';
import { EmployeeService } from '@core/services/employee.service';

export const employeeDetailResolver: ResolveFn<Employee> = (route) => inject(EmployeeService).getById(route.paramMap.get('id') ?? '');
