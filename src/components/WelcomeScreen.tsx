'use client';

import { useState, useEffect } from 'react';

export function WelcomeScreen() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  
  useEffect(() => {
    // Check if this is the first visit
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShow(false);
  };

  const welcomeSteps = [
    {
      title: "Welcome to Novo",
      content: "Your journey to freedom starts here. We're here to support you every step of the way with a Christ-centered approach to overcoming addiction.",
      icon: "🙏"
    },
    {
      title: "Daily Journey",
      content: "Each day, you'll receive guidance, scriptures, and reflection prompts to help you grow stronger in your faith and freedom.",
      icon: "📅"
    },
    {
      title: "Urge Rescue",
      content: "When temptation strikes, our Urge Rescue feature provides immediate support with prayer, scripture, and practical steps.",
      icon: "🛟"
    },
    {
      title: "Community Support",
      content: "You're not alone. Join others in prayer and support as we walk this journey together.",
      icon: "👥"
    }
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 max-w-md w-full mx-4 rounded-xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{welcomeSteps[step - 1].icon}</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {welcomeSteps[step - 1].title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {welcomeSteps[step - 1].content}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 disabled:opacity-50"
            disabled={step === 1}
          >
            Back
          </button>
          
          <div className="flex space-x-1">
            {welcomeSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  step === index + 1
                    ? 'bg-blue-600 dark:bg-blue-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {step < welcomeSteps.length ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}