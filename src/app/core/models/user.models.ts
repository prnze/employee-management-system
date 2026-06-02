import { AppRole } from '@core/constants/roles.constant';

export type UserStatus = 'Active' | 'Inactive' | 'Locked';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: AppRole;
  status: UserStatus;
  lastLoginAt?: string;
}

export interface Role {
  id: string;
  name: AppRole;
  description: string;
  permissions: string[];
}
