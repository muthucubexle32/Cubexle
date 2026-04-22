// src/pages/admin/AdminPage.jsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Settings, Users, Truck } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import UserSetupPanel from './UserSetupPage';
import CarrierSetupPanel from './CarrierSetupPage';

const AdminPage = ({ onLogout }) => {
  const [activePanel, setActivePanel] = useState('user');

  const menuItems = [
    { id: 'user', label: 'User Setup', icon: Users },
    { id: 'carrier', label: 'Carrier Setup', icon: Truck },
  ];

  return (
    <AppLayout onLogout={onLogout}>
      <div className="min-h-screen bg-[#f4f6f8] py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Admin Setup</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Configure users and carrier settings</p>
          </div>

          {/* Submenu (Sidebar + Content) */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="md:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Setup Menu</span>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePanel === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActivePanel(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-[#0f3f3f] text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <div className="overflow-y-auto max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)] overflow-x-hidden">
                <AnimatePresence mode="wait">
                  {activePanel === 'user' ? (
                    <UserSetupPanel key="user" />
                  ) : (
                    <CarrierSetupPanel key="carrier" />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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