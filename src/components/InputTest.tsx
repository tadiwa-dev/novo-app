'use client';

import { useState } from 'react';

export function InputTest() {
  const [value, setValue] = useState('');

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 border rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">Input Test</h3>
      <div className="space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type here..."
          className="w-full px-3 py-2 border rounded"
        />
        <p className="text-sm">Value: "{value}"</p>
        <button 
          onClick={() => setValue('')}
          className="w-full bg-gray-200 text-gray-800 py-1 rounded text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
