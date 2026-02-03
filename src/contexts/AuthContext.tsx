import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AuthContextType } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ACCOUNT_COMPANY, UPDATE_COMPANY } from '@/graphql/mutations';
import { GET_USER_SUBSCRIPTION } from '@/graphql/queries';
import { createCompanyIfNotExists } from '@/graphql/queries';
import { CompanyInfoModal } from '@/components/CompanyInfoModal';

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
  const [createAccountCompany, { error }] = useMutation(CREATE_ACCOUNT_COMPANY);
  const [updateCompany] = useMutation(UPDATE_COMPANY);
  const navigate = useNavigate();
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);

  const { data: subscriptionData, loading: subscriptionLoading } = useQuery(GET_USER_SUBSCRIPTION, {
    variables: { userId: currentUser?.id },
    skip: !currentUser,
  });

  //console.log('Subscription Data:', subscriptionData);

  useEffect(() => {
    // ✅ Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // ✅ Set up Supabase auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth Event:', event); // Debugging purpose
      setCurrentUser(session?.user ?? null);
      setLoading(false);

      // ✅ Handle password recovery event
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      }

      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);


  // useEffect(() => {
  //   // Check current session
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setCurrentUser(session?.user ?? null);
  //     setLoading(false);
  //   });

  //   // Set up Supabase auth state listener
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     setCurrentUser(session?.user ?? null);

  //     console.log(session?.user);
  //     setLoading(false);

  //     if (event === 'SIGNED_OUT') {
  //       navigate('/login');
  //     }
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [navigate]);

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      throw error;
    }

    // Successfully logged in
    const user = data.user; // This contains the user object
    const userId = user.id; // This is the UUID of the logged-in user
    console.log('Logged in user UUID:', userId);
    createCompanyIfNotExists(userId, user.user_metadata.full_name);
  }

  async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;

    const user = data.user; // This contains the user object
    const userId = user?.id; // This is the UUID of the signed-up user

    try {
      const companyData = await createAccountCompany({
        variables: {
          input: {
            name: `${name}'s company`,
            owner_id: userId,
          },
        },
      });

      const companyId = companyData.data.insertIntocompaniesCollection.records[0].id;

      // Store the company ID in state
      setCurrentCompanyId(companyId);

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          company_id: companyId,
        },
      });

      if (updateError) {
        throw new Error(
          `Failed to update user metadata: ${updateError.message}`
        );
      }

      console.log('User metadata updated with company_id:', companyId);

      console.log('Company created:', companyData);
    } catch (err) {
      console.error('Error creating company:', err);
    }

    // Show company info modal after signup
    setShowCompanyModal(true);
  }

  const handleCompanySubmit = async (companyName: string, logoUrl: string | null) => {
    console.log('Received logo URL:', logoUrl); // Log the received URL
    try {
      const companyData = await updateCompany({
        variables: {
          id: currentCompanyId,
          input: {
            name: companyName,
            logo_url: logoUrl, // Ensure this is used
          },
        },
      });

      console.log('Company updated:', companyData);
    } catch (err) {
      console.error('Error updating company:', err);
    }

    setShowCompanyModal(false);
    setRedirectToDashboard(true);
  };

  useEffect(() => {
    if (redirectToDashboard) {
      navigate('/dashboard');
      setRedirectToDashboard(false); // Reset to prevent re-triggering
    }
  }, [redirectToDashboard, navigate]);

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate('/login');
  }

  // async function resetPassword(email: string) {
  //   const { error } = await supabase.auth.resetPasswordForEmail(email);
  //   if (error) throw error;
  // }

  function generateRandomString(length = 128) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => ('0' + byte.toString(16)).slice(-2)).join('');
  }
  
  async function resetPassword(email: string) {
    const codeVerifier = generateRandomString();
    console.log('Generated Code Verifier:', codeVerifier);
    localStorage.setItem('pkce_code_verifier', codeVerifier);
  
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://app.jobbify.com.au/reset-password', // ✅ Ensure correct redirect URL 
      //redirectTo: 'http://localhost:5173/reset-password', // ✅ Ensure correct redirect URL 
    });
  
    if (error) throw error;
  }

  async function updateUserProfile(displayName: string) {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName },
    });
    if (error) throw error;
  }

  async function updateUserPassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }

  async function updateUserEmail(newEmail: string) {
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });
    if (error) throw error;
  }

  async function setNewPassword(token: string, newPassword: string) {
    // This should be handled server-side or through a custom API
    // Placeholder for server-side logic
    console.log('This function should be implemented server-side to handle password reset securely.');
    // Example: await yourServerApi.resetPassword(token, newPassword);
  }

  const value: AuthContextType = {
    currentUser,
    loading: loading || subscriptionLoading,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserPassword,
    updateUserEmail,
    setNewPassword,
    companyId: currentUser?.user_metadata?.company_id || null,
    subscription: subscriptionData?.subscriptionsCollection.edges[0]?.node || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      <CompanyInfoModal
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onSubmit={handleCompanySubmit}
      />
    </AuthContext.Provider>
  );
}
