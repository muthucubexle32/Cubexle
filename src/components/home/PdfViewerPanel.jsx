import React, { useState, useEffect, useRef } from "react";
import {
  Maximize2,
  RotateCcw,
  PanelRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Settings,
  Sun,
  Moon,
  Star,
  X,
  Search,
  Grid,
  LayoutGrid,
  LayoutList,
  RotateCw,
  Ruler,
  ScanLine,
  Menu,
  Check,
  FileText,
  Clock,
  Copy,
  Download,
  Layers,
  Type,
  Languages,
  FolderOpen,
  User as UserIcon,
  Calendar,
  Users
} from "lucide-react";

// Tooltip Component
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-pointer"
      >
        {children}
      </div>
      {show && (
        <div className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap
          ${position === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-2' : ''}
          ${position === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-2' : ''}
          ${position === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-2' : ''}
          ${position === 'right' ? 'left-full top-1/2 transform -translate-y-1/2 ml-2' : ''}
        `}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45
            ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
            ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
            ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
            ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
          `} />
        </div>
      )}
    </div>
  );
};

const PAGE_SIZE_DIMENSIONS = {
  'A4': { width: 595, height: 842, unit: 'px' },
  'A3': { width: 842, height: 1191, unit: 'px' },
  'Letter': { width: 612, height: 792, unit: 'px' },
  'Legal': { width: 612, height: 1008, unit: 'px' },
};

