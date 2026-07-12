import type { IAuthService } from '../../interfaces/auth';
import type { User } from '../../types';
import { dummyUsers } from '../../data/dummy-users';

// Shared mutable session state
let currentUser: User | null = null;

// Load from sessionStorage on init
const stored = typeof window !== 'undefined' ? sessionStorage.getItem('hospital_user') : null;
if (stored) {
  try { currentUser = JSON.parse(stored); } catch { /* ignore */ }
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export const dummyAuthService: IAuthService = {
  async login(email: string, password: string): Promise<User | null> {
    const entry = dummyUsers[email];
    if (entry && entry.password === password) {
      currentUser = entry.user;
      sessionStorage.setItem('hospital_user', JSON.stringify(entry.user));
      return entry.user;
    }
    return null;
  },

  logout(): void {
    currentUser = null;
    sessionStorage.removeItem('hospital_user');
  },

  getCurrentUser(): User | null {
    return currentUser;
  },

  async requestPasswordReset(email: string): Promise<boolean> {
    // Simulates checking if the email exists and sending a reset link
    return email in dummyUsers;
  },
};
