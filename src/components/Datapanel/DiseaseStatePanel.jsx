// src/components/panels/DiseaseStatePanel.jsx
import React, { useState, useRef, useLayoutEffect } from "react";
import { Save, RotateCcw, Trash2, Plus, X } from "lucide-react";

// Tooltip Component (identical to original)
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
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      className={`w-full resize-none overflow-hidden outline-none transition-all bg-[#CFE8F2] rounded p-1 sm:px-2 text-xs sm:text-sm text-black focus:ring-1 focus:ring-blue-400 border-none placeholder-gray-500 ${className}`}
    />
  );
};

// Fixed list of diseases (non‑editable labels)
const FIXED_DISEASES = [
  "Coronary Artery Disease",
  "Diabetes",
  "Cancer Hx",
  "Renal Problems"
];

const DiseaseStatePanel = () => {
  const [records, setRecords] = useState([]); // stored records

  // Entry form: each disease has yes, no, and a "selected" flag
  const [entryData, setEntryData] = useState(
    FIXED_DISEASES.map(disease => ({ disease, yes: "", no: "", selected: true }))
  );

  const updateEntry = (index, field, value) => {
    const updated = [...entryData];
    updated[index][field] = value;
    setEntryData(updated);
  };

  // Add only the selected disease rows that have non‑empty Yes OR No (or force‑selected)
  const handleAddRecord = () => {
    const newRecords = entryData
      .filter(item => item.selected) // only selected rows
      .map((item, idx) => ({
        id: Date.now() + idx,
        disease: item.disease,
        yes: item.yes,
        no: item.no,
      }));
    
    if (newRecords.length === 0) {
      alert("No disease rows selected for addition.");
      return;
    }
    
    setRecords([...records, ...newRecords]);
    // Optional: clear entry form after add – leave as is or reset?
    // Reset only the added rows? Here we keep data but you can uncheck them.
    // I'll leave the data but show a success message.
    alert(`Added ${newRecords.length} disease record(s).`);
  };

  const handleDeleteRecord = (id) => {
    if (records.length === 0) return;
    setRecords(records.filter(record => record.id !== id));
  };

  const handleReset = () => {
    if (window.confirm("Reset all records? This will clear the stored data and entry form.")) {
      setRecords([]);
      setEntryData(FIXED_DISEASES.map(disease => ({ disease, yes: "", no: "", selected: true })));
    }
  };

  const handleDeleteAll = () => handleReset();

  const handleSave = () => {
    const dataToSave = records.map(({ disease, yes, no }) => ({ disease, yes, no }));
    console.log("Disease State Data:", dataToSave);
    alert("Disease State data saved! Check console.");
  };

  return (
    <div className="w-full bg-white min-h-screen pb-1 overflow-x-hidden">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 sm:px-4 py-2 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-[1400px] mx-auto">
          <h1 className="text-lg sm:text-xl font-bold text-black">Disease State</h1>
          <div className="flex gap-2 sm:ml-auto w-full sm:w-auto">
            <Tooltip text="Save" position="bottom">
              <button onClick={handleSave} className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm">
                <Save size={14} /> Save
              </button>
            </Tooltip>
            <Tooltip text="Reset" position="bottom">
              <button onClick={handleReset} className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm">
                <RotateCcw size={14} /> Reset
              </button>
            </Tooltip>
            <Tooltip text="Delete All" position="bottom">
              <button onClick={handleDeleteAll} className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition-all duration-200 shadow-sm">
                <Trash2 size={14} /> Delete All
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="px-2 sm:px-4 py-4 max-w-5xl mx-auto space-y-4">
        {/* Upper Table: Stored Records */}
        <div className="border border-blue-300 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="p-2 sm:p-3">
            <h2 className="text-md font-semibold text-gray-900 mb-2">Stored Disease Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="text-center py-3 px-3 text-sm font-semibold text-gray-900 w-1/3">Disease State</th>
                    <th className="text-center py-3 px-3 text-sm font-semibold text-gray-900 w-1/3">Yes</th>
                    <th className="text-center py-3 px-3 text-sm font-semibold text-gray-900 w-1/3">No</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-sm text-gray-800 break-words">{record.disease}</td>
                      <td className="py-2 px-2 text-sm text-gray-800 break-words">{record.yes}</td>
                      <td className="py-2 px-2 text-sm text-gray-800 break-words">{record.no}</td>
                      <td className="py-2 px-2 text-center">
                        <Tooltip text="Delete" position="left">
                          <button onClick={() => handleDeleteRecord(record.id)} className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <X size={16} />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-gray-400 text-sm">
                        No disease records. Use the form below to add.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Entry Form: 4 Fixed Disease Rows with Yes/No & Selection Checkbox */}
        <div className="border border-blue-300 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="p-2 sm:p-3">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
              <h2 className="text-md font-semibold text-gray-900"> New Disease Records</h2>
              <Tooltip text="Add selected diseases (with current details) to the table" position="left">
                <button
                  onClick={handleAddRecord}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
                >
                  <Plus size={14} /> Save Selected Records
                </button>
              </Tooltip>
            </div>

            <div className="space-y-3">
              {entryData.map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                  <div className="flex items-start gap-2">
                    {/* Selection checkbox */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) => updateEntry(idx, "selected", e.target.checked)}
                        className="w-4 h-4 mt-1 text-blue-600 rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        <div className="font-semibold text-sm text-gray-800">
                          {item.disease}
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs font-semibold text-black mb-1">Yes / Details</label>
                          <AutoResizeTextarea
                            value={item.yes}
                            onChange={(e) => updateEntry(idx, "yes", e.target.value)}
                            placeholder="Enter details "
                            className="min-h-[20px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs font-semibold text-black mb-1">No / Details</label>
                          <AutoResizeTextarea
                            value={item.no}
                            onChange={(e) => updateEntry(idx, "no", e.target.value)}
                            placeholder="Enter details "
                            className="min-h-[20px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        @media (max-width: 640px) {
          input, button, textarea { font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default DiseaseStatePanel;