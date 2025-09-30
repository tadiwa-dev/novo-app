'use client';

import { useState } from 'react';

export function SimpleInputTest() {
  const [value, setValue] = useState('');

  return (
    <div className="fixed top-4 right-4 bg-white p-4 border rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">Simple Input Test</h3>
      <input
        type="text"
        id="simple-test"
        name="simple-test"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type here..."
        className="w-full px-3 py-2 border rounded"
      />
      <p className="text-sm mt-2">Value: "{value}"</p>
    </div>
  );
}
