import React, { useState, useRef, useEffect } from "react";
import {
  Activity,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Calendar,
} from "lucide-react";


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
    switch(pos) {
      case "top":
        return "top-full -translate-y-1/2 left-1/2 -translate-x-1/2";
      case "bottom":
        return "bottom-full translate-y-1/2 left-1/2 -translate-x-1/2";
      case "left":
        return "left-full -translate-x-1/2 top-1/2 -translate-y-1/2";
      case "right":
        return "right-full translate-x-1/2 top-1/2 -translate-y-1/2";
      default:
        return "top-full -translate-y-1/2 left-1/2 -translate-x-1/2";
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      ref={tooltipRef}
    >
      {children}
      
      {show && (
        <div 
          className={`absolute z-[9999] ${positionClasses[position]} px-2 py-1 
                     bg-gray-900 text-white text-xs rounded shadow-lg 
                     whitespace-nowrap pointer-events-none animate-fadeIn
                     backdrop-blur-sm bg-opacity-95 border border-gray-700`}
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
          }}
        >
          {text}
          
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 
                          border border-gray-700 ${getArrowClasses(position)}`}
               style={{
                 background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
                 borderWidth: position === 'top' ? '0 1px 1px 0' :
                             position === 'bottom' ? '1px 0 0 1px' :
                             position === 'left' ? '1px 1px 0 0' :
                             '0 0 1px 1px'
               }}>
          </div>
        </div>
      )}
    </div>
  );
};

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

// --- Auto-resizing Textarea Component ---
const AutoResizeTextarea = ({ value, onChange, placeholder, className }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`resize-none overflow-hidden ${className}`}
      rows={1}
    />
  );
};

// --- Main EKG Panel Component ---
export default function EKGPanel() {
  /* STATUS */
  const [status, setStatus] = useState("pending");

  /* PROVIDER / FACILITY - TOP SECTION */
  const [providerName, setProviderName] = useState("Full Name");
  const [facility, setFacility] = useState("");
  const [pageNo, setPageNo] = useState("");
  const [dos, setDos] = useState("");

  /* TIMING & COMMENTS - BOTTOM SECTION (Multiple entries) */
  const [timingComments, setTimingComments] = useState([
    { id: "1", timing: "", comment: "" }
  ]);

  /* ADDITIONAL NOTES */
  const [additionalNotes, setAdditionalNotes] = useState("");

  /* REFS for Date Pickers - only needed for DOS (no longer used, keep for consistency) */
  const dosRef = useRef(null);

  /* HANDLERS */
  // DOS change handler with formatting
  const handleDosChange = (e) => {
    const raw = e.target.value;
    const formatted = formatDate(raw);
    setDos(formatted);
  };

  // Add new timing/comment pair
  const handleAddTimingComment = () => {
    const newEntry = {
      id: Date.now().toString(),
      timing: "",
      comment: ""
    };
    setTimingComments([...timingComments, newEntry]);
  };

  // Update timing or comment
  const handleUpdateTimingComment = (id, field, value) => {
    setTimingComments(prev =>
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  // Delete timing/comment pair
  const handleDeleteTimingComment = (id) => {
    if (timingComments.length > 1) {
      setTimingComments(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields?")) {
      setProviderName("Full Name");
      setFacility("");
      setPageNo("");
      setDos("");
      setTimingComments([{ id: "1", timing: "", comment: "" }]);
      setAdditionalNotes("");
      setStatus("pending");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete EKG record?")) {
      handleReset();
    }
  };

  const handleSave = () => {
    console.log({
      status,
      provider: { providerName, facility, pageNo, dos },      
      timingComments,
      additionalNotes
    });
    alert("EKG Report Saved Successfully!");
  };

  // --- Styles ---
  const inputClass = "w-full h-10 bg-[#e6f3f7] rounded-md px-3 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-400 border border-gray-200 placeholder-gray-400 transition-all";
  const labelClass = "block text-xs font-semibold text-black mb-1";

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pb-0 ">

      {/* 1. Top Status Bar */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-2 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity size={18} className="text-blue-600" />
              </div>
              <h1 className="block text-lg font-semibold text-black mb-1">EKG Report</h1>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Tooltip text="Save" position="bottom">
            <button onClick={handleSave} className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm">
              <Save size={16} strokeWidth={2} /> Save
            </button>
            </Tooltip>
              <Tooltip text="Reset" position="bottom">
            <button onClick={handleReset} className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
              <RotateCcw size={16} strokeWidth={2} /> Reset
            </button>
            </Tooltip>
             <Tooltip text="Delete All" position="bottom">
            <button onClick={handleDelete} className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
              <Trash2 size={16} strokeWidth={2} /> Delete
            </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="px-3 sm:px-4 py-2 max-w-5xl mx-auto">

        {/* 3. TOP SECTION: Provider, Facility, DOS, Page No */}
        <div className="bg-white border border-blue-200 rounded-xl p-2 shadow-sm mb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* Provider Name - Pre-filled */}
            <div>
              <label className={labelClass}>Provider name</label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Facility */}
            <div>
              <label className={labelClass}>Facility</label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                placeholder="Enter facility"
                className={inputClass}
              />
            </div>

            {/* DOS - Changed to MM-DD-YYYY text input with calendar icon */}
            <div>
              <label className={labelClass}>DOS</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="MM-DD-YYYY"
                  value={dos}
                  onChange={handleDosChange}
                  className={`${inputClass} pr-8`}
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Page No */}
            <div>
              <label className={labelClass}>Page No</label>
              <input
                type="text"
                value={pageNo}
                onChange={(e) => setPageNo(e.target.value)}
                placeholder="Page number"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 4. EKG READINGS SECTION */}
        <div className="bg-white border border-blue-200 rounded-xl p-2 shadow-sm mb-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium px-1 text-black">EKG Readings</h2>
            <button
              onClick={handleAddTimingComment}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Add Reading
            </button>
          </div>

          {/* Dynamic Timing/Comment Entries */}
          <div className="relative">
            {timingComments.map((item, index) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-2 mb-2">
                <div className="flex items-center justify-between mb-2">
                  {timingComments.length > 1 && (
                    <button
                      onClick={() => handleDeleteTimingComment(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-auto"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-start">
                  {/* Timing - Left side */}
                  <div className="w-full md:w-40">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Timing</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={item.timing}
                        onChange={(e) => handleUpdateTimingComment(item.id, 'timing', e.target.value)}
                        className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* Comment - Right side (takes remaining space) */}
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Comment</label>
                    <AutoResizeTextarea
                      value={item.comment}
                      onChange={(e) => handleUpdateTimingComment(item.id, 'comment', e.target.value)}
                      placeholder="Enter observation"
                      className="w-full min-h-[40px] bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Additional Notes Section - Auto-resizing */}
        <div className="bg-white border border-blue-200 rounded-xl p-2 shadow-sm mb-2">
          <h2 className="text-sm px-1 font-bold text-black mb-1">Additional Notes</h2>
          <AutoResizeTextarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Enter any additional EKG observations, clinical findings, or recommendations..."
            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm text-gray-700 outline-none focus:border-blue-400 min-h-[150px]"
          />
          <div className="text-xs text-gray-400 mt-2">
            {additionalNotes.length} characters
          </div>
        </div>
      </div>
    </div>
  );
}