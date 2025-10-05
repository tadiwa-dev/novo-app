'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface UserStats {
  totalEntries: number;
  urgeRescueUses: number;
  lastActive: Date | null;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalEntries: 0,
    urgeRescueUses: 0,
    lastActive: null
  });

  useEffect(() => {
    async function fetchUserStats() {
      if (!user) return;

      try {
        // Get journal entries count
        const entriesQuery = query(
          collection(db, 'journal_entries'),
          where('userId', '==', user.uid)
        );
        const entriesSnapshot = await getDocs(entriesQuery);
        
        // Get urge rescue uses
        const urgeRescueQuery = query(
          collection(db, 'urge_rescue_uses'),
          where('userId', '==', user.uid)
        );
        const urgeRescueSnapshot = await getDocs(urgeRescueQuery);

        // Find the most recent activity
        const allDocs = [...entriesSnapshot.docs, ...urgeRescueSnapshot.docs];
        const lastActiveDate = allDocs.length > 0
          ? new Date(Math.max(...allDocs.map(doc => doc.data().createdAt?.seconds * 1000 || 0)))
          : null;

        setStats({
          totalEntries: entriesSnapshot.size,
          urgeRescueUses: urgeRescueSnapshot.size,
          lastActive: lastActiveDate
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    }

    fetchUserStats();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4">
        <p className="text-center text-gray-600 dark:text-gray-300">
          Please sign in to view your profile
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Profile</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Account</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email || 'Anonymous User'}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Your Journey Stats</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalEntries}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Journal Entries</div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.urgeRescueUses}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Times Rescued</div>
              </div>
            </div>
            
            {stats.lastActive && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Last activity: {stats.lastActive.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}