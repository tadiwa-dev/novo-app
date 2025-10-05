'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile } = useAuth();

  return (
    <div className="relative">
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
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

      {/* Menu Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          {/* Menu Content */}
          <div className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl p-4 space-y-6">
            {/* User Profile Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile</h2>
              {user ? (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{user.email || 'Anonymous User'}</p>
                  <Link 
                    href="/profile" 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    View Profile
                  </Link>
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
        </div>
      )}
    </div>
  );
}