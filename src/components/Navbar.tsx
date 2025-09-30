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
    <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <Logo size="md" showText={true} />
          </Link>

          {/* Navigation Items */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Info & Logout */}
          {userProfile && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{userProfile.nickname}</span>
                <span className="text-gray-400 ml-1">#{userProfile.handle}</span>
              </div>
              <button
                onClick={onLogoutClick}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                title="Logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
