import React, { useState, useRef, useLayoutEffect } from "react";
import { RotateCcw, Trash2, Save, Cigarette, Wine, Pill } from "lucide-react";

// Tooltip Component (same as original)
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

// Auto-Resizing Textarea Component
const AutoResizeTextarea = ({ value, onChange, placeholder, className }) => {
  const textareaRef = useRef(null);
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 50)}px`;
    }
  }, [value]);
  return (
    <textarea ref={textareaRef} value={value} onChange={onChange} placeholder={placeholder} rows={1} className={`w-full resize-none overflow-hidden outline-none transition-all text-black ${className}`} />
  );
};

export default function SocialHistoryPanel() {
  const [rows, setRows] = useState([
    { id: Date.now(), type: "Tobacco", icon: Cigarette, value: "", dateOfService: "", pageNo: "", comments: "" },
    { id: Date.now() + 1, type: "Alcohol", icon: Wine, value: "", dateOfService: "", pageNo: "", comments: "" },
    { id: Date.now() + 2, type: "Drug Use", icon: Pill, value: "", dateOfService: "", pageNo: "", comments: "" }
  ]);

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields?")) {
      setRows([
        { id: Date.now(), type: "Tobacco", icon: Cigarette, value: "", dateOfService: "", pageNo: "", comments: "" },
        { id: Date.now() + 1, type: "Alcohol", icon: Wine, value: "", dateOfService: "", pageNo: "", comments: "" },
        { id: Date.now() + 2, type: "Drug Use", icon: Pill, value: "", dateOfService: "", pageNo: "", comments: "" }
      ]);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete all records?")) handleReset();
  };

  const handleSave = () => {
    const allData = { socialHistory: rows };
    alert("Social History Data Saved!");
    console.log(allData);
  };

  const inputBaseClass = "w-full h-9 sm:h-8 bg-[#CFE8F2] rounded px-2 sm:px-3 text-xs sm:text-sm text-black outline-none focus:ring-1 focus:ring-blue-400 border-none placeholder-gray-500";
  const labelClass = "block text-[10px] sm:text-xs font-semibold text-black mb-1";

  return (
    <div className="w-full bg-white min-h-screen pb-2 overflow-x-hidden">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 sm:px-4 py-2 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-[1400px] mx-auto">
          <h1 className="text-lg sm:text-lg font-semibold text-black">Social History</h1>
          <div className="flex gap-2 sm:ml-auto w-full sm:w-auto">
            <Tooltip text="Save Data"><button onClick={handleSave} className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"><Save size={14} /> Save</button></Tooltip>
            <Tooltip text="Reset All"><button onClick={handleReset} className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"><RotateCcw size={14} /> Reset</button></Tooltip>
            <Tooltip text="Delete All"><button onClick={handleDelete} className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"><Trash2 size={14} /> Delete</button></Tooltip>
          </div>
        </div>
      </div>
      <div className="px-2 sm:px-2 md:px-2 py-2 sm:py-2 max-w-[1400px] mx-auto">
        <div className="border border-blue-300 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="p-2 sm:p-2">
            <div className="space-y-2 sm:space-y-2">
              {rows.map((row) => (
                <div key={row.id} className="border border-blue-200 rounded-lg bg-blue-50/30 p-2 sm:p-2">
                  {/* Row 1: Icon, Title, Yes/No */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-2 sm:mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 sm:p-2 bg-[#CFE8F2] rounded-lg"><row.icon size={16} className="text-blue-600" /></div>
                      <span className="text-sm sm:text-base font-semibold text-black">{row.type}</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name={`${row.type}-${row.id}`} value="No" checked={row.value === "No"} onChange={(e) => updateRow(row.id, "value", e.target.value)} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" /><span className="text-xs sm:text-sm text-black">No</span></label>
                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name={`${row.type}-${row.id}`} value="Yes" checked={row.value === "Yes"} onChange={(e) => updateRow(row.id, "value", e.target.value)} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" /><span className="text-xs sm:text-sm text-black">Yes</span></label>
                    </div>
                  </div>
                  {/* Row 2: Date and Page */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-2">
                    <div><label className={labelClass}>Date of Service</label><input type="date" value={row.dateOfService} onChange={(e) => updateRow(row.id, "dateOfService", e.target.value)} className={inputBaseClass} /></div>
                    <div><label className={labelClass}>Page No</label><input type="number" value={row.pageNo} onChange={(e) => updateRow(row.id, "pageNo", e.target.value)} className={inputBaseClass} placeholder="Enter page number" /></div>
                  </div>
                  {/* Row 3: Comments */}
                  <div><label className={labelClass}>Comments</label><AutoResizeTextarea value={row.comments} onChange={(e) => updateRow(row.id, "comments", e.target.value)} placeholder="Enter comments..." className="w-full min-h-[60px] p-2 text-xs sm:text-sm text-black bg-[#CFE8F2] rounded-lg" /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 480px) { .xs\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        @media (max-width: 640px) { input, button, textarea { font-size: 16px !important; } }
      `}</style>
    </div>
  );
}