// src/pages/admin/AdminPage.jsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import AppLayout from '../../components/layout/AppLayout';
import UserSetupPanel from './UserSetupPage';
import CarrierSetupPanel from './CarrierSetupPage';

const AdminPage = ({ onLogout }) => {
  const [activePanel, setActivePanel] = useState('user');

  return (
    <AppLayout onLogout={onLogout}>
      <div className="min-h-screen bg-[#f4f6f8] py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Admin Setup</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Configure users and carrier settings</p>
          </div>

          {/* Segmented Toggle Control - Responsive */}
          <div className="flex justify-start mb-4 sm:mb-6 md:mb-8 overflow-x-auto pb-2">
            <div className="inline-flex bg-gray-200 p-1 rounded-lg border shadow-sm">
              <button
                onClick={() => setActivePanel('user')}
                className={`relative px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                  activePanel === 'user'
                    ? 'bg-white text-[#0f3f3f] shadow-sm'
                    : 'text-gray-900 hover:text-gray-800'
                }`}
              >
                User Setup
              </button>
              <button
                onClick={() => setActivePanel('carrier')}
                className={`relative px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                  activePanel === 'carrier'
                    ? 'bg-white text-[#0f3f3f] shadow-sm'
                    : 'text-gray-900 hover:text-gray-800'
                }`}
              >
                Carrier Setup
              </button>
            </div>
          </div>

          {/* Animated Panel Container */}
          <div className="overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-240px)] overflow-x-hidden">
            <AnimatePresence mode="wait">
              {activePanel === 'user' ? <UserSetupPanel key="user" /> : <CarrierSetupPanel key="carrier" />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.5s linear forwards;
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </AppLayout>
  );
};

export default AdminPage;