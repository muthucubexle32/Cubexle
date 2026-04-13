// Dashboard.jsx – Fully responsive with proper scrolling
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  XCircle,
  FileText,
  X,
  UserPlus,
  Split,
  FolderOpen,
  Eye
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

// ---------- Status Configuration ----------
const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open', color: 'blue' },
  { value: 'Clarification', label: 'Clarification', color: 'orange' },
  { value: 'UW In Progress', label: 'UW In Progress', color: 'purple' },
  { value: 'UW Completed', label: 'UW Completed', color: 'green' },
  { value: 'Audit In Progress', label: 'Audit In Progress', color: 'teal' },
  { value: 'Completed', label: 'Completed', color: 'emerald' },
  { value: 'Withdrawn', label: 'Withdrawn', color: 'red' },
];

const STATUS_COLOR_MAP = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

// ---------- Mock Data Generation ----------
const generateMockData = () => {
  const clients = ['ABC Corp', 'XYZ Ltd', 'Global Insurance', 'SecureLife', 'Prime Health', 'Elite Coverage'];
  const underwriters = ['MG', 'SJ', 'MB', 'ED', 'DW'];
  const auditors = ['AA', 'AB', 'IT', 'EO', 'CI'];
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const assignedUsers = ['John Doe', 'Jane Smith', 'Robert Brown', 'Emily White', 'Muthu', 'Afridi'];

  const data = [];
  for (let i = 1; i <= 150; i++) {
    const receivedDate = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const completedDate = Math.random() > 0.6 ? new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : null;
    const status = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)].value;

    data.push({
      id: i,
      assigned: Math.random() > 0.5,
      assignedUser: assignedUsers[Math.floor(Math.random() * assignedUsers.length)],
      qc: Math.random() > 0.7,
      receivedDate: receivedDate.toISOString().split('T')[0],
      client: clients[Math.floor(Math.random() * clients.length)],
      sourceFile: `SRC-${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      totalPages: Math.floor(Math.random() * 200) + 10,
      totalFiles: Math.floor(Math.random() * 15) + 1,
      underwriter: underwriters[Math.floor(Math.random() * underwriters.length)],
      auditor: auditors[Math.floor(Math.random() * auditors.length)],
      status: status,
      completedDate: completedDate ? completedDate.toISOString().split('T')[0] : '',
    });
  }
  return data;
};

// ---------- Action Buttons ----------
const ActionButtons = ({ row, onAction, onSplit }) => {
  const handleAction = (action) => {
    const messages = {
      start: 'Start processing this case? Status will change to "UW In Progress".',
      complete: 'Mark this case as completed?',
      cancel: 'Cancel/withdraw this case? Status will change to "Withdrawn".',
    };
    if (window.confirm(messages[action])) {
      onAction(action, row.original);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleAction('start')}
        className="p-1.5 rounded-md hover:bg-blue-100 text-blue-600 transition-all hover:scale-110"
        title="Start Processing"
      >
        <Play size={16} />
      </button>
      <button
        onClick={() => handleAction('complete')}
        className="p-1.5 rounded-md hover:bg-green-100 text-green-600 transition-all hover:scale-110"
        title="Complete Case"
      >
        <CheckCircle size={16} />
      </button>
      <button
        onClick={() => handleAction('cancel')}
        className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-all hover:scale-110"
        title="Cancel/Withdraw"
      >
        <XCircle size={16} />
      </button>
      <button
        onClick={() => onSplit(row.original)}
        className="p-1.5 rounded-md hover:bg-purple-100 text-purple-600 transition-all hover:scale-110"
        title="Split Pages"
      >
        <Split size={16} />
      </button>
    </div>
  );
};

// ---------- Split Modal Component ----------
const SplitModal = ({ isOpen, onClose, caseData, availableUsers, onSplitConfirm }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pageAssignments, setPageAssignments] = useState([]);
  const totalPages = caseData?.totalPages || 0;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && caseData) {
      setSelectedUsers([]);
      setPageAssignments([]);
      setIsDropdownOpen(false);
    }
  }, [isOpen, caseData]);

  const recalcEqualSplit = (users) => {
    if (users.length === 0) return [];
    const pagesPerUser = Math.floor(totalPages / users.length);
    const remainder = totalPages % users.length;
    return users.map((user, idx) => ({
      user,
      pageStart: idx * pagesPerUser + 1,
      pageEnd: (idx + 1) * pagesPerUser + (idx === users.length - 1 ? remainder : 0),
      pages: pagesPerUser + (idx === users.length - 1 ? remainder : 0),
    }));
  };

  const handleUserToggle = (user) => {
    setSelectedUsers(prev => {
      const newSet = prev.includes(user) ? prev.filter(u => u !== user) : [...prev, user];
      if (newSet.length > 0) {
        setPageAssignments(recalcEqualSplit(newSet));
      } else {
        setPageAssignments([]);
      }
      return newSet;
    });
  };

  const handleManualChange = (index, field, value) => {
    const updated = [...pageAssignments];
    let numValue = parseInt(value) || 0;
    updated[index][field] = numValue;
    if (field === 'pageStart' || field === 'pages') {
      updated[index].pageEnd = updated[index].pageStart + updated[index].pages - 1;
    }
    setPageAssignments(updated);
  };

  const handleBalance = () => {
    if (selectedUsers.length === 0) return;
    setPageAssignments(recalcEqualSplit(selectedUsers));
  };

  const handleConfirm = () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user.');
      return;
    }
    if (pageAssignments.length === 0) {
      alert('No page assignments. Please adjust split.');
      return;
    }
    const totalAssignedPages = pageAssignments.reduce((sum, a) => sum + a.pages, 0);
    if (totalAssignedPages !== totalPages) {
      alert(`Total assigned pages (${totalAssignedPages}) does not match case total pages (${totalPages}). Please adjust.`);
      return;
    }
    onSplitConfirm(caseData.id, pageAssignments);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Split Case Pages</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p><strong>Source File:</strong> {caseData?.sourceFile}</p>
            <p><strong>Total Pages:</strong> {totalPages}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Users</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              >
                <span>
                  {selectedUsers.length === 0
                    ? 'Select users'
                    : `${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} selected`}
                </span>
                <span className="ml-2">▼</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {availableUsers.map(user => (
                    <label key={user} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user)}
                        onChange={() => handleUserToggle(user)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{user}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Page Assignments</h4>
                <button onClick={handleBalance} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <RotateCcw size={14} /> Balance equally
                </button>
              </div>
              <div className="space-y-3">
                {pageAssignments.map((assign, idx) => (
                  <div key={assign.user} className="border border-gray-200 rounded-lg p-3">
                    <div className="font-medium mb-2">{assign.user}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500">Start Page</label>
                        <input
                          type="number"
                          value={assign.pageStart}
                          onChange={(e) => handleManualChange(idx, 'pageStart', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Pages Count</label>
                        <input
                          type="number"
                          value={assign.pages}
                          onChange={(e) => handleManualChange(idx, 'pages', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">End Page: {assign.pageEnd}</div>
                  </div>
                ))}
                <div className="text-sm text-gray-600">
                  Total assigned pages: {pageAssignments.reduce((sum, a) => sum + a.pages, 0)} / {totalPages}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Confirm Split</button>
        </div>
      </div>
    </div>
  );
};

// ---------- Custom Status Dropdown Cell ----------
const StatusCell = ({ status, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = STATUS_OPTIONS.find(opt => opt.value === status);
  const colorClass = STATUS_COLOR_MAP[currentOption?.color || 'blue'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass} hover:opacity-80 transition-opacity`}
      >
        {currentOption?.label}
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[130px]">
          {STATUS_OPTIONS.map(opt => {
            const optColorClass = STATUS_COLOR_MAP[opt.color];
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onStatusChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors ${optColorClass}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ---------- Source File Cell with Hyperlink ----------
const SourceFileCell = ({ sourceFile, onViewPatient }) => {
  return (
    <button
      onClick={() => onViewPatient(sourceFile)}
      className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors flex items-center gap-1"
    >
      <FolderOpen size={14} />
      {sourceFile}
    </button>
  );
};

// ---------- Main Dashboard ----------
const Dashboard = ({ onLogout, toggleTheme, dark }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAssignUser, setSelectedAssignUser] = useState('');
  const [filters, setFilters] = useState({
    receivedDateFrom: '',
    receivedDateTo: '',
    client: '',
    firstName: '',
    lastName: '',
    underwriter: '',
    auditor: '',
    completedDateFrom: '',
    completedDateTo: '',
    sourceFile: '',
  });
  const [columnVisibility, setColumnVisibility] = useState({});
  const [caseSplits, setCaseSplits] = useState({});
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [currentSplitCase, setCurrentSplitCase] = useState(null);

  // Show success message if coming from patient info page
  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
      // Clear the message
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setMasterData(generateMockData());
      setLoading(false);
    }, 800);
  }, []);

  // Apply filters
  const filteredData = useMemo(() => {
    let result = [...masterData];
    if (filters.receivedDateFrom) result = result.filter(row => row.receivedDate >= filters.receivedDateFrom);
    if (filters.receivedDateTo) result = result.filter(row => row.receivedDate <= filters.receivedDateTo);
    if (filters.client) result = result.filter(row => row.client.toLowerCase().includes(filters.client.toLowerCase()));
    if (filters.sourceFile) result = result.filter(row => row.sourceFile.toLowerCase().includes(filters.sourceFile.toLowerCase()));
    if (filters.firstName) result = result.filter(row => row.firstName.toLowerCase().includes(filters.firstName.toLowerCase()));
    if (filters.lastName) result = result.filter(row => row.lastName.toLowerCase().includes(filters.lastName.toLowerCase()));
    if (filters.underwriter) result = result.filter(row => row.underwriter === filters.underwriter);
    if (filters.auditor) result = result.filter(row => row.auditor === filters.auditor);
    if (filters.completedDateFrom) result = result.filter(row => row.completedDate && row.completedDate >= filters.completedDateFrom);
    if (filters.completedDateTo) result = result.filter(row => row.completedDate && row.completedDate <= filters.completedDateTo);
    return result;
  }, [masterData, filters]);

  const uniqueUnderwriters = useMemo(() => [...new Set(masterData.map(d => d.underwriter))], [masterData]);
  const uniqueAuditors = useMemo(() => [...new Set(masterData.map(d => d.auditor))], [masterData]);
  const uniqueAssignedUsers = useMemo(() => [...new Set(masterData.map(d => d.assignedUser))], [masterData]);

  // Row update helpers
  const updateRow = useCallback((rowId, updates) => {
    setMasterData(prev => prev.map(row => (row.id === rowId ? { ...row, ...updates } : row)));
  }, []);

  const handleRowAction = useCallback((action, row) => {
    let newStatus = '';
    switch (action) {
      case 'start': newStatus = 'UW In Progress'; break;
      case 'complete': newStatus = 'Completed'; break;
      case 'cancel': newStatus = 'Withdrawn'; break;
      default: return;
    }
    updateRow(row.id, { status: newStatus });
    alert(`✅ Action "${action}" completed. Status updated to "${newStatus}".`);
  }, [updateRow]);

  const handleStatusChange = useCallback((rowId, newStatus) => {
    updateRow(rowId, { status: newStatus });
  }, [updateRow]);

  const handleAssignedChange = useCallback((rowId, checked) => {
    updateRow(rowId, { assigned: checked });
  }, [updateRow]);

  const handleQCChange = useCallback((rowId, checked) => {
    updateRow(rowId, { qc: checked });
  }, [updateRow]);

  // Batch assign
  const handleBatchAssign = useCallback(() => {
    if (!selectedAssignUser) {
      alert('Please select a user to assign.');
      return;
    }
    const rowsToUpdate = masterData.filter(row => row.assigned === true);
    if (rowsToUpdate.length === 0) {
      alert('No rows selected. Please check the "Assigned" boxes for the rows you want to assign.');
      return;
    }
    rowsToUpdate.forEach(row => {
      updateRow(row.id, { assignedUser: selectedAssignUser });
    });
    alert(`✅ Successfully assigned ${rowsToUpdate.length} case(s) to ${selectedAssignUser}.`);
  }, [masterData, selectedAssignUser, updateRow]);

  // Split handlers
  const openSplitModal = (caseData) => {
    setCurrentSplitCase(caseData);
    setSplitModalOpen(true);
  };

  const handleSplitConfirm = (caseId, assignments) => {
    setCaseSplits(prev => ({
      ...prev,
      [caseId]: assignments,
    }));
    alert(`✅ Case ${caseId} split into ${assignments.length} parts.`);
  };

  // Navigate to Patient Info page - UPDATED with returnTo: 'tool'
  const handleViewPatient = (sourceFile) => {
    const caseData = masterData.find(d => d.sourceFile === sourceFile);
    
    // Get existing patient data from localStorage
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    const existingData = savedData[caseData?.id] || savedData[sourceFile];
    
    // Navigate to patient-info page with returnTo parameter set to 'tool'
    navigate('/patient-info', {
      state: {
        sourceFile: sourceFile,
        patientId: caseData?.id,
        existingData: existingData,
        returnTo: 'tool'  // This tells PatientInfo to return to Tool page (Index) after save
      }
    });
  };

  // Column definitions
  const columns = useMemo(() => [
    {
      accessorKey: 'assigned', 
      header: 'Assigned', 
      cell: ({ row }) => (
        <input 
          type="checkbox" 
          checked={row.original.assigned} 
          onChange={(e) => handleAssignedChange(row.original.id, e.target.checked)} 
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
        />
      ), 
      enableSorting: true
    },
    {
      accessorKey: 'qc', 
      header: 'QC', 
      cell: ({ row }) => (
        <input 
          type="checkbox" 
          checked={row.original.qc} 
          onChange={(e) => handleQCChange(row.original.id, e.target.checked)} 
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
        />
      ), 
      enableSorting: true
    },
    { accessorKey: 'receivedDate', header: 'Received Date', enableSorting: true },
    { accessorKey: 'client', header: 'Client', enableSorting: true },
    {
      accessorKey: 'sourceFile',
      header: 'Source File',
      cell: ({ row }) => (
        <SourceFileCell 
          sourceFile={row.original.sourceFile} 
          onViewPatient={handleViewPatient} 
        />
      ),
      enableSorting: true,
    },
    { accessorKey: 'firstName', header: 'First Name', enableSorting: true },
    { accessorKey: 'lastName', header: 'Last Name', enableSorting: true },
    { accessorKey: 'totalPages', header: 'Total Pages', enableSorting: true },
    { accessorKey: 'totalFiles', header: 'Total Files', enableSorting: true },
    { accessorKey: 'underwriter', header: 'UW', enableSorting: true },
    { accessorKey: 'auditor', header: 'Auditor', enableSorting: true },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusCell
          status={row.original.status}
          onStatusChange={(newStatus) => handleStatusChange(row.original.id, newStatus)}
        />
      ),
      enableSorting: true,
    },
    { accessorKey: 'completedDate', header: 'Completed Date', enableSorting: true },
    {
      id: 'splitInfo',
      header: 'Split Info',
      cell: ({ row }) => {
        const splits = caseSplits[row.original.id];
        if (!splits || splits.length === 0) return <span className="text-gray-400">—</span>;
        return (
          <div className="relative group">
            <span className="text-purple-600 cursor-help">
              {splits.length} user{splits.length > 1 ? 's' : ''}
            </span>
            <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block bg-white border rounded shadow-lg p-2 min-w-[200px] whitespace-normal">
              {splits.map((s, idx) => (
                <div key={idx} className="text-xs">
                  <strong>{s.user}</strong>: pages {s.pageStart}-{s.pageEnd} ({s.pages} pages)
                </div>
              ))}
            </div>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => <ActionButtons row={row} onAction={handleRowAction} onSplit={openSplitModal} />,
      enableSorting: false,
    },
  ], [handleAssignedChange, handleQCChange, handleStatusChange, handleRowAction, caseSplits]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    initialState: { pagination: { pageSize: 10 } },
  });

  const resetFilters = () => {
    setFilters({
      receivedDateFrom: '', receivedDateTo: '', client: '', sourceFile: '',
      firstName: '', lastName: '', underwriter: '', auditor: '', completedDateFrom: '', completedDateTo: '',
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <AppLayout onLogout={onLogout} toggleTheme={toggleTheme} dark={dark}>
        <div className="p-4 md:p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-xl w-full max-w-md"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>)}
            </div>
            <div className="h-16 bg-gray-200 rounded-xl"></div>
            <div className="space-y-2">{[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded"></div>)}</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout onLogout={onLogout} toggleTheme={toggleTheme} dark={dark}>
      <div className="h-full w-full overflow-y-auto">
        <div className="p-2 md:p-3 space-y-4 max-w-[1700px] mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 transition-all hover:shadow-md">
              <p className="text-sm text-gray-500">Total Cases</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{filteredData.length}</p>
            </div>
            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 transition-all hover:shadow-md">
              <p className="text-sm text-gray-500">Open Cases</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{filteredData.filter(r => r.status === 'Open').length}</p>
            </div>
            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 transition-all hover:shadow-md">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{filteredData.filter(r => r.status === 'Completed').length}</p>
            </div>
            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 transition-all hover:shadow-md">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{filteredData.filter(r => r.status === 'UW In Progress' || r.status === 'Audit In Progress').length}</p>
            </div>
          </div>

          {/* Search + Batch Assignment Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div
                className="flex-1 flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-2 pr-3 cursor-pointer"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                <input
                  type="text"
                  placeholder="Search by client, source file, name... (click to open filters)"
                  className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm cursor-pointer"
                  value={filters.client || filters.sourceFile || filters.firstName || filters.lastName ? 'Filters active' : ''}
                  readOnly
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 items-stretch sm:items-center">
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-1 pl-3">
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Assign to:</span>
                  <select
                    value={selectedAssignUser}
                    onChange={(e) => setSelectedAssignUser(e.target.value)}
                    className="px-2 py-1.5 text-sm border-0 bg-transparent text-gray-700 focus:ring-0 focus:outline-none"
                  >
                    <option value="">Select user</option>
                    {uniqueAssignedUsers.map(user => (
                      <option key={user} value={user}>{user}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleBatchAssign}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                  >
                    <UserPlus size={14} /> Assign
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-fadeInUp">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Received Date</label>
                    <div className="flex gap-2">
                      <input type="date" value={filters.receivedDateFrom} onChange={(e) => setFilters({ ...filters, receivedDateFrom: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                      <input type="date" value={filters.receivedDateTo} onChange={(e) => setFilters({ ...filters, receivedDateTo: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Client</label>
                    <input type="text" value={filters.client} onChange={(e) => setFilters({ ...filters, client: e.target.value })} placeholder="Client name" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Source File</label>
                    <input type="text" value={filters.sourceFile} onChange={(e) => setFilters({ ...filters, sourceFile: e.target.value })} placeholder="Source file number" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <div className="flex gap-2">
                      <input type="text" value={filters.firstName} onChange={(e) => setFilters({ ...filters, firstName: e.target.value })} placeholder="First" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                      <input type="text" value={filters.lastName} onChange={(e) => setFilters({ ...filters, lastName: e.target.value })} placeholder="Last" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Underwriter</label>
                    <select value={filters.underwriter} onChange={(e) => setFilters({ ...filters, underwriter: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                      <option value="">All</option>
                      {uniqueUnderwriters.map(uw => <option key={uw} value={uw}>{uw}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Auditor</label>
                    <select value={filters.auditor} onChange={(e) => setFilters({ ...filters, auditor: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                      <option value="">All</option>
                      {uniqueAuditors.map(aud => <option key={aud} value={aud}>{aud}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Completed Date</label>
                    <div className="flex gap-2">
                      <input type="date" value={filters.completedDateFrom} onChange={(e) => setFilters({ ...filters, completedDateFrom: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                      <input type="date" value={filters.completedDateTo} onChange={(e) => setFilters({ ...filters, completedDateTo: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={resetFilters} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                    <RotateCcw size={14} /> Reset
                  </button>
                  <button onClick={() => setShowFilters(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm">
                    <Search size={14} /> Search
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-3 py-4 text-left text-xs font-bold text-gray-600 tracking-wider">
                          {header.column.getCanSort() ? (
                            <button onClick={header.column.getToggleSortingHandler()} className="flex items-center gap-2 hover:text-gray-700">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <FileText size={48} className="opacity-50" />
                          <p>No matching records found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-3 py-3 text-xs text-gray-900 break-words">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-between items-center gap-4 px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                    table.setPageSize(Number(e.target.value));
                    table.setPageIndex(0);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
                >
                  {[10, 20, 30, 50].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-1 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-1 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Modal */}
      <SplitModal
        isOpen={splitModalOpen}
        onClose={() => setSplitModalOpen(false)}
        caseData={currentSplitCase}
        availableUsers={uniqueAssignedUsers.filter(u => u !== 'Unassigned')}
        onSplitConfirm={handleSplitConfirm}
      />

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.2s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </AppLayout>
  );
};

export default Dashboard;