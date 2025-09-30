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
        <div className="max-w-2xl mx-auto p-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Day {currentDay} Completed!
            </h1>
            <p className="text-gray-600 text-base">
              Great job! You've taken another step forward in your journey.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What's Next?</h2>
            <p className="text-gray-700 mb-4">
              {currentDay < 14 
                ? `Come back tomorrow to unlock Day ${currentDay + 1} and continue your journey to freedom.`
                : "Congratulations! You've completed this week. More content will be available soon."
              }
            </p>
            <p className="text-gray-600 text-sm">
              "The Lord will guide you always; he will satisfy your needs in a sun-scorched land and will strengthen your frame." - Isaiah 58:11
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRedo}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
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
      <div className="max-w-4xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-pink-100/30 rounded-3xl blur-3xl -z-10"></div>
            
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium mb-4 shadow-md">
                Week {weekNumber} • Day {dayInWeek} of 7
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                {week.title}
              </h1>
              <p className="text-gray-600 text-base">
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
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
              disabled={currentCardIndex === 0}
              className="flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-600 rounded-xl font-medium hover:bg-white hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Card Indicators */}
            <div className="flex space-x-2 bg-white/60 backdrop-blur-sm rounded-full p-2 border border-white/20">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCardIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentCardIndex === index ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-md' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentCardIndex(Math.min(4, currentCardIndex + 1))}
              disabled={currentCardIndex === 4}
              className="flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-600 rounded-xl font-medium hover:bg-white hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            >
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="relative h-[400px] perspective-1000">
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
                <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 shadow-xl h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-base">📖</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Scripture</h2>
                  </div>
                  <p className="text-blue-700 italic text-base leading-relaxed mb-2">"{day.verse}"</p>
                  <p className="text-blue-600 font-semibold">— {day.verseReference}</p>
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
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-xl h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-base">💭</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Devotional</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base">
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
                <div className="bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-sm border border-green-200/50 rounded-2xl p-6 shadow-xl h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-base">✍️</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Activity</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base">
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
                <div className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-6 shadow-xl h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-base">🙏</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Prayer</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base">
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
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-xl h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white text-base">💭</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Reflection</h2>
                  </div>
                  <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    {day.reflection}
                  </p>
                  <textarea
                    id="reflection"
                    name="reflection"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Share your thoughts and reflections here..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>


            {/* Complete Button - Only show on last card */}
            {currentCardIndex === 4 && (
              <div className="mt-8">
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting || !reflection.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-base hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                      Completing Day...
                    </div>
                  ) : (
                    'Complete This Day'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
    </Layout>
  );
}
