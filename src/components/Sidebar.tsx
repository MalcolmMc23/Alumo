import React from 'react';
import { Compass, Bot } from 'lucide-react';

interface SidebarProps {
  currentTab: 'explore' | 'chat';
  onTabChange: (tab: 'explore' | 'chat') => void;
}

const navItems = [
  { icon: Compass, label: 'Explore', id: 'explore' as const },
  { icon: Bot, label: 'AI Chat', id: 'chat' as const }
];

function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-white">
      <div className="px-6 py-5 border-b">
        <h1 className="text-2xl font-bold text-purple-600">Alumo</h1>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              currentTab === item.id
                ? 'bg-purple-50 text-purple-600' 
                : 'hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1 font-medium text-left">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;