'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SignInPopup } from './SignInPopup';

export function SignInPrompt() {
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    // Smart sign-in suggestion system for anonymous users
    if (user && userProfile && user.isAnonymous) {
      const currentDay = userProfile.currentDay || 1;
      const lastShown = localStorage.getItem('novo-signin-popup-last-shown');
      const lastShownDay = localStorage.getItem('novo-signin-popup-last-shown-day');
      const lastShownDate = lastShown ? new Date(parseInt(lastShown)) : null;
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      let shouldShowPopup = false;
      let delay = 5000; // Default 5 second delay
      
      // Check if we should show the popup based on day milestones
      if (currentDay === 3 && lastShownDay !== '3') {
        // After completing day 2 (user is now on day 3)
        shouldShowPopup = true;
        delay = 3000; // Show quickly after day completion
      } else if (currentDay === 8 && lastShownDay !== '8') {
        // After completing day 7 (user is now on day 8)
        shouldShowPopup = true;
        delay = 3000; // Show quickly after day completion
      } else if (currentDay > 7 && lastShownDate && lastShownDate < oneWeekAgo) {
        // After completing day 7, show every week if user hasn't signed in
        shouldShowPopup = true;
        delay = 10000; // Longer delay for weekly reminders
      }
      
      if (shouldShowPopup) {
        const timer = setTimeout(() => {
          setShowSignInPopup(true);
          localStorage.setItem('novo-signin-popup-last-shown', Date.now().toString());
          localStorage.setItem('novo-signin-popup-last-shown-day', currentDay.toString());
        }, delay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user, userProfile]);

  return (
    <SignInPopup 
      isOpen={showSignInPopup} 
      onClose={() => setShowSignInPopup(false)} 
    />
  );
}