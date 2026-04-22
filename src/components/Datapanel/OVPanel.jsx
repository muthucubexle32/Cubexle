import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import {
  ChevronDown,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  Clock,
  FileText,
  ClipboardList,
  CheckCircle,
  MapPin,
  Briefcase,
  MessageSquare,
  NotebookTabs,
  Scale,
  HeartPulse,
  X,
  Calendar,          // added calendar icon
} from "lucide-react";

// Helper function to format date as MM-DD-YYYY
const formatDate = (value) => {
  // Remove non-digits
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) return '';
  
  // Limit to 8 digits (MMDDYYYY)
  if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
  
  // Add slashes after month and day
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

  const getArrowClasses = (pos) => {
    switch(pos) {
      case "top": return "top-full -translate-y-1/2 left-1/2 -translate-x-1/2";
      case "bottom": return "bottom-full translate-y-1/2 left-1/2 -translate-x-1/2";
      case "left": return "left-full -translate-x-1/2 top-1/2 -translate-y-1/2";
      case "right": return "right-full translate-x-1/2 top-1/2 -translate-y-1/2";
      default: return "top-full -translate-y-1/2 left-1/2 -translate-x-1/2";
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
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
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

// --- Components ---
const PageBox = ({ value, setValue, id }) => (
  <div className="flex bg-[#b6d3dc] rounded overflow-hidden w-[70px] h-[30px] border border-[#a6c3cc] shadow-sm">
    <input
      id={id}
      type="number"
      min=""
      value={value || ""}
      onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
      className="w-full text-center bg-transparent outline-none text-sm px-1 text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-1 focus:ring-blue-400"
      aria-label="Page number"
    />
  </div>
);

const Header = ({ title, icon: Icon, hideIcon }) => (
  <div className="flex justify-between items-center">
    <span className="font-semibold text-[15px] text-gray-800 flex items-center">
      {Icon && !hideIcon && <Icon size={16} className="text-gray-600" strokeWidth={2} />} {title}
    </span>
  </div>
);

const Block = ({ title, value, onChange, icon: Icon, minHeight = 60, hideIcon }) => {
  const textareaRef = useRef(null);
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(minHeight, textareaRef.current.scrollHeight)}px`;
    }
  }, [minHeight]);

  useLayoutEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const titleToIconMap = {
    "CC/HOPI": Clock,
    "Past Medical History": FileText,
    "Past Surgical History": FileText,
    "Previous Hospitalization records": FileText,
    "Previous Lab/Reports": FileText,
    "Review of System": ClipboardList,
    "Physical Examination/ Scores": ClipboardList,
    "Assessment": CheckCircle,
    "Plan/Recommendation": MapPin,
    "Work Status": Briefcase,
    "Special Comments": MessageSquare,
  };

  const CurrentIcon = Icon || titleToIconMap[title];
  const shouldHideIcon = hideIcon !== undefined ? hideIcon : true;

  return (
    <div className="border border-blue-400 rounded-lg p-2 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <Header title={title} icon={CurrentIcon} hideIcon={shouldHideIcon} />
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg bg-[#f3f5f6] p-2 resize-none outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 custom-scroll text-sm text-gray-700 transition-colors duration-200"
        placeholder={`Enter ${title.toLowerCase()}...`}
        aria-label={`Text input for ${title}`}
        rows={1}
        style={{ minHeight: `${minHeight}px`, overflowY: 'hidden' }}
      />
    </div>
  );
};

// --- Main UI Component ---
export default function MedicalUI() {
  /* PAGE NUMBERS for sections */
  const [pageVitals1, setPageVitals1] = useState("");
  const [pageVitals2, setPageVitals2] = useState("");
  const [pageTop, setPageTop] = useState("");

  /* TOP PANEL FIELDS */
  const [notesType, setNotesType] = useState("select");
  const [dos, setDos] = useState("");
  const [doi, setDoi] = useState("");
  const [provider, setProvider] = useState("");
  const [facility, setFacility] = useState("");

  /* VITALS - Consistent Measurements */
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("CM");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("KG");
  const [bmi, setBmi] = useState("");

  /* TEXT SECTIONS - Main blocks */
  const fields = [
    "CC/HOPI",
    "Past Medical History",
    "Past Surgical History",
    "Previous Hospitalization records",
    "Previous Lab/Reports",
    "Review of System",
    "Physical Examination/ Scores",
    "Assessment",
  ];

  const [data, setData] = useState(
    Object.fromEntries(fields.map((f) => [f, ""]))
  );

  /* PLAN, WORK STATUS, SPECIAL COMMENTS */
  const [planRecommendation, setPlanRecommendation] = useState("");
  const [workStatus, setWorkStatus] = useState("");
  const [specialComments, setSpecialComments] = useState("");

  /* MEDICATION */
  const [rows, setRows] = useState([]);

  const addRow = () => {
    setRows([...rows, { db: "", dose: "", freq: "", cmt: "" }]);
  };

  const removeRow = (i) => {
    if (window.confirm("Are you sure you want to remove this medication entry?")) {
      setRows(rows.filter((_, idx) => idx !== i));
    }
  };

  const updateRow = (i, k, v) => {
    const copy = [...rows];
    copy[i][k] = v;
    setRows(copy);
  };

  /* ADDITIONAL VITALS ROWS - BP & Pulse only */
  const [vitalsRows, setVitalsRows] = useState([
    {
      id: 1,
      dia: "",
      sys: "",
      pulse: "",
      pageNo2: "",
    },
  ]);

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

  const updateVitals = (id, field, value) => {
    setVitalsRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const removeVitalsRow = (id) => {
    if (vitalsRows.length > 1) {
      if (window.confirm("Are you sure you want to remove this vitals entry?")) {
        setVitalsRows(vitalsRows.filter((row) => row.id !== id));
      }
    }
  };

  /* BOX 1 - Height/Weight Vitals Rows */
  const [vitalsRowsBox1, setVitalsRowsBox1] = useState([
    { id: Date.now(), height: '', heightUnit: 'CM', weight: '', weightUnit: 'KG', bmi: '', pageNo: '' }
  ]);

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

  /* ACTIONS */
  const deleteAll = () => {
    if (window.confirm("Delete ALL data? This action cannot be undone.")) {
      setNotesType("select");
      setDos("");
      setDoi("");
      setProvider("");
      setFacility("");
      setHeight("");
      setHeightUnit("CM");
      setWeight("");
      setWeightUnit("KG");
      setBmi("");
      setPageVitals1("");
      setPageVitals2("");
      setPageTop("");
      setRows([]);
      setData(Object.fromEntries(fields.map((f) => [f, ""])));
      setPlanRecommendation("");
      setWorkStatus("");
      setSpecialComments("");
      setVitalsRows([
        {
          id: 1,
          dia: "",
          sys: "",
          pulse: "",
          pageNo2: "",
        },
      ]);
      setVitalsRowsBox1([
        { id: Date.now(), height: '', heightUnit: 'CM', weight: '', weightUnit: 'KG', bmi: '', pageNo: '' }
      ]);
    }
  };

  const resetAll = () => {
    if (window.confirm("Reset all form fields to their initial empty state?")) {
      setNotesType("select");
      setDos("");
      setDoi("");
      setProvider("");
      setFacility("");
      setHeight("");
      setHeightUnit("CM");
      setWeight("");
      setWeightUnit("KG");
      setBmi("");
      setPageVitals1("");
      setPageVitals2("");
      setPageTop("");
      setRows([]);
      setData(Object.fromEntries(fields.map((f) => [f, ""])));
      setPlanRecommendation("");
      setWorkStatus("");
      setSpecialComments("");
      setVitalsRows([
        {
          id: 1,
          dia: "",
          sys: "",
          pulse: "",
          pageNo2: "",
        },
      ]);
      setVitalsRowsBox1([
        { id: Date.now(), height: '', heightUnit: 'CM', weight: '', weightUnit: 'KG', bmi: '', pageNo: '' }
      ]);
    }
  };

  const saveData = () => {
    const allData = {
      notesType,
      dos,
      doi,
      provider,
      facility,
      pageTop,
      vitals: {
        height,
        heightUnit,
        weight,
        weightUnit,
        bmi,
        pageVitals1,
        pageVitals2,
        vitalsRows,
        vitalsRowsBox1,
      },
      notes: {
        ...data,
        "Plan/Recommendation": planRecommendation,
        "Work Status": workStatus,
        "Special Comments": specialComments,
      },
      medication: rows,
    };
    console.log("Saved data:", allData);
    alert("Data saved successfully!");
  };

  // Handlers for DOS and DOI with formatting
  const handleDosChange = (e) => {
    const raw = e.target.value;
    const formatted = formatDate(raw);
    setDos(formatted);
  };

  const handleDoiChange = (e) => {
    const raw = e.target.value;
    const formatted = formatDate(raw);
    setDoi(formatted);
  };

  const inputBaseClass = "w-full h-8 bg-[#CFE8F2] rounded px-3 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-400 border-none placeholder-gray-400";
  const labelClass = "block text-xs font-semibold text-black mb-1";

  return (
    <div className="w-full gap-3">
      <div className="w-full flex flex-wrap items-center gap-3 mb-2 pb-2 pt-3 border-b border-gray-200 px-4">
        <span className="block text-lg font-semibold text-black mb-1">OV</span>
        {/* Action Buttons - Positioned to the right */}
        <div className="flex gap-2 ml-auto">
          <Tooltip text="save" position="bottom">
            <button
              type="button"
              onClick={saveData}
              className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
              aria-label="Save current record"
            >
              <Save size={16} strokeWidth={2} /> Save
            </button>
          </Tooltip>
          <Tooltip text="Reset" position="bottom">
            <button
              type="button"
              onClick={resetAll}
              className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
              aria-label="Reset all fields"
            >
              <RotateCcw size={16} strokeWidth={2} /> Reset
            </button>
          </Tooltip>
            <Tooltip text="Delete All" position="bottom">
          <button
            type="button"
            onClick={deleteAll}
            className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm"
            aria-label="Delete all data"
          >
            <Trash2 size={16} strokeWidth={2} /> Delete
          </button>
          </Tooltip>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-2 pb-3" >
        {/* Top Panel */}
        <div className="border border-blue-400 rounded-lg p-2 bg-white shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2">
            {/* Notes Type */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-800 flex items-center gap-1">
                  <NotebookTabs size={16} className="text-gray-600" /> Notes Type
                </span>
              </div>
              <div className="relative flex items-center bg-[#b6d3dc] rounded h-[30px] border border-[#a6c3cc]">
                <select
                  value={notesType}
                  onChange={(e) => setNotesType(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm appearance-none pr-6 cursor-pointer text-gray-800 px-2"
                >
                  <option value="select" disabled>select</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Procedure">Procedure</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 pointer-events-none text-gray-600" />
              </div>
            </div>

            {/* DOS - MM-DD-YYYY with calendar icon */}
            <div className="space-y-1">
              <span className="font-semibold text-sm text-gray-800 block">Date of Service</span>
              <div className="relative flex items-center bg-[#b6d3dc] rounded h-[30px] border border-[#a6c3cc]">
                <input
                  type="text"
                  placeholder="MM-DD-YYYY"
                  value={dos}
                  onChange={handleDosChange}
                  className="w-full bg-transparent outline-none text-sm px-2 text-gray-800"
                />
                <Calendar size={14} className="absolute right-2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* DOI - MM-DD-YYYY with calendar icon */}
            <div className="space-y-1">
              <span className="font-semibold text-sm text-gray-800 block">Date of Injury</span>
              <div className="relative flex items-center bg-[#b6d3dc] rounded h-[30px] border border-[#a6c3cc]">
                <input
                  type="text"
                  placeholder="MM-DD-YYYY"
                  value={doi}
                  onChange={handleDoiChange}
                  className="w-full bg-transparent outline-none text-sm px-2 text-gray-800"
                />
                <Calendar size={14} className="absolute right-2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Provider */}
            <div className="space-y-1">
              <span className="font-semibold text-sm text-gray-800 block">Provider</span>
              <input
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full h-[30px] bg-[#b6d3dc] rounded px-2 text-sm outline-none text-gray-800 border border-[#a6c3cc]"
                placeholder="Provider name"
              />
            </div>

            {/* Facility */}
            <div className="space-y-1">
              <span className="font-semibold text-sm text-gray-800 block">Facility</span>
              <div className="relative flex items-center bg-[#b6d3dc] rounded h-[30px] border border-[#a6c3cc]">
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  placeholder="Enter facility name"
                  className="w-full bg-transparent outline-none text-sm text-gray-800 px-2 h-full placeholder-gray-600"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-sm text-gray-800 block">Page no</label>
              <div className="flex items-center bg-[#b6d3dc] rounded h-[30px] border border-[#a6c3cc]">
                <input
                  type="number"
                  value={pageTop}
                  onChange={(e) => setPageTop(e.target.value)}
                  placeholder="Page No"
                  className="w-full bg-transparent outline-none text-sm text-gray-800 px-2 h-full placeholder-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* VITALS Section - Two Separate Rows */}
        <div className="border border-blue-300 rounded-xl p-1 bg-white shadow-sm">
          <h2 className="text-sm font-bold uppercase flex items-center gap-1 mb-1">
            <HeartPulse size={18} className="text-blue-600" />
            VITALS
          </h2>

          {/* ROW 1: Height & Weight Measurements */}
          <div className="mb-1">
            <div className="border pr-1 border-blue-200 rounded-lg bg-blue-50/30">
              <div className="flex justify-end items-center px-2 pt-1 ">
                <button
                  onClick={addVitalsRowBox1}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Plus size={14} /> ADD
                </button>
              </div>
              <div className="p-2 space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar ">
                {vitalsRowsBox1.map((row) => (
                  <div key={row.id} className="relative bg-white rounded p-1 border border-blue-100">
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
                      <div className="min-w-0">
                        <label className="block text-[10px] font-semibold text-gray-600 mb-1">Height</label>
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
                            className="w-10 h-8 bg-[#CFE8F2] rounded-r text-xs outline-none appearance-none px-1 border-l border-blue-200"
                          >
                            <option>CM</option>
                            <option>INCH</option>
                            <option>FT</option>
                          </select>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <label className="block text-[10px] font-semibold text-gray-600 mb-1">Weight</label>
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
                            className="w-10 h-8 bg-[#CFE8F2] rounded-r text-xs outline-none appearance-none px-1 border-l border-blue-200"
                          >
                            <option>KG</option>
                            <option>LBS</option>
                          </select>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <label className="block text-[10px] font-semibold text-gray-600 mb-1">BMI</label>
                        <input
                          value={row.bmi}
                          onChange={(e) => updateVitalsBox1(row.id, "bmi", e.target.value)}
                          className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-xs outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="0.0"
                        />
                      </div>
                      <div className="min-w-0">
                        <label className="block text-[10px] font-semibold text-gray-600 mb-1">Page</label>
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
              <div className="flex justify-end items-center px-2 pt-1">
                <button
                  onClick={addVitalsRow}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Plus size={14} /> ADD
                </button>
              </div>
              <div className="p-1 space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                {vitalsRows.map((row) => (
                  <div key={row.id} className="relative bg-white rounded p-2 border border-blue-100">
                    {vitalsRows.length > 1 && (
                      <button
                        onClick={() => removeVitalsRow(row.id)}
                        className="absolute -top-0.5 -right-0.5 bg-red-400 hover:bg-red-500 text-white p-1 rounded-full shadow-md z-10"
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    )}
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
                      <div className="min-w-0 col-span-1 xs:col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-semibold text-gray-600 mb-1">Blood Pressure</label>
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
                      <div className="min-w-0">
                        <label className="block text-[10px] font-semibold text-gray-600 mb-1">Pulse (bpm)</label>
                        <input
                          value={row.pulse}
                          onChange={(e) => updateVitals(row.id, "pulse", e.target.value)}
                          className="w-full h-8 bg-[#CFE8F2] rounded px-2 text-xs outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="0"
                        />
                      </div>
                      <div className="min-w-0">
                        <label className="block text-[10px] font-semibold text-gray-600 mb-1">Page</label>
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

        {/* Text Blocks */}
        <div className="space-y-1">
          {fields.map((title) => (
            <Block
              key={title}
              title={title}
              value={data[title] || ""}
              onChange={(v) => setData({ ...data, [title]: v })}
              minHeight={60}
              hideIcon={true}
            />
          ))}
        </div>

        {/* Medication */}
        <div className="border border-blue-400 rounded-lg p-2 bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="font-semibold text-[15px] text-gray-800">Medication</span>
            <div className="flex items-center gap-2 sm:mt-0">
              <button
                type="button"
                onClick={addRow}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm font-medium flex items-center gap-2 h-[25px] mb-1"
              >
                <Plus size={16} /> Add Medication
              </button>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm italic">No medications added</div>
          ) : (
            <div className="space-y-2">
              {rows.map((row, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-1">
                    <input
                      value={row.db}
                      onChange={(e) => updateRow(i, "db", e.target.value)}
                      className="bg-white px-3 py-1.5 rounded text-sm outline-none border border-gray-300 w-full"
                      placeholder="Drug/Brand"
                    />
                    <input
                      value={row.dose}
                      onChange={(e) => updateRow(i, "dose", e.target.value)}
                      className="bg-white px-3 py-1.5 rounded text-sm outline-none border border-gray-300 w-full"
                      placeholder="Dose"
                    />
                    <input
                      value={row.freq}
                      onChange={(e) => updateRow(i, "freq", e.target.value)}
                      className="bg-white px-3 py-1.5 rounded text-sm outline-none border border-gray-300 w-full"
                      placeholder="Frequency"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <textarea
                      value={row.cmt}
                      onChange={(e) => updateRow(i, "cmt", e.target.value)}
                      onInput={(e) => {
                        const textarea = e.currentTarget;
                        textarea.style.height = 'auto';
                        textarea.style.height = textarea.scrollHeight + 'px';
                      }}
                      className="bg-white px-3 py-1.5 rounded text-sm outline-none border border-gray-300 w-full sm:flex-1 resize-none overflow-hidden min-h-[36px]"
                      placeholder="Comments"
                      rows={1}
                    />
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors flex items-center justify-center sm:w-auto w-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plan/Recommendation and Work Status */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
          <Block
            title="Plan/Recommendation"
            value={planRecommendation}
            onChange={setPlanRecommendation}
            minHeight={60}
            hideIcon={true}
          />
          <Block
            title="Work Status"
            value={workStatus}
            onChange={setWorkStatus}
            minHeight={60}
            hideIcon={true}
          />
        </div>

        {/* Special Comments */}
        <Block
          title="Special Comments"
          value={specialComments}
          onChange={setSpecialComments}
          minHeight={60}
          hideIcon={true}
        />
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