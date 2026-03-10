import React, { useState, useEffect, useRef } from "react";
import {
  Maximize2,
  RotateCcw,
  FileSearch,
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
  Upload,
  Minus,
  Plus,
  Check,
  AlertCircle,
  HelpCircle,
  Tag,
  Flag,
  Edit,
  File,
  Clock,
  Calendar,
  User,
  CheckCircle,
  MoreVertical,
  MoreHorizontal,
  Home,
  FileText,
  Circle,
} from "lucide-react";

const PAGE_SIZE_DIMENSIONS = {
  'A4': { width: 595, height: 842, unit: 'px' },
  'A3': { width: 842, height: 1191, unit: 'px' },
  'A2': { width: 1191, height: 1684, unit: 'px' },
  'A1': { width: 1684, height: 2384, unit: 'px' },
  'A0': { width: 2384, height: 3370, unit: 'px' },
  'Letter': { width: 612, height: 792, unit: 'px' },
  'Legal': { width: 612, height: 1008, unit: 'px' },
};

const PdfViewerPanel = () => {
  // Document Info State with manual entry
  const [documentInfo, setDocumentInfo] = useState({
    docName: "Annual Report 2025.pdf",
    docNo: "DOC-2025-001",
    status: "pending",
    pageNo: 1,
    totalPages: 11,
    fileSize: "2.4 MB",
    createdDate: new Date().toLocaleDateString(),
    modifiedDate: new Date().toLocaleDateString(),
    author: "",
    department: ""
  });

  // Manual entry states
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [editDocInfo, setEditDocInfo] = useState({ ...documentInfo });

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
  const [pageSearchResults, setPageSearchResults] = useState([]);

  // OCR states
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [showOCRPanel, setShowOCRPanel] = useState(false);

  // Page size states
  const [pageSize, setPageSize] = useState('A4');
  const [customWidth, setCustomWidth] = useState(595);
  const [customHeight, setCustomHeight] = useState(842);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

  // UI states
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
  const [showDocumentMenu, setShowDocumentMenu] = useState(false);
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false);

  // Refs
  const scrollContainerRef = useRef(null);
  const settingsRef = useRef(null);
  const sizeRef = useRef(null);
  const fileInputRef = useRef(null);
  const documentMenuRef = useRef(null);
  const zoomMenuRef = useRef(null);

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
        setIsToolbarCollapsed(true);
      } else if (window.innerWidth < 1024) {
        setIsThumbnailOpen(false);
        setIsToolbarCollapsed(false);
      } else {
        setIsThumbnailOpen(true);
        setIsToolbarCollapsed(false);
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
      if (documentMenuRef.current && !documentMenuRef.current.contains(event.target)) {
        setShowDocumentMenu(false);
      }
      if (zoomMenuRef.current && !zoomMenuRef.current.contains(event.target)) {
        setIsZoomMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation functions
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    setDocumentInfo(prev => ({ ...prev, pageNo: currentPage }));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    setDocumentInfo(prev => ({ ...prev, pageNo: currentPage }));
  };

  const handlePageChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= totalPages) {
      setCurrentPage(value);
      setDocumentInfo(prev => ({ ...prev, pageNo: value }));
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 25));
  const handleZoomReset = () => setZoomLevel(100);

  const handleRotate = (direction) => {
    setRotationAngle(prev => direction === 'left' ? prev - 90 : prev + 90);
  };

  // Manual page search
  const handleManualPageSearch = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setSelectedPage(pageNum);
      setDocumentInfo(prev => ({ ...prev, pageNo: pageNum }));
      setIsPageSearchOpen(false);
    }
  };

  // Document info editing
  const startEditingDoc = () => {
    setEditDocInfo({ ...documentInfo });
    setIsEditingDoc(true);
    setShowDocumentMenu(false);
  };

  const saveDocInfo = () => {
    setDocumentInfo({ ...editDocInfo });
    setIsEditingDoc(false);
  };

  const cancelEditingDoc = () => {
    setIsEditingDoc(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'clarification': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'in-progress': return <Clock className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      case 'clarification': return <HelpCircle className="w-3 h-3" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  // OCR Functions
  const performOCR = async () => {
    setIsOCRProcessing(true);
    setTimeout(() => {
      const mockOCRText = `OCR text for page ${currentPage}...`;
      setOcrText(mockOCRText);
      setIsOCRProcessing(false);
      setShowOCRPanel(true);
    }, 2000);
  };

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Page Content Component
  const PageContent = ({ pageNum }) => (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden transition-all ${
        selectedPage === pageNum ? 'ring-2 ring-blue-500' : 'border-gray-200 dark:border-gray-700'
      } ${pageSearchResults.includes(pageNum) ? 'ring-2 ring-yellow-500' : ''}`}
      style={{
        width: '100%',
        minHeight: isMobile ? '400px' : pageDims.height,
        transform: `scale(${isMobile ? 0.8 : zoomLevel / 100}) rotate(${rotationAngle}deg)`,
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease'
      }}
    >
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-3 sm:px-4 py-2 border-b flex justify-between items-center">
        <span className="font-medium text-sm sm:text-base">Page {pageNum}</span>
        <div className="flex items-center gap-2">
          {starredPages.includes(pageNum) && (
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          )}
        </div>
      </div>

      <div className="relative p-4 sm:p-6 min-h-[300px] sm:min-h-[500px] lg:min-h-[800px]">
        <div className="space-y-2 sm:space-y-3 mb-8">
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/2"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-5/6"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-2/3"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-gray-50 to-white text-gray-800'
    }`}>
      {/* Document Info Bar with Manual Entry */}
      <div className={`px-2 sm:px-4 py-1 sm:py-2 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        {isEditingDoc ? (
          // Edit Mode - Responsive grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Document Name</label>
              <input
                type="text"
                value={editDocInfo.docName}
                onChange={(e) => setEditDocInfo({ ...editDocInfo, docName: e.target.value })}
                className={`w-full px-2 py-1 text-xs sm:text-sm border rounded ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Document No.</label>
              <input
                type="text"
                value={editDocInfo.docNo}
                onChange={(e) => setEditDocInfo({ ...editDocInfo, docNo: e.target.value })}
                className={`w-full px-2 py-1 text-xs sm:text-sm border rounded ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Status</label>
              <select
                value={editDocInfo.status}
                onChange={(e) => setEditDocInfo({ ...editDocInfo, status: e.target.value })}
                className={`w-full px-2 py-1 text-xs sm:text-sm border rounded ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="clarification">Clarification</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Page</label>
              <input
                type="number"
                value={editDocInfo.pageNo}
                onChange={(e) => setEditDocInfo({ ...editDocInfo, pageNo: parseInt(e.target.value) || 1 })}
                min="1"
                max={totalPages}
                className={`w-full px-2 py-1 text-xs sm:text-sm border rounded ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 mt-2">
              <button
                onClick={cancelEditingDoc}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={saveDocInfo}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          // View Mode - Responsive
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2">
                <File className="w-4 h-4 sm:w-5 sm:h-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm sm:text-base lg:text-xl font-semibold truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[300px]">
                  {documentInfo.docName}
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm lg:text-base font-semibold">{documentInfo.docNo}</span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Flag className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                <span className={`text-xs sm:text-sm px-1 sm:px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(documentInfo.status)}`}>
                  {getStatusIcon(documentInfo.status)}
                  <span className="capitalize hidden xs:inline">{documentInfo.status.replace('-', ' ')}</span>
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <FileSearch className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Pg {documentInfo.pageNo}/{documentInfo.totalPages}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Document Menu Button */}
              <div className="relative" ref={documentMenuRef}>
                <button
                  onClick={() => setShowDocumentMenu(!showDocumentMenu)}
                  className="p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Document options"
                >
                  <MoreVertical className="w-3 sm:w-4 h-3 sm:h-4" />
                </button>

                {showDocumentMenu && (
                  <div className={`absolute right-0 top-full mt-1 w-40 sm:w-48 rounded-lg shadow-lg border py-1 z-50 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <button
                      onClick={startEditingDoc}
                      className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Edit className="w-3 sm:w-4 h-3 sm:h-4" /> Edit Document Info
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Toolbar - Responsive */}
      <div className={`flex flex-wrap items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/60'
      }`}>
        {/* Mobile Menu */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Menu className="w-3 h-3 sm:w-4  sm:h-4" />
        </button>

        {/* Thumbnail Toggle - Hidden on mobile */}
        <button
          onClick={() => setIsThumbnailOpen(!isThumbnailOpen)}
          className={`p-1.5 sm:p-2 rounded-lg hidden lg:block ${
            isThumbnailOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <PanelRight className="w-3 h-3 sm:w-4  sm:h-4" />
        </button>

        {/* Zoom Controls - Simplified for mobile */}
        <div className="relative flex items-center">
          <button onClick={handleZoomOut} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
            <ZoomOut className="w-3 h-3 sm:w-4  sm:h-4" />
          </button>
          
          {/* Zoom percentage - clickable on mobile */}
          <button
            onClick={() => setIsZoomMenuOpen(!isZoomMenuOpen)}
            className="px-1 sm:px-2 py-1 text-xs sm:text-sm font-medium hover:bg-gray-100 rounded"
          >
            {zoomLevel}%
          </button>
          
          <button onClick={handleZoomIn} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
            <ZoomIn className="w-3 h-3 sm:w-4  sm:h-4" />
          </button>

          {/* Zoom menu for mobile */}
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

        {/* Rotate buttons - Hidden on very small screens */}
        <div className="hidden xs:flex items-center gap-1">
          <button onClick={() => handleRotate('left')} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
            <RotateCcw className="w-3  sm:w-4 h-3 sm:h-4" />
          </button>
          <button onClick={() => handleRotate('right')} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
            <RotateCw className="w-3  sm:w-4 h-3 sm:h-4" />
          </button>
        </div>

        {/* Settings Dropdown */}
        <div className="relative ml-auto" ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5  rounded-lg text-xs sm:text-sm"
          >
            <Settings className="w-3  sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline"></span>
          </button>

          {isSettingsOpen && (
            <div className={`absolute right-0 top-full mt-1 w-56 sm:w-72 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto rounded-lg shadow-lg border py-2 z-50 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              {/* View Settings */}
              <div className="px-3 sm:px-4 py-2">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">VIEW SETTINGS</h4>
                <div className="space-y-1">
                  <button onClick={() => setViewMode('single')} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-100 rounded flex items-center gap-2">
                    <LayoutList className="w-3  sm:w-4 h-3 sm:h-4" /> Single Page
                    {viewMode === 'single' && <Check className="w-3 h-3 ml-auto text-green-500" />}
                  </button>
                  <button onClick={() => setViewMode('double')} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-100 rounded flex items-center gap-2">
                    <LayoutGrid className="w-3  sm:w-4 h-3 sm:h-4" /> Double Page
                    {viewMode === 'double' && <Check className="w-3 h-3 ml-auto text-green-500" />}
                  </button>
                  <button onClick={() => setViewMode('continuous')} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-100 rounded flex items-center gap-2">
                    <Grid className="w-3 h-3 sm:w-4  sm:h-4" /> Continuous
                    {viewMode === 'continuous' && <Check className="w-3 h-3 ml-auto text-green-500" />}
                  </button>
                </div>
              </div>

              <div className="border-t my-2"></div>

              {/* Page Size */}
              <div className="px-3 sm:px-4 py-2">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">PAGE SIZE</h4>
                <div className="relative">
                  <button
                    onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                    className="w-full flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg hover:bg-gray-100"
                  >
                    <span className="flex items-center gap-2">
                      <Ruler className="w-3 h-3 sm:w-4  sm:h-4" /> {pageSize}
                    </span>
                    <ChevronDown className="w-3 h-3 sm:w-4  sm:h-4" />
                  </button>

                  {isSizeDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-10">
                      {(['A4', 'A3', 'Letter', 'Legal']).map((size) => (
                        <button
                          key={size}
                          onClick={() => handlePageSizeChange(size)}
                          className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-100 ${
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

              {/* Theme */}
              <div className="px-3 sm:px-4 py-2">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">APPEARANCE</h4>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                >
                  {isDarkMode ? <Sun className="w-3  sm:w-4 h-3 sm:h-4" /> : <Moon className="w-3  sm:w-4 h-3 sm:h-4" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input type="file" ref={fileInputRef} onChange={() => { }} accept="image/*,.pdf" className="hidden" />

        {/* Page Navigation - Simplified for mobile */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button onClick={handlePrevPage} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg" disabled={currentPage === 1}>
            <ChevronLeft className="w-3 h-3 sm:w-4  sm:h-4" />
          </button>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <input
              type="text"
              value={currentPage}
              onChange={handlePageChange}
              className={`w-8 sm:w-12 h-6 sm:h-8 text-center text-xs sm:text-sm border rounded-lg font-medium ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              }`}
            />
            <span className="text-xs sm:text-sm text-gray-500">/ {totalPages}</span>
          </div>

          <button onClick={handleNextPage} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg" disabled={currentPage === totalPages}>
            <ChevronRight className="w-3 h-3 sm:w-4  sm:h-4" />
          </button>
        </div>

        {/* Page Search */}
        <div className="relative">
          <button
            onClick={() => setIsPageSearchOpen(true)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
          >
            <Search className="w-3 h-3 sm:w-4  sm:h-4" />
          </button>

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
                  <X className="w-3 h-3 sm:w-4  sm:h-4" />
                </button>
              </div>
              <div className="text-xs text-gray-500">Press Enter to go to page</div>
            </div>
          )}
        </div>

        {/* Fullscreen */}
        <button onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
          <Maximize2 className="w-3 h-3 sm:w-4  sm:h-4" />
        </button>
      </div>

      {/* OCR Panel */}
      {showOCRPanel && (
        <div className={`border-b p-2 sm:p-4 ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-blue-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
              <ScanLine className="w-3 h-3 sm:w-4  sm:h-4" /> OCR Text - Page {currentPage}
            </h3>
            <button onClick={() => setShowOCRPanel(false)} className="p-1 hover:bg-gray-200 rounded">
              <X className="w-3 h-3 sm:w-4  sm:h-4" />
            </button>
          </div>
          <div className={`p-2 sm:p-3 rounded-lg max-h-32 sm:max-h-40 overflow-y-auto text-xs sm:text-sm ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          }`}>
            {isOCRProcessing ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-500 mr-2"></div>
                <span>Processing OCR...</span>
              </div>
            ) : (
              ocrText || 'No OCR text available'
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className={`flex-1 overflow-auto transition-all ${
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

        {/* Thumbnail Sidebar - Hidden on mobile */}
        {isThumbnailOpen && !isMobile && (
          <div className={`w-16 sm:w-20 lg:w-24 xl:w-32 border-l overflow-auto p-1 sm:p-2 ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <div className="text-xs font-medium text-gray-500 mb-2 sm:mb-3 px-1 sm:px-2">PAGES</div>
            <div className="space-y-1 sm:space-y-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    setSelectedPage(pageNum);
                    setDocumentInfo(prev => ({ ...prev, pageNo: pageNum }));
                  }}
                  className={`w-full relative rounded-lg border-2 transition-all overflow-hidden ${
                    currentPage === pageNum ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
                  }`}
                >
                  <div className="h-10 sm:h-12 lg:h-14 xl:h-16 bg-gradient-to-b from-gray-100 to-gray-200 p-1 sm:p-2">
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="h-0.5 sm:h-1 w-full bg-white/80 rounded"></div>
                      <div className="h-0.5 sm:h-1 w-3/4 bg-white/80 rounded"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-0.5 sm:bottom-1 right-0.5 sm:right-1 bg-black/50 text-white text-[8px] sm:text-[10px] px-1 py-0.5 rounded">
                    {pageNum}
                  </div>
                  {starredPages.includes(pageNum) && (
                    <Star className="absolute top-0.5 left-0.5 w-2 h-2 sm:w-3  sm:h-3 text-yellow-500 fill-yellow-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm">Menu</h3>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                Recent
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                Starred
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                Shared
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload Document
              </button>
              <button
                onClick={() => {
                  performOCR();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <ScanLine className="w-4 h-4" /> OCR Current Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfViewerPanel;