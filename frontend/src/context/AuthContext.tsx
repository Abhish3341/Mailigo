import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // This would be replaced with actual OAuth verification
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    // In a real app, this would redirect to Google OAuth
    // This is a mock implementation
    const mockGoogleLogin = () => {
      return new Promise<User>((resolve) => {
        setTimeout(() => {
          const mockUser = {
            id: '123456789',
            name: 'Test User',
            email: 'testuser@example.com',
            picture: 'https://via.placeholder.com/150'
          };
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve(mockUser);
        }, 1000);
      });
    };

    try {
      setLoading(true);
      const authenticatedUser = await mockGoogleLogin();
      setUser(authenticatedUser);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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