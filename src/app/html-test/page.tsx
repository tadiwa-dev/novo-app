'use client';

export default function HtmlTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">HTML Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pure HTML Input:</label>
            <input
              type="text"
              placeholder="Pure HTML input - should work"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">HTML Textarea:</label>
            <textarea
              placeholder="Pure HTML textarea - should work"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">HTML Input with defaultValue:</label>
            <input
              type="text"
              defaultValue="Static value"
              placeholder="HTML input with static value"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Try typing in the first input (should work)</li>
            <li>• Try typing in the textarea (should work)</li>
            <li>• Try typing in the third input (might not work due to static value)</li>
            <li>• Open browser console (F12) and check for errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
