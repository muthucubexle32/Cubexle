// src/components/panels/IndexingPanel.jsx
import React, { useState, useMemo } from 'react';
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
  FileText,
  X,
  Save,
  Trash2,
  Plus,
  Edit2,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

// Tooltip Component (reused)
const Tooltip = ({ children, text, position = "bottom" }) => {
  const [show, setShow] = useState(false);
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };
  const getArrowClasses = (pos) => {
    switch (pos) {
      case "top": return "top-full -translate-y-1/2 left-1/2 -translate-x-1/2";
      case "bottom": return "bottom-full translate-y-1/2 left-1/2 -translate-x-1/2";
      case "left": return "left-full -translate-x-1/2 top-1/2 -translate-y-1/2";
      case "right": return "right-full translate-x-1/2 top-1/2 -translate-y-1/2";
      default: return "top-full -translate-y-1/2 left-1/2 -translate-x-1/2";
    }
  };
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={`absolute z-[9999] ${positionClasses[position]} px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none animate-fadeIn backdrop-blur-sm bg-opacity-95 border border-gray-700`}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 border border-gray-700 ${getArrowClasses(position)}`} style={{ background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)' }}></div>
        </div>
      )}
    </div>
  );
};

// Simple input (light blue background)
const SimpleInput = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full bg-[#CFE8F2] rounded p-1.5 sm:px-2 text-xs sm:text-sm text-black outline-none focus:ring-1 focus:ring-blue-400 border-none placeholder-gray-500"
  />
);

// DocGroup dropdown
const DocGroupDropdown = ({ value, onChange }) => {
  const options = [
    "01. Medical",
    "Non-Medical-Review",
    "Other Patient",
    "Others",
    "Duplicate",
    "Physical therapy",
    "Occupational therapy",
    "Chiropractic",
    "Massage therapy"
  ];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#CFE8F2] rounded p-1.5 sm:px-2 text-xs sm:text-sm text-black outline-none focus:ring-1 focus:ring-blue-400 border-none"
    >
      <option value="">-- Select --</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
};

const IndexingPanel = ({ onLogout, toggleTheme, dark }) => {
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startPage: "",
    endPage: "",
    provider: "",
    facility: "",
    reportType: "",
    docGroup: "",
    fileName: "",
    duplicatePage: "",
  });

  // Filter state
  const [filters, setFilters] = useState({
    fileName: '',
    provider: '',
    docGroup: '',
    dateFrom: '',
    dateTo: '',
  });

  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Overlap validation
  const hasOverlap = (newStart, newEnd, fileName, excludeId = null) => {
    if (!fileName || !newStart || !newEnd) return false;
    const start = parseInt(newStart, 10);
    const end = parseInt(newEnd, 10);
    if (isNaN(start) || isNaN(end)) return false;

    return records.some(record => {
      if (excludeId !== null && record.id === excludeId) return false;
      if (record.fileName !== fileName) return false;
      const existingStart = parseInt(record.startPage, 10);
      const existingEnd = parseInt(record.endPage, 10);
      if (isNaN(existingStart) || isNaN(existingEnd)) return false;
      return (start <= existingEnd && end >= existingStart);
    });
  };

  // Submit / Update
  const handleSubmit = () => {
    if (!formData.startPage || !formData.endPage) {
      alert("Start Page and End Page are required.");
      return;
    }
    const start = parseInt(formData.startPage, 10);
    const end = parseInt(formData.endPage, 10);
    if (isNaN(start) || isNaN(end) || start > end) {
      alert("Start Page must be ≤ End Page.");
      return;
    }
    if (!formData.fileName) {
      alert("File Name is required to detect overlaps.");
      return;
    }
    if (hasOverlap(start, end, formData.fileName, editId)) {
      alert(`Overlapping page range [${start}-${end}] for file "${formData.fileName}". Please adjust pages or use Duplicate Page#.`);
      return;
    }

    const newRecord = {
      id: editId !== null ? editId : Date.now(),
      ...formData,
      startPage: start,
      endPage: end,
    };

    if (editId !== null) {
      setRecords(records.map(record => record.id === editId ? newRecord : record));
      setEditId(null);
    } else {
      setRecords([...records, newRecord]);
    }

    // Reset form
    setFormData({
      date: "", startPage: "", endPage: "", provider: "", facility: "",
      reportType: "", docGroup: "", fileName: "", duplicatePage: "",
    });
  };

  const handleDeleteRecord = (id) => {
    setRecords(records.filter(record => record.id !== id));
    if (editId === id) {
      setEditId(null);
      setFormData({
        date: "", startPage: "", endPage: "", provider: "", facility: "",
        reportType: "", docGroup: "", fileName: "", duplicatePage: "",
      });
    }
  };

  const handleEditRecord = (record) => {
    setFormData({
      date: record.date || "",
      startPage: record.startPage.toString(),
      endPage: record.endPage.toString(),
      provider: record.provider || "",
      facility: record.facility || "",
      reportType: record.reportType || "",
      docGroup: record.docGroup || "",
      fileName: record.fileName || "",
      duplicatePage: record.duplicatePage?.toString() || "",
    });
    setEditId(record.id);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({
      date: "", startPage: "", endPage: "", provider: "", facility: "",
      reportType: "", docGroup: "", fileName: "", duplicatePage: "",
    });
  };

  const handleReset = () => {
    if (window.confirm("Delete ALL records? This cannot be undone.")) {
      setRecords([]);
      setEditId(null);
      setFormData({
        date: "", startPage: "", endPage: "", provider: "", facility: "",
        reportType: "", docGroup: "", fileName: "", duplicatePage: "",
      });
    }
  };

  const handleSave = () => {
    const dataToSave = records.map(({ id, ...rest }) => rest);
    console.log("Indexing Data:", dataToSave);
    alert("Data saved to console. Implement your own storage.");
  };

  // Apply filters
  const filteredData = useMemo(() => {
    let result = [...records];
    if (filters.fileName) {
      result = result.filter(r => r.fileName.toLowerCase().includes(filters.fileName.toLowerCase()));
    }
    if (filters.provider) {
      result = result.filter(r => r.provider?.toLowerCase().includes(filters.provider.toLowerCase()));
    }
    if (filters.docGroup) {
      result = result.filter(r => r.docGroup === filters.docGroup);
    }
    if (filters.dateFrom) {
      result = result.filter(r => r.date && r.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter(r => r.date && r.date <= filters.dateTo);
    }
    return result;
  }, [records, filters]);

  // Stats
  const totalRecords = filteredData.length;
  const totalPages = filteredData.reduce((sum, r) => sum + (r.endPage - r.startPage + 1), 0);
  const uniqueFiles = new Set(filteredData.map(r => r.fileName)).size;

  // Column definitions (Date, Start, End, Provider, Facility, Type, DocGroup, FileName, Duplicate, Actions)
  const columns = useMemo(() => [
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => row.original.date || '—', enableSorting: true },
    { accessorKey: 'startPage', header: 'Start Page', enableSorting: true },
    { accessorKey: 'endPage', header: 'End Page', enableSorting: true },
    { accessorKey: 'provider', header: 'Provider', cell: ({ row }) => row.original.provider || '—', enableSorting: true },
    { accessorKey: 'facility', header: 'Facility', cell: ({ row }) => row.original.facility || '—', enableSorting: true },
    { accessorKey: 'reportType', header: 'Type of Report', cell: ({ row }) => row.original.reportType || '—', enableSorting: true },
    { accessorKey: 'docGroup', header: 'Doc‑Group', cell: ({ row }) => row.original.docGroup || '—', enableSorting: true },
    { accessorKey: 'fileName', header: 'File Name', enableSorting: true },
    { accessorKey: 'duplicatePage', header: 'Duplicate Page', cell: ({ row }) => row.original.duplicatePage || '—', enableSorting: true },

  ], [handleEditRecord, handleDeleteRecord]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  // Reset filters
  const resetFilters = () => {
    setFilters({ fileName: '', provider: '', docGroup: '', dateFrom: '', dateTo: '' });
  };

  return (
    <AppLayout onLogout={onLogout} toggleTheme={toggleTheme} dark={dark}>
      <div className="h-full w-full overflow-y-auto">
        <div className="p-2 md:p-3 space-y-4 max-w-[1700px] mx-auto">
          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-3 py-4 text-left text-xs font-bold text-gray-900 tracking-wider">
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
                          <p> Enter Details on the form</p>
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

          {/* ---------- ENTRY FORM (3×3) ---------- */}
          <div className="border border-blue-300 rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <h2 className="text-md font-semibold text-gray-900">
                  {editId !== null ? "Edit Document Record" : "Add New Document Record"}
                </h2>
                <Tooltip text={editId !== null ? "Update record" : "Add record"} position="left">
                    <button onClick={handleSubmit} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm">
                      {editId !== null ? <Edit2 size={14} /> : <Plus size={14} />}
                      {editId !== null ? "Update" : "Add"}
                    </button>
                  </Tooltip>
                </div>
              

              {/* 3×3 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Row 1 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                  <SimpleInput type="date" value={formData.date} onChange={(e) => updateFormField("date", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Page *</label>
                  <SimpleInput type="number" value={formData.startPage} onChange={(e) => updateFormField("startPage", e.target.value)} placeholder="e.g., 1" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End Page *</label>
                  <SimpleInput type="number" value={formData.endPage} onChange={(e) => updateFormField("endPage", e.target.value)} placeholder="e.g., 5" />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Provider</label>
                  <SimpleInput value={formData.provider} onChange={(e) => updateFormField("provider", e.target.value)} placeholder="Provider name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Facility</label>
                  <SimpleInput value={formData.facility} onChange={(e) => updateFormField("facility", e.target.value)} placeholder="Clinic / Hospital" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Type of Report</label>
                  <SimpleInput value={formData.reportType} onChange={(e) => updateFormField("reportType", e.target.value)} placeholder="e.g., Consultation" />
                </div>

                {/* Row 3 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Doc‑Group</label>
                  <DocGroupDropdown value={formData.docGroup} onChange={(val) => updateFormField("docGroup", val)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">File Name *</label>
                  <SimpleInput value={formData.fileName} onChange={(e) => updateFormField("fileName", e.target.value)} placeholder="e.g., patient_A.pdf" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duplicate Page#</label>
                  <SimpleInput type="number" value={formData.duplicatePage} onChange={(e) => updateFormField("duplicatePage", e.target.value)} placeholder="If duplicate, enter page number" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                * Required fields.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.2s ease-out; }
        @media (max-width: 640px) {
          input, button, select { font-size: 16px !important; }
        }
      `}</style>
    </AppLayout>
  );
};

export default IndexingPanel;