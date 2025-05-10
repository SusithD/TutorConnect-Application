import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // TEMPORARY FOR SCREENSHOTS: Mock user with admin role to access all pages
  const mockUser: User = {
    id: 1,
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN'
  };

  const [user, setUser] = useState<User | null>(mockUser);
  const [token, setToken] = useState<string | null>('mock-token-for-screenshots');
  const [loading, setLoading] = useState(false); // Set to false to avoid loading state

  // TEMPORARY: Skip the authentication check for screenshots
  useEffect(() => {
    // This is intentionally empty to skip the regular authentication check
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For screenshot purposes, just set the mock user and don't make API calls
      setUser(mockUser);
      setToken('mock-token-for-screenshots');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      // For screenshot purposes, just set the mock user
      setUser(mockUser);
      setToken('mock-token-for-screenshots');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    // For screenshot purposes, do nothing to keep the mock user
  };

  return (
    <AuthContext.Provider value={{
      user: mockUser, // Always provide the mock user
      token: 'mock-token-for-screenshots',
      isAuthenticated: true, // Always authenticated for screenshots
      loading: false, // Never in loading state
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};