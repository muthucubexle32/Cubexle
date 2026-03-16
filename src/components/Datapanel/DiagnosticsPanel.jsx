import React, { useState, useRef, useLayoutEffect } from "react";
import {
  ChevronDown,
  RotateCcw,
  Trash2,
  Calendar,
  Plus,
  Save,
  Activity,
  FolderOpen,
  MessageCircle,
  GitCompare,
  Search,
  FileCheck,
  HeartPulse,
  X,
} from "lucide-react";

// Tooltip Component - Fixed z-index and positioning
const Tooltip = ({ children, text, position = "bottom" }) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef(null);
  
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  // Calculate arrow position based on tooltip position
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
      
      {/* Tooltip with high z-index and backdrop blur */}
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
          
          {/* Arrow */}
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

// --- Auto-Resizing Textarea Component ---
const AutoResizeTextarea = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
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
      className={`w-full resize-none overflow-hidden outline-none transition-all ${className}`}
    />
  );
};

// --- Main Component ---
export default function DiagnosticReport() {
 
 


  /* PROVIDER / FACILITY / DOS */
  const [providerName, setProviderName] = useState("");
  const [facility, setFacility] = useState("");
  const [dos, setDos] = useState("");
  const [pageNoHeader, setPageNoHeader] = useState("");

  /* Refs for Date Pickers */
  const dobRef = useRef(null);
  const dosRef = useRef(null);

  /* VITALS STATE - Two separate rows like OV panel */
  // Box 1 - Height/Weight measurements (multiple rows)
  const [vitalsRowsBox1, setVitalsRowsBox1] = useState([
    { id: Date.now(), height: '', heightUnit: 'CM', weight: '', weightUnit: 'KG', bmi: '', pageNo: '' }
  ]);

  // Box 2 - BP & Pulse measurements (multiple rows)
  const [vitalsRows, setVitalsRows] = useState([
    {
      id: 1,
      dia: "",
      sys: "",
      pulse: "",
      pageNo2: "",
    },
  ]);

  /* DIAGNOSTIC REPORT FIELDS */
  const [radiologyReport, setRadiologyReport] = useState("");
  const [procedureName, setProcedureName] = useState("");
  const [indication, setIndication] = useState("");
  const [comparison, setComparison] = useState("");
  const [findings, setFindings] = useState("");
  const [impression, setImpression] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [specialComments, setSpecialComments] = useState("");

  /* ACTIONS for Box 1 - Height/Weight */
  const addVitalsRowBox1 = () => {
    const newRow = {
      id: Date.now() + Math.random(),
      height: '',
      heightUnit: 'CM',
      weight: '',
      weightUnit: 'KG',
      bmi: '',
      pageNo: ''
    };
    setVitalsRowsBox1([...vitalsRowsBox1, newRow]);
  };

  const removeVitalsRowBox1 = (id) => {
    if (vitalsRowsBox1.length > 1) {
      if (window.confirm("Are you sure you want to remove this vitals entry?")) {
        setVitalsRowsBox1(vitalsRowsBox1.filter(row => row.id !== id));
      }
    }
  };

  const updateVitalsBox1 = (id, field, value) => {
    setVitalsRowsBox1(vitalsRowsBox1.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  /* ACTIONS for Box 2 - BP & Pulse */
  const addVitalsRow = () => {
    setVitalsRows([
      ...vitalsRows,
      {
        id: Date.now(),
        dia: "",
        sys: "",
        pulse: "",
        pageNo2: "",
      },
    ]);
  };

  const removeVitalsRow = (id) => {
    if (vitalsRows.length > 1) {
      if (window.confirm("Are you sure you want to remove this vitals entry?")) {
        setVitalsRows(vitalsRows.filter((row) => row.id !== id));
      }
    }
  };

  const updateVitals = (id, field, val) => {
    setVitalsRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields?")) {
      setStatus("pending");
      setFirstName("");
      setLastName("");
      setDob("");
      setGender("");
      setProviderName("");
      setFacility("");
      setDos("");
      setPageNoHeader("");
      setRadiologyReport("");
      setProcedureName("");
      setIndication("");
      setComparison("");
      setFindings("");
      setImpression("");
      setRecommendation("");
      setSpecialComments("");
      setVitalsRowsBox1([
        { id: Date.now(), height: '', heightUnit: 'CM', weight: '', weightUnit: 'KG', bmi: '', pageNo: '' }
      ]);
      setVitalsRows([
        {
          id: 1,
          dia: "",
          sys: "",
          pulse: "",
          pageNo2: "",
        },
      ]);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete record?")) {
      handleReset();
    }
  };

  const handleSave = () => {
    const allData = {
      patientInfo: { firstName, lastName, dob, gender },
      provider: { providerName, facility, dos, pageNoHeader },
      vitals: { vitalsRowsBox1, vitalsRows },
      diagnostic: {
        radiologyReport,
        procedureName,
        indication,
        comparison,
        findings,
        impression,
        recommendation,
        specialComments
      }
    };
    alert("Data Saved Successfully!");
    console.log(allData);
  };

  // Function to trigger native date picker
  const triggerDatePicker = (ref) => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  // --- Helper Styles ---
  const inputBaseClass = "w-full h-8 bg-[#CFE8F2] rounded px-3 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-400 border-none placeholder-gray-400";
  const labelClass = "block text-xs font-semibold text-black mb-1";

  return (
    <div className="w-full gap-3 bg-white min-h-screen pb-12">
      {/* 1. Header Bar */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2 pb-2 pt-2 border-b border-gray-200 px-4">
        <h1 className="block text-lg font-semibold text-black">Diagnostic Report</h1>
        <div className="flex gap-2 sm:ml-auto w-full sm:w-auto justify-end">
          <Tooltip text="save" position="bottom">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
          >
            <Save size={16} strokeWidth={2} /> Save
          </button>
          </Tooltip>
          <Tooltip text="Reset" position="bottom">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
          >
            <RotateCcw size={16} strokeWidth={2} /> Reset
          </button>
          </Tooltip>
          <Tooltip text="Delete All" position="bottom">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
          >
            <Trash2 size={16} strokeWidth={2} /> Delete
          </button>
          </Tooltip>
        </div>
      </div>

      <div className="px-4 space-y-3 max-w-[1400px] mx-auto">
        

        {/* Provider / Facility Row */}
        <div className="border border-blue-300 rounded-xl p-3 bg-white shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Provider name</label>
              <input
                type="text"
                placeholder="Provider name"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className={inputBaseClass}
              />
            </div>
            <div>
              <label className={labelClass}>Facility</label>
              <input
                type="text"
                placeholder="Enter Facility"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className={inputBaseClass}
              />
            </div>
            <div>
              <label className={labelClass}>Date of Service</label>
              <div
                className="relative cursor-pointer"
                onClick={() => triggerDatePicker(dosRef)}
              >
                <input
                  ref={dosRef}
                  type="date"
                  value={dos}
                  onChange={(e) => setDos(e.target.value)}
                  className={`${inputBaseClass} pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden`}
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Page No</label>
              <input
                type="number"
                value={pageNoHeader}
                onChange={(e) => setPageNoHeader(e.target.value)}
                className={inputBaseClass}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* VITALS Section - Two Separate Rows (like OV panel) */}
        <div className="border border-blue-300 rounded-xl p-1 bg-white shadow-sm">
          <h2 className="text-sm font-bold uppercase flex items-center gap-2 ">
            <HeartPulse size={18} className="text-blue-600" />
            VITALS
          </h2>

          {/* ROW 1: Height & Weight Measurements */}
          <div className="mb-1">
            <div className="border border-blue-200 rounded-lg bg-blue-50/30">
              <div className="flex justify-end items-center px-2 pt-1">
                <button
                  onClick={addVitalsRowBox1}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Plus size={14} /> ADD
                </button>
              </div>

              <div className="p-1  space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                {vitalsRowsBox1.map((row) => (
                  <div key={row.id} className="relative bg-white rounded p-2 border border-blue-100">
                    {vitalsRowsBox1.length > 1 && (
                      <button
                        onClick={() => removeVitalsRowBox1(row.id)}
                        className="absolute -top-0.5 -right-0.5 bg-red-400 hover:bg-red-500 text-white p-1 rounded-full shadow-md z-10"
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2">
                      {/* Height */}
                      <div className="min-w-0">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1">Height</label>
                        <div className="flex">
                          <input
                            value={row.height}
                            onChange={(e) => updateVitalsBox1(row.id, "height", e.target.value)}
                            className="flex-1 min-w-0 h-8 bg-[#CFE8F2] rounded-l px-2 text-xs outline-none focus:ring-1 focus:ring-blue-400"
                            placeholder="0"
                          />
                          <select
                            value={row.heightUnit}
                            onChange={(e) => updateVitalsBox1(row.id, "heightUnit", e.target.value)}
                            className="w-12 h-8 bg-[#CFE8F2] rounded-r text-xs outline-none appearance-none px-1 border-l border-blue-200"
                          >
                            <option>CM</option>
                            <option>INCH</option>
                            <option>FT</option>
                          </select>
                        </div>
                      </div>

                      {/* Weight */}
                      <div className="min-w-0">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1">Weight</label>
                        <div className="flex">
                          <input
                            value={row.weight}
                            onChange={(e) => updateVitalsBox1(row.id, "weight", e.target.value)}
                            className="flex-1 min-w-0 h-8 bg-[#CFE8F2] rounded-l px-2 text-xs outline-none focus:ring-1 focus:ring-blue-400"
                            placeholder="0"
                          />
                          <select
                            value={row.weightUnit}
                            onChange={(e) => updateVitalsBox1(row.id, "weightUnit", e.target.value)}
                            className="w-12 h-8 bg-[#CFE8F2] rounded-r text-xs outline-none appearance-none px-1 border-l border-blue-200"
                          >
                            <option>KG</option>
                            <option>LBS</option>
                          </select>
                        </div>
                      </div>

                      {/* BMI */}
                      <div className="min-w-0">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1">BMI</label>
                        <input
                          value={row.bmi}
                          onChange={(e) => updateVitalsBox1(row.id, "bmi", e.target.value)}
                          className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-xs outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="0.0"
                        />
                      </div>

                      {/* Page No */}
                      <div className="min-w-0">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1">Page</label>
                        <input
                          type="number"
                          value={row.pageNo}
                          onChange={(e) => updateVitalsBox1(row.id, "pageNo", e.target.value)}
                          className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-xs outline-none focus:ring-1 focus:ring-blue-400 appearance-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 2: BP & Pulse Measurements */}
          <div>
            <div className="border border-blue-200 rounded-lg bg-blue-50/30">
              <div className="flex justify-end items-center px-2 pt-2 ">
                <button
                  onClick={addVitalsRow}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Plus size={14} /> ADD
                </button>
              </div>

              <div className="p-1  space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                {vitalsRows.map((row) => (
                  <div key={row.id} className="relative bg-white rounded p-2 border border-blue-100">
                    {vitalsRows.length > 1 && (
                      <button
                        onClick={() => removeVitalsRow(row.id)}
                        className="absolute -top-0.5 -right-0.5  bg-red-400 hover:bg-red-500 text-white p-1 rounded-full shadow-md z-10"
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
                      {/* Blood Pressure */}
                      <div className="min-w-0 col-span-1 xs:col-span-2 sm:col-span-1">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1">Blood Pressure/BP</label>
                        <div className="flex items-center gap-1">
                          <input
                            placeholder="Dia"
                            value={row.dia}
                            onChange={(e) => updateVitals(row.id, "dia", e.target.value)}
                            className="flex-1 min-w-0 h-8 bg-[#CFE8F2] rounded px-2 text-xs text-center outline-none focus:ring-1 focus:ring-blue-400"
                          />
                         
                          <input
                            placeholder="Sys"
                            value={row.sys}
                            onChange={(e) => updateVitals(row.id, "sys", e.target.value)}
                            className="flex-1 min-w-0 h-8 bg-[#CFE8F2] rounded px-2 text-xs text-center outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                      </div>

                      {/* Pulse */}
                      <div className="min-w-0">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1">Pulse (bpm)</label>
                        <input
                          value={row.pulse}
                          onChange={(e) => updateVitals(row.id, "pulse", e.target.value)}
                          className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-xs outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="0"
                        />
                      </div>

                      {/* Page No */}
                      <div className="min-w-0">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1">Page</label>
                        <input
                          type="number"
                          value={row.pageNo2}
                          onChange={(e) => updateVitals(row.id, "pageNo2", e.target.value)}
                          className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-xs outline-none focus:ring-1 focus:ring-blue-400 appearance-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Text Area Sections */}
        {[
          {
            icon: Activity,
            label: "Name of the Radiology report",
            state: radiologyReport,
            set: setRadiologyReport,
          },
          {
            icon: FolderOpen,
            label: "Name of the Procedure",
            state: procedureName,
            set: setProcedureName,
          },
          {
            icon: MessageCircle,
            label: "Indication",
            state: indication,
            set: setIndication,
          },
          {
            icon: GitCompare,
            label: "Comparison",
            state: comparison,
            set: setComparison,
          },
          {
            icon: Search,
            label: "Findings",
            state: findings,
            set: setFindings,
          },
          {
            icon: FileCheck,
            label: "Impression",
            state: impression,
            set: setImpression,
          },
        ].map((item, idx) => (
          <div key={idx} className="w-full">
            <div className="flex items-center gap-2 mb-1">
              <item.icon size={18} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-700">{item.label}</h3>
            </div>
            <div className="w-full border border-blue-300 rounded-lg bg-white overflow-hidden shadow-sm">
              <AutoResizeTextarea
                value={item.state}
                onChange={(e) => item.set(e.target.value)}
                placeholder={`Enter ${item.label.toLowerCase()}...`}
                className="w-full min-h-[80px] p-3 text-sm text-gray-700 bg-white"
              />
            </div>
          </div>
        ))}

        {/* Footer: Recommendation & Special Comments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Recommendation</h3>
            <div className="border border-blue-300 rounded-lg bg-white p-1 shadow-sm">
              <AutoResizeTextarea
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="Enter recommendation..."
                className="w-full min-h-[80px] p-3 text-sm text-gray-700 bg-white"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Special Comments</h3>
            <div className="border border-blue-300 rounded-lg bg-white p-1 shadow-sm">
              <AutoResizeTextarea
                value={specialComments}
                onChange={(e) => setSpecialComments(e.target.value)}
                placeholder="Enter special comments..."
                className="w-full min-h-[80px] p-3 text-sm text-gray-700 bg-white"
              />
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
      `}</style>
    </div>
  );
}