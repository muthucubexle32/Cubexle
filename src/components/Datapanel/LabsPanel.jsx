import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  ChevronDown,
  Calendar,
  Check,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Save,
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
// --- Predefined Data for Panels ---
const PANELS_DATA = {
  "Lipid Panel": [
    "Total Cholesterol (TC)",
    "HDL Cholesterol",
    "LDL Cholesterol",
    "Triglycerides (TG)",
    "TC/HDL Ratio",
  ],
  "Basic Metabolic Panel": [
    "Glucose",
    "Calcium",
    "Sodium",
    "Potassium",
    "CO2",
    "Chloride",
    "BUN",
    "Creatinine",
  ],
  "Complete Blood Count": [
    "WBC",
    "RBC",
    "Hemoglobin",
    "Hematocrit",
    "Platelets",
  ],
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
        150
      )}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full resize-none overflow-hidden outline-none transition-all ${className}`}
    />
  );
};

// --- Main Component ---
export default function LaboratoryReport() {
  /* STATUS */
  const [status, setStatus] = useState("pending");

  /* PATIENT INFORMATION */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  /* PROVIDER / FACILITY */
  const [providerName, setProviderName] = useState("");
  const [facility, setFacility] = useState("");
  const [dos, setDos] = useState("");
  const [pageNo, setPageNo] = useState("");

  /* PANEL & PARAMETERS */
  const [panelName, setPanelName] = useState("Lipid Panel");
  const [availableParams, setAvailableParams] = useState(
    PANELS_DATA["Lipid Panel"]
  );

  /* LAB RESULTS STATE */
  const [results, setResults] = useState([]);

  /* COMMENTS */
  const [comments, setComments] = useState("");

  /* REFS for Date Pickers */
  const dobRef = useRef(null);
  const dosRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    setAvailableParams(PANELS_DATA[panelName] || []);
    // Clear results when panel changes to avoid mismatched parameters
    setResults([]);
  }, [panelName]);

  /* HANDLERS */
  const triggerDatePicker = (ref) => {
    if (ref.current) ref.current.showPicker();
  };

  const handleParameterToggle = (param) => {
    setResults((prev) => {
      const exists = prev.find((r) => r.parameter === param);
      if (exists) {
        return prev.filter((r) => r.parameter !== param);
      } else {
        const newRow = {
          id: param,
          parameter: param,
          value: "",
          unit: "",
          flag: "",
          referenceRange: "",
        };
        const newResults = [...prev, newRow];
        return newResults.sort(
          (a, b) =>
            availableParams.indexOf(a.parameter) -
            availableParams.indexOf(b.parameter)
        );
      }
    });
  };

  const handleSelectAll = () => {
    const allSelected = availableParams.every(param => 
      results.some(r => r.parameter === param)
    );

    if (allSelected) {
      // Deselect all
      setResults([]);
    } else {
      // Select all parameters that aren't already selected
      const newResults = [...results];
      availableParams.forEach(param => {
        const exists = results.some(r => r.parameter === param);
        if (!exists) {
          newResults.push({
            id: param,
            parameter: param,
            value: "",
            unit: "",
            flag: "",
            referenceRange: "",
          });
        }
      });
      // Sort to maintain panel order
      newResults.sort((a, b) => 
        availableParams.indexOf(a.parameter) - availableParams.indexOf(b.parameter)
      );
      setResults(newResults);
    }
  };

  const updateResultRow = (id, field, value) => {
    setResults((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields?")) {
      setFirstName("");
      setLastName("");
      setDob("");
      setGender("");
      setProviderName("");
      setFacility("");
      setDos("");
      setPageNo("");
      setResults([]);
      setComments("");
      setStatus("pending");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete record?")) {
      handleReset();
    }
  };

  const handleSave = () => {
    console.log({
      status,
      patient: { firstName, lastName, dob, gender },
      provider: { providerName, facility, dos, pageNo },
      results,
      comments,
    });
    alert("Report Saved Successfully!");
  };

  // Check if all parameters are selected
  const allParametersSelected = availableParams.length > 0 && 
    availableParams.every(param => results.some(r => r.parameter === param));

  // --- Styles ---
  const inputClass =
    "w-full h-8 bg-[#CFE8F2] rounded px-3 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-400 border-none placeholder-gray-400 transition-all";
  const labelClass = "block text-xs font-semibold text-black mb-1";

  return (
    <div className="min-h-screen bg-white pb-2 font-sans text-gray-800">
      
      {/* 1. Top Status & Action Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          {/* 2. Title Header */}
          <h1 className="block text-base sm:text-lg font-semibold text-black">Laboratory Report</h1>
        </div>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          <Tooltip text="save" position="Bottom">
          <button onClick={handleSave} className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm flex-1 sm:flex-none">
            <Save size={14} /> <span className="hidden xs:inline">Save</span>
          </button>
          </Tooltip>
          <Tooltip text="Reset" position="bottom">
          <button onClick={handleReset} className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm flex-1 sm:flex-none">
            <RotateCcw size={14} /> <span className="hidden xs:inline">Reset</span>
          </button>
          </Tooltip>
          <Tooltip text="Delete All" position="bottom">
          <button onClick={handleDelete} className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm flex-1 sm:flex-none">
            <Trash2 size={14} /> <span className="hidden xs:inline">Delete</span>
          </button>
          </Tooltip>
        </div>
      </div>

      <div className="px-2 sm:px-3 py-4 max-w-[1400px] mx-auto space-y-2">
        
       
        {/* 4. Provider & Facility */}
        <div className="bg-white border border-blue-300 rounded-xl p-2 sm:p-3 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 items-end">
            <div className="col-span-1">
              <label className={labelClass}>Provider name</label>
              <input type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Provider name" className={inputClass} />
            </div>
            <div className="col-span-1">
              <label className={labelClass}>Facility</label>
              <input type="text" value={facility} onChange={(e) => setFacility(e.target.value)} placeholder="Enter Facility" className={inputClass} />
            </div>
            <div className="col-span-1">
              <label className={labelClass}>(DOS)Date of service</label>
              <div className="relative cursor-pointer" onClick={() => triggerDatePicker(dosRef)}>
                <input ref={dosRef} type="date" value={dos} onChange={(e) => setDos(e.target.value)} className={`${inputClass} pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden`} />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="col-span-1">
              <label className={labelClass}>Page No</label>
              <input type="number" value={pageNo} onChange={(e) => setPageNo(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* 5. Panel Selection & Parameters with Select All Button */}
        <div className="bg-white border border-blue-300 rounded-xl p-2 sm:p-3 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Panel Select */}
            <div className="w-full lg:w-1/3">
              <label className={labelClass}>Panel Name</label>
              <div className="relative">
                <select 
                  value={panelName}
                  onChange={(e) => setPanelName(e.target.value)}
                  className="w-full h-8 bg-[#CFE8F2] rounded-lg px-2 text-sm text-gray-700 appearance-none outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                >
                  {Object.keys(PANELS_DATA).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {/* Parameters List with Select All */}
            <div className="w-full lg:w-2/3">
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mb-2">
                <label className="block text-sm font-semibold text-[#030303]">Select Parameters</label>
                <button
                  onClick={handleSelectAll}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors w-full xs:w-auto ${
                    allParametersSelected 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                  }`}
                >
                  {allParametersSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="bg-[#bae6fd] bg-opacity-40 rounded-lg p-2">
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableParams.map((param) => {
                    const isChecked = results.some(r => r.parameter === param);
                    return (
                      <div key={param} className="flex items-center gap-2 cursor-pointer min-w-0" onClick={() => handleParameterToggle(param)}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isChecked ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-blue-300'}`}>
                          {isChecked && <Check size={12} strokeWidth={4} />}
                        </div>
                        <span className="text-sm font-medium text-gray-700 select-none truncate">{param}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Selection Summary */}
                {availableParams.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600 border-t border-blue-200 pt-1">
                    {results.length} of {availableParams.length} parameters selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Lab Results Table */}
        <div className="bg-white border border-blue-300 rounded-xl p-2 sm:p-3 shadow-sm">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-bold text-[#020202]">Lab Results</h2>
            <div className="flex gap-3 text-xs font-medium">
              <span className="text-red-600 flex items-center gap-1"><ArrowUp size={12} /> High</span>
              <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={12} /> Normal</span>
              <span className="text-blue-600 flex items-center gap-1"><ArrowDown size={12} /> Low</span>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 sm:-mx-3">
            <div className="inline-block min-w-full align-middle px-2 sm:px-3">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th scope="col" className="py-3 px-2 sm:px-4 text-left text-xs font-bold text-gray-700 whitespace-nowrap">Parameter</th>
                    <th scope="col" className="py-3 px-2 sm:px-4 text-center text-xs font-bold text-gray-700 whitespace-nowrap">Value</th>
                    <th scope="col" className="py-3 px-2 sm:px-4 text-center text-xs font-bold text-gray-700 whitespace-nowrap">Unit</th>
                    <th scope="col" className="py-3 px-2 sm:px-4 text-center text-xs font-bold text-gray-700 whitespace-nowrap">Flag</th>
                    <th scope="col" className="py-3 px-2 sm:px-4 text-center text-xs font-bold text-gray-700 whitespace-nowrap">Reference Range</th>
                    <th scope="col" className="py-3 px-2 sm:px-4 text-center text-xs font-bold text-gray-700 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 px-2 text-center text-gray-500 text-sm italic">
                        No parameters selected. Please select parameters above.
                      </td>
                    </tr>
                  ) : (
                    results.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-2 sm:px-4 text-sm font-medium text-gray-700 whitespace-nowrap">{row.parameter}</td>
                        <td className="py-2 px-2 sm:px-4">
                          <input
                            value={row.value}
                            onChange={(e) => updateResultRow(row.id, "value", e.target.value)}
                            className="w-full min-w-[60px] h-8 bg-white border border-gray-300 rounded px-2 text-center text-sm outline-none focus:border-blue-400"
                          />
                        </td>
                        <td className="py-2 px-2 sm:px-4">
                          <input
                            value={row.unit}
                            onChange={(e) => updateResultRow(row.id, "unit", e.target.value)}
                            className="w-full min-w-[60px] h-8 bg-white border border-gray-300 rounded px-2 text-center text-sm outline-none focus:border-blue-400"
                            placeholder="mg/dL"
                          />
                        </td>
                        <td className="py-2 px-2 sm:px-4">
                          <div className="relative w-full min-w-[90px]">
                            <select
                              value={row.flag}
                              onChange={(e) => updateResultRow(row.id, "flag", e.target.value)}
                              className={`
                                w-full h-8 px-2 text-xs font-bold rounded border outline-none appearance-none cursor-pointer
                                ${row.flag === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 
                                  row.flag === 'Low' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                  row.flag === 'Normal' ? 'bg-green-50 text-green-600 border-green-200' : 
                                  row.flag === 'No Ref Range' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                                  'bg-white text-gray-600 border-gray-300'}
                              `}
                            >
                              <option value="">Select</option>
                              <option value="Normal">Normal</option>
                              <option value="High">High</option>
                              <option value="Low">Low</option>
                              <option value="No Ref Range">No Ref Range</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                              {row.flag === 'High' && <ArrowUp size={12} className="text-red-600" />}
                              {row.flag === 'Low' && <ArrowDown size={12} className="text-blue-600" />}
                              {row.flag === 'Normal' && <CheckCircle2 size={12} className="text-green-600" />}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 sm:px-4">
                          <input
                            value={row.referenceRange}
                            onChange={(e) => updateResultRow(row.id, "referenceRange", e.target.value)}
                            className="w-full min-w-[90px] h-8 bg-white border border-gray-300 rounded px-2 text-center text-sm outline-none focus:border-blue-400"
                          />
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-center">
                          <button 
                            onClick={() => handleParameterToggle(row.parameter)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove parameter"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Results Summary */}
          {results.length > 0 && (
            <div className="mt-4 text-xs text-gray-500 text-right border-t border-gray-200 pt-2">
              Showing {results.length} of {availableParams.length} parameters
            </div>
          )}
        </div>

        {/* 7. Doctor's Comments & Footer Section */}
        <div className="bg-white border border-blue-300 rounded-xl p-2 sm:p-3 shadow-sm">
          <h2 className="text-sm font-bold text-[#000000] mb-2">Doctor's Comments & Observations</h2>
          
          <div className="bg-[#fcfdfd] border border-gray-300 rounded-lg overflow-hidden">
            <AutoResizeTextarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter clinical observations, interpretations, and recommendations..."
              className="w-full min-h-[100px] bg-transparent p-3 sm:p-4 text-sm text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Add custom CSS for xs breakpoint */}
      <style jsx>{`
        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:flex-row {
            flex-direction: row;
          }
          .xs\\:w-auto {
            width: auto;
          }
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}