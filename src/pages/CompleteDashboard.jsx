// src/pages/CompleteDashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Download,
  FileText,
  X,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

// ---------- Helper: Convert YYYY-MM-DD to MM-DD-YYYY for display ----------
const formatToMDY = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${month}-${day}-${year}`;
};

// ---------- Helper: Convert MM-DD-YYYY to YYYY-MM-DD for internal storage ----------
const formatToYMD = (mdyDate) => {
  if (!mdyDate) return '';
  const [month, day, year] = mdyDate.split('-');
  if (!month || !day || !year) return '';
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// ---------- Helper: Parse user input (digits only) into MM-DD-YYYY ----------
const formatDateInput = (value) => {
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) return '';
  if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
  let formatted = '';
  if (cleaned.length >= 2) {
    formatted += cleaned.slice(0, 2);
    if (cleaned.length >= 4) {
      formatted += '-' + cleaned.slice(2, 4);
      if (cleaned.length >= 8) {
        formatted += '-' + cleaned.slice(4, 8);
      } else if (cleaned.length > 4) {
        formatted += '-' + cleaned.slice(4);
      }
    } else if (cleaned.length > 2) {
      formatted += '-' + cleaned.slice(2);
    }
  } else {
    formatted = cleaned;
  }
  return formatted;
};

// ---------- Generate Mock Data (only Completed & Cancelled statuses) ----------
const generateMockData = () => {
  const clients = ['ABC Corp', 'XYZ Ltd', 'Global Insurance', 'SecureLife', 'Prime Health', 'Elite Coverage'];
  const underwriters = ['MG', 'SJ', 'MB', 'ED', 'DW'];
  const auditors = ['AA', 'AB', 'IT', 'EO', 'CI'];
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  // Only two statuses allowed
  const statuses = ['Completed', 'Cancelled'];

  const data = [];
  for (let i = 1; i <= 150; i++) {
    const receivedDate = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const summaryStart = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const summaryComplete = Math.random() > 0.6 ? new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : null;

    data.push({
      id: i,
      receivedDate: receivedDate.toISOString().split('T')[0],
      client: clients[Math.floor(Math.random() * clients.length)],
      sourceFile: `SRC-${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      policyNo: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      summaryStartDate: summaryStart.toISOString().split('T')[0],
      summaryCompleteDate: summaryComplete ? summaryComplete.toISOString().split('T')[0] : '',
      uw: underwriters[Math.floor(Math.random() * underwriters.length)],
      auditor: auditors[Math.floor(Math.random() * auditors.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  return data;
};

// ---------- Status Badge (only green for Completed, red for Cancelled) ----------
const StatusBadge = ({ status }) => {
  if (status === 'Completed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        Completed
      </span>
    );
  }
  if (status === 'Cancelled') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
        Cancelled
      </span>
    );
  }
  return null; // Should never happen because data is filtered
};

// ---------- Action Buttons (Download & Reopen only) ----------
const ActionButtons = ({ row, onDownload, onReopen }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onDownload(row.original)}
        className="p-1.5 rounded-md text-blue-600 hover:text-gray-800 hover:bg-blue-50 transition-all"
        title="Download"
      >
        <Download size={20} />
      </button>
      <button
        onClick={() => onReopen(row.original)}
        className="p-1.5 rounded-md text-green-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
        title="Reopen"
      >
        <RotateCcw size={20} />
      </button>
    </div>
  );
};

