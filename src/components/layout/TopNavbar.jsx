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

  // Demo data for display (this would come from your backend/state management)
  const [filterData] = useState({
    provider: "Provider Name/ID",
    dob: "Date of Birth",
    gender: "Gender",
    pageNo: "Pages"
  });

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

  // Check if current page is home/landing page
  const isHomePage = location.pathname === "/";

  return (
    <div className={`w-full transition-all duration-500 ${
    isScrolled 
      ? 'bg-gray-800/95 dark:bg-black/95 backdrop-blur-xl' 
      : 'bg-[#031724] dark:bg-black'
  }`}>
      
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x"></div>

      {/* ROW 1: Main Navigation */}
      <div className="relative flex items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8 py-1.5">
        {/* Logo Section with enhanced effects */}
        <div 
          className="flex items-center gap-2 sm:gap-3 group cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0" 
          onClick={() => navigate('/')}
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
            <span className="text-xs sm:text-sm font-bold text-white relative z-10">Logo</span>
          </div>
          <span className="text-sm sm:text-base lg:text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300 hidden xs:inline">
            Logo Name
          </span>
        </div>

        {/* Desktop Navigation - Main Menu with modern effects */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
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
                {/* Hover shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Name - Desktop */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs xl:text-sm font-semibold text-white truncate max-w-[100px] xl:max-w-[150px]">User Name</span>
            </div>
            <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
            </div>
          </div>

          {/* Logout Button with enhanced effects */}
          <button
            onClick={() => navigate("/login")}
            className="relative group p-2 xl:px-4 xl:py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 overflow-hidden flex-shrink-0"
            title="Logout"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <LogOut className="w-4 h-4 xl:w-4 xl:h-4 group-hover:rotate-180 transition-transform duration-500" />
           
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex-shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* ROW 2: Search/Filter Bar - Label Method with API Data - Only visible on Home Page */}
      {isHomePage && (
        <div className="border-t border-white/30 bg-current ">
          <div className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 py-1 sm:py-1.5">
            
            {/* Mobile: Horizontal scroll for small screens */}
            <div className="block sm:hidden w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-1">
              <div className="flex items-center gap-1.5 min-w-max">
                {/* Provider - Mobile */}
                <div className="w-[140px] flex-none">
                  <div className="w-full px-2 py-1.5 bg-white/5 border border-white/30 rounded-sm text-white text-xs">
                    {filterData.provider || 'Provider Name/ID'}
                  </div>
                </div>

                {/* DOB - Mobile */}
                <div className="relative w-[100px] flex-none" ref={calendarRef}>
                  <div 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full px-2 py-1.5 bg-white/5 border border-white/30 rounded-sm text-white text-xs cursor-pointer"
                  >
                    {filterData.dob || 'DOB'}
                  </div>
                </div>

                {/* Gender - Mobile */}
                <div className="w-[80px] flex-none">
                  <div className="w-full px-2 py-1.5 bg-white/5 border border-white/30 rounded-sm text-white text-xs">
                    {filterData.gender || 'Gender'}
                  </div>
                </div>

                {/* Page No - Mobile */}
                <div className="w-[70px] flex-none">
                  <div className="w-full px-2 py-1.5 bg-white/5 border border-white/30 rounded-sm text-white text-xs">
                    {filterData.pageNo || 'Pages'}
                  </div>
                </div>

                {/* Entry Pages - Mobile */}
                <div className="relative flex-none" ref={entryDropdownRef}>
                  <button
                    onClick={() => setShowEntryDropdown(!showEntryDropdown)}
                    className="flex items-center gap-1 px-2 py-1.5 bg-white/30 border border-white/20 rounded-sm text-white text-xs hover:bg-white/15 focus:outline-none focus:ring-1 focus:ring-blue-400/50 whitespace-nowrap"
                  >
                    <span>{activePanel ? entryItems.find(item => item.panelId === activePanel)?.label || 'Entry' : 'Entry'}</span>
                    <ChevronDown className={`w-3 h-3 text-white/60 transition-transform ${showEntryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tablet & Desktop: Normal flex layout */}
            <div className="hidden sm:flex sm:flex-wrap items-center gap-1 md:gap-2 justify-start">
              
              {/* Provider Name - Label Method */}
              <div className="w-auto flex-1 min-w-[140px] md:min-w-[180px] lg:min-w-[220px] xl:min-w-[260px] max-w-[340px]">
                <div className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-white/5 border border-white/20 rounded-sm text-white text-xs md:text-sm">
                  {filterData.provider || 'Provider Name / ID'}
                </div>
              </div>

              {/* DOB with Calendar - Label Method */}
              <div className="relative w-24 md:w-28 lg:w-32 xl:w-36" ref={calendarRef}>
                <div className="relative group">
                  <div 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-white/5 border border-white/20 rounded-sm text-white text-xs md:text-sm cursor-pointer pr-7 transition-all duration-300 hover:bg-white/50"
                  >
                    {filterData.dob || 'Date of Birth'}
                  </div>
                  <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                </div>

                
              </div>

              {/* Gender - Label Method */}
              <div className="relative w-20 md:w-24 lg:w-32">
                <div className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-white/5 border border-white/20 rounded-sm text-white text-xs md:text-sm">
                  {filterData.gender || 'Gender'}
                </div>
              </div>

              {/* Page Number - Label Method */}
              <div className="relative w-16 md:w-20 lg:w-32">
                <div className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-white/5 border border-white/20 rounded-sm text-white text-xs md:text-sm">
                  {filterData.pageNo || 'Pages'}
                </div>
              </div>

              {/* Entry Pages Dropdown - Interactive */}
              <div className="relative " ref={entryDropdownRef}>
                <button
                  onClick={() => setShowEntryDropdown(!showEntryDropdown)}
                  className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 lg:px-4 py-1.5 md:py-2 bg-white/10 border border-white/20 rounded-sm text-white text-xs md:text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 whitespace-nowrap"
                >
                  <span className="hidden xs:inline">{activePanel ? entryItems.find(item => item.panelId === activePanel)?.label || 'Entry Pages' : 'Entry Pages'}</span>
                  <span className="xs:hidden">{activePanel ? entryItems.find(item => item.panelId === activePanel)?.label || 'Pages' : 'Pages'}</span>
                  <ChevronDown className={`w-3 h-3 md:w-3.5 md:h-3.5 text-white/60 transition-transform duration-300 ${showEntryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Entry Pages Dropdown - Mobile optimized */}
                {showEntryDropdown && (
                  <>
                    {/* Mobile full-screen dropdown */}
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:hidden">
                      <div className="w-full bg-white dark:bg-gray-800 rounded-t-xl p-4 animate-slideUp">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Select Entry</h3>
                          <button onClick={() => setShowEntryDropdown(false)} className="p-2">
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {entryItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activePanel === item.panelId;
                            return (
                              <button
                                key={item.panelId}
                                onClick={() => {
                                  handleEntrySelect(item.panelId);
                                  setShowEntryDropdown(false);
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                                  isActive 
                                    ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-gray-700 dark:to-gray-600 border border-blue-500/20' 
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <span className={`flex-1 text-left text-base ${isActive ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {item.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Desktop dropdown */}
                    <div className="hidden sm:block absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 py-1 rounded-lg z-50">
                      {entryItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePanel === item.panelId;
                        return (
                          <button
                            key={item.panelId}
                            onClick={() => handleEntrySelect(item.panelId)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600' : ''
                            }`}
                          >
                            <div className={`p-1 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className={`flex-1 text-left ${isActive ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu - Enhanced for better mobile experience */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] sm:top-[61px] bg-gradient-to-b from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-800 z-40 animate-slideDown overflow-y-auto">
          <div className="min-h-full pb-20">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* User Profile */}
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-black/10 rounded-full transform -translate-x-12 translate-y-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white text-base sm:text-lg font-semibold">
                        User Name
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/30 hover:bg-red-500/40 rounded-xl transition-colors text-sm sm:text-base"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
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
                      className={`w-full flex items-center gap-4 px-4 py-3 sm:py-4 rounded-xl transition-all duration-300 transform active:scale-95 ${
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
                      className={`w-full flex items-center gap-4 px-4 py-3 sm:py-4 rounded-xl transition-all duration-300 transform active:scale-95 ${
                        isActive 
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                          : 'text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="font-medium flex-1 text-left text-sm sm:text-base">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Filter Data Display - Only on Home Page */}
              {isHomePage && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Current Filters</div>
                  <div className="bg-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Provider:</span>
                      <span className="text-white font-medium">{filterData.provider || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">DOB:</span>
                      <span className="text-white font-medium">{filterData.dob || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Gender:</span>
                      <span className="text-white font-medium">{filterData.gender || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Page No:</span>
                      <span className="text-white font-medium">{filterData.pageNo || '—'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for xs breakpoint and animations */}
      <style jsx>{`
        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
        }
        
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