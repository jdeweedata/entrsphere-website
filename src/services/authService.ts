
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';

export interface User {
  $id: string;
  email: string;
  name: string;
  emailVerification: boolean;
  labels: string[];
}

export interface AuthError {
  message: string;
  code?: number;
}

export const authService = {
  // Register a new user
  register: async (email: string, password: string, name: string): Promise<User> => {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      console.log('User registered:', user);
      return user;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<any> => {
    try {
      const session = await account.createEmailSession(email, password);
      console.log('User logged in:', session);
      return session;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await account.deleteSession('current');
      console.log('User logged out');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Logout failed');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      return null;
    }
  },

  // Check if user is admin (based on email or labels)
  isAdmin: (user: User): boolean => {
    return user.email === 'admin@entrsphere.com' || user.labels.includes('admin');
  }
};
