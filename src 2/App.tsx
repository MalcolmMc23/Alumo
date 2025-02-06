import React, { useState } from 'react';
import { Bell, User } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';

function App() {
  const [currentTab, setCurrentTab] = useState<'explore' | 'chat'>('explore');

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />
      
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=50&h=50" 
              alt="UO Logo" 
              className="h-8 w-8 rounded"
            />
            <h1 className="text-xl font-semibold">University of Oregon</h1>
          </div>
          <div className="flex items-center gap-6">
            <Bell className="w-6 h-6 text-gray-600" />
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </header>

        {currentTab === 'explore' ? (
          <div className="p-6">
            {/* Banner */}
            <div className="bg-blue-50 p-4 flex items-center justify-between rounded-lg">
              <p className="text-blue-800">Reply to Alexia Coupar from Storage Scholars?</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Reply
              </button>
            </div>

            {/* Videos Section */}
            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Videos <span className="text-purple-600">for you</span></h2>
              </div>
              <div className="max-w-sm">
                <div className="rounded-lg overflow-hidden border">
                  <img 
                    src="https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=300&h=200"
                    alt="Video thumbnail"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium">Career Tips & Tricks</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-600">Career Success</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="h-[calc(100vh-4rem)]">
            <ChatInterface />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;