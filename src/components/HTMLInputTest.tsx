'use client';

export function HTMLInputTest() {
  return (
    <div className="fixed top-4 left-4 bg-white p-4 border rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">HTML Input Test</h3>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Pure HTML input (no React state)"
          className="w-full px-3 py-2 border rounded"
        />
        <p className="text-sm text-gray-600">This input has no React state - test if you can type here</p>
      </div>
    </div>
  );
}
