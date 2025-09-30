'use client';

import { useState } from 'react';

export function InputDebug() {
  const [value, setValue] = useState('');

  return (
    <div className="p-4 border border-red-500 bg-red-50 m-4">
      <h3 className="text-lg font-bold mb-2">Input Debug Test</h3>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          console.log('Debug input changed:', e.target.value);
          setValue(e.target.value);
        }}
        placeholder="Type here to test..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      <p className="mt-2">Current value: "{value}"</p>
      <p className="text-sm text-gray-600">Length: {value.length}</p>
    </div>
  );
}
