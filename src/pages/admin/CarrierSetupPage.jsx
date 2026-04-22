// src/pages/admin/CarrierSetupPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';

// Reusable Input Component
const Input = ({ label, type = "text", placeholder, value, onChange, required, error, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label className="text-[14px] font-semibold  tracking-wide text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/20 focus:border-[#0f3f3f] transition-all duration-200 text-sm bg-white ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
  </div>
);

// Checkbox Component
const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 sm:gap-5 cursor-pointer group pt-1 pr-4 sm:pr-8 md:pr-16">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 sm:w-6 sm:h-6 rounded border-gray-700 text-[#001438] focus:ring-[#001438] focus:ring-offset-2 sm:focus:ring-offset-4 cursor-pointer"
    />
    <span className="text-[14px] sm:text-[16px] font-semibold tracking-wide text-gray-900 group-hover:text-gray-900 transition-colors pt-0.5">{label}</span>
  </label>
);

// Radio Button Component
const Radio = ({ label, name, value, checked, onChange }) => (
  <label className="flex items-center gap-3 sm:gap-5 cursor-pointer group">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.value)}
      className="w-5 h-5 sm:w-6 sm:h-6 border-gray-500 text-[#001438] focus:ring-[#001438] cursor-pointer"
    />
    <span className="text-[14px] sm:text-[16px] font-semibold  tracking-wide text-gray-900 group-hover:text-gray-900 transition-colors">{label}</span>
  </label>
);

