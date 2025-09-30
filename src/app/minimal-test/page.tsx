'use client';

export default function MinimalTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Minimal Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Uncontrolled Input (should work):</label>
            <input
              type="text"
              placeholder="This should work..."
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Controlled Input (might not work):</label>
            <input
              type="text"
              value=""
              onChange={() => {}}
              placeholder="This might not work..."
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Textarea:</label>
            <textarea
              placeholder="Try typing here..."
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
