'use client';

import { useState } from 'react';
import { Layout } from '@/components/Layout';

export default function DonatePage() {
  const [amount, setAmount] = useState<string>('5');
  const [currency, setCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pesepay/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), currencyCode: currency, reason: 'Donation' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout');
      window.location.href = data.redirectUrl;
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Support The Journey</h1>
        
        <div className="space-y-4 mb-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Your donation, no matter how small, makes a significant impact in keeping this ministry accessible to everyone seeking freedom from addiction.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Your Support Helps Us:</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>Keep the app completely free for everyone</li>
              <li>Cover server and maintenance costs</li>
              <li>Develop new features and improvements</li>
              <li>Reach more people struggling with addiction</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 rounded-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
            <input
              type="number"
              min={1}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
            <input
              value={currency}
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Only USD is supported at this time.</p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !Number(amount)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Redirecting…' : 'Donate with Pesepay'}
          </button>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">* Ecocash also available</p>
        </form>
      </div>
    </Layout>
  );
}


