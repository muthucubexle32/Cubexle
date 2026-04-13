import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../../components/layout/AppLayout';

// Reusable Input Component
const Input = ({ label, type = "text", placeholder, value, onChange, required, error, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label className="text-[14px] font-semibold uppercase tracking-wide text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/20 focus:border-[#010c3d] transition-all duration-200 text-sm bg-white ${error ? 'border-red-500' : 'border-gray-400 shadow-md'
        } ${className}`}
    />
    {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
  </div>
);

// Reusable Toggle Switch Component
const Toggle = ({ label, subtext, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex flex-col">
      <span className="text-[16px] font-semibold uppercase tracking-wide text-gray-900">{label}</span>
      {subtext && <span className="text-sm text-gray-900 mt-0.5">{subtext}</span>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#001438] focus:ring-offset-2 ${checked ? 'bg-[#001438]' : 'bg-gray-300'
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  </div>
);

// Pill Button for Role Access - Updated for multi-select
const RolePill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 sm:px-8 md:px-10 py-2 rounded-full text-sm font-medium transition-all duration-200 transform ${active
      ? 'bg-[#001438] text-white shadow-md'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}
  >
    {label}
  </button>
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
    <span className="text-[14px] sm:text-[16px] font-semibold uppercase tracking-wide text-gray-900 group-hover:text-gray-900 transition-colors pt-0.5">{label}</span>
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
    <span className="text-[12px] sm:text-[14px] font-semibold uppercase tracking-wide text-gray-900 group-hover:text-gray-900 transition-colors">{label}</span>
  </label>
);

// Button Component with Ripple Effect
const Button = ({ children, variant = "primary", onClick, type = "button" }) => {
  const [ripple, setRipple] = useState(null);

  const handleClick = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipple({ x, y });
    setTimeout(() => setRipple(null), 500);

    if (onClick) onClick(e);
  };

  const variants = {
    primary: "bg-[#0f3f3f] text-white hover:bg-[#0a2f2f] shadow-sm hover:shadow-md",
    secondary: "bg-white border border-gray-500 text-gray-700 hover:bg-gray-50",
    success: "bg-[#16a34a] text-white hover:bg-[#15803d] shadow-sm hover:shadow-md"
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`relative overflow-hidden px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 active:scale-95 ${variants[variant]}`}
    >
      {children}
      {ripple && (
        <span
          className="absolute pointer-events-none bg-white/30 rounded-full animate-ripple"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 80,
            height: 80,
          }}
        />
      )}
    </button>
  );
};

// User Setup Panel - Updated for multi-select role access
const UserSetupPanel = () => {
  const [formData, setFormData] = useState({
    empId: '', firstName: '', lastName: '', initial: '', userName: '',
    email: '', pageMin: '', pageMax: '', qcEnabled: false,
    userRoles: ['Admin'], // Changed from single userRole to array userRoles
    carrierSearch: '', isActive: true
  });
  const [errors, setErrors] = useState({});
  const [carrierSearch, setCarrierSearch] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.empId) newErrors.empId = 'EMP ID is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.userName) newErrors.userName = 'Username is required';
    if (formData.userRoles.length === 0) newErrors.userRoles = 'At least one role must be selected';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Handle role toggle for multi-select
  const toggleRole = (role) => {
    setFormData(prev => {
      const currentRoles = [...prev.userRoles];
      if (currentRoles.includes(role)) {
        // Remove role if already selected
        const updatedRoles = currentRoles.filter(r => r !== role);
        return { ...prev, userRoles: updatedRoles };
      } else {
        // Add role if not selected
        return { ...prev, userRoles: [...currentRoles, role] };
      }
    });
    if (errors.userRoles) setErrors(prev => ({ ...prev, userRoles: '' }));
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log('Saving user profile:', formData);
      alert(`User profile saved successfully!\nSelected Roles: ${formData.userRoles.join(', ')}`);
    }
  };

  const handleReset = () => {
    setFormData({
      empId: '', firstName: '', lastName: '', initial: '', userName: '',
      email: '', pageMin: '', pageMax: '', qcEnabled: false,
      userRoles: ['Admin'], // Reset to default
      carrierSearch: '', isActive: true
    });
    setCarrierSearch('');
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Row 1: EMP ID, FIRST NAME, LAST NAME, INITIAL, USER NAME */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <Input
            label="EMP ID"
            placeholder="EMP001"
            value={formData.empId}
            onChange={(e) => updateField('empId', e.target.value)}
            error={errors.empId}
            required
          />
          <Input
            label="FIRST NAME"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            error={errors.firstName}
            required
          />
          <Input
            label="LAST NAME"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            error={errors.lastName}
            required
          />
          <Input
            label="INITIAL"
            placeholder="JD"
            value={formData.initial}
            onChange={(e) => updateField('initial', e.target.value)}
          />
          <Input
            label="USER NAME"
            placeholder="johndoe"
            value={formData.userName}
            onChange={(e) => updateField('userName', e.target.value)}
            error={errors.userName}
            required
          />
        </div>

        {/* Row 2: EMAIL ADDRESS + QC + PAGE RANGE - Responsive */}
        <div className="space-y-4 lg:space-y-0">
          {/* Mobile/Tablet: Stacked layout */}
          <div className="block lg:hidden space-y-4">
            <Input
              label="EMAIL ADDRESS"
              type="email"
              placeholder="@admin.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold uppercase tracking-wide text-gray-900">QC</span>
              <Toggle
                label=""
                checked={formData.qcEnabled}
                onChange={(val) => updateField('qcEnabled', val)}
              />
            </div>
            <div>
              <label className="text-[14px] font-semibold uppercase tracking-wide text-gray-900 block mb-1.5">
                PAGE RANGE
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Min"
                  value={formData.pageMin}
                  onChange={(e) => updateField('pageMin', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0f3f3f] focus:border-[#0f3f3f] text-sm"
                />
                <input
                  type="text"
                  placeholder="Max"
                  value={formData.pageMax}
                  onChange={(e) => updateField('pageMax', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0f3f3f] focus:border-[#0f3f3f] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-5">
              <Input
                label="EMAIL ADDRESS"
                type="email"
                placeholder="@admin.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>
            <div className="lg:col-span-2 flex items-center pb-2 pl-8">
              <Toggle
                label="QC"
                checked={formData.qcEnabled}
                onChange={(val) => updateField('qcEnabled', val)}
              />
            </div>
            <div className="lg:col-span-5">
              <label className="text-[14px] font-semibold uppercase tracking-wide text-gray-900 block mb-1.5">
                PAGE RANGE
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Min"
                  value={formData.pageMin}
                  onChange={(e) => updateField('pageMin', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0f3f3f] focus:border-[#0f3f3f] text-sm"
                />
                <input
                  type="text"
                  placeholder="Max"
                  value={formData.pageMax}
                  onChange={(e) => updateField('pageMax', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0f3f3f] focus:border-[#0f3f3f] text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Role Access & Carrier Assigned - Responsive */}
        <div className="space-y-4 lg:space-y-0">
          {/* Mobile/Tablet: Stacked */}
          <div className="block lg:hidden space-y-4">
            <div>
              <label className="text-[14px] font-semibold uppercase tracking-wide text-gray-900 block mb-1.5">
                USER ROLE ACCESS
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {['Admin', 'Underwriter', 'Team Lead', 'Indexer'].map(role => (
                  <RolePill
                    key={role}
                    label={role}
                    active={formData.userRoles.includes(role)}
                    onClick={() => toggleRole(role)}
                  />
                ))}
              </div>
              {errors.userRoles && (
                <p className="text-xs text-red-500 mt-1">{errors.userRoles}</p>
              )}
            </div>
            <div>
              <label className="text-[14px] font-semibold uppercase tracking-wide text-gray-900 block mb-1.5">
                CARRIER ASSIGNED
              </label>
              <div className="relative group">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-900 group-hover:text-gray-900 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={carrierSearch}
                  onChange={(e) => setCarrierSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/20 focus:border-[#0f3f3f] text-sm transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-1">
            <div className="lg:col-span-7">
              <label className="text-[14px] font-semibold uppercase tracking-wide text-gray-900 block mb-1.5">
                USER ROLE ACCESS
              </label>
              <div className="flex flex-wrap gap-3">
                {['Admin', 'Underwriter', 'Team Lead', 'Indexer'].map(role => (
                  <RolePill
                    key={role}
                    label={role}
                    active={formData.userRoles.includes(role)}
                    onClick={() => toggleRole(role)}
                  />
                ))}
              </div>
              {errors.userRoles && (
                <p className="text-xs text-red-500 mt-1">{errors.userRoles}</p>
              )}
            </div>
            <div className="lg:col-span-5">
              <label className="text-[14px] font-semibold uppercase tracking-wide text-gray-900 block mb-1.5">
                CARRIER ASSIGNED
              </label>
              <div className="relative group">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-900 group-hover:text-gray-900 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={carrierSearch}
                  onChange={(e) => setCarrierSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/20 focus:border-[#0f3f3f] text-sm transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Toggle */}
        <div className="pt-2">
          <Toggle
            label="Is Active"
            subtext="User will have immediate system access"
            checked={formData.isActive}
            onChange={(val) => updateField('isActive', val)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="success" onClick={handleReset}>Reset Changes</Button>
          <Button variant="primary" onClick={handleSave}>Save Profile</Button>
        </div>
      </div>
    </motion.div>
  );
};

// Carrier Setup Panel
const CarrierSetupPanel = () => {
  const [formData, setFormData] = useState({
    carrierName: '', carrierCode: '', accountNumber: '', product: '',
    carrierQC: false, icd: false, templateName: '', sortingLogic: 'chronological',
    combineAPS: false, indexer: false
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.carrierName) newErrors.carrierName = 'Carrier name is required';
    if (!formData.carrierCode) newErrors.carrierCode = 'Carrier code is required';
    if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
    if (!formData.templateName) newErrors.templateName = 'Template name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log('Saving carrier setup:', formData);
      alert('Carrier setup saved successfully!');
    }
  };

  const handleReset = () => {
    setFormData({
      carrierName: '', carrierCode: '', accountNumber: '', product: '',
      carrierQC: false, icd: false, templateName: '', sortingLogic: 'chronological',
      combineAPS: false, indexer: false
    });
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Row 1: Carrier Name, Carrier Code, Account Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Input
            label="CARRIER NAME"
            placeholder="Enter carrier name"
            value={formData.carrierName}
            onChange={(e) => updateField('carrierName', e.target.value)}
            error={errors.carrierName}
            required
          />
          <Input
            label="CARRIER CODE"
            placeholder="CAR001"
            value={formData.carrierCode}
            onChange={(e) => updateField('carrierCode', e.target.value)}
            error={errors.carrierCode}
            required
          />
          <Input
            label="ACCOUNT NUMBER"
            placeholder="ACC-12345"
            value={formData.accountNumber}
            onChange={(e) => updateField('accountNumber', e.target.value)}
            error={errors.accountNumber}
            required
          />
        </div>

        {/* Row 2: Product, Checkboxes - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-20">
          <div className="flex-1">
            <Input
              label="PRODUCT"
              placeholder="Product name"
              value={formData.product}
              onChange={(e) => updateField('product', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-[14px] font-semibold uppercase tracking-wide text-gray-900 hidden sm:block">&nbsp;</label>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Checkbox
                label="Carrier QC"
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

        {/* Row 3: Template Name, Sorting Logic - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-20">
          <div className="flex-1">
            <Input
              label="TEMPLATE NAME"
              placeholder="Template name"
              value={formData.templateName}
              onChange={(e) => updateField('templateName', e.target.value)}
              error={errors.templateName}
              required
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[14px] font-semibold uppercase tracking-wide text-gray-900">SORTING LOGIC</label>
            <div className="flex flex-wrap gap-4 sm:gap-12">
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

        {/* Row 4: Additional Checkboxes */}
        <div className="flex flex-wrap gap-2 sm:gap-4 pt-2">
          <Checkbox
            label="Combine APS Summary & APS Document"
            checked={formData.combineAPS}
            onChange={(val) => updateField('combineAPS', val)}
          />
          <Checkbox
            label="Indexer"
            checked={formData.indexer}
            onChange={(val) => updateField('indexer', val)}
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={handleReset}>Reset</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </motion.div>
  );
};

// Main AdminSetupPage Component
const AdminSetupPage = ({ onLogout }) => {
  const [activePanel, setActivePanel] = useState('user');

  return (
    <AppLayout onLogout={onLogout}>
      <div className="min-h-screen bg-[#f4f6f8] py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Admin Setup</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Configure users and carrier settings</p>
          </div>

          {/* Segmented Toggle Control - Responsive */}
          <div className="flex justify-start mb-4 sm:mb-6 md:mb-8 overflow-x-auto pb-2">
            <div className="inline-flex bg-gray-200 p-1 rounded-lg border shadow-sm">
              <button
                onClick={() => setActivePanel('user')}
                className={`relative px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                  activePanel === 'user'
                    ? 'bg-white text-[#0f3f3f] shadow-sm'
                    : 'text-gray-900 hover:text-gray-800'
                }`}
              >
                User Setup
              </button>
              <button
                onClick={() => setActivePanel('carrier')}
                className={`relative px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                  activePanel === 'carrier'
                    ? 'bg-white text-[#0f3f3f] shadow-sm'
                    : 'text-gray-900 hover:text-gray-800'
                }`}
              >
                Carrier Setup
              </button>
            </div>
          </div>

          {/* Animated Panel Container */}
          <div className="overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-240px)] overflow-x-hidden">
            <AnimatePresence mode="wait">
              {activePanel === 'user' ? <UserSetupPanel key="user" /> : <CarrierSetupPanel key="carrier" />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add ripple animation CSS */}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.5s linear forwards;
        }
        
        /* Custom scrollbar for better UX */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </AppLayout>
  );
};

export default AdminSetupPage;