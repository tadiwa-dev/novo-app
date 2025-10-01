'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { saveJournalEntry, updateUserProgress } from '@/lib/firebase';
import journeyData from '@/data/journey.json';

export default function Home() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/onboarding');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your journey..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Wait for user profile to load
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Get current day from user profile
  const currentDay = userProfile.currentDay || 1;
  
  // Determine which week based on current day
  const weekNumber = Math.ceil(currentDay / 7);
  const weekKey = `week${weekNumber}`;
  const week = journeyData[weekKey as keyof typeof journeyData];
  
  // Get the day within the week (1-7)
  const dayInWeek = ((currentDay - 1) % 7) + 1;
  const day = week?.days.find(d => d.day === dayInWeek);

  if (!day) {
  return (
      <Layout>
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Day Not Found</h1>
          <p className="text-gray-600">Something went wrong. Please try refreshing the page.</p>
        </div>
      </Layout>
    );
  }

  const handleComplete = async () => {
    if (!reflection.trim()) {
      alert('Please write your reflection before completing the day.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save journal entry
      await saveJournalEntry(user.uid, currentDay, reflection.trim());
      
      // Update user progress
      await updateUserProgress(user.uid, currentDay);
      
      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing day:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedo = () => {
    setIsCompleted(false);
    setReflection('');
  };

  if (isCompleted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Day {currentDay} Completed!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Great job! You've taken another step forward in your journey.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/50 dark:to-blue-900/50 rounded-xl p-4 sm:p-6 border border-green-200 dark:border-green-700 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">What's Next?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              {currentDay < 14 
                ? `Come back tomorrow to unlock Day ${currentDay + 1} and continue your journey to freedom.`
                : "Congratulations! You've completed this week. More content will be available soon."
              }
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              "The Lord will guide you always; he will satisfy your needs in a sun-scorched land and will strengthen your frame." - Isaiah 58:11
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleRedo}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              Re-do This Day
            </button>
            {currentDay < 14 && (
              <button
                onClick={() => {
                  // Close the completion dialog and refresh to show the next day
                  // The progress was already updated in handleComplete
                  setIsCompleted(false);
                  setCurrentCardIndex(0);
                  setReflection('');
                  // Force a page refresh to load the new day
                  window.location.reload();
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
              >
                See You Tomorrow
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-pink-100/30 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl blur-3xl -z-10"></div>
            
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-lg border border-white/20 dark:border-gray-700/20">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 shadow-md">
                Week {weekNumber} • Day {dayInWeek} of 7
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3">
                {week.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                {weekNumber === 1 
                  ? "Your journey to freedom begins with understanding God's love"
                  : "Continuing your journey to freedom through Christ's grace"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Card Deck */}
        <div className="max-w-2xl mx-auto">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <button
              onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
              disabled={currentCardIndex === 0}
              className="flex items-center px-3 sm:px-6 py-2 sm:py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-lg sm:rounded-xl font-medium hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 dark:border-gray-700/20 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Card Indicators */}
            <div className="flex space-x-1 sm:space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full p-1 sm:p-2 border border-white/20 dark:border-gray-700/20">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCardIndex(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                    currentCardIndex === index ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-md' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentCardIndex(Math.min(4, currentCardIndex + 1))}
              disabled={currentCardIndex === 4}
              className="flex items-center px-3 sm:px-6 py-2 sm:py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-lg sm:rounded-xl font-medium hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 dark:border-gray-700/20 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="relative h-[350px] sm:h-[400px] perspective-1000">
            {/* Card Stack */}
            <div className="relative w-full h-full">
              {/* Scripture Card */}
              <div 
                className={`absolute inset-0 transition-all duration-500 transform ${
                  currentCardIndex === 0 
                    ? 'translate-x-0 translate-y-0 rotate-0 z-10' 
                    : 'translate-x-4 translate-y-4 rotate-2 z-0'
                }`}
                style={{ 
                  transform: currentCardIndex === 0 
                    ? 'translateX(0) translateY(0) rotate(0deg)' 
                    : `translateX(${4 + (3 - currentCardIndex) * 2}px) translateY(${4 + (3 - currentCardIndex) * 2}px) rotate(${2 + (3 - currentCardIndex) * 0.5}deg)`
                }}
              >
                <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-blue-900/90 dark:to-indigo-900/90 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-2xl p-4 sm:p-6 shadow-xl h-full">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                      <span className="text-white text-sm sm:text-base">📖</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Scripture</h2>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 italic text-sm sm:text-base leading-relaxed mb-2">"{day.verse}"</p>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base">— {day.verseReference}</p>
                </div>
              </div>

              {/* Devotional Card */}
              <div 
                className={`absolute inset-0 transition-all duration-500 transform ${
                  currentCardIndex === 1 
                    ? 'translate-x-0 translate-y-0 rotate-0 z-10' 
                    : 'translate-x-4 translate-y-4 rotate-2 z-0'
                }`}
                style={{ 
                  transform: currentCardIndex === 1 
                    ? 'translateX(0) translateY(0) rotate(0deg)' 
                    : `translateX(${4 + (3 - currentCardIndex) * 2}px) translateY(${4 + (3 - currentCardIndex) * 2}px) rotate(${2 + (3 - currentCardIndex) * 0.5}deg)`
                }}
              >
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 sm:p-6 shadow-xl h-full">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                      <span className="text-white text-sm sm:text-base">💭</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Devotional</h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    {day.devotional}
                  </p>
                </div>
              </div>

              {/* Activity Card */}
              <div 
                className={`absolute inset-0 transition-all duration-500 transform ${
                  currentCardIndex === 2 
                    ? 'translate-x-0 translate-y-0 rotate-0 z-10' 
                    : 'translate-x-4 translate-y-4 rotate-2 z-0'
                }`}
                style={{ 
                  transform: currentCardIndex === 2 
                    ? 'translateX(0) translateY(0) rotate(0deg)' 
                    : `translateX(${4 + (3 - currentCardIndex) * 2}px) translateY(${4 + (3 - currentCardIndex) * 2}px) rotate(${2 + (3 - currentCardIndex) * 0.5}deg)`
                }}
              >
                <div className="bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:from-green-900/90 dark:to-emerald-900/90 backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 rounded-2xl p-4 sm:p-6 shadow-xl h-full">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                      <span className="text-white text-sm sm:text-base">✍️</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Activity</h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    {day.activity}
                  </p>
                </div>
              </div>

              {/* Prayer Card */}
              <div 
                className={`absolute inset-0 transition-all duration-500 transform ${
                  currentCardIndex === 3 
                    ? 'translate-x-0 translate-y-0 rotate-0 z-10' 
                    : 'translate-x-4 translate-y-4 rotate-2 z-0'
                }`}
                style={{ 
                  transform: currentCardIndex === 3 
                    ? 'translateX(0) translateY(0) rotate(0deg)' 
                    : `translateX(${4 + (3 - currentCardIndex) * 2}px) translateY(${4 + (3 - currentCardIndex) * 2}px) rotate(${2 + (3 - currentCardIndex) * 0.5}deg)`
                }}
              >
                <div className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 dark:from-purple-900/90 dark:to-pink-900/90 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 rounded-2xl p-4 sm:p-6 shadow-xl h-full">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                      <span className="text-white text-sm sm:text-base">🙏</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Prayer</h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    {day.prayer}
                  </p>
                </div>
              </div>

              {/* Reflection Card */}
              <div 
                className={`absolute inset-0 transition-all duration-500 transform ${
                  currentCardIndex === 4 
                    ? 'translate-x-0 translate-y-0 rotate-0 z-10' 
                    : 'translate-x-4 translate-y-4 rotate-2 z-0'
                }`}
                style={{ 
                  transform: currentCardIndex === 4 
                    ? 'translateX(0) translateY(0) rotate(0deg)' 
                    : `translateX(${4 + (4 - currentCardIndex) * 2}px) translateY(${4 + (4 - currentCardIndex) * 2}px) rotate(${2 + (4 - currentCardIndex) * 0.5}deg)`
                }}
              >
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 sm:p-6 shadow-xl h-full">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                      <span className="text-white text-sm sm:text-base">💭</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Reflection</h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                    {day.reflection}
                  </p>
                  <textarea
                    id="reflection"
                    name="reflection"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Share your thoughts and reflections here..."
                    className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-sm sm:text-base"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>


            {/* Complete Button - Only show on last card */}
            {currentCardIndex === 4 && (
              <div className="mt-6 sm:mt-8">
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting || !reflection.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full mr-2 sm:mr-3"></div>
                      <span className="text-sm sm:text-base">Completing Day...</span>
                    </div>
                  ) : (
                    'Complete This Day'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Donate CTA */}
          <div className="max-w-2xl mx-auto mt-6">
            <a
              href="/donate"
              className="block w-full text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold text-base hover:shadow-xl transition-all duration-300"
            >
              Donate
            </a>
          </div>
        </div>
    </div>
    </Layout>
  );
}
