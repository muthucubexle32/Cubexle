import React, { useState, useRef, useLayoutEffect } from "react";
import { RotateCcw, Trash2, Plus, Save, X, Activity } from "lucide-react";

// Helper function to format date as MM-DD-YYYY
const formatDate = (value) => {
  // Remove non-digits
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) return '';
  
  // Limit to 8 digits (MMDDYYYY)
  if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
  
  // Add hyphens after month and day
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

// Tooltip and AutoResizeTextarea (same as above – include them)
const Tooltip = ({ children, text, position = "bottom" }) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef(null);
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
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} ref={tooltipRef}>
      {children}
      {show && (
        <div className={`absolute z-[9999] ${positionClasses[position]} px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none animate-fadeIn backdrop-blur-sm bg-opacity-95 border border-gray-700`} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 border border-gray-700 ${getArrowClasses(position)}`} style={{ background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)', borderWidth: position === 'top' ? '0 1px 1px 0' : position === 'bottom' ? '1px 0 0 1px' : position === 'left' ? '1px 1px 0 0' : '0 0 1px 1px' }}></div>
        </div>
      )}
    </div>
  );
};

const AutoResizeTextarea = ({ value, onChange, placeholder, className }) => {
  const textareaRef = useRef(null);
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 90)}px`;
    }
  }, [value]);
  return (
    <textarea ref={textareaRef} value={value} onChange={onChange} placeholder={placeholder} rows={1} className={`w-full resize-none overflow-hidden outline-none transition-all text-black ${className}`} />
  );
};

export default function HealthOverviewPanel() {
  const [rows, setRows] = useState([{ id: Date.now(), dateOfService: "", pageNo: "", comments: "" }]);

  const addRow = () => setRows([...rows, { id: Date.now() + Math.random(), dateOfService: "", pageNo: "", comments: "" }]);
  const removeRow = (id) => { if (rows.length > 1 && window.confirm("Remove entry?")) setRows(rows.filter(row => row.id !== id)); };
  const updateRow = (id, field, value) => setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  
  // Handle date change with formatting
  const handleDateChange = (id, value) => {
    const formatted = formatDate(value);
    updateRow(id, "dateOfService", formatted);
  };
  
  const handleReset = () => { if (window.confirm("Reset all?")) setRows([{ id: Date.now(), dateOfService: "", pageNo: "", comments: "" }]); };
  const handleDelete = () => handleReset();
  const handleSave = () => { alert("Health Overview Saved!"); console.log({ healthOverview: rows }); };

  const inputBaseClass = "w-full h-9 sm:h-8 bg-[#CFE8F2] rounded px-2 sm:px-3 text-xs sm:text-sm text-black outline-none focus:ring-1 focus:ring-blue-400 border-none placeholder-gray-500";
  const labelClass = "block text-[10px] sm:text-xs font-semibold text-black mb-1";

  return (
    <div className="w-full bg-white min-h-screen pb-2 overflow-x-hidden">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 sm:px-4 py-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-[1400px] mx-auto">
          <h1 className="text-lg sm:text-xl font-semibold text-black">Health Overview</h1>
          <div className="flex gap-2 sm:ml-auto w-full sm:w-auto">
             <Tooltip text="Save Data"><button onClick={handleSave} className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"><Save size={14} /> Save</button></Tooltip>
                        <Tooltip text="Reset All"><button onClick={handleReset} className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"><RotateCcw size={14} /> Reset</button></Tooltip>
                        <Tooltip text="Delete All"><button onClick={handleDelete} className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"><Trash2 size={14} /> Delete</button></Tooltip>
          </div>
        </div>
      </div>
      <div className="px-2 sm:px-2 md:px-2 py-3 sm:py-2 max-w-[1400px] mx-auto">
        <div className="border border-blue-300 rounded-xl p-2 sm:p-2 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2"><Activity size={16} className="text-blue-600" /><span className="text-xs font-semibold text-black">Health Overview Entries</span></div>
            <Tooltip text="Add new entry"><button onClick={addRow} className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-bold flex items-center gap-1"><Plus size={12} /> ADD</button></Tooltip>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            {rows.map((row) => (
              <div key={row.id} className="relative bg-white rounded p-2 border border-blue-100">
                {rows.length > 1 && <Tooltip text="Remove entry"><button onClick={() => removeRow(row.id)} className="absolute -top-2 -right-2 bg-red-400 hover:bg-red-500 text-white p-1 rounded-full shadow-md"><X size={10} /></button></Tooltip>}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className={labelClass}>Date of Service</label>
                    <input 
                      type="text" 
                      placeholder="MM-DD-YYYY"
                      value={row.dateOfService} 
                      onChange={(e) => handleDateChange(row.id, e.target.value)} 
                      className={inputBaseClass} 
                    />
                  </div>
                  <div><label className={labelClass}>Page No</label><input type="number" value={row.pageNo} onChange={(e) => updateRow(row.id, "pageNo", e.target.value)} className={inputBaseClass} placeholder="0" /></div>
                </div>
                <div><label className={labelClass}>Comments</label><AutoResizeTextarea value={row.comments} onChange={(e) => updateRow(row.id, "comments", e.target.value)} placeholder="Enter health overview..." className="w-full min-h-[50px] p-2 text-xs sm:text-sm text-black bg-[#CFE8F2] rounded-lg" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 4px; }
        @media (min-width: 480px) { .xs\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      `}</style>
    </div>
  );
}