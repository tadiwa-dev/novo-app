'use client';

import { useState } from 'react';

export function SimpleInputTest() {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Simple input changed:', e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className="p-4 border border-green-500 bg-green-50 m-4">
      <h3 className="text-lg font-bold mb-2">Simple Input Test</h3>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Simple test input..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      <p className="mt-2">Value: "{value}"</p>
      <p className="text-sm text-gray-600">Length: {value.length}</p>
      <button 
        onClick={() => {
          console.log('Button clicked, current value:', value);
          setValue('Test Value');
        }}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Set Test Value
      </button>
    </div>
  );
}