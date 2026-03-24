import { LogOut, Home, Search, FileText, User, ChevronDown, Menu, X, Calendar, Settings, Activity, Microscope, HeartPulse, Stethoscope, Sparkles, Info, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; 

// Tooltip Component - Fixed to not interfere with clicks
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

const TopNavbar = ({ onPanelChange, activePanel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName] = useState("John Doe");
  const [userRole] = useState("Physician");

  const [showEntryDropdown, setShowEntryDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const entryDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Demo data for display
  const [filterData] = useState({
    provider: 'Dr. John Smith',
    dob: '15-05-1992',
    gender: 'Male',
    pageNo: '1-500'
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
      if (entryDropdownRef.current && !entryDropdownRef.current.contains(event.target)) {
        setShowEntryDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEntrySelect = (panelId) => {
    if (onPanelChange) {
      onPanelChange(panelId);
    }
    setShowEntryDropdown(false);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/", icon: Home, tooltip: "Go to Dashboard" },
    { label: "Admin", path: "/admin", icon: Settings, tooltip: "Admin Panel" },
    { label: "Report", path: "/report", icon: FileText, tooltip: "View Reports" },
    { label: "Search", path: "/search", icon: Search, tooltip: "Search Records" },
  ];

  // Updated entryItems with Social History
  const entryItems = [
    { label: "OV", icon: Stethoscope, panelId: "ov", color: "from-blue-500 to-cyan-400", tooltip: "Office Visit" },
    { label: "Diagnostics", icon: Activity, panelId: "diagnostics", color: "from-emerald-500 to-teal-400", tooltip: "Diagnostic Reports" },
    { label: "Labs", icon: Microscope, panelId: "labs", color: "from-purple-500 to-pink-400", tooltip: "Laboratory Results" },
    { label: "EKG", icon: HeartPulse, panelId: "ekg", color: "from-rose-500 to-red-400", tooltip: "Electrocardiogram" },
    { label: "Social History", icon: Users, panelId: "socialhistory", color: "from-indigo-500 to-purple-500", tooltip: "Social History & Clinical History" }
  ];

  // Get selected entry label
  const getSelectedEntryLabel = () => {
    if (!activePanel) return "Entry Page";
    const selected = entryItems.find(item => item.panelId === activePanel);
    return selected ? `Entry Page - ${selected.label}` : "Entry Page";
  };

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
        {/* Logo Section with tooltip */}
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

        {/* Desktop Navigation - Main Menu */}
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

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Info - Desktop with dropdown */}
          <div className="hidden lg:block relative" ref={userDropdownRef}>
            <Tooltip text="User Profile" position="bottom">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 xl:gap-3 hover:bg-white/5 rounded-xl px-2 py-1 transition-colors"
              >
                <div className="flex flex-col items-end">
                  <span className="text-xs xl:text-sm font-semibold text-white">{userName}</span>
                </div>
                <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
                </div>
              </button>
            </Tooltip>
          </div>

          {/* Logout Button with tooltip */}
          <Tooltip text="Logout" position="bottom">
            <button
              onClick={() => navigate("/login")}
              className="relative group p-2 xl:px-4 xl:py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 overflow-hidden flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <LogOut className="w-4 h-4 xl:w-4 xl:h-4 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </Tooltip>

          {/* Mobile Menu Button with tooltip */}
          <Tooltip text={isMobileMenuOpen ? "Close Menu" : "Open Menu"} position="bottom">
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
          </Tooltip>
        </div>
      </div>

      {/* ROW 2: Search/Filter Bar - Only visible on Home Page */}
      {isHomePage && (
        <div className="border-t border-white/30 bg-current">
          <div className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 py-1 sm:py-1.5">
            
            {/* Mobile: Horizontal scroll for small screens */}
            <div className="block sm:hidden overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-1">
              <div className="flex items-center gap-1.5 min-w-max">
                {/* Provider - Mobile with tooltip */}
                <Tooltip text="Current Provider" position="top">
                  <div className="flex-none px-2 py-1.5 bg-white/5 rounded text-white text-xs whitespace-nowrap">
                    <span className="text-white/60">Patient Name:</span> {filterData.provider}
                  </div>
                </Tooltip>

                {/* DOB - Mobile with tooltip */}
                <Tooltip text="Date of Birth" position="top">
                  <div className="flex-none px-2 py-1.5 bg-white/5 rounded text-white text-xs whitespace-nowrap">
                    <span className="text-white/60">DOB:</span> {filterData.dob}
                  </div>
                </Tooltip>

                {/* Gender - Mobile with tooltip */}
                <Tooltip text="Patient Gender" position="top">
                  <div className="flex-none px-2 py-1.5 bg-white/5 rounded text-white text-xs whitespace-nowrap">
                    <span className="text-white/60">Gender:</span> {filterData.gender}
                  </div>
                </Tooltip>

                {/* Page No - Mobile with tooltip */}
                <Tooltip text="Page Range" position="top">
                  <div className="flex-none px-2 py-1.5 bg-white/5 rounded text-white text-xs whitespace-nowrap">
                    <span className="text-white/60">Pages:</span> {filterData.pageNo}
                  </div>
                </Tooltip>

                {/* Entry Pages - Mobile with tooltip */}
                <div className="relative flex-none ml-auto" ref={entryDropdownRef}>
                  <Tooltip text="Select Entry Type" position="top">
                    <button
                      onClick={() => setShowEntryDropdown(!showEntryDropdown)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md text-white text-xs hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 whitespace-nowrap shadow-lg"
                    >
                      <span>{getSelectedEntryLabel()}</span>
                      <ChevronDown className={`w-4 h-4 text-white/80 transition-transform ${showEntryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Tablet & Desktop: Flex with left and right sections */}
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              {/* Left side - Filter items */}
              <div className="flex items-center gap-2 md:gap-3 lg:gap-4 flex-wrap">
                {/* Provider Name - with tooltip */}
                <Tooltip text="Current Patient Information" position="top">
                  <div className="flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 rounded-md">
                    <span className="text-white/60 text-xs md:text-sm">Patient Name:</span>
                    <span className="text-white text-xs md:text-sm font-medium">{filterData.provider}</span>
                  </div>
                </Tooltip>

                {/* DOB with tooltip */}
                <Tooltip text="Date of Birth" position="top">
                  <div className="flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 rounded-md">
                    <span className="text-white/60 text-xs md:text-sm">DOB:</span>
                    <span className="text-white text-xs md:text-sm font-medium">{filterData.dob}</span>
                  </div>
                </Tooltip>

                {/* Gender - with tooltip */}
                <Tooltip text="Patient Gender" position="top">
                  <div className="flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 rounded-md">
                    <span className="text-white/60 text-xs md:text-sm">Gender:</span>
                    <span className="text-white text-xs md:text-sm font-medium">{filterData.gender}</span>
                  </div>
                </Tooltip>

                {/* Page Number - with tooltip */}
                <Tooltip text="Page Range" position="top">
                  <div className="flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 rounded-md">
                    <span className="text-white/60 text-xs md:text-sm">Pages:</span>
                    <span className="text-white text-xs md:text-sm font-medium">{filterData.pageNo}</span>
                  </div>
                </Tooltip>
              </div>

              {/* Right side - Entry Pages Dropdown */}
              <div className="relative ml-4" ref={entryDropdownRef}>
                <Tooltip text="Select clinical entry" position="top">
                  <button
                    onClick={() => setShowEntryDropdown(!showEntryDropdown)}
                    className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-slate-950 to-black rounded-md text-white text-xs md:text-sm hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 shadow-lg"
                  >
                    <span className="font-medium">
                      {getSelectedEntryLabel()}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-white/80 transition-transform duration-300 ${showEntryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </Tooltip>

                {/* Entry Pages Dropdown */}
                {showEntryDropdown && (
                  <>
                    {/* Mobile full-screen dropdown */}
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:hidden">
                      <div className="w-full bg-white dark:bg-gray-800 rounded-t-xl p-4 animate-slideUp">
                        <div className="flex justify-between items-center mb-4">
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
                    <div className="hidden sm:block absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 py-1 rounded-lg z-50">
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
                            title={item.tooltip}
                          >
                            <div className={`p-1 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20`}>
                              <Icon className="w-4 h-4" />
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

      {/* Mobile Menu - Enhanced */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] sm:top-[61px] bg-gradient-to-b from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-800 z-40 animate-slideDown overflow-y-auto">
          <div className="min-h-full pb-20">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* User Profile with tooltips */}
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-black/10 rounded-full transform -translate-x-12 translate-y-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base sm:text-lg font-semibold">{userName}</div>
                      <div className="text-xs sm:text-sm text-white/80">{userRole}</div>
                    </div>
                  </div>
                  <Tooltip text="Logout from application" position="top">
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
                  </Tooltip>
                </div>
              </div>

              {/* Main Navigation with tooltips */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Main Menu</div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Tooltip key={item.path} text={item.tooltip} position="right">
                      <button
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
                    </Tooltip>
                  );
                })}
              </div>

              {/* Entry Pages with tooltips */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Entry Pages</div>
                {entryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePanel === item.panelId;
                  return (
                    <Tooltip key={item.panelId} text={item.tooltip} position="right">
                      <button
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
                    </Tooltip>
                  );
                })}
              </div>

              {/* Filter Data Display with tooltips */}
              {isHomePage && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Current Filters</div>
                  <div className="bg-white/5 rounded-xl p-4 space-y-2">
                    <Tooltip text="Current Provider" position="left">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">Provider:</span>
                        <span className="text-white font-medium">{filterData.provider}</span>
                      </div>
                    </Tooltip>
                    <Tooltip text="Date of Birth" position="left">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">DOB:</span>
                        <span className="text-white font-medium">{filterData.dob}</span>
                      </div>
                    </Tooltip>
                    <Tooltip text="Patient Gender" position="left">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">Gender:</span>
                        <span className="text-white font-medium">{filterData.gender}</span>
                      </div>
                    </Tooltip>
                    <Tooltip text="Page Range" position="left">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">Page No:</span>
                        <span className="text-white font-medium">{filterData.pageNo}</span>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
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
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TopNavbar;