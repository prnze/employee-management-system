import { AppRole } from '@core/constants/roles.constant';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
  avatarUrl?: string;
  permissions: string[];
  forcePasswordReset?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
