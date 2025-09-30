'use client';

import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { UrgeRescue } from './UrgeRescue';
import { LogoutDialog } from './LogoutDialog';
import { SignInPopup } from './SignInPopup';
import { useAuth } from '@/contexts/AuthContext';
import { TestButtons } from './TestButtons';
import { SimpleInputTest } from './SimpleInputTest';
import { InputTest } from './InputTest';
import { HTMLInputTest } from './HTMLInputTest';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    // Show sign-in popup after user has been using the app for a while
    // Only show for anonymous users who have made progress
    if (user && userProfile && user.isAnonymous && userProfile.currentDay > 1) {
      const hasSeenPopup = localStorage.getItem('novo-signin-popup-seen');
      const lastShown = localStorage.getItem('novo-signin-popup-last-shown');
      
      if (!hasSeenPopup) {
        // Show popup after 30 seconds of app usage
        const timer = setTimeout(() => {
          setShowSignInPopup(true);
          localStorage.setItem('novo-signin-popup-seen', 'true');
          localStorage.setItem('novo-signin-popup-last-shown', Date.now().toString());
        }, 30000);
        
        return () => clearTimeout(timer);
      } else if (lastShown) {
        // Show popup again after 7 days if user hasn't signed in
        const lastShownDate = new Date(parseInt(lastShown));
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        if (lastShownDate < sevenDaysAgo) {
          const timer = setTimeout(() => {
            setShowSignInPopup(true);
            localStorage.setItem('novo-signin-popup-last-shown', Date.now().toString());
          }, 10000); // Show after 10 seconds on return visits
          
          return () => clearTimeout(timer);
        }
      }
    }
  }, [user, userProfile]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onLogoutClick={() => setShowLogoutDialog(true)} />
      <main className="flex-1">
        {children}
      </main>
      <UrgeRescue />
      <LogoutDialog 
        isOpen={showLogoutDialog} 
        onClose={() => setShowLogoutDialog(false)} 
      />
      <SignInPopup 
        isOpen={showSignInPopup} 
        onClose={() => setShowSignInPopup(false)} 
      />
      {/* Debug components removed for production */}
    </div>
  );
}
