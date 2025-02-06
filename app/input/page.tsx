'use client';

import { useState } from 'react';

export default function InputPage() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-purple-900">Input Page</h1>
      <div className="max-w-xl mx-auto mt-12">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-purple-100 hover:border-purple-200 transition-colors">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your text
          </label>
          <input
            id="input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors"
            placeholder="Type something..."
          />
        </div>
      </div>
    </div>
  );
}