"use client";

import React from 'react';
import Link from 'next/link';
import WelcomeModal from './components/WelcomeModal';
import { Bell } from 'lucide-react';

export default function Home() {
  return (
    <>
      <WelcomeModal />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r shadow-sm">
          <div className="p-4">
            <h1 className="text-xl font-bold text-purple-600 hover:text-purple-700 transition-colors">Alumo</h1>
          </div>
          <nav className="mt-4 px-2">
            <Link href="/" className="flex items-center px-4 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all rounded-xl mb-1">
              <span className="mr-2">🔍</span>
              Explore
            </Link>
            <Link href="/chat" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-all rounded-xl">
              <span className="mr-2">💬</span>
              AI Chat
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50">
          {/* Header */}
          <header className="bg-white border-b shadow-sm">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1535185384036-28bbc8035f28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=36&h=36&q=80"
                  alt="University"
                  className="w-8 h-8 rounded-md shadow-sm hover:shadow transition-shadow"
                />
                <h2 className="ml-3 text-lg font-semibold">University of Oregon</h2>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=36&h=36&q=80"
                  alt="Profile"
                  className="w-8 h-8 rounded-full ring-2 ring-purple-100 hover:ring-purple-300 transition-all cursor-pointer"
                />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-8 hover:bg-blue-100 transition-colors shadow-sm hover:shadow">
              <p className="text-blue-800">Reply to Alexia Coupar from Storage Scholars?</p>
              <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Reply</button>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Videos <span className="text-purple-600">for you</span></h2>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Santorini"
                    className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold group-hover:text-purple-600 transition-colors">Career Tips & Tricks</h3>
                  <div className="flex items-center mt-2">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=36&h=36&q=80"
                      alt="Career Success"
                      className="w-6 h-6 rounded-full ring-1 ring-purple-100"
                    />
                    <span className="ml-2 text-gray-600">Career Success</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}