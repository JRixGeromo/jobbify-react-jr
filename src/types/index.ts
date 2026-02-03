import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
  companyId: string | null; // Keep this field for convenience
  subscription: {
    id: string;
    status: string;
    trial_end: string | null;
    created_at: string;
    updated_at: string;
  } | null;
  setNewPassword: (token: string, newPassword: string) => Promise<void>;
}

export interface SubscriptionStatus {
  isActive: boolean;
  isTrialing: boolean;
  trialEndsAt: Date | null;
  plan: 'essential' | 'pro' | null;
}

export * from './apps';
