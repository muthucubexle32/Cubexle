import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Settings, Shield, Database, ChevronRight, 
  LogIn, Mail, Lock, Eye, EyeOff, Activity, Calendar,
  LogOut, Bell, Search, FileText, BarChart3, 
  Layout, Construction, ArrowLeft, Clock, Sparkles, 
  FlaskConical, Stethoscope, Microscope
} from "lucide-react";

import TopNavbar from "../../components/layout/TopNavbar"; 

const ADMIN_CREDENTIALS = {
  email: "admin@cubexletool.com",
  password: "Admin@2024"
};

// --- High-End "Coming Soon" Placeholder ---
const FeatureComingSoon = ({ title, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 animate-in fade-in zoom-in duration-700">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse"></div>
      <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <Icon className="w-20 h-20 text-blue-600 animate-float" />
      </div>
      <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-xl shadow-xl animate-bounce">
        <Sparkles size={18} />
      </div>
    </div>
    
    <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
      {title} Module
    </h2>
    
    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-xl">
      <Clock size={14} className="text-blue-400" />
      Coming Soon
    </div>
    
    <p className="max-w-xs text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
      We are currently building this module to provide the best medical analysis interface.
    </p>
  </div>
);

// --- Admin Login Component ---
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
        setError('Access Denied: Invalid Admin Credentials');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
          <div className="p-10">
            <div className="text-center mb-10">
              <div className="inline-flex p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mb-4 text-white shadow-xl shadow-blue-500/30">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Admin Portal</h2>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-2">Secure Gateway</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold border border-red-100 animate-shake text-center">{error}</div>}
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="email"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white text-sm"
                    placeholder="admin@cubexletool.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-11 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white text-sm"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-950 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn size={20} />}
                Unlock Dashboard
              </button>
            </form>

            {/* Return to home page - Placed at bottom of card */}
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <button 
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-all hover:-translate-x-1"
              >
                <ArrowLeft size={16} />
                Return to home page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Dashboard Component ---
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  const menuItems = [
    { id: 'Overview', icon: Layout },
    { id: 'User Management', icon: Users },
    { id: 'Clinical Analytics', icon: BarChart3 },
    { id: 'Security Central', icon: Shield },
    { id: 'Database Config', icon: Database },
    { id: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden bg-slate-50 dark:bg-black">
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-72' : 'w-24'} 
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transition-all duration-500 flex flex-col z-20 m-4 rounded-[2.5rem] shadow-sm
      `}>
        <div className="p-8 flex items-center justify-between">
          {sidebarOpen && <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Main Menu</span>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-blue-600 mx-auto"
          >
            <ChevronRight className={`transition-transform duration-500 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative group
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
              `}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:text-blue-500'} />
              {sidebarOpen && <span className="font-bold text-xs tracking-tight">{item.id}</span>}
              {!sidebarOpen && (
                <div className="absolute left-20 bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 uppercase tracking-widest">
                  {item.id}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <Construction size={20} className="mx-auto text-amber-500 mb-2" />
            <p className="text-[10px] font-bold text-slate-500 uppercase">System v2.0</p>
          </div>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl h-full rounded-[3rem] border border-white dark:border-slate-800 shadow-sm flex items-center justify-center">
          <FeatureComingSoon title={activeTab} icon={activeTab === 'Overview' ? Layout : Construction} />
        </div>
      </main>
    </div>
  );
};

// --- Main Admin Page ---
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = sessionStorage.getItem('adminSession');
    if (session === 'authenticated') setIsAuthenticated(true);
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) sessionStorage.setItem('adminSession', 'authenticated');
  };

  const handleLogout = () => {
    // This function will be triggered by TopNavbar's logout too
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminSession');
    // Ensure we are viewing the admin login
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black selection:bg-blue-600 selection:text-white">
      {/* 
        Modified TopNavbar logic: 
        We pass a function to move to admin login if logout is clicked 
      */}
      <div onClick={(e) => {
        // Intercepting clicks specifically on logout-related triggers in TopNavbar
        if (e.target.closest('button')?.textContent?.toLowerCase().includes('logout') || 
            e.target.closest('button')?.querySelector('.lucide-log-out')) {
          e.preventDefault();
          handleLogout();
        }
      }}>
        <TopNavbar activePanel="admin" />
      </div>
      
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard />
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default AdminPage;