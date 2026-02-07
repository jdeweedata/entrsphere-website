import { account } from '@/lib/appwrite';
import { ID, Models } from 'appwrite';

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

// Helper to extract error message from unknown error type
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unknown error occurred';
}

export const authService = {
  // Register a new user
  register: async (email: string, password: string, name: string): Promise<User> => {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      return user;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error) || 'Registration failed');
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<Models.Session> => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error) || 'Login failed');
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await account.deleteSession('current');
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error) || 'Logout failed');
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
