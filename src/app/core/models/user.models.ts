import { AppRole } from '@core/constants/roles.constant';

export type UserStatus = 'Active' | 'Inactive' | 'Locked';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: AppRole;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt?: string;
  /** Extra permissions beyond the role default. */
  extraPermissions?: string[];
  /** Whether the user must change password on next login. */
  forcePasswordReset?: boolean;
  phone?: string;
  department?: string;
}

export interface Role {
  id: string;
  name: AppRole;
  description: string;
  permissions: string[];
}

/** Request body for creating / updating a user. */
export type UserRequest = Omit<User, 'id' | 'lastLoginAt' | 'createdAt'>;

/** Filter state for the user list page. */
export interface UserFilter {
  query: string;
  role: AppRole | '';
  status: UserStatus | '';
  createdFrom: string;
  createdTo: string;
  hasExtraPermissions: boolean | null;
}

/** Named preset for saving a filter combination. */
export interface SavedUserFilter {
  id: string;
  name: string;
  filter: Partial<UserFilter>;
  createdAt: string;
}

export type UserSortField = keyof Pick<User, 'fullName' | 'email' | 'role' | 'status' | 'lastLoginAt' | 'createdAt'>;
export interface UserSortEntry {
  field: UserSortField;
  direction: 'asc' | 'desc';
}
