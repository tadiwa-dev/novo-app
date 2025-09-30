'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { deleteDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutDialog({ isOpen, onClose }: LogoutDialogProps) {
  const { logout, user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLogoutAndDelete = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Delete user profile
      await deleteDoc(doc(db, 'users', user.uid));
      
      // Delete all journal entries
      const journalQuery = query(
        collection(db, 'journal'),
        where('userId', '==', user.uid)
      );
      const journalSnapshot = await getDocs(journalQuery);
      const deletePromises = journalSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Delete all prayer requests
      const prayerQuery = query(
        collection(db, 'prayers'),
        where('userId', '==', user.uid)
      );
      const prayerSnapshot = await getDocs(prayerQuery);
      const prayerDeletePromises = prayerSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(prayerDeletePromises);
      
      // Now logout
      await logout();
      onClose();
    } catch (error) {
      console.error('Error deleting data and logging out:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center backdrop-blur-md">
        <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🚪</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Logout Options</h2>
          <p className="text-gray-600">
            Choose how you&apos;d like to logout
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            Just Logout
          </button>
          
          <div className="text-center text-gray-500 text-sm">
            Keep your progress and come back anytime
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={handleLogoutAndDelete}
              disabled={isDeleting}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Deleting Data...
                </div>
              ) : (
                'Logout & Delete All Data'
              )}
            </button>
            
            <div className="text-center text-gray-500 text-sm mt-2">
              Permanently delete your profile and all data
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
        </div>
      </div>
    </>
  );
}
