import type { EntityId } from "./common";

export type UserRole = "customer" | "admin";

export interface User {
  id: EntityId;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface Session {
  user: User;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  session: Session;
}
