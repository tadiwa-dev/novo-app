'use client';

import { useState } from 'react';
import Link from 'next/link';

export function UrgeRescue() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          title="Urge Rescue"
        >
          <span className="text-xl">🚨</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Urge Rescue</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Scripture for Strength</h3>
            <p className="text-blue-700 italic">
              &quot;No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out so that you can endure it.&quot;
            </p>
            <p className="text-blue-600 text-sm mt-2">- 1 Corinthians 10:13</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Quick Prayer</h3>
            <p className="text-purple-700">
              &quot;Lord, I&apos;m struggling right now. Please give me Your strength to resist this temptation. Help me to remember who I am in You and the freedom You have for me. Amen.&quot;
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Worship & Peace</h3>
            <a
              href="https://open.spotify.com/playlist/5c9j2CzRpK9KCEWJYCclx0?si=10db1f9a0317461a"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">🎵</span>
                <span className="font-semibold">Scripture Songs</span>
                <span className="text-sm opacity-90">on Spotify</span>
              </div>
            </a>
          </div>

          <div className="pt-4 border-t">
            <Link
              href="/urge-rescue"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg text-center hover:shadow-lg transition-shadow"
            >
              Go to Full Urge Rescue Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
