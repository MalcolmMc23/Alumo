'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare,
  TextQuote,
  Menu, 
  X,
  Bell,
  User
} from 'lucide-react';
import ProfilePopup from '@/components/ProfilePopup';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: MessageSquare, label: 'AI Chat', href: '/chat' },
  { icon: TextQuote, label: 'Input', href: '/input' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  
  // Don't show the dashboard sidebar on the chat page
  const showSidebar = pathname !== '/chat';

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfilePopup isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      {/* Mobile Sidebar Toggle - Only show on non-chat pages */}
      {showSidebar && (
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar - Only show on non-chat pages */}
      {showSidebar && (
<<<<<<< HEAD
        <aside
          className={`
            fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
=======
        <aside className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${pathname === '/chat' ? '' : 'transform transition-transform duration-200 ease-in-out'}
        `}>
>>>>>>> 4a4b4ff (test)
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-purple-600">Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-2.5 rounded-lg
<<<<<<< HEAD
                    transition-colors duration-200
=======
>>>>>>> 4a4b4ff (test)
                    ${isActive 
                      ? 'bg-purple-50 text-purple-700' 
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'}
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className={`
        min-h-screen
<<<<<<< HEAD
        transition-margin duration-300 ease-in-out
        ${showSidebar ? 'lg:ml-64' : 'lg:ml-0'}
        ${showSidebar && isSidebarOpen ? 'ml-64' : 'ml-0'}
=======
        ${showSidebar ? 'lg:pl-64' : ''}
        ${showSidebar && isSidebarOpen ? 'pl-64' : ''}
>>>>>>> 4a4b4ff (test)
      `}>
        {/* Header - Only show on non-chat pages */}
        {showSidebar && (
          <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-end px-8">
            <div className="flex items-center space-x-5">
<<<<<<< HEAD
              <button className="p-3 hover:bg-purple-50 rounded-full transition-colors">
                <Bell size={22} className="text-gray-600 hover:text-purple-600" />
              </button>
              <button 
                className="p-3 hover:bg-purple-50 rounded-full transition-colors"
=======
              <button className="p-3 hover:bg-purple-50 rounded-full">
                <Bell size={22} className="text-gray-600 hover:text-purple-600" />
              </button>
              <button 
                className="p-3 hover:bg-purple-50 rounded-full"
>>>>>>> 4a4b4ff (test)
                onClick={() => setIsProfileOpen(true)}
              >
                <User size={22} className="text-gray-600 hover:text-purple-600" />
              </button>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className={showSidebar ? 'p-6' : ''}>
          {children}
        </main>
      </div>
    </div>
  );
}