export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = 'Admin',
  MEMBER = 'Member'
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}
