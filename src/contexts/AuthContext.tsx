"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// User type (previously from authService)
export interface User {
  $id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// NOTE: Appwrite auth has been disabled. Auth functionality is stubbed out.
// To implement auth, integrate with Convex auth or another provider.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // No auth check, start as not loading

  useEffect(() => {
    // Auth disabled - no automatic auth check
    // Previously called Appwrite which caused DNS errors
  }, []);

  const login = async (_email: string, _password: string) => {
    // Auth disabled - implement with Convex auth when needed
    throw new Error('Auth is currently disabled');
  };

  const register = async (_email: string, _password: string, _name: string) => {
    // Auth disabled - implement with Convex auth when needed
    throw new Error('Auth is currently disabled');
  };

  const logout = async () => {
    setUser(null);
  };

  const isAdmin = false; // No admin without auth

  const value: AuthContextType = {
    user,
    isLoading,
    isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
