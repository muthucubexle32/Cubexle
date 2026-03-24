import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Settings, Shield, Database, ChevronRight,
  LogIn, Mail, Lock, Eye, EyeOff, Activity, Calendar,
  LogOut, Bell, Search, FileText, BarChart3,
  Layout, Construction, ArrowLeft, Clock, Sparkles,
  Menu, X
} from "lucide-react";

import TopNavbar from "../../components/layout/TopNavbar";

const ADMIN_CREDENTIALS = {
  email: "admin@cubexletool.com",
  password: "Admin@2024"
};

// --- Responsive "Coming Soon" Placeholder ---
const FeatureComingSoon = ({ title, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] text-center p-4 sm:p-8 animate-in fade-in zoom-in duration-700">
    <div className="relative mb-6 sm:mb-8">
      <div className="absolute inset-0 bg-blue-500/20 blur-[60px] sm:blur-[100px] rounded-full animate-pulse"></div>
      <div className="relative bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 animate-float" />
      </div>
    </div>

    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
      {title} <span className="text-blue-600">Module</span>
    </h2>

    <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-slate-900 text-white rounded-md text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-4 sm:mb-6 shadow-xl">
      <Clock size={12} className="text-blue-400" />
      Engineering Phase
    </div>

    <p className="max-w-[250px] sm:max-w-xs text-slate-500 dark:text-slate-400 leading-relaxed text-xs sm:text-sm font-medium">
      This clinical module is currently being optimized for high-precision data analysis.
    </p>
  </div>
);

// --- Adaptive Admin Login ---
const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (credentials.email === ADMIN_CREDENTIALS.email && credentials.password === ADMIN_CREDENTIALS.password) {
        onLogin(true);
      } else {
        setError('Invalid Admin Credentials');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-black/95">
      <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg lg:max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-3 sm:mb-4 text-white shadow-lg">
                <Shield size={24} className="sm:w-7 sm:h-7" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Portal</h2>
              <p className="text-slate-500 text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-wider mt-1">Secure Core Access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              {error && (
                <div className="p-2 sm:p-3 bg-red-50 text-red-600 rounded-lg text-[9px] sm:text-[10px] font-bold border border-red-100 animate-shake text-center">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="email"
                    className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white text-xs sm:text-sm font-medium"
                    placeholder="admin@cubexletool.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-9 sm:pl-11 pr-9 sm:pr-11 py-2.5 sm:py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white text-xs sm:text-sm font-medium"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 md:py-4 bg-slate-900 dark:bg-blue-600 hover:bg-black text-white rounded-xl font-semibold shadow-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide"
              >
                {loading ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn size={14} className="sm:w-4 sm:h-4" />
                )}
                Unlock Admin Dashboard
              </button>
            </form>

            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-slate-400 hover:text-blue-600 uppercase tracking-wider transition-all"
              >
                <ArrowLeft size={12} className="sm:w-3.5 sm:h-3.5" />
                Return to home page
              </button>
              <div className="mt-3 sm:mt-4 text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 sm:p-2.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                <span className="opacity-60 uppercase">Debug:</span> admin@cubexletool.com / Admin@2024
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Responsive Dashboard with No Overlay Sidebar ---
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      // Auto-adjust sidebar based on screen size
      if (width < 768) {
        setSidebarOpen(false);
      } else if (width >= 768 && width < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'Overview', icon: Layout },
    { id: 'User Management', icon: Users },
    { id: 'Clinical Analytics', icon: BarChart3 },
    { id: 'Security Central', icon: Shield },
    { id: 'Database Config', icon: Database },
    { id: 'System Settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden bg-slate-50 dark:bg-black">
      {/* Sidebar - Responsive without overlay */}
      <aside 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed lg:relative lg:translate-x-0
          w-64 sm:w-72 md:w-64
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transition-transform duration-300 ease-in-out
          flex flex-col z-30 h-full shadow-xl lg:shadow-none
          ${sidebarOpen ? 'lg:flex' : 'lg:flex'}
        `}
      >
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-[0.2em]">
              Management
            </span>
            <p className="text-[8px] sm:text-[9px] text-slate-400 mt-1 hidden sm:block">Admin Control Panel</p>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={toggleSidebar}
            className="hidden lg:block p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
          >
            <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200
                ${activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
              `}
            >
              <item.icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">{item.id}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 sm:p-5 md:p-6 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 p-3 sm:p-4 rounded-xl">
            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
              Cubexle Medical Admin
            </p>
            <p className="text-[7px] sm:text-[8px] text-slate-400 dark:text-slate-500 text-center mt-1">
              v2.0.0
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-3 sm:p-4">
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <Menu size={18} />
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>

        <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
          <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl min-h-[calc(100vh-130px)] lg:min-h-[calc(100vh-100px)] rounded-xl sm:rounded-2xl md:rounded-3xl border border-white dark:border-slate-800 shadow-sm flex items-center justify-center">
            <FeatureComingSoon title={activeTab} icon={Layout} />
          </div>
        </div>
      </main>

      {/* Responsive CSS for sidebar animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        
        /* Responsive transitions */
        @media (max-width: 1023px) {
          aside {
            animation: slideIn 0.3s ease-out;
          }
        }
        
        /* Custom scrollbar for sidebar */
        aside::-webkit-scrollbar {
          width: 4px;
        }
        
        aside::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        aside::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        .dark aside::-webkit-scrollbar-track {
          background: #1e293b;
        }
        
        .dark aside::-webkit-scrollbar-thumb {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

// --- Main Entry ---
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem('adminSession');
    if (session === 'authenticated') setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminSession');
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black overflow-x-hidden">
      {/* Global Navbar Integration */}
      <div onClick={(e) => {
        const btn = e.target.closest('button');
        if (btn && (btn.textContent?.toLowerCase().includes('logout') || btn.querySelector('.lucide-log-out'))) {
          e.preventDefault();
          handleLogout();
        }
      }}>
        <TopNavbar activePanel="admin" />
      </div>

      {!isAuthenticated ? (
        <AdminLogin onLogin={(status) => {
          setIsAuthenticated(status);
          if (status) sessionStorage.setItem('adminSession', 'authenticated');
        }} />
      ) : (
        <AdminDashboard />
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        
        /* Responsive scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        
        @media (min-width: 768px) {
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        .dark ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        
        /* Responsive text selection */
        ::selection {
          background: rgba(59, 130, 246, 0.2);
        }
        
        /* Prevent zoom on mobile inputs */
        @media (max-width: 480px) {
          input, button {
            font-size: 16px !important;
          }
        }
        
        /* Smooth transitions */
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Responsive container queries */
        @media (max-width: 640px) {
          .backdrop-blur-xl {
            backdrop-filter: blur(8px);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;