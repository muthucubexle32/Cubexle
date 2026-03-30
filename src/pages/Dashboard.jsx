import React from 'react';
import { Construction, Clock } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const Dashboard = ({ onLogout }) => {
  return (
    <AppLayout onLogout={onLogout} activePanel="dashboard">
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
           
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Coming Soon
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Clock size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Under Development</span>
          </div>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            We're working hard to bring you an amazing healthcare management experience. 
            Stay tuned for exciting features coming your way!
          </p>
          <div className="flex gap-4 justify-center mt-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
      `}</style>
    </AppLayout>
  );
};

export default Dashboard;