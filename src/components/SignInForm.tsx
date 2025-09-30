'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SignInFormProps {
  onSuccess?: (user?: any) => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export function SignInForm({ onSuccess, onCancel, showCancel = true }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { signInWithEmail, createUserWithEmail, signInWithGoogle } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let user;
      if (mode === 'signin') {
        user = await signInWithEmail(email.trim(), password.trim());
      } else {
        user = await createUserWithEmail(email.trim(), password.trim());
      }
      onSuccess?.(user);
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Try signing up instead.');
        setMode('signup');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try signing in instead.');
        setMode('signin');
      } else {
        setError(error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const user = await signInWithGoogle();
      onSuccess?.(user);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site and try again.');
      } else {
        setError(error.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email/Password Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            disabled={isLoading}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email.trim() || !password.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
            </div>
          ) : (
            mode === 'signin' ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      {/* Toggle between sign in and sign up */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError('');
          }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          disabled={isLoading}
        >
          {mode === 'signin' 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"
          }
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="font-medium">Google</span>
      </button>

      {/* Cancel Button */}
      {showCancel && onCancel && (
        <div className="text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
