'use client';

import { useState } from 'react';

export default function StateTestPage() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">React State Test</h1>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Counter Test:</h3>
            <p className="text-lg">Count: {count}</p>
            <button 
              onClick={() => {
                console.log('Button clicked, incrementing count');
                setCount(count + 1);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Increment
            </button>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Text Input Test:</h3>
            <input
              type="text"
              value={text}
              onChange={(e) => {
                console.log('Text input changed:', e.target.value);
                setText(e.target.value);
              }}
              placeholder="Type here..."
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <p className="mt-2">Current text: "{text}"</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Uncontrolled Input (should always work):</h3>
            <input
              type="text"
              placeholder="This should work without React state"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Test Results:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• If counter works → React state is working</li>
            <li>• If text input works → React state + onChange is working</li>
            <li>• If uncontrolled input works → HTML inputs work</li>
            <li>• Check console for logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
