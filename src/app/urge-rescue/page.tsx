'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import urgeRescueData from '@/data/urge-rescue.json';

export default function UrgeRescuePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentScripture, setCurrentScripture] = useState(0);
  const [currentPrayer, setCurrentPrayer] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/onboarding');
    }
  }, [user, loading, router]);

  const getRandomScripture = () => {
    const randomIndex = Math.floor(Math.random() * urgeRescueData.scriptures.length);
    setCurrentScripture(randomIndex);
  };

  const getRandomPrayer = () => {
    const randomIndex = Math.floor(Math.random() * urgeRescueData.prayers.length);
    setCurrentPrayer(randomIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const scripture = urgeRescueData.scriptures[currentScripture];
  const prayer = urgeRescueData.prayers[currentPrayer];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚨</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Urge Rescue
          </h1>
          <p className="text-gray-600">
            You&apos;re not alone. God is with you in this moment.
          </p>
        </div>

        {/* Scripture Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-800">📖 Scripture for Strength</h2>
            <button
              onClick={getRandomScripture}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              New Verse
            </button>
          </div>
          <blockquote className="text-blue-700 italic text-lg leading-relaxed mb-3">
            &quot;{scripture.text}&quot;
          </blockquote>
          <p className="text-blue-600 font-medium">— {scripture.reference}</p>
        </div>

        {/* Prayer Section */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-purple-800">🙏 Prayer for This Moment</h2>
            <button
              onClick={getRandomPrayer}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              New Prayer
            </button>
          </div>
          <p className="text-purple-700 leading-relaxed text-lg">
            {prayer}
          </p>
        </div>

        {/* Worship Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🎵 Worship & Peace</h2>
          <p className="text-gray-600 mb-6">
            Let worship music help you focus on God and find peace in this moment.
          </p>
          <div className="max-w-md mx-auto">
            <a
              href="https://open.spotify.com/playlist/5c9j2CzRpK9KCEWJYCclx0?si=10db1f9a0317461a"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">🎵</span>
                <div className="text-center">
                  <h3 className="text-xl font-bold">Scripture Songs</h3>
                  <p className="text-sm opacity-90">Beautiful musical renditions of Bible verses</p>
                  <p className="text-xs opacity-75 mt-1">on Spotify</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Action Steps */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">💪 What You Can Do Right Now</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-gray-700">Take 3 deep breaths and focus on God&apos;s presence</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-gray-700">Pray the prayer above out loud</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-gray-700">Read the Scripture verse slowly and meditate on it</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p className="text-gray-700">Put on worship music to change your focus</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                <p className="text-gray-700">Call a trusted friend or family member</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                <p className="text-gray-700">Go for a walk or do some physical activity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Resources */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-800 mb-4">🆘 Need More Help?</h2>
          <p className="text-red-700 mb-4">
            If you&apos;re struggling and need immediate support, don&apos;t hesitate to reach out:
          </p>
          <div className="space-y-2">
            <p className="text-red-700">
              • <strong>Your local church or pastor</strong>
            </p>
            <p className="text-red-700">
              • <strong>A trusted friend or family member</strong>
            </p>
          </div>
        </div>

        {/* Encouragement */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              You Are Stronger Than This Moment 💪
            </h3>
            <p className="text-gray-600">
              &quot;I can do all this through him who gives me strength.&quot; - Philippians 4:13
            </p>
            <p className="text-gray-600 mt-2">
              This feeling will pass. You are loved, you are valued, and you are not alone.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
