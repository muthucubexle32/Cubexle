// src/components/layout/TopNavbar.jsx
import { 
  LogOut, Home, Search, FileText, User, ChevronDown, Menu, X, 
  Calendar, Settings, Activity, Microscope, HeartPulse, Stethoscope, 
  Sparkles, Info, Users, FileText as MedicalFile, 
  Activity as HealthActivity, AlertCircle, Heart,
  Layout,
  CheckCircle,
  AlertCircle as AlertIcon
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; 

// Tooltip Component (unchanged)
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
        <div className={`absolute z-50 ${positionClasses[position]} px-2 py-1 bg-gray-900 text-white text-[10px] sm:text-xs rounded shadow-lg whitespace-nowrap pointer-events-none animate-fadeIn`}>
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

const TopNavbar = ({ 
  onPanelChange, 
  activePanel, 
  onLogout,
  indexingStatus,        
  onIndexingStatusChange 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName] = useState("John Doe");
  const [userRole] = useState("Physician");
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [showEntryDropdown, setShowEntryDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const entryDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const [patientData, setPatientData] = useState({
    provider: 'No Patient Selected',
    dob: '—',
    gender: '—',
    pageNo: '—'
  });

  useEffect(() => {
    loadPatientData();
  }, [location.pathname]);

  const loadPatientData = () => {
    const savedPatient = localStorage.getItem('currentPatient');
    if (savedPatient) {
      const patient = JSON.parse(savedPatient);
      setPatientData({
        provider: patient.patientName || patient.sourceFile || 'No Patient Selected',
        dob: patient.dob || '—',
        gender: patient.gender || '—',
        pageNo: patient.pages || '1-500'
      });
    } else {
      const allPatients = JSON.parse(localStorage.getItem('patientData') || '{}');
      const firstPatient = Object.values(allPatients)[0];
      if (firstPatient) {
        setPatientData({
          provider: firstPatient.fullName || firstPatient.sourceFile || 'No Patient Selected',
          dob: firstPatient.dob || '—',
          gender: firstPatient.gender || '—',
          pageNo: '1-500'
        });
      }
    }
  };

  // Show toast helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 2000);
  };

  useEffect(() => {
    const handleStorageChange = () => loadPatientData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    else navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleEntrySelect = (panelId) => {
    if (onPanelChange) onPanelChange(panelId);
    setShowEntryDropdown(false);
    setIsMobileMenuOpen(false);
  };

  // Handle status change with toast
  const handleStatusChange = (status) => {
    if (onIndexingStatusChange) {
      onIndexingStatusChange(status);
    }
    showToast(`Document status set to "${status}"`, status === 'Completed' ? 'success' : 'info');
  };

  const navItems = [
    { label: "Team Dashboard", path: "/dashboard", icon: Layout, tooltip: "Team Dashboard" },
    { label: "Tool", path: "/tool", icon: Activity, tooltip: "Data Entry Tool" },
    { label: "Admin", path: "/admin", icon: Settings, tooltip: "Admin Panel" },
    { label: "Report", path: "/report", icon: FileText, tooltip: "View Reports" },
    { label: "Complete Dashboard", path: "/complete-dashboard", icon: Layout, tooltip: "Complete Dashboard" },
    { label: "Indexing", path: "/tool", icon: Layout, tooltip: "Indexing" }
  ];

  const entryItems = [
    { label: "OV", icon: Stethoscope, panelId: "ov", color: "from-blue-500 to-cyan-400", tooltip: "Office Visit" },
    { label: "Diagnostics", icon: Activity, panelId: "diagnostics", color: "from-emerald-500 to-teal-400", tooltip: "Diagnostic Reports" },
    { label: "Labs", icon: Microscope, panelId: "labs", color: "from-purple-500 to-pink-400", tooltip: "Laboratory Results" },
    { label: "EKG", icon: HeartPulse, panelId: "ekg", color: "from-rose-500 to-red-400", tooltip: "Electrocardiogram" },
    { label: "Social History", icon: Users, panelId: "socialhistory", color: "from-indigo-500 to-purple-500", tooltip: "Social History" },
    { label: "PMH", icon: MedicalFile, panelId: "pmh", color: "from-teal-500 to-green-400", tooltip: "Past Medical History" },
    { label: "PSH", icon: Stethoscope, panelId: "psh", color: "from-orange-500 to-yellow-400", tooltip: "Past Surgical History" },
    { label: "Family History", icon: Heart, panelId: "family-medical-history", color: "from-pink-500 to-rose-400", tooltip: "Family Medical History" },
    { label: "Health Overview", icon: HealthActivity, panelId: "health-overview", color: "from-cyan-500 to-blue-400", tooltip: "Health Overview" },
    { label: "Special Attention", icon: AlertCircle, panelId: "special-attention", color: "from-red-500 to-pink-400", tooltip: "Special Attention & APS" },
    { label: "Disease State", icon: Activity, panelId: "disease-state", color: "from-orange-500 to-red-400", tooltip: "Disease State" },
  ];

  const getSelectedEntryLabel = () => {
    if (!activePanel) return "Entry Page";
    const selected = entryItems.find(item => item.panelId === activePanel);
    return selected ? `Entry Page - ${selected.label}` : "Entry Page";
  };

  const showPatientBar = (location.pathname === "/" || location.pathname === "/tool") && activePanel !== 'indexing';
  const showIndexingStatusBar = location.pathname === "/tool" && activePanel === 'indexing';

  const handleIndexingClick = () => {
    if (location.pathname === "/tool") {
      if (onPanelChange) onPanelChange('indexing');
    } else {
      navigate('/tool', { state: { activePanel: 'indexing' } });
    }
    setIsMobileMenuOpen(false);
  };

  const handleToolClick = () => {
    if (location.pathname === "/tool") {
      if (onPanelChange) onPanelChange('ov');
    } else {
      navigate('/tool');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`w-full transition-all duration-500 ${
      isScrolled 
        ? 'bg-gray-800/95 dark:bg-black/95 backdrop-blur-xl shadow-lg' 
        : 'bg-[#031724] dark:bg-black'
    }`}>
      
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x"></div>

      {/* ROW 1: Main Navigation */}
      <div className="relative flex flex-wrap items-center justify-between px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-1.5 gap-2">
        {/* Logo Section */}
        <Tooltip text="Return to Dashboard" position="right">
          <div 
            className="flex items-center gap-1 xs:gap-2 sm:gap-3 group cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0" 
            onClick={() => navigate('/')}
          >
            <div className="relative w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
              <span className="text-[10px] xs:text-xs sm:text-sm font-bold text-white relative z-10">C</span>
            </div>
            <span className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300 hidden xs:inline">
              Cubexle
            </span>
          </div>
        </Tooltip>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-4 flex-wrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            let isActive = false;
            if (item.label === "Tool") {
              isActive = location.pathname === "/tool" && activePanel !== 'indexing';
            } else if (item.label === "Indexing") {
              isActive = location.pathname === "/tool" && activePanel === 'indexing';
            } else {
              isActive = location.pathname === item.path;
            }
            
            const handleClick = () => {
              if (item.label === "Indexing") {
                handleIndexingClick();
              } else if (item.label === "Tool") {
                handleToolClick();
              } else {
                navigate(item.path);
              }
            };

            return (
              <Tooltip key={item.path} text={item.tooltip} position="bottom">
                <button
                  onClick={handleClick}
                  className={`relative px-2 md:px-3 lg:px-4 xl:px-5 py-1.5 md:py-2 text-[11px] md:text-xs lg:text-sm font-medium rounded-xl transition-all duration-300 group overflow-hidden ${
                    isActive 
                      ? 'text-white bg-white/15 shadow-lg shadow-white/5' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1 md:gap-2">
                    <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                    <span className="lg:hidden">{item.label.charAt(0)}</span>
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 md:w-6 lg:w-8 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          <div className="hidden md:block relative" ref={userDropdownRef}>
            <Tooltip text="User Profile" position="bottom">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1 xl:gap-2 hover:bg-white/5 rounded-xl px-1 md:px-2 py-1 transition-colors"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] md:text-xs xl:text-sm font-semibold text-white">{userName}</span>
                </div>
                <div className="w-7 h-7 md:w-8 md:h-8 xl:w-10 xl:h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 md:w-4 md:h-4 xl:w-5 xl:h-5 text-white" />
                </div>
              </button>
            </Tooltip>
          </div>
          <Tooltip text="Logout" position="bottom">
            <button
              onClick={handleLogoutClick}
              className="relative group p-1.5 md:p-2 xl:px-4 xl:py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 overflow-hidden flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4 xl:w-4 xl:h-4 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </Tooltip>
          <Tooltip text={isMobileMenuOpen ? "Close Menu" : "Open Menu"} position="bottom">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex-shrink-0"
            >
              {isMobileMenuOpen ? (
                <X className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white animate-spin" />
              ) : (
                <Menu className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* ROW 2: Patient Information Bar (normal mode) */}
      {showPatientBar && (
        <div className="border-t border-white/30 bg-current">
          <div className="px-1 xs:px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 py-1 sm:py-1.5">
            {/* Mobile horizontal scroll */}
            <div className="block sm:hidden overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-1 -mx-1 px-1">
              <div className="flex items-center gap-1.5 min-w-max">
                <Tooltip text="Current Patient" position="top">
                  <div className="flex-none px-2 py-1.5 bg-white/5 rounded text-white text-[10px] whitespace-nowrap">
                    <span className="text-white/60">Patient Name:</span> {patientData.provider.length > 15 ? patientData.provider.substring(0, 15) + '...' : patientData.provider}
                  </div>
                </Tooltip>
                <Tooltip text="Date of Birth" position="top">
                  <div className="flex-none px-2 py-1.5 bg-white/5 rounded text-white text-[10px] whitespace-nowrap">
                    <span className="text-white/60">DOB:</span> {patientData.dob}
                  </div>
                </Tooltip>
                <Tooltip text="Patient Gender" position="top">
                  <div className="flex-none px-2 py-1.5 bg-white/5 rounded text-white text-[10px] whitespace-nowrap">
                    <span className="text-white/60">Gender:</span> {patientData.gender}
                  </div>
                </Tooltip>
                <Tooltip text="Page Range" position="top">
                  <div className="flex-none px-2 py-1.5 bg-white/5 rounded text-white text-[10px] whitespace-nowrap">
                    <span className="text-white/60">Pages:</span> {patientData.pageNo}
                  </div>
                </Tooltip>
                <div className="relative flex-none ml-auto" ref={entryDropdownRef}>
                  <Tooltip text="Select Entry Type" position="top">
                    <button
                      onClick={() => setShowEntryDropdown(!showEntryDropdown)}
                      className="flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md text-white text-[10px] hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 whitespace-nowrap shadow-lg"
                    >
                      <span className="max-w-[100px] truncate">{getSelectedEntryLabel()}</span>
                      <ChevronDown className={`w-3 h-3 text-white/80 transition-transform ${showEntryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
            {/* Tablet & Desktop */}
            <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4">
                <Tooltip text="Current Patient Information" position="top">
                  <div className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-md">
                    <span className="text-white text-[10px] md:text-xs">Patient Name:</span>
                    <span className="text-white text-[10px] md:text-xs font-medium truncate max-w-[150px] md:max-w-[200px]">{patientData.provider}</span>
                  </div>
                </Tooltip>
                <Tooltip text="Date of Birth" position="top">
                  <div className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-md">
                    <span className="text-white text-[10px] md:text-xs">DOB:</span>
                    <span className="text-white text-[10px] md:text-xs font-medium">{patientData.dob}</span>
                  </div>
                </Tooltip>
                <Tooltip text="Patient Gender" position="top">
                  <div className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-md">
                    <span className="text-white text-[10px] md:text-xs">Gender:</span>
                    <span className="text-white text-[10px] md:text-xs font-medium">{patientData.gender}</span>
                  </div>
                </Tooltip>
                <Tooltip text="Page Range" position="top">
                  <div className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-md">
                    <span className="text-white text-[10px] md:text-xs">Pages:</span>
                    <span className="text-white text-[10px] md:text-xs font-medium">{patientData.pageNo}</span>
                  </div>
                </Tooltip>
              </div>
              <div className="relative flex-shrink-0" ref={entryDropdownRef}>
                <Tooltip text="Select clinical entry" position="top">
                  <button
                    onClick={() => setShowEntryDropdown(!showEntryDropdown)}
                    className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-slate-950 to-black rounded-md text-white text-[10px] md:text-xs hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 shadow-lg"
                  >
                    <span className="font-medium whitespace-nowrap">{getSelectedEntryLabel()}</span>
                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-white/80 transition-transform duration-300 ${showEntryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </Tooltip>
                {showEntryDropdown && (
                  <>
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:hidden">
                      <div className="w-full bg-white dark:bg-gray-800 rounded-t-xl p-4 animate-slideUp max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 pt-2 pb-2">
                          <h3 className="text-base font-semibold text-gray-800 dark:text-white">Select Entry</h3>
                          <button onClick={() => setShowEntryDropdown(false)} className="p-2"><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <div className="space-y-2">
                          {entryItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activePanel === item.panelId;
                            return (
                              <button key={item.panelId} onClick={() => { handleEntrySelect(item.panelId); setShowEntryDropdown(false); }}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-gray-700 dark:to-gray-600 border border-blue-500/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20`}><Icon className="w-5 h-5" /></div>
                                <span className={`flex-1 text-left text-sm ${isActive ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block absolute right-0 top-full mt-1 w-40 md:w-44 lg:w-48 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 py-1 rounded-lg z-50">
                      {entryItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePanel === item.panelId;
                        return (
                          <button key={item.panelId} onClick={() => handleEntrySelect(item.panelId)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs md:text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600' : ''}`} title={item.tooltip}>
                            <div className={`p-1 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20`}><Icon className="w-3.5 h-3.5 md:w-4 md:h-4" /></div>
                            <span className={`flex-1 text-left ${isActive ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{item.label}</span>
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

      {/* ROW 2 (alternate) : Indexing Status Bar - RESPONSIVE with Toast */}
      {showIndexingStatusBar && (
        <div className="border-t border-white/30 bg-current">
          <div className="px-3 sm:px-4 md:px-6 py-2 flex flex-col sm:flex-row justify-end items-center gap-3 sm:gap-4">
            <span className="text-white text-xs sm:text-sm font-medium">Document Status:</span>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => handleStatusChange('Clarification')}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  indexingStatus === 'Clarification'
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                Clarification
              </button>
              <button
                onClick={() => handleStatusChange('Completed')}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  indexingStatus === 'Completed'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] xs:top-[60px] sm:top-[65px] bg-gradient-to-b from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-800 z-40 animate-slideDown overflow-y-auto">
          <div className="min-h-full pb-20">
            <div className="p-3 xs:p-4 sm:p-6 space-y-3 xs:space-y-4 sm:space-y-6">
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-3 xs:p-4 sm:p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-20 xs:w-24 sm:w-32 h-20 xs:h-24 sm:h-32 bg-white/10 rounded-full transform translate-x-12 xs:translate-x-16 -translate-y-12 xs:-translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 bg-black/10 rounded-full transform -translate-x-8 xs:-translate-x-12 translate-y-8 xs:translate-y-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm xs:text-base sm:text-lg font-semibold">{userName}</div>
                      <div className="text-[10px] xs:text-xs sm:text-sm text-white/80">{userRole}</div>
                    </div>
                  </div>
                  <Tooltip text="Logout from application" position="top">
                    <button onClick={handleLogoutClick} className="w-full flex items-center justify-center gap-2 px-3 py-2 xs:px-4 xs:py-3 bg-red-500/30 hover:bg-red-500/40 rounded-xl transition-colors text-xs xs:text-sm sm:text-base">
                      <LogOut className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" /><span>Logout</span>
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="space-y-1 xs:space-y-2">
                <div className="text-[9px] xs:text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 xs:px-4">Main Menu</div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  let isActive = false;
                  if (item.label === "Tool") {
                    isActive = location.pathname === "/tool" && activePanel !== 'indexing';
                  } else if (item.label === "Indexing") {
                    isActive = location.pathname === "/tool" && activePanel === 'indexing';
                  } else {
                    isActive = location.pathname === item.path;
                  }
                  const handleClick = () => {
                    if (item.label === "Indexing") {
                      handleIndexingClick();
                    } else if (item.label === "Tool") {
                      handleToolClick();
                    } else {
                      navigate(item.path);
                    }
                    setIsMobileMenuOpen(false);
                  };
                  return (
                    <Tooltip key={item.path} text={item.tooltip} position="right">
                      <button onClick={handleClick} className={`w-full flex items-center gap-3 xs:gap-4 px-3 xs:px-4 py-2.5 xs:py-3 sm:py-4 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/20 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                        <div className={`p-1.5 xs:p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5'}`}><Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" /></div>
                        <span className="font-medium flex-1 text-left text-xs xs:text-sm sm:text-base">{item.label}</span>
                        {isActive && <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-blue-300 animate-pulse" />}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
              <div className="space-y-1 xs:space-y-2 pt-3 xs:pt-4 border-t border-white/10">
                <div className="text-[9px] xs:text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 xs:px-4">Entry Pages</div>
                {entryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePanel === item.panelId;
                  return (
                    <Tooltip key={item.panelId} text={item.tooltip} position="right">
                      <button onClick={() => { handleEntrySelect(item.panelId); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 xs:gap-4 px-3 xs:px-4 py-2.5 xs:py-3 sm:py-4 rounded-xl transition-all duration-300 ${isActive ? `bg-gradient-to-r ${item.color} text-white shadow-lg` : 'text-white/70 hover:bg-white/10'}`}>
                        <div className={`p-1.5 xs:p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5'}`}><Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" /></div>
                        <span className="font-medium flex-1 text-left text-xs xs:text-sm sm:text-base">{item.label}</span>
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
              <div className="space-y-1 xs:space-y-2 pt-3 xs:pt-4 border-t border-white/10">
                <div className="text-[9px] xs:text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 xs:px-4">Current Patient</div>
                <div className="bg-white/5 rounded-xl p-3 xs:p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs xs:text-sm"><span className="text-white/60">Patient:</span><span className="text-white font-medium truncate ml-2 max-w-[150px]">{patientData.provider}</span></div>
                  <div className="flex justify-between items-center text-xs xs:text-sm"><span className="text-white/60">DOB:</span><span className="text-white font-medium">{patientData.dob}</span></div>
                  <div className="flex justify-between items-center text-xs xs:text-sm"><span className="text-white/60">Gender:</span><span className="text-white font-medium">{patientData.gender}</span></div>
                  <div className="flex justify-between items-center text-xs xs:text-sm"><span className="text-white/60">Pages:</span><span className="text-white font-medium">{patientData.pageNo}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification for Status Confirmation */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] animate-slideUp">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-yellow-500 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertIcon size={16} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 480px) {
          .xs\\:inline { display: inline; }
          .xs\\:hidden { display: none; }
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5);
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
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TopNavbar;