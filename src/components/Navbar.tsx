'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BurgerMenu } from './BurgerMenu';

const navItems = [
	{
		name: 'Home',
		href: '/',
		icon: (
			<svg
				className="w-4 h-4 sm:w-5 sm:h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
			>
				<path
					strokeWidth={1.5}
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z"
				/>
			</svg>
		)
	},
	{
		name: 'Urge Rescue',
		href: '/urge-rescue',
		// keep the panic emoji as requested
		icon: '🚨'
	},
	{
		name: 'Donate',
		href: '/donate',
		icon: (
			<svg
				className="w-4 h-4 sm:w-5 sm:h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
			>
				<path
					strokeWidth={1.5}
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
				/>
			</svg>
		)
	}
];

interface NavbarProps {
	onLogoutClick?: () => void;
}

export function Navbar({ onLogoutClick }: NavbarProps) {
	const pathname = usePathname();
	const { userProfile } = useAuth();
	const handleLogout = onLogoutClick || (() => {});

	// Don't show navbar on onboarding page
	if (pathname === '/onboarding') {
		return null;
	}

	return (
		<nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-blue-200 dark:border-gray-700 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
				<div className="flex justify-between items-center h-14 sm:h-16">
					{/* BurgerMenu on the left, logo removed */}
					<div className="flex items-center">
						<BurgerMenu />
					</div>

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
								<span className="text-gray-400 dark:text-gray-500 ml-1">
									#{userProfile.handle}
								</span>
							</div>
							<button
								onClick={handleLogout}
								className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs sm:text-sm font-medium transition-colors"
								title="Logout"
							>
								<span className="hidden sm:inline">Logout</span>
								<span className="sm:hidden">
									<svg
										className="w-5 h-5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeWidth={1.5}
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
										/>
										<path
											strokeWidth={1.5}
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M10 17l5-5-5-5"
										/>
										<path
											strokeWidth={1.5}
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 12H3"
										/>
									</svg>
								</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
