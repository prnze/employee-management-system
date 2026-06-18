export type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave';

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  manager: string;
  location: string;
  status: EmployeeStatus;
  joinedAt: string;
  salary: number;
  avatarUrl?: string;
}

export type EmployeeRequest = Omit<Employee, 'id' | 'employeeCode'>;

/** A single sort entry used for multi-column sorting. */
export interface SortEntry {
  field: keyof Employee;
  direction: 'asc' | 'desc';
}

export interface EmployeeFilter {
  query: string;
  department: string;
  status: string;
  location: string;
  designation: string;
  joinedFrom: string;
  joinedTo: string;
  page: number;
  pageSize: number;
  /** Primary sort (kept for backwards compatibility). */
  sortBy: keyof Employee;
  sortDirection: 'asc' | 'desc';
  /** Multi-column sort stack — takes precedence over sortBy/sortDirection when non-empty. */
  sortStack: SortEntry[];
}

/** A named, persisted filter preset. */
export interface SavedFilter {
  id: string;
  name: string;
  filter: Partial<EmployeeFilter>;
  createdAt: string;
}
