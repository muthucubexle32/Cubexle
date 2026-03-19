import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, Shield, Database, ChevronRight, 
  LogIn, Mail, Lock, Eye, EyeOff, Activity, Calendar,
  LogOut, Menu, Bell, Search, UserPlus,
  FileText, BarChart3, Heart, Stethoscope,
  Pill, Syringe, Thermometer, Ambulance,
  Moon, Sun, Layout, X, Home, Clock,
  AlertCircle, CheckCircle, RefreshCw, Grid,
  PieChart, TrendingUp, Download, Filter
} from "lucide-react";

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@cubexletool.com",
  password: "Admin@2024"
};

const AdminLogin = ({ onLogin, darkMode, setDarkMode }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedEmail) {
      setCredentials(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (credentials.email === ADMIN_CREDENTIALS.email && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        if (rememberMe) {
          localStorage.setItem('adminEmail', credentials.email);
        } else {
          localStorage.removeItem('adminEmail');
        }
        onLogin(true);
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={`min-h-screen flex transition-all duration-700 ${
      mounted ? 'opacity-100' : 'opacity-0'
    } ${darkMode ? 'dark' : ''}`}>
      {/* Left side - Medical theme */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Floating medical icons */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const Icon = [Heart, Stethoscope, Pill, Syringe, Thermometer, Ambulance][i % 6];
            return (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.1
                }}
              >
                <Icon size={24 + Math.random() * 40} />
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <h1 className="text-5xl font-bold mb-6 animate-slideInLeft">
            Cubexle Medical
          </h1>
          <p className="text-xl mb-8 opacity-90 animate-slideInLeft delay-200">
            Advanced Healthcare Management System
          </p>
          
          <div className="space-y-6">
            {[
              { icon: Shield, text: "Secure & HIPAA Compliant" },
              { icon: Users, text: "Manage 10,000+ Patients" },
              { icon: Activity, text: "Real-time Analytics" },
              { icon: Database, text: "Automated Backups" }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 animate-slideInLeft"
                style={{ animationDelay: `${(index + 3) * 200}ms` }}
              >
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md">
          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Portal
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Secure access for authorized personnel only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-slideInUp">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-shake">
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Access Admin Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg animate-fadeIn delay-1000">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Security Notice
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  This area is restricted to authorized administrators only. 
                  All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Demo: admin@cubexletool.com / Admin@2024
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .delay-200 { animation-delay: 200ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
};

const AdminDashboard = ({ onLogout, darkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('dashboard');

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setMobileSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    { icon: Layout, label: 'Dashboard', id: 'dashboard', color: 'from-blue-500 to-blue-600' },
    { icon: Users, label: 'User Management', id: 'users', color: 'from-purple-500 to-purple-600' },
    { icon: Heart, label: 'Patient Records', id: 'patients', color: 'from-red-500 to-red-600' },
    { icon: Calendar, label: 'Appointments', id: 'appointments', color: 'from-green-500 to-green-600' },
    { icon: Activity, label: 'Analytics', id: 'analytics', color: 'from-yellow-500 to-yellow-600' },
    { icon: Settings, label: 'Settings', id: 'settings', color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className={`min-h-screen flex bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen || mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${sidebarOpen ? 'md:w-64' : 'md:w-20'}
        bg-gradient-to-b from-gray-900 to-gray-800 text-white
        flex flex-col h-full
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'md:justify-center w-full'}`}>
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Stethoscope className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            {(sidebarOpen || mobileSidebarOpen) && (
              <span className="font-bold text-base md:text-lg truncate">MediAdmin</span>
            )}
          </div>
          
          {/* Mobile close button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1 hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:block absolute -right-3 top-6 bg-blue-600 p-1 rounded-full hover:bg-blue-700 transition-colors"
          >
            <ChevronRight className={`w-3 h-3 md:w-4 md:h-4 transform transition-transform ${!sidebarOpen && 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 md:p-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedSection(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3 rounded-lg mb-1
                transition-all relative group
                ${selectedSection === item.id
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              {(sidebarOpen || mobileSidebarOpen) && (
                <span className="text-xs md:text-sm truncate">{item.label}</span>
              )}
              
              {/* Tooltip for collapsed sidebar */}
              {!sidebarOpen && !mobileSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-gray-700 p-2 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-sm md:text-base">A</span>
            </div>
            {(sidebarOpen || mobileSidebarOpen) && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium truncate">Admin User</p>
                  
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 md:p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 md:py-4">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white truncate">
                {navigationItems.find(item => item.id === selectedSection)?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {/* Search - Hidden on mobile, shown as icon */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-40 md:w-64 pl-9 pr-4 py-1.5 md:py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <button className="sm:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Search className="w-5 h-5" />
              </button>

              <button className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="hidden sm:block p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Filter className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button className="hidden sm:block p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Download className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="sm:hidden px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content - Coming Soon */}
        <div className="flex-1 p-3 sm:p-4 md:p-6">
          {/* Coming Soon Banner */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 sm:mb-6">
            {/* Animated background */}
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="absolute inset-0">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-float-slow"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  {[Heart, Stethoscope, Pill, Syringe][i % 4] && (
                    <div className="text-white/10">
                      {React.createElement([Heart, Stethoscope, Pill, Syringe][i % 4], { size: 20 + Math.random() * 30 })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="relative z-10 p-4 sm:p-6 md:p-8 text-white text-center">
              <div className="inline-block p-2 sm:p-3 bg-white/20 rounded-full mb-3 sm:mb-4 backdrop-blur-sm">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 animate-pulse" />
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                Coming Soon!
              </h2>
              
              <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto mb-4 sm:mb-6">
                We're working hard to bring you an amazing admin dashboard experience. 
                Stay tuned for powerful features to manage your medical practice efficiently.
              </p>

              {/* Feature preview cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-3xl mx-auto">
                {[
                  { icon: Users, label: 'User Management' },
                  { icon: Activity, label: 'Analytics' },
                  { icon: Calendar, label: 'Appointments' },
                  { icon: Shield, label: 'Security' },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 hover:bg-white/20 transition-all group"
                  >
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mx-auto mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] sm:text-xs font-medium block truncate">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="max-w-md mx-auto mt-4 sm:mt-6">
                <div className="flex justify-between text-xs mb-1">
                  <span>Development Progress</span>
                  <span>75%</span>
                </div>
                <div className="h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Notify button */}
              <button className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-white text-blue-600 rounded-lg font-semibold text-xs sm:text-sm hover:bg-blue-50 transform hover:scale-105 transition-all shadow-lg">
                Notify Me When Ready
              </button>
            </div>
          </div>

          {/* Quick Stats Cards - Coming Soon Placeholder */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded animate-pulse"></div>
                  </div>
                  <div className="w-12 sm:w-16 h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="w-16 sm:w-20 h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                <div className="w-20 sm:w-24 h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Coming Soon Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Main content area - Coming Soon */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold">Activity Overview</h3>
                <div className="flex gap-1 sm:gap-2">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
              
              {/* Chart placeholder */}
              <div className="h-40 sm:h-48 md:h-64 bg-gray-100 dark:bg-gray-700 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
                <div className="flex items-center justify-center h-full">
                  <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-300 dark:text-gray-600" />
                </div>
              </div>
            </div>

            {/* Sidebar - Coming Soon */}
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Recent Activities</h3>
              <div className="space-y-2 sm:space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-start gap-2 sm:gap-3">
                    <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="w-3/4 h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                      <div className="w-1/2 h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mt-3 sm:mt-4 animate-pulse"></div>
            </div>
          </div>

          {/* Quick Actions - Coming Soon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm flex items-center gap-2 sm:gap-3"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="flex-1 h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .bg-grid-white {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        @media (max-width: 640px) {
          .bg-grid-white {
            background-size: 10px 10px;
          }
        }
      `}</style>
    </div>
  );
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem('adminSession');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) {
      sessionStorage.setItem('adminSession', 'authenticated');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminSession');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      {!isAuthenticated ? (
        <AdminLogin 
          onLogin={handleLogin} 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      ) : (
        <AdminDashboard 
          onLogout={handleLogout}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default AdminPage;