import { LogOut, Home, Search, FileText, User, ChevronDown, Menu, X, Calendar, Settings, Activity, Microscope, HeartPulse, Stethoscope, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const TopNavbar = ({ onPanelChange, activePanel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName] = useState("User Name");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showEntryDropdown, setShowEntryDropdown] = useState(false);
  const calendarRef = useRef(null);
  const entryDropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (entryDropdownRef.current && !entryDropdownRef.current.contains(event.target)) {
        setShowEntryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${dayStr}`);
    setShowCalendar(false);
  };

  const handleEntrySelect = (panelId) => {
    if (onPanelChange) {
      onPanelChange(panelId);
    }
    setShowEntryDropdown(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Admin", path: "/admin", icon: Settings },
    { label: "Report", path: "/report", icon: FileText },
    { label: "Search", path: "/search", icon: Search },
  ];

  const entryItems = [
    { label: "OV", icon: Stethoscope, panelId: "ov", color: "from-blue-500 to-cyan-400" },
    { label: "Diagnostics", icon: Activity, panelId: "diagnostics", color: "from-emerald-500 to-teal-400" },
    { label: "Labs", icon: Microscope, panelId: "labs", color: "from-purple-500 to-pink-400" },
    { label: "EKG", icon: HeartPulse, panelId: "ekg", color: "from-rose-500 to-red-400" },
  ];

  return (
    <div className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]' 
        : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
    }`}>
      
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x"></div>

      {/* ROW 1: Main Navigation */}
      <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1.5">
        {/* Logo Section with enhanced effects */}
        <div 
          className="flex items-center gap-3 group cursor-pointer transform transition-all duration-300 hover:scale-105" 
          onClick={() => navigate('/')}
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
            <span className="text-sm font-bold text-white relative z-10">Logo</span>
          </div>
          <span className="text-base sm:text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300">
            Logo Name
          </span>
        </div>

        {/* Desktop Navigation - Main Menu with modern effects */}
        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative px-5 py-2 text-sm font-medium rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive 
                    ? 'text-white bg-white/15 shadow-lg shadow-white/5' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                )}
                {/* Hover shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* User Name - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-white">User Name</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Logout Button with enhanced effects */}
          <button
            onClick={() => navigate("/login")}
            className="relative group px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <LogOut className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* ROW 2: Search/Filter Bar - All data in one row */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-1">
          <div className="flex flex-wrap items-center gap-2 justify-end">
            {/* Provider Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Provider Name"
                className="w-36 sm:w-80 px-4 py-2 bg-white/10 border border-white/20 rounded-sm text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 pointer-events-none transition-all duration-300"></div>
            </div>

            {/* DOB with Calendar */}
            <div className="relative w-48" ref={calendarRef}>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="DOB"
                  value={selectedDate}
                  onClick={() => setShowCalendar(!showCalendar)}
                  readOnly
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-sm text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer transition-all duration-300 group-hover:bg-white/15"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>

              {/* Calendar Popup */}
              {showCalendar && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50 animate-slideDown">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90 text-gray-600 dark:text-gray-400" />
                    </button>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 -rotate-90 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8" />
                    ))}
                    {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isSelected = selectedDate === dateStr;
                      const isToday = dateStr === new Date().toISOString().split('T')[0];
                      
                      return (
                        <button
                          key={day}
                          onClick={() => handleDateSelect(day)}
                          className={`h-8 w-8 flex items-center justify-center text-sm rounded-lg transition-all duration-200 ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                              : isToday
                              ? 'border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        setSelectedDate(`${year}-${month}-${day}`);
                        setShowCalendar(false);
                      }}
                      className="w-full px-3 py-1.5 text-sm bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300"
                    >
                      Today
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gender Dropdown */}
            <div className="relative group">
              <select className="w-32 px-4 py-2 bg-white/10 border border-white/20 rounded-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm transition-all duration-300 group-hover:bg-white/15">
                <option value="" className="bg-slate-800 text-white">Gender</option>
                <option value="male" className="bg-slate-800 text-white">Male</option>
                <option value="female" className="bg-slate-800 text-white">Female</option>
                <option value="other" className="bg-slate-800 text-white">Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors pointer-events-none" />
            </div>

            {/* Page Number */}
            <div className="relative">
              <input
                type="text"
                placeholder="Pg No"
                className="w-24 px-4 py-2 bg-white/10 border border-white/20 rounded-sm text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 group-hover:bg-white/15"
              />
            </div>

            {/* Entry Pages Dropdown with OV, Diagnostics, Labs, EKG */}
            <div className="relative" ref={entryDropdownRef}>
              <button
                onClick={() => setShowEntryDropdown(!showEntryDropdown)}
                className="group flex items-center gap-2 px-5 py-2 bg-white/10 border border-white/20 rounded-sm text-white text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
              >
                <span>Entry Pages</span>
                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-300`} />
              </button>

              {/* Entry Pages Dropdown Menu */}
              {showEntryDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-slideDown">
                  {entryItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePanel === item.panelId;
                    return (
                      <button
                        key={item.panelId}
                        onClick={() => handleEntrySelect(item.panelId)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 group hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600' : ''
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-4 h-4 text-${item.color.split('-')[1]}-500`} />
                        </div>
                        <span className={`flex-1 text-left ${isActive ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {item.label}
                        </span>
                        {isActive && <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-gradient-to-b from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-800 z-40 animate-slideDown">
          <div className="h-full overflow-y-auto pb-20">
            <div className="p-6 space-y-6">
              {/* User Profile */}
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full transform -translate-x-12 translate-y-12"></div>
                <div className="relative z-10">
                  <input
                    type="text"
                    placeholder="User Name"
                    defaultValue="User Name"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/80 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-white/50 mb-3"
                  />
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/30 hover:bg-red-500/40 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* Main Navigation */}
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
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 transform active:scale-95 ${
                        isActive 
                          ? 'bg-white/20 text-white shadow-lg' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {isActive && <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />}
                    </button>
                  );
                })}
              </div>

              {/* Entry Pages */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Entry Pages</div>
                {entryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePanel === item.panelId;
                  return (
                    <button
                      key={item.panelId}
                      onClick={() => {
                        handleEntrySelect(item.panelId);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 transform active:scale-95 ${
                        isActive 
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                          : 'text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
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
      `}</style>
    </div>
  );
};

export default TopNavbar;