// ---------- Main Component ----------
const CompleteDashboard = ({ onLogout, toggleTheme, dark }) => {
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    receivedDateFrom: '',
    receivedDateTo: '',
    client: '',
    sourceFile: '',
    firstName: '',
    lastName: '',
    uw: '',
    auditor: '',
    completedDateFrom: '',
    completedDateTo: '',
  });
  // Display values for date inputs (MM-DD-YYYY)
  const [displayReceivedFrom, setDisplayReceivedFrom] = useState('');
  const [displayReceivedTo, setDisplayReceivedTo] = useState('');
  const [displayCompletedFrom, setDisplayCompletedFrom] = useState('');
  const [displayCompletedTo, setDisplayCompletedTo] = useState('');

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      const allData = generateMockData();
      // Ensure only Completed and Cancelled (already true)
      setMasterData(allData);
      setLoading(false);
    }, 500);
  }, []);

  // Apply filters (only show Completed & Cancelled already)
  const filteredData = useMemo(() => {
    let result = [...masterData];
    if (filters.receivedDateFrom) result = result.filter(row => row.receivedDate >= filters.receivedDateFrom);
    if (filters.receivedDateTo) result = result.filter(row => row.receivedDate <= filters.receivedDateTo);
    if (filters.client) result = result.filter(row => row.client.toLowerCase().includes(filters.client.toLowerCase()));
    if (filters.sourceFile) result = result.filter(row => row.sourceFile.toLowerCase().includes(filters.sourceFile.toLowerCase()));
    if (filters.firstName) result = result.filter(row => row.firstName.toLowerCase().includes(filters.firstName.toLowerCase()));
    if (filters.lastName) result = result.filter(row => row.lastName.toLowerCase().includes(filters.lastName.toLowerCase()));
    if (filters.uw) result = result.filter(row => row.uw === filters.uw);
    if (filters.auditor) result = result.filter(row => row.auditor === filters.auditor);
    if (filters.completedDateFrom) result = result.filter(row => row.summaryCompleteDate && row.summaryCompleteDate >= filters.completedDateFrom);
    if (filters.completedDateTo) result = result.filter(row => row.summaryCompleteDate && row.summaryCompleteDate <= filters.completedDateTo);
    return result;
  }, [masterData, filters]);

  const uniqueUWs = useMemo(() => [...new Set(masterData.map(d => d.uw))], [masterData]);
  const uniqueAuditors = useMemo(() => [...new Set(masterData.map(d => d.auditor))], [masterData]);

  // Update row helper
  const updateRow = useCallback((rowId, updates) => {
    setMasterData(prev => prev.map(row => (row.id === rowId ? { ...row, ...updates } : row)));
  }, []);

  // Download handler (placeholder – implement actual download logic)
  const handleDownload = (row) => {
    alert(`Downloading data for case: ${row.sourceFile}`);
    // You can replace this with actual CSV/PDF export
  };

  // Reopen handler: changes status from 'Cancelled' or 'Completed' to 'Open'
  // This will make the row disappear from this dashboard (since we only show Completed/Cancelled)
  // That's intentional; the user can see the reopened case elsewhere.
  const handleReopen = (row) => {
    if (row.status === 'Cancelled' || row.status === 'Completed') {
      updateRow(row.id, { status: 'Open' });
      alert(`Case ${row.sourceFile} has been reopened. Status set to Open.`);
    } else {
      alert(`This case is not eligible for reopening.`);
    }
  };

  // Date filter handlers
  const handleReceivedFromChange = (e) => {
    const raw = e.target.value;
    const formatted = formatDateInput(raw);
    setDisplayReceivedFrom(formatted);
    setFilters(prev => ({ ...prev, receivedDateFrom: formatToYMD(formatted) }));
  };
  const handleReceivedToChange = (e) => {
    const raw = e.target.value;
    const formatted = formatDateInput(raw);
    setDisplayReceivedTo(formatted);
    setFilters(prev => ({ ...prev, receivedDateTo: formatToYMD(formatted) }));
  };
  const handleCompletedFromChange = (e) => {
    const raw = e.target.value;
    const formatted = formatDateInput(raw);
    setDisplayCompletedFrom(formatted);
    setFilters(prev => ({ ...prev, completedDateFrom: formatToYMD(formatted) }));
  };
  const handleCompletedToChange = (e) => {
    const raw = e.target.value;
    const formatted = formatDateInput(raw);
    setDisplayCompletedTo(formatted);
    setFilters(prev => ({ ...prev, completedDateTo: formatToYMD(formatted) }));
  };

  const resetFilters = () => {
    setFilters({
      receivedDateFrom: '', receivedDateTo: '', client: '', sourceFile: '',
      firstName: '', lastName: '', uw: '', auditor: '', completedDateFrom: '', completedDateTo: '',
    });
    setDisplayReceivedFrom('');
    setDisplayReceivedTo('');
    setDisplayCompletedFrom('');
    setDisplayCompletedTo('');
  };

  // Column definitions (no checkboxes, no split, only Download/Reopen actions)
  const columns = useMemo(() => [
    {
      accessorKey: 'receivedDate',
      header: 'Received Date',
      cell: ({ row }) => formatToMDY(row.original.receivedDate),
      enableSorting: true,
    },
    { accessorKey: 'client', header: 'Client', enableSorting: true },
    {
      accessorKey: 'sourceFile',
      header: 'Source File',
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.sourceFile}</span>,
      enableSorting: true,
    },
    { accessorKey: 'policyNo', header: 'Policy No', enableSorting: true },
    { accessorKey: 'firstName', header: 'First Name', enableSorting: true },
    { accessorKey: 'lastName', header: 'Last Name', enableSorting: true },
    {
      accessorKey: 'summaryStartDate',
      header: 'Summary Start Date',
      cell: ({ row }) => formatToMDY(row.original.summaryStartDate),
      enableSorting: true,
    },
    {
      accessorKey: 'summaryCompleteDate',
      header: 'Summary Complete Date',
      cell: ({ row }) => (row.original.summaryCompleteDate ? formatToMDY(row.original.summaryCompleteDate) : ''),
      enableSorting: true,
    },
    { accessorKey: 'uw', header: 'UW', enableSorting: true },
    { accessorKey: 'auditor', header: 'Auditor', enableSorting: true },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <ActionButtons
          row={row}
          onDownload={handleDownload}
          onReopen={handleReopen}
        />
      ),
      enableSorting: false,
    },
  ], [handleDownload, handleReopen]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } }, // default 10 rows per page
  });

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
          {/* Stats Cards (optional, can be removed if not needed) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 transition-all hover:shadow-md">
              <p className="text-sm text-gray-500">Total Completed</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{filteredData.filter(r => r.status === 'Completed').length}</p>
            </div>
            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 transition-all hover:shadow-md">
              <p className="text-sm text-gray-500">Total Cancelled</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{filteredData.filter(r => r.status === 'Cancelled').length}</p>
            </div>
          </div>

          {/* Search + Advanced Filters */}
          <div className="space-y-4">
            <div
              className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-2 pr-3 cursor-pointer"
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
                      <input type="text" placeholder="MM-DD-YYYY" value={displayReceivedFrom} onChange={handleReceivedFromChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                      <input type="text" placeholder="MM-DD-YYYY" value={displayReceivedTo} onChange={handleReceivedToChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">Underwriter (UW)</label>
                    <select value={filters.uw} onChange={(e) => setFilters({ ...filters, uw: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                      <option value="">All</option>
                      {uniqueUWs.map(uw => <option key={uw} value={uw}>{uw}</option>)}
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">Completed Date (Summary)</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="MM-DD-YYYY" value={displayCompletedFrom} onChange={handleCompletedFromChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                      <input type="text" placeholder="MM-DD-YYYY" value={displayCompletedTo} onChange={handleCompletedToChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
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
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-3 py-4 text-left text-xs font-bold text-gray-600 tracking-wider">
                          {header.column.getCanSort() ? (
                            <button onClick={header.column.getToggleSortingHandler()} className="flex items-center gap-2 hover:text-gray-700">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: ' ↑',
                                desc: ' ↓',
                              }[header.column.getIsSorted()] ?? null}
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

export default CompleteDashboard;