import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { decodeToken } from '../utils/tokenUtils';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (token: string, userData: User) => {
    setLoading(true);
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    setLoading(true);
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};