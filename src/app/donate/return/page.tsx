'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';

export default function DonateReturnPage() {
  const [message, setMessage] = useState('Processing your donation…');

  useEffect(() => {
    // You can parse query params here if Pesepay includes any
    setTimeout(() => setMessage('Thank you! If your payment was successful, you will receive a confirmation shortly.'), 800);
  }, []);

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Donation</h1>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </Layout>
  );
}


