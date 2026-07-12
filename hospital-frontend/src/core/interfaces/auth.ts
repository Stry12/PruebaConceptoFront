import type { User } from '../types';

export interface IAuthService {
  login(email: string, password: string): Promise<User | null>;
  logout(): void;
  getCurrentUser(): User | null;
  requestPasswordReset(email: string): Promise<boolean>;
}
