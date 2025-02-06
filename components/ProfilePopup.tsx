'use client';

import { User, Mail, X } from 'lucide-react';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  if (!isOpen) return null;

  const handleProfileClick = () => {
    console.log('hello world');
    onClose();
  };

  const handleContactClick = () => {
    console.log('hello world');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div 
        className="absolute right-4 top-16 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-2">
          <button
            onClick={handleProfileClick}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <User size={18} className="text-purple-600" />
            <span className="font-medium">Profile</span>
          </button>
          
          <button
            onClick={handleContactClick}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Mail size={18} className="text-purple-600" />
            <span className="font-medium">Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
}