import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from 'firebase/auth';

// Extended user type that works with both Firebase and mock users
type ExtendedUser = User | {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  organization?: string;
  role?: string;
};

interface AuthState {
  user: ExtendedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organization: string;
    role: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Try Firebase first, fallback to mock service
          try {
            const { authService } = await import('../services/authService');
            const user = await authService.signIn(email, password);
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (firebaseError) {
            console.log('Firebase failed, using mock service:', firebaseError);
            const { mockAuthService } = await import('../services/mockAuthService');
            const user = await mockAuthService.signIn(email, password);
            // Store in localStorage for mock persistence
            localStorage.setItem('mockUser', JSON.stringify(user));
            set({ user, isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Try Firebase first, fallback to mock service
          try {
            const { authService } = await import('../services/authService');
            const user = await authService.signUp(userData);
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (firebaseError) {
            console.log('Firebase failed, using mock service:', firebaseError);
            const { mockAuthService } = await import('../services/mockAuthService');
            const user = await mockAuthService.signUp(userData);
            // Store in localStorage for mock persistence
            localStorage.setItem('mockUser', JSON.stringify(user));
            set({ user, isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Signup failed', 
            isLoading: false 
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Try Firebase first, fallback to mock service
          try {
            const { authService } = await import('../services/authService');
            await authService.signOut();
          } catch (firebaseError) {
            console.log('Firebase failed, using mock service:', firebaseError);
            const { mockAuthService } = await import('../services/mockAuthService');
            await mockAuthService.signOut();
            localStorage.removeItem('mockUser');
          }
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed', 
            isLoading: false 
          });
        }
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          // Try Firebase first, fallback to mock service
          try {
            const { authService } = await import('../services/authService');
            const user = await authService.getCurrentUser();
            set({ user, isAuthenticated: !!user, isLoading: false });
          } catch (firebaseError) {
            console.log('Firebase failed, using mock service:', firebaseError);
            const { mockAuthService } = await import('../services/mockAuthService');
            const user = await mockAuthService.getCurrentUser();
            set({ user, isAuthenticated: !!user, isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
