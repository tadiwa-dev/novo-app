'use client';

export default function BasicTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Basic HTML Test</h1>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Pure HTML Button:</h3>
            <button 
              onClick={() => alert('Button clicked!')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Click Me (Alert)
            </button>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Pure HTML Input:</h3>
            <input
              type="text"
              placeholder="Pure HTML input - no React state"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">JavaScript Test:</h3>
            <button 
              onClick={() => {
                console.log('JavaScript button clicked');
                document.getElementById('test-output')!.textContent = 'JavaScript works!';
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test JavaScript
            </button>
            <p id="test-output" className="mt-2 text-gray-600">Click button to test JavaScript</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-semibold text-red-800 mb-2">Critical Test:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• If alert button works → Basic JavaScript works</li>
            <li>• If input works → HTML inputs work</li>
            <li>• If JavaScript button works → DOM manipulation works</li>
            <li>• If none work → Browser/JavaScript issue</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
