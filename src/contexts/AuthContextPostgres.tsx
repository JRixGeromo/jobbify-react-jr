import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/postgres';
import { AuthContextType } from '@/types';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);

    // Set up auth state change listener
    const unsubscribe = auth.onAuthStateChange((state) => {
      setCurrentUser(state.session?.user || null);
    });

    return unsubscribe;
  }, []);

  async function signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
      const result = await auth.signUp(email, password, firstName, lastName);
      
      // Store token and user data
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setCurrentUser(result.user);
      
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const result = await auth.signIn(email, password);
      
      // Store token and user data
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setCurrentUser(result.user);
      
      return result;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      await auth.signOut();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setCurrentUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Signout error:', error);
    }
  }

  async function resetPassword(email: string) {
    try {
      const result = await auth.forgotPassword(email);
      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async function updateUserProfile(displayName: string) {
    // This would be implemented with the backend API
    console.log('Update user profile:', displayName);
  }

  const value: AuthContextType = {
    currentUser,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
