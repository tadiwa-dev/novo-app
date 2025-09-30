'use client';

import { useState } from 'react';

export default function TestInputPage() {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Test input changed:', e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Input Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Input:</label>
            <input
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="Type here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <p><strong>Current value:</strong> "{value}"</p>
            <p><strong>Length:</strong> {value.length}</p>
          </div>
          
          <button 
            onClick={() => {
              console.log('Button clicked, setting value to "Test"');
              setValue('Test');
            }}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Set to "Test"
          </button>
          
          <button 
            onClick={() => {
              console.log('Button clicked, clearing value');
              setValue('');
            }}
            className="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
