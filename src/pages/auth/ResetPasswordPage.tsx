import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Lock, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type ResetPasswordForm = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const codeVerifier = localStorage.getItem('pkce_code_verifier');

    console.log('Retrieved Code Verifier:', codeVerifier);
    console.log('Code from URL:', code);

    if (!codeVerifier) {
      throw new Error('Code verifier is missing.');
    }

    if (!code) {
      throw new Error('Invalid reset link. Missing code.');
    }

    const verifySession = async () => {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('Session exchange error:', error);
          throw new Error(`Invalid or expired reset link: ${error.message}`);
        }

        if (data?.session) {
          console.log('Session established:', data.session);
          setSessionChecked(true);
        } else {
          throw new Error('Session data is missing after exchange.');
        }
      } catch (err) {
        console.error('Verification Error:', err);
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('Invalid or expired reset link.');
        }
      }
    };

    verifySession();
  }, []);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;

      alert('Password reset successful. You can now log in.');
      navigate('/login');
    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessage('Error resetting password. Please try again.');
    }
  };

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{errorMessage}</p>
      </div>
    );
  }

  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying reset link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-4 text-slate-800">Reset Your Password</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                {...register('newPassword')}
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your new password"
              />
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Key className="h-5 w-5 mr-2" />
                Reset Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
