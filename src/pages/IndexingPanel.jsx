// src/components/panels/IndexingPanel.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Trash2,
  Plus,
  Edit2,
  Calendar as CalendarIcon,
} from 'lucide-react';

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
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={`absolute z-[9999] ${positionClasses[position]} px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none animate-fadeIn backdrop-blur-sm bg-opacity-95 border border-gray-700`}>
          {text}
        </div>
      )}
    </div>
  );
};

// ----- Custom Date Picker with MM-DD-YYYY format and popup calendar -----
const CustomDatePicker = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date());
  const containerRef = useRef(null);

  // Parse stored MM-DD-YYYY into Date object
  const getDateObject = () => {
    if (!value || !value.match(/^\d{2}-\d{2}-\d{4}$/)) return null;
    const [month, day, year] = value.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return isNaN(date.getTime()) ? null : date;
  };

  const currentDate = getDateObject();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format Date object to MM-DD-YYYY
  const formatToMMDDYYYY = (date) => {
    if (!date || isNaN(date.getTime())) return '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    const formatted = formatToMMDDYYYY(newDate);
    onChange(formatted);
    setIsOpen(false);
  };

  const changeMonth = (delta) => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1));
  };

  // Generate calendar days
  const getDaysInMonth = () => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
      days.push({ date: prevMonthDays - i, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isCurrentMonth: true });
    }
    // Next month days (to fill 6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: i, isCurrentMonth: false });
    }
    return days;
  };

  const days = getDaysInMonth();
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="w-full bg-[#CFE8F2] rounded p-1.5 sm:px-2 text-xs sm:text-sm text-black outline-none focus:ring-1 focus:ring-blue-400 border-none cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!value ? "text-gray-500" : "text-black"}>
          {value || placeholder || "MM-DD-YYYY"}
        </span>
        <CalendarIcon size={16} className="text-gray-600" />
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-64 sm:w-72 p-2 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center mb-2 px-1">
            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium">
              {viewMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight size={16} />
            </button>
          </div>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600 mb-1">
            {weekdays.map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>
          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day, idx) => {
              const isSelected = currentDate &&
                day.isCurrentMonth &&
                currentDate.getDate() === day.date &&
                currentDate.getMonth() === viewMonth.getMonth() &&
                currentDate.getFullYear() === viewMonth.getFullYear();
              return (
                <button
                  key={idx}
                  onClick={() => day.isCurrentMonth && handleDateSelect(day.date)}
                  className={`py-1 text-xs rounded-full transition-colors ${
                    day.isCurrentMonth
                      ? isSelected
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-blue-100 text-gray-800'
                      : 'text-gray-400 cursor-default'
                  }`}
                  disabled={!day.isCurrentMonth}
                >
                  {day.date}
                </button>
              );
            })}
          </div>
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

const IndexingPanel = () => {
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);
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

    setFormData({
      date: "", startPage: "", endPage: "", provider: "", facility: "",
      reportType: "", docGroup: "", fileName: "", duplicatePage: "",
    });
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm("Delete this record?")) {
      setRecords(records.filter(record => record.id !== id));
      if (editId === id) {
        setEditId(null);
        setFormData({
          date: "", startPage: "", endPage: "", provider: "", facility: "",
          reportType: "", docGroup: "", fileName: "", duplicatePage: "",
        });
      }
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

  // Column definitions with Actions (Edit/Delete)
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
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Tooltip text="Edit" position="top">
            <button onClick={() => handleEditRecord(row.original)} className="text-blue-600 hover:text-blue-800">
              <Edit2 size={16} />
            </button>
          </Tooltip>
          <Tooltip text="Delete" position="top">
            <button onClick={() => handleDeleteRecord(row.original.id)} className="text-red-600 hover:text-red-800">
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="h-full w-full overflow-y-auto p-2">
      <div className="space-y-2 max-w-[1600px] mx-auto">
        {/* Data Table with Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-3 py-4 text-left text-xs font-bold text-gray-900 tracking-wider">
                        {header.column.getCanSort() ? (
                          <button onClick={header.column.getToggleSortingHandler()} className="flex items-center gap-2 hover:text-gray-700">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted()] ?? null}
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
                        <p>No records yet. Use the form below to add.</p>
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
                onChange={e => { table.setPageSize(Number(e.target.value)); table.setPageIndex(0); }}
                className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
              >
                {[10, 20, 30, 50].map(size => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-100"><ChevronLeft size={18} /></button>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-100"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>

        {/* Entry Form with Custom Date Picker (MM-DD-YYYY) */}
        <div className="border border-blue-300 rounded-xl bg-white shadow-sm ">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Date field with custom popup calendar (MM-DD-YYYY) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date (MM-DD-YYYY)</label>
                <CustomDatePicker
                  value={formData.date}
                  onChange={(val) => updateFormField("date", val)}
                  placeholder="MM-DD-YYYY"
                />
              </div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Start Page *</label><SimpleInput type="number" value={formData.startPage} onChange={(e) => updateFormField("startPage", e.target.value)} placeholder="e.g., 1" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">End Page *</label><SimpleInput type="number" value={formData.endPage} onChange={(e) => updateFormField("endPage", e.target.value)} placeholder="e.g., 5" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Provider</label><SimpleInput value={formData.provider} onChange={(e) => updateFormField("provider", e.target.value)} placeholder="Provider name" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Facility</label><SimpleInput value={formData.facility} onChange={(e) => updateFormField("facility", e.target.value)} placeholder="Clinic / Hospital" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Type of Report</label><SimpleInput value={formData.reportType} onChange={(e) => updateFormField("reportType", e.target.value)} placeholder="e.g., Consultation" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Doc‑Group</label><DocGroupDropdown value={formData.docGroup} onChange={(val) => updateFormField("docGroup", val)} /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">File Name *</label><SimpleInput value={formData.fileName} onChange={(e) => updateFormField("fileName", e.target.value)} placeholder="e.g., patient_A.pdf" /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Duplicate Page#</label><SimpleInput type="number" value={formData.duplicatePage} onChange={(e) => updateFormField("duplicatePage", e.target.value)} placeholder="If duplicate, enter page number" /></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">* Required fields.</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default IndexingPanel;