import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  HeartPulse,
  Stethoscope,
  Shield,
  Home,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
  Clock,
  Construction,
  Settings,
  FileText,
  AlertCircle,
  ArrowLeft,
  CheckCircle
} from "lucide-react";

// Tooltip Component
const Tooltip = ({ children, text, position = "bottom" }) => {
  const [show, setShow] = useState(false);
  
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 ${positionClasses[position]} px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none animate-fadeIn`}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === "top" ? "top-full -translate-y-1/2 left-1/2 -translate-x-1/2" :
            position === "bottom" ? "bottom-full translate-y-1/2 left-1/2 -translate-x-1/2" :
            position === "left" ? "left-full -translate-x-1/2 top-1/2 -translate-y-1/2" :
            "right-full translate-x-1/2 top-1/2 -translate-y-1/2"
          }`}></div>
        </div>
      )}
    </div>
  );
};

// Navbar Component - Persistent across all pages
const Navbar = ({ onLogout, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName] = useState("User");

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/", icon: Home, tooltip: "Go to Dashboard" },
    { label: "Admin", path: "/admin", icon: Settings, tooltip: "Admin Panel" },
    { label: "Report", path: "/report", icon: FileText, tooltip: "View Reports" },
    { label: "Search", path: "/search", icon: Search, tooltip: "Search Records" },
  ];

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`w-full transition-all duration-500 ${
      isScrolled 
        ? 'bg-gray-800/95 backdrop-blur-xl shadow-lg' 
        : 'bg-[#031724]'
    }`}>
      
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x"></div>

      <div className="relative flex items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8 py-1.5">
        <Tooltip text="Return to Dashboard" position="right">
          <div 
            className="flex items-center gap-2 sm:gap-3 group cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0" 
            onClick={() => navigate('/')}
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
              <span className="text-xs sm:text-sm font-bold text-white relative z-10">C</span>
            </div>
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300 hidden xs:inline">
              Cubexle
            </span>
          </div>
        </Tooltip>

        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-2 xl:gap-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Tooltip key={item.path} text={item.tooltip} position="bottom">
                  <button
                    onClick={() => navigate(item.path)}
                    className={`relative px-3 xl:px-5 py-2 text-xs xl:text-sm font-medium rounded-xl transition-all duration-300 group overflow-hidden ${
                      isActive 
                        ? 'text-white bg-white/15 shadow-lg shadow-white/5' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-1 xl:gap-2">
                      <Icon className="w-3 h-3 xl:w-4 xl:h-4" />
                      <span className="hidden xl:inline">{item.label}</span>
                      <span className="xl:hidden">{item.label.charAt(0)}</span>
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 xl:w-8 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated && (
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 xl:gap-3 hover:bg-white/5 rounded-xl px-2 py-1 transition-colors">
                <div className="flex flex-col items-end">
                  <span className="text-xs xl:text-sm font-semibold text-white">{userName}</span>
                </div>
                <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
                </div>
              </div>
            </div>
          )}

          <Tooltip text={isAuthenticated ? "Logout" : "Login"} position="bottom">
            <button
              onClick={handleLogoutClick}
              className="relative group p-2 xl:px-4 xl:py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 overflow-hidden flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isAuthenticated ? (
                <LogOut className="w-4 h-4 xl:w-4 xl:h-4 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <LogIn className="w-4 h-4 xl:w-4 xl:h-4" />
              )}
            </button>
          </Tooltip>

          <Tooltip text={isMobileMenuOpen ? "Close Menu" : "Open Menu"} position="bottom">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex-shrink-0"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {isMobileMenuOpen && isAuthenticated && (
        <div className="lg:hidden fixed inset-0 top-[57px] sm:top-[61px] bg-gradient-to-b from-slate-900 to-slate-800 z-40 animate-slideDown overflow-y-auto">
          <div className="min-h-full pb-20">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base sm:text-lg font-semibold">{userName}</div>
                      <div className="text-xs sm:text-sm text-white/80">Healthcare Professional</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/30 hover:bg-red-500/40 rounded-xl transition-colors text-sm sm:text-base"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Main Menu</div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-4 py-3 sm:py-4 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/20 text-white shadow-lg' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="font-medium flex-1 text-left text-sm sm:text-base">{item.label}</span>
                      {isActive && <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
};

// Forgot Password Modal Component
const ForgotPasswordModal = ({ isOpen, onClose, onSendReset }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsSent(true);
    onSendReset(email);
    setTimeout(() => {
      onClose();
      setIsSent(false);
      setEmail('');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform animate-slideUp">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {!isSent ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {error}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h4>
              <p className="text-sm text-gray-600">
                We've sent a password reset link to <br />
                <strong className="text-blue-600">{email}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Professional Login Component
const ProfessionalLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Simulate authentication (replace with real authentication in production)
    setTimeout(() => {
      // For demo purposes, accept any valid email/password combo
      // In production, this would call your authentication API
      onLogin(true);
      setLoading(false);
    }, 1000);
  };

  const handleSendResetLink = (resetEmail) => {
    console.log('Password reset link sent to:', resetEmail);
    // Here you would integrate with your password reset API
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => {
            const icons = [HeartPulse, Stethoscope, Shield];
            const Icon = icons[i % icons.length];
            return (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 10}s`,
                  opacity: 0.1
                }}
              >
                <Icon size={24 + Math.random() * 30} />
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500">
            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-5 text-white shadow-xl">
                  <Stethoscope size={32} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Cubexle Login
                </h1>
                <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    © {currentYear} Cubexle. All rights reserved.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
                    <span>Version 2.0.0</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Build 24.03.2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
        `}</style>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSendReset={handleSendResetLink}
      />
    </>
  );
};

// Simple Dashboard - Only Coming Soon Text
const SimpleDashboard = ({ onLogout }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar onLogout={onLogout} isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Animated Construction Icon */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-full shadow-2xl border border-gray-200">
              <Construction size={80} className="text-blue-600 animate-float-slow" />
            </div>
          </div>

          {/* Coming Soon Text */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Coming Soon
          </h1>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Clock size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Under Development</span>
          </div>
          
          <p className="text-gray-600 max-w-md mb-8">
            We're working hard to bring you an amazing healthcare management experience. 
            Stay tuned for exciting features coming your way!
          </p>

          {/* Decorative Elements */}
          <div className="flex gap-4 mt-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-gray-200">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              © {currentYear} Cubexle. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
              <span>Version 2.0.0</span>
              <span className="hidden sm:inline">•</span>
              <span>Build 24.03.2026</span>
            </div>
          </div>
        </footer>
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
    </div>
  );
};

// Main Component
const SimpleAdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      {!isAuthenticated ? (
        <>
          <Navbar onLogout={handleLogout} isAuthenticated={false} />
          <ProfessionalLogin onLogin={handleLogin} />
        </>
      ) : (
        <SimpleDashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default SimpleAdminPage;