const PdfViewerPanel = () => {
  // Patient data from localStorage
  const [patientInfo, setPatientInfo] = useState({
    sourceFile: null,
    patientName: null,
    dob: null,
    gender: null,
    pages: null,
    providerName: null,
    policyNumber: null
  });

  // Document Info State
  const [documentInfo, setDocumentInfo] = useState({
    docName: "No Document Selected",
    docNo: "—",
    totalPages: 11
  });

  // Core states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(11);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isThumbnailOpen, setIsThumbnailOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [viewMode, setViewMode] = useState('single');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [starredPages, setStarredPages] = useState([]);

  // Page search states
  const [isPageSearchOpen, setIsPageSearchOpen] = useState(false);
  const pageSearchInputRef = useRef(null);

  // OCR states
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [showOCRPanel, setShowOCRPanel] = useState(false);
  const [ocrHistory, setOcrHistory] = useState([]);
  const [selectedOCRLanguage, setSelectedOCRLanguage] = useState('english');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [showOCRExportMenu, setShowOCRExportMenu] = useState(false);
  const [ocrMode, setOcrMode] = useState('full-page');
  const [isOCRSettingsOpen, setIsOCRSettingsOpen] = useState(false);

  // Page size states
  const [pageSize, setPageSize] = useState('A4');
  const [customWidth, setCustomWidth] = useState(595);
  const [customHeight, setCustomHeight] = useState(842);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

  // UI states
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // Refs
  const scrollContainerRef = useRef(null);
  const settingsRef = useRef(null);
  const sizeRef = useRef(null);
  const zoomMenuRef = useRef(null);
  const ocrExportMenuRef = useRef(null);
  const pageContentRef = useRef(null);

  // ==================== LOAD PATIENT DATA FROM LOCALSTORAGE ====================
  const loadPatientData = () => {
    const currentPatient = localStorage.getItem('currentPatient');
    if (currentPatient) {
      const patient = JSON.parse(currentPatient);
      setPatientInfo({
        sourceFile: patient.sourceFile,
        patientName: patient.patientName,
        dob: patient.dob,
        gender: patient.gender,
        pages: patient.pages,
        providerName: patient.providerName,
        policyNumber: patient.policyNumber
      });
      
      // Update document info with patient data
      setDocumentInfo({
        docName: patient.patientName || patient.sourceFile || "Document",
        docNo: patient.sourceFile || "—",
        totalPages: 11
      });
      
      console.log('PDF Viewer loaded patient:', patient);
    } else {
      // Try to load from patientData
      const allPatients = JSON.parse(localStorage.getItem('patientData') || '{}');
      const firstKey = Object.keys(allPatients)[0];
      if (firstKey) {
        const patient = allPatients[firstKey];
        setPatientInfo({
          sourceFile: patient.sourceFile,
          patientName: patient.fullName,
          dob: patient.dob,
          gender: patient.gender,
         
          providerName: patient.providerName,
          policyNumber: patient.policyNumber
        });
        setDocumentInfo({
          docName: patient.fullName || patient.sourceFile || "Document",
          docNo: patient.sourceFile || "—",
          totalPages: 11
        });
      }
    }
  };

  // Load patient data on mount and listen for changes
  useEffect(() => {
    loadPatientData();
    
    // Listen for storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'currentPatient' || event.key === 'patientData') {
        loadPatientData();
      }
    };
    
    // Listen for custom event
    const handlePatientLoaded = (event) => {
      if (event.detail) {
        setPatientInfo(prev => ({ ...prev, ...event.detail }));
        setDocumentInfo({
          docName: event.detail.patientName || event.detail.sourceFile || "Document",
          docNo: event.detail.sourceFile || "—",
          totalPages: 11
        });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('patientLoaded', handlePatientLoaded);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('patientLoaded', handlePatientLoaded);
    };
  }, []);

  // Page size handling
  const getCurrentPageDimensions = () => {
    if (pageSize === 'Custom') {
      return { width: customWidth, height: customHeight };
    }
    return PAGE_SIZE_DIMENSIONS[pageSize];
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    if (size !== 'Custom') {
      const dims = PAGE_SIZE_DIMENSIONS[size];
      setCustomWidth(dims.width);
      setCustomHeight(dims.height);
    }
    setIsSizeDropdownOpen(false);
  };

  const pageDims = getCurrentPageDimensions();

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 640) {
        setIsThumbnailOpen(false);
      } else if (window.innerWidth < 1024) {
        setIsThumbnailOpen(false);
      } else {
        setIsThumbnailOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
      if (sizeRef.current && !sizeRef.current.contains(event.target)) {
        setIsSizeDropdownOpen(false);
      }
      if (zoomMenuRef.current && !zoomMenuRef.current.contains(event.target)) {
        setIsZoomMenuOpen(false);
      }
      if (ocrExportMenuRef.current && !ocrExportMenuRef.current.contains(event.target)) {
        setShowOCRExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation functions
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= totalPages) {
      setCurrentPage(value);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 25));
  const handleZoomReset = () => setZoomLevel(100);

  const handleRotate = (direction) => {
    setRotationAngle(prev => direction === 'left' ? prev - 90 : prev + 90);
  };

  const handleManualPageSearch = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setSelectedPage(pageNum);
      setIsPageSearchOpen(false);
    }
  };

  // OCR Functions
  const performOCR = async (mode = 'full-page') => {
    setIsOCRProcessing(true);
    setOcrProgress(0);
    setOcrMode(mode);
    
    const interval = setInterval(() => {
      setOcrProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      
      let mockOCRText = '';
      if (mode === 'full-page') {
        mockOCRText = `[FULL PAGE OCR - Page ${currentPage}]\n\nSource File: ${patientInfo.sourceFile || 'Unknown'}\nPatient: ${patientInfo.patientName || 'Unknown'}\nDOB: ${patientInfo.dob || 'Unknown'}\nGender: ${patientInfo.gender || 'Unknown'}\n\nThis is the complete OCR text extracted from page ${currentPage}. It contains all the text content that was detected on this page.`;
      } else if (mode === 'area') {
        mockOCRText = `[SELECTED AREA OCR - Page ${currentPage}]\n\nSource File: ${patientInfo.sourceFile || 'Unknown'}\nPatient: ${patientInfo.patientName || 'Unknown'}\n\nThis is the OCR text from the selected area on page ${currentPage}.`;
      } else {
        mockOCRText = `[TEXT-ONLY OCR - Page ${currentPage}]\n\nSource File: ${patientInfo.sourceFile || 'Unknown'}\n\nThis is the raw text extracted from page ${currentPage}.`;
      }

      setOcrText(mockOCRText);
      
      setOcrHistory(prev => [{
        page: currentPage,
        text: mockOCRText,
        timestamp: new Date().toLocaleTimeString(),
        mode: mode,
        language: selectedOCRLanguage,
        sourceFile: patientInfo.sourceFile
      }, ...prev].slice(0, 10));
      
      setIsOCRProcessing(false);
      setShowOCRPanel(true);
      setOcrProgress(100);
    }, 2000);
  };

  const handleCopyOCRText = () => {
    navigator.clipboard.writeText(ocrText);
    alert('OCR text copied to clipboard!');
  };

  const handleDownloadOCRText = () => {
    const element = document.createElement('a');
    const file = new Blob([ocrText], {type: 'text/plain'});
    const fileName = patientInfo.sourceFile 
      ? `${patientInfo.sourceFile}-page-${currentPage}-ocr.txt`
      : `page-${currentPage}-ocr-${new Date().getTime()}.txt`;
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleStarPage = (pageNum) => {
    setStarredPages(prev => 
      prev.includes(pageNum) 
        ? prev.filter(p => p !== pageNum)
        : [...prev, pageNum]
    );
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    }
  };

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Page Content Component
  const PageContent = ({ pageNum }) => (
    <div
      ref={pageContentRef}
      onMouseUp={handleTextSelection}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden transition-all ${
        selectedPage === pageNum ? 'ring-2 ring-blue-500' : 'border-gray-200 dark:border-gray-700'
      }`}
      style={{
        width: '100%',
        minHeight: isMobile ? '400px' : 'auto',
        transform: `rotate(${rotationAngle}deg)`,
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease'
      }}
    >
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-3 sm:px-4 py-2 border-b flex justify-between items-center flex-wrap gap-2">
        <div>
          <span className="font-medium text-sm sm:text-base">Page {pageNum}</span>
         
        </div>
        <div className="flex items-center gap-2">
          <Tooltip text={starredPages.includes(pageNum) ? "Remove from starred" : "Add to starred"} position="bottom">
            <button 
              onClick={() => toggleStarPage(pageNum)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <Star className={`w-3 h-3 ${starredPages.includes(pageNum) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
            </button>
          </Tooltip>
          <Tooltip text="OCR on this page" position="left">
            <button 
              onClick={() => performOCR('full-page')}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <ScanLine className="w-3 h-3 text-blue-500" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="relative p-4 sm:p-6" style={{ zoom: zoomLevel / 100 }}>
        <div className="space-y-2 sm:space-y-3 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-32"></div>
            <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-24"></div>
          </div>
          
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-11/12"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-4/5"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-5/6"></div>
          
          <div className="h-2"></div>
          
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-10/12"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-9/12"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-4/5"></div>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-8/12"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-7/12"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-9/12"></div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded w-20 mx-auto"></div>
            </div>
          </div>
        </div>
        
        {selectedText && (
          <div className="absolute bottom-2 right-2 text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
            Text selected
          </div>
        )}
      </div>
    </div>
  );

  // Thumbnail Component
  const ThumbnailPage = ({ pageNum }) => (
    <button
      onClick={() => {
        setCurrentPage(pageNum);
        setSelectedPage(pageNum);
      }}
      className={`w-full relative rounded-lg border-2 transition-all overflow-hidden group ${
        currentPage === pageNum ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-blue-300'
      }`}
    >
      <div className={`h-12 sm:h-14 lg:h-16 xl:h-20 bg-gradient-to-b from-gray-100 to-gray-200 p-1.5 sm:p-2 ${
        currentPage === pageNum ? 'bg-gradient-to-b from-blue-50 to-blue-100' : ''
      }`}>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="h-1 w-8 bg-gray-300 rounded"></div>
            <div className="h-1 w-4 bg-gray-300 rounded"></div>
          </div>
          <div className="h-1 w-full bg-white/80 rounded"></div>
          <div className="h-1 w-3/4 bg-white/80 rounded"></div>
          <div className="h-1 w-5/6 bg-white/80 rounded"></div>
          <div className="h-1 w-2/3 bg-white/80 rounded"></div>
          <div className="flex justify-end mt-1">
            <div className="h-1 w-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded-full">
        {pageNum}
      </div>
      
      {starredPages.includes(pageNum) && (
        <div className="absolute top-1 left-1">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500 fill-yellow-500" />
        </div>
      )}
      
      {ocrHistory.some(h => h.page === pageNum) && (
        <Tooltip text="OCR performed on this page" position="top">
          <div className="absolute top-1 right-6">
            <ScanLine className="w-2.5 h-2.5 text-green-500" />
          </div>
        </Tooltip>
      )}
      
      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all"></div>
    </button>
  );

  return (
    <div className={`flex flex-col h-full w-full transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-gray-50 to-white text-gray-800'
    }`}>
      {/* Document Info Bar with Patient Data */}
      <div className={`flex-shrink-0 px-2 sm:px-4 py-2 sm:py-3 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            {/* Source File */}
            <div className="flex items-center gap-1 sm:gap-2">
             
              <Tooltip text="Source File" position="bottom">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {patientInfo.sourceFile || 'No Source File'}
                </span>
              </Tooltip>
            </div>
            
            {/* Patient Name */}
            {patientInfo.patientName && (
              <div className="flex items-center gap-1 sm:gap-2">
                
                <Tooltip text="Patient Name" position="bottom">
                  <span className=" text-xs sm:text-sm font-medium">
                    {patientInfo.patientName}
                  </span>
                </Tooltip>
              </div>
            )}
            
            {/* Page Info */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              <Tooltip text="Current page / Total pages" position="bottom">
                <span className="text-xs sm:text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Main Toolbar */}
      <div className={`flex-shrink-0 flex flex-wrap items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/60'
      }`}>
        {/* Mobile Menu */}
        <Tooltip text="Menu" position="bottom">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </Tooltip>

        {/* Thumbnail Toggle */}
        <Tooltip text={isThumbnailOpen ? "Hide thumbnails" : "Show thumbnails"} position="right">
          <button
            onClick={() => setIsThumbnailOpen(!isThumbnailOpen)}
            className={`p-1.5 sm:p-2 rounded-lg hidden lg:block ${
              isThumbnailOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <PanelRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </Tooltip>

        {/* Zoom Controls */}
        <div className="relative flex items-center">
          <Tooltip text="Zoom out" position="bottom">
            <button onClick={handleZoomOut} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </Tooltip>
          
          <Tooltip text="Zoom level" position="bottom">
            <button
              onClick={() => setIsZoomMenuOpen(!isZoomMenuOpen)}
              className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-medium hover:bg-gray-100 rounded"
            >
              {zoomLevel}%
            </button>
          </Tooltip>
          
          <Tooltip text="Zoom in" position="bottom">
            <button onClick={handleZoomIn} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </Tooltip>

          {isZoomMenuOpen && (
            <div className={`absolute top-full left-0 mt-1 w-24 rounded-lg shadow-lg border py-1 z-50 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`} ref={zoomMenuRef}>
              {[50, 75, 100, 125, 150, 200].map(level => (
                <button
                  key={level}
                  onClick={() => {
                    setZoomLevel(level);
                    setIsZoomMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-xs text-left hover:bg-gray-100 ${
                    zoomLevel === level ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  {level}%
                </button>
              ))}
              <button
                onClick={handleZoomReset}
                className="w-full px-3 py-1.5 text-xs text-left hover:bg-gray-100 border-t"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Rotate buttons */}
        <div className="hidden xs:flex items-center gap-1">
          <Tooltip text="Rotate left" position="bottom">
            <button onClick={() => handleRotate('left')} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Rotate right" position="bottom">
            <button onClick={() => handleRotate('right')} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
              <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </Tooltip>
        </div>

        {/* OCR Button */}
        <div className="relative">
          <Tooltip text="OCR" position="bottom">
            <button
              onClick={() => setIsOCRSettingsOpen(!isOCRSettingsOpen)}
              className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg ${
                showOCRPanel ? 'bg-blue-100 text-blue-600' : ''
              }`}
            >
              <ScanLine className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </Tooltip>

          {isOCRSettingsOpen && (
            <div className={`absolute left-0 top-full mt-1 w-48 sm:w-56 rounded-lg shadow-lg border py-2 z-50 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="px-3 py-1 text-xs font-semibold text-gray-500">OCR MODE</div>
              <button
                onClick={() => {
                  performOCR('full-page');
                  setIsOCRSettingsOpen(false);
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 flex items-center gap-2"
              >
                <Layers className="w-3 h-3" /> Full Page OCR
              </button>
              <button
                onClick={() => {
                  performOCR('area');
                  setIsOCRSettingsOpen(false);
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 flex items-center gap-2"
              >
                <Type className="w-3 h-3" /> Selected Area
              </button>
              <button
                onClick={() => {
                  performOCR('text-only');
                  setIsOCRSettingsOpen(false);
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 flex items-center gap-2"
              >
                <FileText className="w-3 h-3" /> Text Only
              </button>
              
              <div className="border-t my-1"></div>
              
              <div className="px-3 py-1 text-xs font-semibold text-gray-500">LANGUAGE</div>
              {['English'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedOCRLanguage(lang)}
                  className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 flex items-center gap-2 capitalize ${
                    selectedOCRLanguage === lang ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <Languages className="w-3 h-3" />
                  {lang}
                  {selectedOCRLanguage === lang && <Check className="w-3 h-3 ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings Dropdown */}
        <div className="relative ml-auto" ref={settingsRef}>
          <Tooltip text="Settings" position="bottom">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </Tooltip>

          {isSettingsOpen && (
            <div className={`absolute right-0 top-full mt-1 w-56 sm:w-72 max-h-[70vh] overflow-y-auto rounded-lg shadow-lg border py-2 z-50 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="px-3 sm:px-4 py-2">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">VIEW SETTINGS</h4>
                <div className="space-y-1">
                  <button onClick={() => setViewMode('single')} className="w-full px-2 sm:px-3 py-1.5 text-left text-xs sm:text-sm hover:bg-gray-100 rounded flex items-center gap-2">
                    <LayoutList className="w-3.5 h-3.5" /> Single Page
                    {viewMode === 'single' && <Check className="w-3 h-3 ml-auto text-green-500" />}
                  </button>
                  <button onClick={() => setViewMode('double')} className="w-full px-2 sm:px-3 py-1.5 text-left text-xs sm:text-sm hover:bg-gray-100 rounded flex items-center gap-2">
                    <LayoutGrid className="w-3.5 h-3.5" /> Double Page
                    {viewMode === 'double' && <Check className="w-3 h-3 ml-auto text-green-500" />}
                  </button>
                  <button onClick={() => setViewMode('continuous')} className="w-full px-2 sm:px-3 py-1.5 text-left text-xs sm:text-sm hover:bg-gray-100 rounded flex items-center gap-2">
                    <Grid className="w-3.5 h-3.5" /> Continuous
                    {viewMode === 'continuous' && <Check className="w-3 h-3 ml-auto text-green-500" />}
                  </button>
                </div>
              </div>

              <div className="border-t my-2"></div>

              <div className="px-3 sm:px-4 py-2">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">PAGE SIZE</h4>
                <div className="relative">
                  <button
                    onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                    className="w-full flex items-center justify-between px-2 sm:px-3 py-1.5 text-xs sm:text-sm border rounded-lg hover:bg-gray-100"
                  >
                    <span className="flex items-center gap-2">
                      <Ruler className="w-3.5 h-3.5" /> {pageSize}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {isSizeDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-10">
                      {(['A4', 'A3', 'Letter', 'Legal']).map((size) => (
                        <button
                          key={size}
                          onClick={() => handlePageSizeChange(size)}
                          className={`w-full px-3 sm:px-4 py-1.5 text-left text-xs sm:text-sm hover:bg-gray-100 ${
                            pageSize === size ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t my-2"></div>

              <div className="px-3 sm:px-4 py-2">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">APPEARANCE</h4>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full px-2 sm:px-3 py-1.5 text-left text-xs sm:text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Tooltip text="Previous page" position="bottom">
            <button onClick={handlePrevPage} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg" disabled={currentPage === 1}>
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </Tooltip>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Tooltip text="Go to page" position="bottom">
              <input
                type="text"
                value={currentPage}
                onChange={handlePageChange}
                className={`w-8 sm:w-12 h-6 sm:h-8 text-center text-xs sm:text-sm border rounded-lg font-medium ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}
              />
            </Tooltip>
            <span className="text-xs sm:text-sm text-gray-500">/ {totalPages}</span>
          </div>

          <Tooltip text="Next page" position="bottom">
            <button onClick={handleNextPage} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg" disabled={currentPage === totalPages}>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Page Search */}
        <div className="relative">
          <Tooltip text="Search page" position="bottom">
            <button
              onClick={() => setIsPageSearchOpen(true)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </Tooltip>

          {isPageSearchOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 sm:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-2 sm:p-3 z-50">
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <input
                  type="number"
                  ref={pageSearchInputRef}
                  min="1"
                  max={totalPages}
                  placeholder={`Page (1-${totalPages})`}
                  className={`flex-1 px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-lg ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleManualPageSearch(parseInt(e.currentTarget.value));
                    }
                  }}
                />
                <button onClick={() => setIsPageSearchOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="text-xs text-gray-500">Press Enter to go to page</div>
            </div>
          )}
        </div>

        {/* Fullscreen */}
        <Tooltip text="Fullscreen" position="bottom">
          <button onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </Tooltip>
      </div>

      {/* OCR Panel */}
      {showOCRPanel && (
        <div className={`flex-shrink-0 border-b p-2 sm:p-4 ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-blue-50'
        }`}>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                <ScanLine className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> OCR Text - Page {currentPage}
              </h3>
              {ocrMode && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'
                }`}>
                  {ocrMode.replace('-', ' ')} • {selectedOCRLanguage}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {ocrHistory.length > 0 && (
                <div className="relative" ref={ocrExportMenuRef}>
                  <Tooltip text="OCR History" position="bottom">
                    <button
                      onClick={() => setShowOCRExportMenu(!showOCRExportMenu)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </Tooltip>
                  
                  {showOCRExportMenu && (
                    <div className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border py-1 z-50 ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500">RECENT OCR</div>
                      {ocrHistory.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setOcrText(item.text);
                            setShowOCRExportMenu(false);
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100"
                        >
                          Page {item.page} • {item.timestamp}
                          {item.sourceFile && ` • ${item.sourceFile}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <Tooltip text="Copy text" position="bottom">
                <button onClick={handleCopyOCRText} className="p-1 hover:bg-gray-200 rounded">
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </Tooltip>
              
              <Tooltip text="Download text" position="bottom">
                <button onClick={handleDownloadOCRText} className="p-1 hover:bg-gray-200 rounded">
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </Tooltip>
              
              <Tooltip text="Close" position="bottom">
                <button onClick={() => setShowOCRPanel(false)} className="p-1 hover:bg-gray-200 rounded">
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </Tooltip>
            </div>
          </div>
          
          {isOCRProcessing && (
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Processing OCR...</span>
                <span>{ocrProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className={`p-2 sm:p-3 rounded-lg max-h-32 sm:max-h-40 overflow-y-auto text-xs sm:text-sm ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          }`}>
            {isOCRProcessing ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-500 mr-2"></div>
                <span>Processing OCR...</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">
                {ocrText || 'No OCR text available'}
              </div>
            )}
          </div>
          
          {!isOCRProcessing && ocrText && (
            <div className="mt-2 text-xs text-gray-500 flex gap-4">
              <span>Words: {ocrText.split(/\s+/).length}</span>
              <span>Characters: {ocrText.length}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Content - SCROLLABLE AREA */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        <div
          ref={scrollContainerRef}
          className={`flex-1 overflow-y-auto overflow-x-hidden transition-all ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
          }`}
        >
          <div className="p-2 sm:p-4 lg:p-6">
            <div className="mx-auto" style={{ 
              maxWidth: viewMode === 'double' 
                ? `${Math.min(pageDims.width * 2.2, windowWidth - (isThumbnailOpen ? 128 : 0))}px` 
                : `${Math.min(pageDims.width, windowWidth - (isThumbnailOpen ? 128 : 32))}px` 
            }}>
              {viewMode === 'double' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <PageContent pageNum={currentPage} />
                  {currentPage + 1 <= totalPages && <PageContent pageNum={currentPage + 1} />}
                </div>
              ) : viewMode === 'continuous' ? (
                <div className="space-y-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <PageContent key={pageNum} pageNum={pageNum} />
                  ))}
                </div>
              ) : (
                <PageContent pageNum={currentPage} />
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Sidebar */}
        {isThumbnailOpen && !isMobile && (
          <div className={`flex-shrink-0 w-16 sm:w-20 lg:w-24 xl:w-32 border-l overflow-y-auto p-1 sm:p-2 ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2 sm:mb-3 px-1 sm:px-2">
              <span className="text-xs font-medium text-gray-500">PAGES</span>
              {patientInfo.sourceFile && (
                <span className="text-[9px] text-gray-400 truncate max-w-[60px]" title={patientInfo.sourceFile}>
                  {patientInfo.sourceFile}
                </span>
              )}
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <ThumbnailPage key={pageNum} pageNum={pageNum} />
              ))}
            </div>
            
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <Tooltip text="Go to first page" position="right">
                <button 
                  onClick={() => setCurrentPage(1)}
                  className="w-full text-xs text-gray-500 hover:text-blue-500 py-1"
                >
                  First
                </button>
              </Tooltip>
              <Tooltip text="Go to last page" position="right">
                <button 
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-full text-xs text-gray-500 hover:text-blue-500 py-1"
                >
                  Last
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm">Menu</h3>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Patient Info in Mobile Menu */}
            {patientInfo.patientName && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Current Patient</p>
                <p className="text-sm font-semibold">{patientInfo.patientName}</p>
                <p className="text-xs text-gray-500 mt-1">Source: {patientInfo.sourceFile}</p>
                <p className="text-xs text-gray-500">DOB: {patientInfo.dob} | Gender: {patientInfo.gender}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  performOCR('full-page');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <ScanLine className="w-4 h-4" /> OCR Current Page
              </button>
              <button
                onClick={() => {
                  setViewMode('continuous');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" /> Continuous View
              </button>
            </div>
            
            {ocrHistory.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">RECENT OCR</h4>
                <div className="space-y-1">
                  {ocrHistory.slice(0, 3).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setOcrText(item.text);
                        setShowOCRPanel(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 rounded"
                    >
                      Page {item.page} • {item.timestamp}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfViewerPanel;