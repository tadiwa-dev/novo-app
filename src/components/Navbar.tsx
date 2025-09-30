'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from './Logo';

const navItems = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Urge Rescue', href: '/urge-rescue', icon: '🚨' },
];

interface NavbarProps {
  onLogoutClick: () => void;
}

export function Navbar({ onLogoutClick }: NavbarProps) {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  // Don't show navbar on onboarding page
  if (pathname === '/onboarding') {
    return null;
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-blue-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/">
            <Logo size="sm" showText={false} />
          </Link>

          {/* Navigation Items */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50'
                  }`}
                >
                  <span className="text-sm sm:text-base">{item.icon}</span>
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Info & Logout */}
          {userProfile && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                <span className="font-medium">{userProfile.nickname}</span>
                <span className="text-gray-400 dark:text-gray-500 ml-1">#{userProfile.handle}</span>
              </div>
              <button
                onClick={onLogoutClick}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs sm:text-sm font-medium transition-colors"
                title="Logout"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
