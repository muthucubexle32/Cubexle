// Dashboard.jsx – fully corrected
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  Eye,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  XCircle,
  ChevronsUpDown,
  FileText,
  X,
  ChevronDown,
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
  const underwriters = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson'];
  const auditors = ['Audit Firm A', 'Audit Firm B', 'Internal Audit', 'External Audit Co', 'Compliance Plus'];
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const assignedUsers = ['Unassigned', 'John Doe', 'Jane Smith', 'Robert Brown', 'Emily White'];

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
      uin: `UIN-${Math.floor(10000 + Math.random() * 90000)}`,
      caseNum: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
      policyNum: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
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
const ActionButtons = ({ row, onAction }) => {
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
        className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-all hover:scale-110"
        title="Start Processing"
      >
        <Play size={18} />
      </button>
      <button
        onClick={() => handleAction('complete')}
        className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition-all hover:scale-110"
        title="Complete Case"
      >
        <CheckCircle size={18} />
      </button>
      <button
        onClick={() => handleAction('cancel')}
        className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all hover:scale-110"
        title="Cancel/Withdraw"
      >
        <XCircle size={18} />
      </button>
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
        <div className="absolute left-0 top-full mt-1 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[130px]">
          {STATUS_OPTIONS.map(opt => {
            const optColorClass = STATUS_COLOR_MAP[opt.color];
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onStatusChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${optColorClass}`}
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

// ---------- Main Dashboard ----------
const Dashboard = ({ onLogout }) => {
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [assignedUserFilter, setAssignedUserFilter] = useState('');
  const [filters, setFilters] = useState({
    receivedDateFrom: '',
    receivedDateTo: '',
    client: '',
    caseNum: '',
    policyNum: '',
    firstName: '',
    lastName: '',
    underwriter: '',
    auditor: '',
    completedDateFrom: '',
    completedDateTo: '',
  });
  const [columnVisibility, setColumnVisibility] = useState({});
  const filterPanelRef = useRef(null);

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setMasterData(generateMockData());
      setLoading(false);
    }, 800);
  }, []);

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target) && showFilters) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  // Apply filters
  const filteredData = useMemo(() => {
    let result = [...masterData];

    if (assignedUserFilter) {
      result = result.filter(row => row.assignedUser === assignedUserFilter);
    }

    if (filters.receivedDateFrom) result = result.filter(row => row.receivedDate >= filters.receivedDateFrom);
    if (filters.receivedDateTo) result = result.filter(row => row.receivedDate <= filters.receivedDateTo);
    if (filters.client) result = result.filter(row => row.client.toLowerCase().includes(filters.client.toLowerCase()));
    if (filters.caseNum) result = result.filter(row => row.caseNum.toLowerCase().includes(filters.caseNum.toLowerCase()));
    if (filters.policyNum) result = result.filter(row => row.policyNum.toLowerCase().includes(filters.policyNum.toLowerCase()));
    if (filters.firstName) result = result.filter(row => row.firstName.toLowerCase().includes(filters.firstName.toLowerCase()));
    if (filters.lastName) result = result.filter(row => row.lastName.toLowerCase().includes(filters.lastName.toLowerCase()));
    if (filters.underwriter) result = result.filter(row => row.underwriter === filters.underwriter);
    if (filters.auditor) result = result.filter(row => row.auditor === filters.auditor);
    if (filters.completedDateFrom) result = result.filter(row => row.completedDate && row.completedDate >= filters.completedDateFrom);
    if (filters.completedDateTo) result = result.filter(row => row.completedDate && row.completedDate <= filters.completedDateTo);

    return result;
  }, [masterData, filters, assignedUserFilter]);

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

  // Table columns
  const columns = useMemo(() => [
    {
      accessorKey: 'assigned', header: 'Assigned', cell: ({ row }) => (
        <input type="checkbox" checked={row.original.assigned} onChange={(e) => handleAssignedChange(row.original.id, e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
      ), enableSorting: true
    },
    {
      accessorKey: 'qc', header: 'QC', cell: ({ row }) => (
        <input type="checkbox" checked={row.original.qc} onChange={(e) => handleQCChange(row.original.id, e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
      ), enableSorting: true
    },
    { accessorKey: 'receivedDate', header: 'Received Date', enableSorting: true },
    { accessorKey: 'client', header: 'Client', enableSorting: true },
    { accessorKey: 'uin', header: 'UIN No', enableSorting: true },
    { accessorKey: 'caseNum', header: 'Case No', enableSorting: true },
    { accessorKey: 'policyNum', header: 'Policy No', enableSorting: true },
    { accessorKey: 'firstName', header: 'First Name', enableSorting: true },
    { accessorKey: 'lastName', header: 'Last Name', enableSorting: true },
    { accessorKey: 'totalPages', header: 'Total Pages', enableSorting: true },
    { accessorKey: 'totalFiles', header: 'Total Files', enableSorting: true },
    { accessorKey: 'underwriter', header: 'Underwriter', enableSorting: true },
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
    { id: 'actions', header: 'Actions', cell: ({ row }) => <ActionButtons row={row} onAction={handleRowAction} />, enableSorting: false },
  ], [handleAssignedChange, handleQCChange, handleStatusChange, handleRowAction]);

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
      receivedDateFrom: '', receivedDateTo: '', client: '', caseNum: '', policyNum: '',
      firstName: '', lastName: '', underwriter: '', auditor: '', completedDateFrom: '', completedDateTo: '',
    });
    setAssignedUserFilter('');
  };

  // Column visibility menu
  const ColumnVisibilityMenu = () => {
    const [show, setShow] = useState(false);
    const allColumns = table.getAllLeafColumns();
    return (
      <div className="relative">
        <button
          onClick={() => setShow(!show)}
          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          <Eye size={16} /> Columns
        </button>
        {show && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 p-2">
            {allColumns.map(column => (
              <label key={column.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                <input type="checkbox" checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{column.columnDef.header}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full max-w-md"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>)}
          </div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="space-y-2">{[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>)}</div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout onLogout={onLogout} activePanel="dashboard">
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:-translate-y-0.5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Cases</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{filteredData.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:-translate-y-0.5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Open Cases</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{filteredData.filter(r => r.status === 'Open').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:-translate-y-0.5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{filteredData.filter(r => r.status === 'Completed').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:-translate-y-0.5">
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{filteredData.filter(r => r.status === 'UW In Progress' || r.status === 'Audit In Progress').length}</p>
          </div>
        </div>

        {/* Smart Search Bar */}
        <div className="relative" ref={filterPanelRef}>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Left side: search input */}
            <div className="flex-1 flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 pr-3 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
              <input
                type="text"
                placeholder="Search by client, case, policy, name..."
                className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                value={filters.client || filters.caseNum || filters.policyNum || filters.firstName || filters.lastName ? 'Filters active' : ''}
                readOnly
                onClick={() => setShowFilters(true)}
              />
            </div>
            {/* Right side: Column Visibility + Assigned to dropdown (responsive) */}
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <div className="sm:self-start">
                <ColumnVisibilityMenu />
              </div>
              <select
                value={assignedUserFilter}
                onChange={(e) => setAssignedUserFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="">Assigned To</option>
                {uniqueAssignedUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Dropdown Panel */}
          {showFilters && (
            <div className="absolute left-0 right-0 mt-2 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 animate-fadeInUp">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Row 1 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Received Date</label>
                  <div className="flex gap-2">
                    <input type="date" value={filters.receivedDateFrom} onChange={(e) => setFilters({ ...filters, receivedDateFrom: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
                    <input type="date" value={filters.receivedDateTo} onChange={(e) => setFilters({ ...filters, receivedDateTo: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
                  <input type="text" value={filters.client} onChange={(e) => setFilters({ ...filters, client: e.target.value })} placeholder="Client name" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Case No</label>
                  <input type="text" value={filters.caseNum} onChange={(e) => setFilters({ ...filters, caseNum: e.target.value })} placeholder="Case number" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Policy No</label>
                  <input type="text" value={filters.policyNum} onChange={(e) => setFilters({ ...filters, policyNum: e.target.value })} placeholder="Policy number" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
                </div>
                {/* Row 2 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <div className="flex gap-2">
                    <input type="text" value={filters.firstName} onChange={(e) => setFilters({ ...filters, firstName: e.target.value })} placeholder="First" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
                    <input type="text" value={filters.lastName} onChange={(e) => setFilters({ ...filters, lastName: e.target.value })} placeholder="Last" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Underwriter</label>
                  <select value={filters.underwriter} onChange={(e) => setFilters({ ...filters, underwriter: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                    <option value="">All</option>
                    {uniqueUnderwriters.map(uw => <option key={uw} value={uw}>{uw}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Auditor</label>
                  <select value={filters.auditor} onChange={(e) => setFilters({ ...filters, auditor: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                    <option value="">All</option>
                    {uniqueAuditors.map(aud => <option key={aud} value={aud}>{aud}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Completed Date</label>
                  <div className="flex gap-2">
                    <input type="date" value={filters.completedDateFrom} onChange={(e) => setFilters({ ...filters, completedDateFrom: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
                    <input type="date" value={filters.completedDateTo} onChange={(e) => setFilters({ ...filters, completedDateTo: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={resetFilters} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
                  <RotateCcw size={14} /> Reset
                </button>
                <button onClick={() => setShowFilters(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm">
                  <Search size={14} /> Search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Data Table - fully responsive */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {header.column.getCanSort() ? (
                          <button onClick={header.column.getToggleSortingHandler()} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
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
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <FileText size={48} className="opacity-50" />
                        <p>No matching records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300 break-words">
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
          <div className="flex flex-wrap justify-between items-center gap-4 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value));
                  table.setPageIndex(0);
                }}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                {[10, 20, 30, 50].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.2s ease-out; }
      `}</style>
    </AppLayout>
  );
};

export default Dashboard;