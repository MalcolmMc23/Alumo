"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            Supercharge Your{" "}
            <span className="text-purple-600">Your Career</span>
          </h2>

          <div className="space-y-6 mt-8">
            {/* Features */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">Instant AI counseling</h3>
                <p className="text-gray-600">for rapid progresstion</p>
              </div>
            </div>

            {/* Price and Rating */}
            <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">4.9</span>
                <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                <span className="text-gray-600 text-sm">
                  Loved by 5,000+ students
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold">$120</div>
                <div className="text-gray-600 text-sm">per year</div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Start 3-day free trial
            </button>

            <p className="text-center text-sm text-gray-500">
              You wont be billed during the trial period
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
