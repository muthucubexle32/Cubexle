import React, { useState, useRef, useLayoutEffect } from "react";
import {
  RotateCcw,
  Trash2,
  Calendar,
  Plus,
  Save,
  Activity,
  X,
  Users,
  AlertCircle,
  Heart,
  FileText,
  Clipboard,
  Cigarette,
  Wine,
  Pill,
  Stethoscope
} from "lucide-react";

// Tooltip Component
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

// Auto-Resizing Textarea Component
const AutoResizeTextarea = ({ value, onChange, placeholder, className }) => {
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        50
      )}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      className={`w-full resize-none overflow-hidden outline-none transition-all text-black ${className}`}
    />
  );
};

export default function SocialHistoryPanel() {
  // Social History Fields with dynamic rows
  const [socialHistoryRows, setSocialHistoryRows] = useState([
    { 
      id: Date.now(), 
      type: "Tobacco", 
      icon: Cigarette,
      value: "",
      dateOfService: "",
      pageNo: "",
      comments: ""
    },
    { 
      id: Date.now() + 1, 
      type: "Alcohol", 
      icon: Wine,
      value: "",
      dateOfService: "",
      pageNo: "",
      comments: ""
    },
    { 
      id: Date.now() + 2, 
      type: "Drug Use", 
      icon: Pill,
      value: "",
      dateOfService: "",
      pageNo: "",
      comments: ""
    }
  ]);

  // Clinical Medical History Sections
  const [pmhPsh, setPmhPsh] = useState([
    { id: Date.now(), dateOfService: "", pageNo: "", comments: "" }
  ]);
  
  const [specialAttention, setSpecialAttention] = useState([
    { id: Date.now(), dateOfService: "", pageNo: "", comments: "" }
  ]);
  
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState([
    { id: Date.now(), dateOfService: "", pageNo: "", comments: "" }
  ]);
  
  const [healthOverview, setHealthOverview] = useState([
    { id: Date.now(), dateOfService: "", pageNo: "", comments: "" }
  ]);

  // APS Data Range
  const [apsStartDate, setApsStartDate] = useState("");
  const [apsEndDate, setApsEndDate] = useState("");

  // Refs for Date Pickers
  const dosRef = useRef(null);
  const apsStartRef = useRef(null);
  const apsEndRef = useRef(null);

  const triggerDatePicker = (ref) => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  // Update social history row
  const updateSocialHistoryRow = (id, field, value) => {
    setSocialHistoryRows(socialHistoryRows.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  // Generic functions for dynamic rows
  const addRow = (setter, rows) => {
    const newRow = {
      id: Date.now() + Math.random(),
      dateOfService: "",
      pageNo: "",
      comments: ""
    };
    setter([...rows, newRow]);
  };

  const removeRow = (id, setter, rows) => {
    if (rows.length > 1) {
      if (window.confirm("Are you sure you want to remove this entry?")) {
        setter(rows.filter(row => row.id !== id));
      }
    }
  };

  const updateRow = (id, field, value, setter, rows) => {
    setter(rows.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  // Reset all fields
  const handleReset = () => {
    if (window.confirm("Reset all fields?")) {
      setProviderName("");
      setFacility("");
      setDos("");
      setPageNoHeader("");
      setSocialHistoryRows([
        { id: Date.now(), type: "Tobacco", icon: Cigarette, value: "", dateOfService: "", pageNo: "", comments: "" },
        { id: Date.now() + 1, type: "Alcohol", icon: Wine, value: "", dateOfService: "", pageNo: "", comments: "" },
        { id: Date.now() + 2, type: "Drug Use", icon: Pill, value: "", dateOfService: "", pageNo: "", comments: "" }
      ]);
      setPmhPsh([{ id: Date.now(), dateOfService: "", pageNo: "", comments: "" }]);
      setSpecialAttention([{ id: Date.now(), dateOfService: "", pageNo: "", comments: "" }]);
      setFamilyMedicalHistory([{ id: Date.now(), dateOfService: "", pageNo: "", comments: "" }]);
      setHealthOverview([{ id: Date.now(), dateOfService: "", pageNo: "", comments: "" }]);
      setApsStartDate("");
      setApsEndDate("");
    }
  };

  // Delete all records
  const handleDelete = () => {
    if (window.confirm("Delete record?")) {
      handleReset();
    }
  };

  // Save data
  const handleSave = () => {
    const allData = {
      provider: { providerName, facility, dos, pageNoHeader },
      socialHistory: socialHistoryRows,
      clinicalHistory: {
        pmhPsh,
        specialAttention,
        familyMedicalHistory,
        healthOverview
      },
      apsDataRange: { apsStartDate, apsEndDate }
    };
    alert("Social History Data Saved Successfully!");
    console.log(allData);
  };

  // Styles - all text black
  const inputBaseClass = "w-full h-8 bg-[#CFE8F2] rounded px-3 text-sm text-black outline-none focus:ring-1 focus:ring-blue-400 border-none placeholder-gray-500";
  const labelClass = "block text-xs font-semibold text-black mb-1";

  return (
    <div className="w-full gap-3 bg-white min-h-screen pb-12">
      {/* Header Bar - Responsive */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2 pb-2 pt-2 border-b border-gray-200 px-4">
        <h1 className="block text-xl font-semibold text-black">Social History</h1>
        <div className="flex gap-2 sm:ml-auto w-full sm:w-auto justify-end">
          <Tooltip text="save" position="bottom">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
            >
              <Save size={16} strokeWidth={2} /> Save
            </button>
          </Tooltip>
          <Tooltip text="Reset" position="bottom">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
            >
              <RotateCcw size={16} strokeWidth={2} /> Reset
            </button>
          </Tooltip>
          <Tooltip text="Delete All" position="bottom">
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
            >
              <Trash2 size={16} strokeWidth={2} /> Delete
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="px-2 sm:px-2 space-y-2 max-w-[1400px] mx-auto">
        {/* Social History Section */}
        <div className="border border-blue-300 rounded-xl p-2 sm:p-3 bg-white shadow-sm">
          <div className="space-y-2">
            {socialHistoryRows.map((row) => (
              <div key={row.id} className="border border-blue-200 rounded-lg bg-blue-50/30 p-2 sm:p-3">
                {/* First Row: Icon, Label, No/Yes Toggle, Date of Service & Page No */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-1">
                  {/* Icon and Label */}
                  <div className="lg:col-span-2 flex items-center gap-3">
                    <div className="p-2 bg-[#CFE8F2] rounded-lg flex-shrink-0">
                      <row.icon size={18} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-black">{row.type}</span>
                  </div>
                  
                  {/* No/Yes Toggle */}
                  <div className="lg:col-span-2 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`${row.type}-${row.id}`}
                        value="No"
                        checked={row.value === "No"}
                        onChange={(e) => updateSocialHistoryRow(row.id, "value", e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-black">No</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`${row.type}-${row.id}`}
                        value="Yes"
                        checked={row.value === "Yes"}
                        onChange={(e) => updateSocialHistoryRow(row.id, "value", e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-black">Yes</span>
                    </label>
                  </div>
                  
                  {/* Date of Service */}
                  <div className="lg:col-span-4">
                    <label className="block text-[12px] font-semibold text-black mb-1">Date of Service</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={row.dateOfService}
                        onChange={(e) => updateSocialHistoryRow(row.id, "dateOfService", e.target.value)}
                        className={`${inputBaseClass} cursor-pointer`}
                      />
                    </div>
                  </div>
                  
                  {/* Page No */}
                  <div className="lg:col-span-4">
                    <label className="block text-[12px] font-semibold text-black mb-1">Page No</label>
                    <input
                      type="number"
                      value={row.pageNo}
                      onChange={(e) => updateSocialHistoryRow(row.id, "pageNo", e.target.value)}
                      className={inputBaseClass}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Second Row: Comments with Auto-Resizing Textarea */}
                <div>
                  <label className="block text-[12px] font-semibold text-black mb-1">Comments</label>
                  <AutoResizeTextarea
                    value={row.comments}
                    onChange={(e) => updateSocialHistoryRow(row.id, "comments", e.target.value)}
                    placeholder="Enter comments..."
                    className="w-full min-h-[60px] p-2 text-sm text-black bg-[#CFE8F2] rounded-lg focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Medical History Section */}
        <div className="border border-blue-300 rounded-xl p-3 bg-white shadow-sm">
          <h2 className="text-sm font-bold uppercase flex items-center gap-2 mb-1 text-black">
            <Clipboard size={18} className="text-blue-600" />
            CLINICAL MEDICAL HISTORY
          </h2>

          {/* PMH/PSH */}
          <div className="mb-1">
            <div className="border border-blue-200 rounded-lg bg-blue-50/30">
              <div className="flex justify-between items-center px-2 pt-2">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  <span className="text-xs font-semibold text-black">PMH/PSH</span>
                </div>
                <Tooltip text="Add new entry" position="bottom">
                  <button
                    onClick={() => addRow(setPmhPsh, pmhPsh)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Plus size={14} /> ADD
                  </button>
                </Tooltip>
              </div>

              <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {pmhPsh.map((row) => (
                  <div key={row.id} className="relative bg-white rounded p-2 border border-blue-100">
                    {pmhPsh.length > 1 && (
                      <Tooltip text="Remove entry" position="right">
                        <button
                          onClick={() => removeRow(row.id, setPmhPsh, pmhPsh)}
                          className="absolute -top-4  bg-red-400 hover:bg-red-500 text-white p-1 rounded-full shadow-md z-10"
                        >
                          <X size={12} />
                        </button>
                      </Tooltip>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                          Date of Service
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={row.dateOfService}
                            onChange={(e) => updateRow(row.id, "dateOfService", e.target.value, setPmhPsh, pmhPsh)}
                            className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-sm text-black outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                          Page No
                        </label>
                        <input
                          type="number"
                          value={row.pageNo}
                          onChange={(e) => updateRow(row.id, "pageNo", e.target.value, setPmhPsh, pmhPsh)}
                          className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-sm text-black outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                        Comments
                      </label>
                      <AutoResizeTextarea
                        value={row.comments}
                        onChange={(e) => updateRow(row.id, "comments", e.target.value, setPmhPsh, pmhPsh)}
                        placeholder="Enter comments..."
                        className="w-full min-h-[50px] p-2 text-sm text-black bg-[#CFE8F2] rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Special Attention */}
          <div className="mb-2">
            <div className="border border-blue-200 rounded-lg bg-blue-50/30">
              <div className="flex justify-between items-center px-2 pt-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-blue-600" />
                  <span className="text-xs font-semibold text-black">Special Attention</span>
                </div>
                <Tooltip text="Add new entry" position="bottom">
                  <button
                    onClick={() => addRow(setSpecialAttention, specialAttention)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Plus size={14} /> ADD
                  </button>
                </Tooltip>
              </div>

              <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {specialAttention.map((row) => (
                  <div key={row.id} className="relative bg-white rounded p-2 border border-blue-100">
                    {specialAttention.length > 1 && (
                      <Tooltip text="Remove entry" position="right">
                        <button
                          onClick={() => removeRow(row.id, setSpecialAttention, specialAttention)}
                          className="absolute -top-4  bg-red-400 hover:bg-red-500 text-white p-1 rounded-full shadow-md z-10"
                        >
                          <X size={12} />
                        </button>
                      </Tooltip>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                          Date of Service
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={row.dateOfService}
                            onChange={(e) => updateRow(row.id, "dateOfService", e.target.value, setSpecialAttention, specialAttention)}
                            className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-sm text-black outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                          Page No
                        </label>
                        <input
                          type="number"
                          value={row.pageNo}
                          onChange={(e) => updateRow(row.id, "pageNo", e.target.value, setSpecialAttention, specialAttention)}
                          className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-sm text-black outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                        Comments
                      </label>
                      <AutoResizeTextarea
                        value={row.comments}
                        onChange={(e) => updateRow(row.id, "comments", e.target.value, setSpecialAttention, specialAttention)}
                        placeholder="Enter comments..."
                        className="w-full min-h-[50px] p-2 text-sm text-black bg-[#CFE8F2] rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Family Medical History */}
          <div className="mb-2">
            <div className="border border-blue-200 rounded-lg bg-blue-50/30">
              <div className="flex justify-between items-center px-2 pt-2">
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-blue-600" />
                  <span className="text-xs font-semibold text-black">Family Medical History</span>
                </div>
                <Tooltip text="Add new entry" position="bottom">
                  <button
                    onClick={() => addRow(setFamilyMedicalHistory, familyMedicalHistory)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Plus size={14} /> ADD
                  </button>
                </Tooltip>
              </div>

              <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {familyMedicalHistory.map((row) => (
                  <div key={row.id} className="relative bg-white rounded p-2 border border-blue-100">
                    {familyMedicalHistory.length > 1 && (
                      <Tooltip text="Remove entry" position="right">
                        <button
                          onClick={() => removeRow(row.id, setFamilyMedicalHistory, familyMedicalHistory)}
                          className="absolute -top-4  bg-red-400 hover:bg-red-500 text-white p-1 rounded-full shadow-md z-10"
                        >
                          <X size={12} />
                        </button>
                      </Tooltip>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                          Date of Service
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={row.dateOfService}
                            onChange={(e) => updateRow(row.id, "dateOfService", e.target.value, setFamilyMedicalHistory, familyMedicalHistory)}
                            className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-sm text-black outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                          Page No
                        </label>
                        <input
                          type="number"
                          value={row.pageNo}
                          onChange={(e) => updateRow(row.id, "pageNo", e.target.value, setFamilyMedicalHistory, familyMedicalHistory)}
                          className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-sm text-black outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                        Comments
                      </label>
                      <AutoResizeTextarea
                        value={row.comments}
                        onChange={(e) => updateRow(row.id, "comments", e.target.value, setFamilyMedicalHistory, familyMedicalHistory)}
                        placeholder="Enter comments..."
                        className="w-full min-h-[50px] p-2 text-sm text-black bg-[#CFE8F2] rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Health Overview */}
          <div className="mb-2">
            <div className="border border-blue-200 rounded-lg bg-blue-50/30">
              <div className="flex justify-between items-center px-2 pt-2">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-blue-600" />
                  <span className="text-xs font-semibold text-black">Health Overview</span>
                </div>
                <Tooltip text="Add new entry" position="bottom">
                  <button
                    onClick={() => addRow(setHealthOverview, healthOverview)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Plus size={14} /> ADD
                  </button>
                </Tooltip>
              </div>

              <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {healthOverview.map((row) => (
                  <div key={row.id} className="relative bg-white rounded p-2 border border-blue-100">
                    {healthOverview.length > 1 && (
                      <Tooltip text="Remove entry" position="right">
                        <button
                          onClick={() => removeRow(row.id, setHealthOverview, healthOverview)}
                          className="absolute -top-4 bg-red-400 hover:bg-red-500 text-white p-1 rounded-full shadow-md z-10"
                        >
                          <X size={12} />
                        </button>
                      </Tooltip>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                          Date of Service
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={row.dateOfService}
                            onChange={(e) => updateRow(row.id, "dateOfService", e.target.value, setHealthOverview, healthOverview)}
                            className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-sm text-black outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                          Page No
                        </label>
                        <input
                          type="number"
                          value={row.pageNo}
                          onChange={(e) => updateRow(row.id, "pageNo", e.target.value, setHealthOverview, healthOverview)}
                          className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-sm text-black outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-black mb-1 uppercase tracking-wider">
                        Comments
                      </label>
                      <AutoResizeTextarea
                        value={row.comments}
                        onChange={(e) => updateRow(row.id, "comments", e.target.value, setHealthOverview, healthOverview)}
                        placeholder="Enter comments..."
                        className="w-full min-h-[50px] p-2 text-sm text-black bg-[#CFE8F2] rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* APS Data Range */}
        <div className="border border-blue-300 rounded-xl p-3 bg-white shadow-sm">
          <h2 className="text-sm font-bold uppercase flex items-center gap-2 mb-2 text-black">
            <Calendar size={18} className="text-blue-600" />
            APS DATA RANGE
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start Date</label>
              <div
                className="relative cursor-pointer"
                onClick={() => triggerDatePicker(apsStartRef)}
              >
                <input
                  ref={apsStartRef}
                  type="date"
                  value={apsStartDate}
                  onChange={(e) => setApsStartDate(e.target.value)}
                  className={`${inputBaseClass} pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden`}
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-900"
                />
              </div>
            </div>
            
            <div>
              <label className={labelClass}>End Date</label>
              <div
                className="relative cursor-pointer"
                onClick={() => triggerDatePicker(apsEndRef)}
              >
                <input
                  ref={apsEndRef}
                  type="date"
                  value={apsEndDate}
                  onChange={(e) => setApsEndDate(e.target.value)}
                  className={`${inputBaseClass} pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden`}
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}