// Button Component
const Button = ({ children, variant = "primary", onClick, type = "button", className = "" }) => {
  const variants = {
    primary: "bg-[#0f3f3f] text-white hover:bg-[#0a2f2f]",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-[#16a34a] text-white hover:bg-[#15803d]"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl min-h-[700px] max-h-[99vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Export the carriers state and setter for sharing with UserSetupPanel
// Using window object for cross-component communication
export const getCarriersList = () => {
  if (typeof window !== 'undefined' && window.__carriersData) {
    return window.__carriersData;
  }
  return [];
};

const CarrierSetupPanel = () => {
  // Form state for entry - Complete form with all fields
  const [formData, setFormData] = useState({
    carrierName: '',
    carrierCode: '',
    accountNumber: '',
    product: '',
    carrierQC: false,
    icd: false,
    templateName: '',
    sortingLogic: 'chronological',
    combineAPS: false,
    combineAPSHyperlink: false,
    indexer: false
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table data state with sample data
  const [carriers, setCarriers] = useState([
    {
      id: 1,
      carrierName: 'ABC Insurance',
      carrierCode: 'ABC001987978978987',
      accountNumber: 'ACC-12345',
      product: 'Health Insurance',
      carrierQC: true,
      icd: false,
      templateName: 'Medical Template v1',
      sortingLogic: 'chronological',
      combineAPS: true,
      combineAPSHyperlink: false,
      indexer: false
    },
    {
      id: 2,
      carrierName: 'XYZ Health',
      carrierCode: 'XYZ00289879789789',
      accountNumber: 'ACC-67890',
      product: 'Life Insurance',
      carrierQC: false,
      icd: true,
      templateName: 'Health Assessment',
      sortingLogic: 'reverse',
      combineAPS: false,
      combineAPSHyperlink: true,
      indexer: true
    },
    {
      id: 3,
      carrierName: 'Global Care',
      carrierCode: 'GLOB00399898779879',
      accountNumber: 'ACC-11223',
      product: 'Dental Insurance',
      carrierQC: true,
      icd: true,
      templateName: 'Global Standard',
      sortingLogic: 'chronological',
      combineAPS: true,
      combineAPSHyperlink: false,
      indexer: false
    },
  ]);

  // Update global carriers list whenever carriers change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__carriersData = carriers.map(c => ({ id: c.id, carrierName: c.carrierName }));
      // Dispatch custom event to notify UserSetupPanel of carrier changes
      window.dispatchEvent(new CustomEvent('carriersUpdated', { detail: window.__carriersData }));
    }
  }, [carriers]);

  // Initialize global carriers list on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.__carriersData) {
      window.__carriersData = carriers.map(c => ({ id: c.id, carrierName: c.carrierName }));
    }
  }, []);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter carriers based on search
  const filteredCarriers = carriers.filter(carrier =>
    carrier.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.carrierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredCarriers.length / itemsPerPage);
  const paginatedCarriers = filteredCarriers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.carrierName.trim()) newErrors.carrierName = 'Carrier name is required';
    if (!formData.carrierCode.trim()) newErrors.carrierCode = 'Carrier code is required';
    if (!formData.templateName.trim()) newErrors.templateName = 'Template name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditing && editId) {
      setCarriers(prev => prev.map(carrier =>
        carrier.id === editId ? { ...formData, id: editId } : carrier
      ));
      alert('Carrier updated successfully!');
    } else {
      const newCarrier = {
        ...formData,
        id: Date.now(),
      };
      setCarriers(prev => [...prev, newCarrier]);
      alert('Carrier added successfully!');
    }

    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      carrierName: '',
      carrierCode: '',
      accountNumber: '',
      product: '',
      carrierQC: false,
      icd: false,
      templateName: '',
      sortingLogic: 'chronological',
      combineAPS: false,
      combineAPSHyperlink: false,
      indexer: false
    });
    setIsEditing(false);
    setEditId(null);
    setErrors({});
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (carrier) => {
    setFormData({
      carrierName: carrier.carrierName,
      carrierCode: carrier.carrierCode,
      accountNumber: carrier.accountNumber,
      product: carrier.product || '',
      carrierQC: carrier.carrierQC || false,
      icd: carrier.icd || false,
      templateName: carrier.templateName,
      sortingLogic: carrier.sortingLogic || 'chronological',
      combineAPS: carrier.combineAPS || false,
      combineAPSHyperlink: carrier.combineAPSHyperlink || false,
      indexer: carrier.indexer || false
    });
    setIsEditing(true);
    setEditId(carrier.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this carrier?')) {
      setCarriers(prev => prev.filter(carrier => carrier.id !== id));
      alert('Carrier deleted successfully!');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="space-y-4"
      >
        {/* Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative max-w-xs w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search carriers..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/20 focus:border-[#0f3f3f]"
            />
          </div>

          <Button variant="primary" onClick={openAddModal}>
            <Plus size={16} /> Add New Carrier
          </Button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Carrier Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Carrier Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Template Name</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCarriers.length > 0 ? (
                  paginatedCarriers.map((carrier) => (
                    <tr key={carrier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">{carrier.carrierName}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{carrier.carrierCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{carrier.templateName}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(carrier)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="opacity-50" />
                        <p>No carriers found</p>
                        <Button variant="primary" onClick={openAddModal}>
                          <Plus size={14} /> Add New Carrier
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCarriers.length)} of {filteredCarriers.length} entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded text-sm transition-colors ${currentPage === pageNum
                            ? 'bg-[#0f3f3f] text-white'
                            : 'text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal for Add/Edit Carrier */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditing ? 'Edit Carrier' : 'Add New Carrier'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Carrier Name, Carrier Code, Account Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Carrier Name"
              placeholder="Enter carrier name"
              value={formData.carrierName}
              onChange={(e) => updateField('carrierName', e.target.value)}
              error={errors.carrierName}
              required
            />
            <Input
              label="Carrier Code"
              placeholder="CAR001"
              value={formData.carrierCode}
              onChange={(e) => updateField('carrierCode', e.target.value)}
              error={errors.carrierCode}
              required
            />
            <Input
              label="Account Number"
              placeholder="ACC-12345"
              value={formData.accountNumber}
              onChange={(e) => updateField('accountNumber', e.target.value)}
            />
          </div>

          {/* Row 2: Product (wide) + Checkboxes (Carrier QC, ICD) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <Input
                label="Product"
                placeholder="Enter product name"
                value={formData.product}
                onChange={(e) => updateField('product', e.target.value)}
              />
            </div>
            <div className="lg:col-span-5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-gray-600 block mb-2">&nbsp;</label>
              <div className="flex flex-wrap gap-4 sm:gap-12">
                <Checkbox
                  label=" QC"
                  checked={formData.carrierQC}
                  onChange={(val) => updateField('carrierQC', val)}
                />
                <Checkbox
                  label="ICD"
                  checked={formData.icd}
                  onChange={(val) => updateField('icd', val)}
                />
              </div>
            </div>
          </div>

          {/* Row 3: Template Name (wide) + Sorting Logic (radio buttons) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-3">
            <div className="lg:col-span-7">
              <Input
                label="Template Name"
                placeholder="Enter template name"
                value={formData.templateName}
                onChange={(e) => updateField('templateName', e.target.value)}
                error={errors.templateName}
                required
              />
            </div>
            <div className="lg:col-span-5">
              <label className="text-[14px] font-semibold  tracking-wide text-gray-900 block mb-2">Sorting Logic</label>
              <div className="flex flex-wrap gap-4 sm:gap-8">
                <Radio
                  label="Chronological"
                  name="sortingLogic"
                  value="chronological"
                  checked={formData.sortingLogic === 'chronological'}
                  onChange={(val) => updateField('sortingLogic', val)}
                />
                <Radio
                  label="Reverse Chronological"
                  name="sortingLogic"
                  value="reverse"
                  checked={formData.sortingLogic === 'reverse'}
                  onChange={(val) => updateField('sortingLogic', val)}
                />
              </div>
            </div>
          </div>

          {/* Row 4: Checkboxes (Combine APS Summary & APS Document, Combine APS Summary & APS Hyperlink Document) */}
          <div className="flex flex-wrap gap-4 sm:gap-8 pt-2">
            <Checkbox
              label="Combine APS Summary & APS Document"
              checked={formData.combineAPS}
              onChange={(val) => updateField('combineAPS', val)}
            />
            <Checkbox
              label="Combine APS Summary & APS Hyperlink Document"
              checked={formData.combineAPSHyperlink}
              onChange={(val) => updateField('combineAPSHyperlink', val)}
            />
          </div>

          {/* Row 5: Indexer Checkbox */}
          <div className="pt-2">
            <Checkbox
              label="Indexer"
              checked={formData.indexer}
              onChange={(val) => updateField('indexer', val)}
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200 mt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">
              <Save size={14} />
              {isEditing ? 'Update Carrier' : 'Save Carrier'}
            </Button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CarrierSetupPanel;