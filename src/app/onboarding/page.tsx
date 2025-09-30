'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createUserProfile } from '@/lib/firebase';
import { Logo } from '@/components/Logo';

export default function OnboardingPage() {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, signIn, signInWithGoogle, signInWithEmail } = useAuth();
  const router = useRouter();

  // Debug: Log state changes (removed to prevent infinite re-renders)
  // console.log('OnboardingPage render - nickname:', nickname);

  const generateHandle = () => {
    const adjectives = ['Brave', 'Faithful', 'Strong', 'Hopeful', 'Courageous', 'Blessed', 'Free', 'Loved', 'Chosen', 'Victorious'];
    const nouns = ['Pilgrim', 'Warrior', 'Disciple', 'Believer', 'Overcomer', 'Seeker', 'Healer', 'Light', 'Grace', 'Hope'];
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 9999) + 1;
    
    return `${adjective}${noun}#${number}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let currentUser = user;
      
      // Sign in anonymously if not already signed in
      if (!currentUser) {
        currentUser = await signIn();
      }

      // Generate handle and create profile
      const handle = generateHandle();
      await createUserProfile(currentUser.uid, nickname.trim(), handle);

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error during onboarding:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Google sign-in clicked on onboarding');
    setIsLoading(true);
    setError('');

    try {
      const currentUser = await signInWithGoogle();
      
      // Generate handle and create profile
      const handle = generateHandle();
      const displayName = currentUser.displayName || 'User';
      await createUserProfile(currentUser.uid, displayName, handle);

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    console.log('Email sign-in clicked on onboarding');
    setIsLoading(true);
    setError('');

    try {
      const currentUser = await signInWithEmail();
      
      // Generate handle and create profile
      const handle = generateHandle();
      const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
      await createUserProfile(currentUser.uid, displayName, handle);

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error signing in with email:', error);
      setError(error instanceof Error ? error.message : 'Email sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome to Novo
            </h1>
            <p className="text-gray-600">
              Your journey to freedom begins here
            </p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                What should we call you?
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={nickname}
                onChange={(e) => {
                  console.log('Input changed:', e.target.value);
                  setNickname(e.target.value);
                }}
                placeholder="Enter your nickname"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isLoading}
                autoComplete="off"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be your display name in the community
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !nickname.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Starting Your Journey...
                </div>
              ) : (
                'Start My Journey'
              )}
            </button>
          </form>

          {/* Sign-in Options */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-3">Or continue with:</p>
            </div>
            
            <div className="space-y-3">
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

              <button
                onClick={handleEmailSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Email</span>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p className="mb-2">🔒 Your privacy is protected</p>
              <p>Sign in to save your progress across devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
