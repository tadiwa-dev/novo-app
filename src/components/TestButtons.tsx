'use client';

import { useState } from 'react';

export function TestButtons() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testClick = () => {
    addResult('Button click works!');
  };

  const testConsole = () => {
    console.log('Console test - this should appear in browser console');
    addResult('Console test executed');
  };

  const testFirebase = async () => {
    try {
      const { auth } = await import('@/lib/firebase');
      addResult(`Firebase auth loaded: ${auth ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      addResult(`Firebase error: ${error}`);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-bold mb-2">Debug Tests</h3>
      <div className="space-y-2 mb-3">
        <button 
          onClick={testClick}
          className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Test Click
        </button>
        <button 
          onClick={testConsole}
          className="w-full bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          Test Console
        </button>
        <button 
          onClick={testFirebase}
          className="w-full bg-purple-500 text-white px-3 py-1 rounded text-sm"
        >
          Test Firebase
        </button>
      </div>
      <div className="text-xs max-h-32 overflow-y-auto">
        {testResults.map((result, index) => (
          <div key={index} className="text-gray-600">{result}</div>
        ))}
      </div>
    </div>
  );
}
