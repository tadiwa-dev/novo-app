'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuContent = mounted && isOpen ? (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/40" 
        onClick={() => setIsOpen(false)}
      />
      {/* Animated Menu Content */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl p-4 space-y-6 z-[9999] transform transition-transform duration-300 ease-in-out translate-x-0 pointer-events-auto`}
      >
        {/* User Profile Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile</h2>
          {user ? (
            <div className="mt-2 space-y-3">
              {userProfile ? (
                <>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {userProfile.nickname || 'Anonymous User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email || '@' + userProfile.handle}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-md">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Day {userProfile.currentDay}
                      </p>
                    </div>
                    {userProfile.badges && userProfile.badges.length > 0 && (
                      <div className="flex -space-x-1">
                        {userProfile.badges.slice(0, 3).map((badge, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"
                            title={badge}
                          >
                            🏆
                          </span>
                        ))}
                        {userProfile.badges.length > 3 && (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                            +{userProfile.badges.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Link 
                    href="/profile" 
                    className="inline-block px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    View Full Profile
                  </Link>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{user.email || 'Anonymous User'}</p>
                  <Link 
                    href="/profile" 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Complete Profile
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300">Not signed in</p>
          )}
        </div>

        {/* Menu Links */}
        <nav className="space-y-4">
          <Link
            href="/donate"
            className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Support Us
          </Link>
          <a
            href="mailto:solutionsthm@gmail.com"
            className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </a>
        </nav>
      </div>
    </>
  ) : null;

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
      >
        <span className="sr-only">Open menu</span>
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      
      {/* Portal the menu outside of navbar stacking context */}
      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}