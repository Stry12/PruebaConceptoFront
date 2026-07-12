import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '@/core/types';
import { dummyAuthService, getCurrentUser } from '@/core/services';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => null,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const result = await dummyAuthService.login(email, password);
    if (result) {
      setUser(result);
      return null;
    }
    return 'Correo o contraseña incorrectos';
  }, []);

  const logout = useCallback(() => {
    dummyAuthService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
