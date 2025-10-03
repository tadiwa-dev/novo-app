'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, signInAnonymous, signInWithGoogle, signInWithEmail, createUserWithEmail } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface UserProfile {
  nickname: string;
  handle: string;
  currentDay: number;
  completedDays: number[];
  badges: string[];
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  createUserWithEmail: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  setUserProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let previousAnonUid: string | null = null;
    const unsubscribe = onAuthStateChange(async (user) => {
      // Remember previous anonymous UID for potential migration
      if (user && user.isAnonymous) {
        previousAnonUid = user.uid;
      }

      setUser(user);
      if (user) {
        try {
          // Load user profile from Firestore
          const { getUserProfile } = await import('@/lib/firebase');
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile as UserProfile | null);
        } catch (error) {
          console.warn('Firebase connection blocked - using local storage fallback');
          // Fallback to local storage if Firebase is blocked
          const localProfile = localStorage.getItem(`userProfile_${user.uid}`);
          if (localProfile) {
            setUserProfile(JSON.parse(localProfile));
          }
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (): Promise<User> => {
    try {
      const result = await signInAnonymous();
      const { createUserProfile, getUserProfile } = await import('@/lib/firebase');
      
      // Generate a guest nickname and handle
      const guestNumber = Math.floor(Math.random() * 10000);
      const nickname = `Guest ${guestNumber}`;
      const handle = `guest${guestNumber}`;
      
      // Create profile for anonymous user
      await createUserProfile(result.user.uid, nickname, handle);
      const profile = await getUserProfile(result.user.uid);
      setUserProfile(profile as UserProfile | null);
      
      return result.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const handleGoogleSignIn = async (): Promise<User> => {
    // If there is an anonymous user signed in, capture their uid for migration
    const currentAnonUid = auth.currentUser && auth.currentUser.isAnonymous ? auth.currentUser.uid : null;
    console.log('[Auth] Google sign-in: currentAnonUid =', currentAnonUid);
    try {
      const result = await signInWithGoogle();
      const newUser = result.user;

      console.log('[Auth] Google sign-in: newUser.uid =', newUser.uid);

      const { migrateAnonymousAccount, getUserProfile, createUserProfile } = await import('@/lib/firebase');

      // If there was an anonymous user, migrate their data
      if (currentAnonUid) {
        try {
          console.log('[Auth] Running migrateAnonymousAccount from', currentAnonUid, 'to', newUser.uid);
          await migrateAnonymousAccount(currentAnonUid, newUser.uid);
          const profile = await getUserProfile(newUser.uid);
          setUserProfile(profile as UserProfile | null);
          console.log('[Auth] Migration complete, profile:', profile);
        } catch (mErr) {
          console.warn('Migration failed:', mErr);
        }
      } else {
        // No anonymous user, so check if profile exists, and create if not
        let profile = await getUserProfile(newUser.uid);
        if (!profile) {
          // Use displayName or fallback to 'User', and generate a handle
          const nickname = newUser.displayName || 'User';
          const handle = (nickname.replace(/\s+/g, '').toLowerCase() || 'user') + Math.floor(Math.random() * 10000);
          await createUserProfile(newUser.uid, nickname, handle);
          profile = await getUserProfile(newUser.uid);
        }
        setUserProfile(profile as UserProfile | null);
      }

      // Attempt to register push token (if messaging configured)
      try {
        const { registerPushToken } = await import('@/lib/firebase');
        await registerPushToken();
      } catch (err) {
        // ignore
      }

      return newUser;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const handleEmailSignIn = async (email: string, password: string): Promise<User> => {
    const currentAnonUid = auth.currentUser && auth.currentUser.isAnonymous ? auth.currentUser.uid : null;
    try {
      const result = await signInWithEmail(email, password);
      const newUser = result.user;

      if (currentAnonUid && newUser.uid !== currentAnonUid) {
        try {
          const { migrateAnonymousAccount, getUserProfile } = await import('@/lib/firebase');
          await migrateAnonymousAccount(currentAnonUid, newUser.uid);
          const profile = await getUserProfile(newUser.uid);
          setUserProfile(profile as UserProfile | null);
        } catch (mErr) {
          console.warn('Migration failed:', mErr);
        }
      }

      return newUser;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const handleCreateUserWithEmail = async (email: string, password: string): Promise<User> => {
    const currentAnonUid = auth.currentUser && auth.currentUser.isAnonymous ? auth.currentUser.uid : null;
    try {
      const result = await createUserWithEmail(email, password);
      const newUser = result.user;

      if (currentAnonUid && newUser.uid !== currentAnonUid) {
        try {
          const { migrateAnonymousAccount, getUserProfile } = await import('@/lib/firebase');
          await migrateAnonymousAccount(currentAnonUid, newUser.uid);
          const profile = await getUserProfile(newUser.uid);
          setUserProfile(profile as UserProfile | null);
        } catch (mErr) {
          console.warn('Migration failed:', mErr);
        }
      }

      return newUser;
    } catch (error) {
      console.error('Error creating user with email:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      // Don't manually set user and userProfile to null here
      // Let the auth state change listener handle it
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signInWithGoogle: handleGoogleSignIn,
    signInWithEmail: handleEmailSignIn,
    createUserWithEmail: handleCreateUserWithEmail,
    logout,
    setUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
