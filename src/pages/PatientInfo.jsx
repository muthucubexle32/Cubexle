// src/pages/PatientInfo.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Shield, Briefcase, Calendar, ChevronDown, DollarSign, Building, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

const PatientInfo = ({ onLogout, toggleTheme, dark }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sourceFile, patientId, existingData, returnTo } = location.state || {};

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    secondName: '',
    dob: '',
    gender: 'Male',
    age: '',
    // Policy Details
    providerName: '',
    policyNumber: '',
    policyAmount: '',
    facility: '',
    // Professional & Additional Info
    applicationScope: 'Universal',
    occupation: '',
    employeeId: '',
    specialInstructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Load existing data if available
  useEffect(() => {
    if (existingData) {
      setFormData({
        firstName: existingData.firstName || '',
        secondName: existingData.secondName || '',
        dob: existingData.dob || '',
        gender: existingData.gender || 'Male',
        age: existingData.age || '',
        providerName: existingData.providerName || '',
        policyNumber: existingData.policyNumber || '',
        policyAmount: existingData.policyAmount || '',
        facility: existingData.facility || '',
        applicationScope: existingData.applicationScope || 'Universal',
        occupation: existingData.occupation || '',
        employeeId: existingData.employeeId || '',
        specialInstructions: existingData.specialInstructions || ''
      });
    }
  }, [existingData]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.secondName.trim()) newErrors.secondName = 'Second name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.providerName.trim()) newErrors.providerName = 'Provider name is required';
    if (!formData.policyNumber.trim()) newErrors.policyNumber = 'Policy number is required';
    if (!formData.policyAmount.trim()) newErrors.policyAmount = 'Policy amount is required';
    if (!formData.facility.trim()) newErrors.facility = 'Facility is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(`field-${firstErrorField}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage with patient info including sourceFile
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    savedData[patientId || sourceFile] = {
      ...formData,
      sourceFile,
      patientId,
      fullName: `${formData.firstName} ${formData.secondName}`,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('patientData', JSON.stringify(savedData));
    
    // Also save the current patient context for the tool page
    const currentPatient = {
      sourceFile: sourceFile,
      patientName: `${formData.firstName} ${formData.secondName}`,
      dob: formData.dob,
      gender: formData.gender,
      pages: '1-500',
      providerName: formData.providerName,
      policyNumber: formData.policyNumber
    };
    localStorage.setItem('currentPatient', JSON.stringify(currentPatient));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      // Navigate to Tool page (Index) after save
      navigate('/tool', { 
        state: { 
          message: `Patient information for ${sourceFile} saved successfully!`,
          patientData: currentPatient
        }
      });
    }, 1500);
  };

  const handleCancel = () => {
    if (returnTo === 'tool') {
      navigate('/tool');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <AppLayout onLogout={onLogout} toggleTheme={toggleTheme} dark={dark}>
      <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-[#f4f6f8]">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
                <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Patient Information</h1>
                  <p className="text-sm text-gray-500 mt-1">Source File: {sourceFile || 'New Entry'}</p>
                </div>
              </div>
              
              {showSuccess && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-fadeIn">
                  <CheckCircle size={18} />
                  <span className="text-sm font-medium">Saved successfully! Redirecting...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                  <div className="w-8 h-8 bg-[#0f3f3f]/10 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-[#0f3f3f]" />
                  </div>
                  <h4 className="text-[20px] font-semibold text-gray-900">Personal Information</h4>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div id="field-firstName">
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        FIRST NAME <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                        className={`w-full h-11 px-4 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all ${errors.firstName && touched.firstName ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && touched.firstName && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.firstName}
                        </p>
                      )}
                    </div>
                    
                    <div id="field-secondName">
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        SECOND NAME <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.secondName}
                        onChange={(e) => handleChange('secondName', e.target.value)}
                        onBlur={() => handleBlur('secondName')}
                        className={`w-full h-11 px-4 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all ${errors.secondName && touched.secondName ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="Enter second name"
                      />
                      {errors.secondName && touched.secondName && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.secondName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div id="field-dob">
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        DOB <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.dob}
                          onChange={(e) => handleChange('dob', e.target.value)}
                          onBlur={() => handleBlur('dob')}
                          className={`w-full h-11 px-4 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all ${errors.dob && touched.dob ? 'ring-2 ring-red-500' : ''}`}
                        />
                      </div>
                      {errors.dob && touched.dob && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.dob}
                        </p>
                      )}
                    </div>
                    
                    <div id="field-gender">
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        GENDER <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.gender}
                          onChange={(e) => handleChange('gender', e.target.value)}
                          onBlur={() => handleBlur('gender')}
                          className={`w-full h-11 px-4 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 appearance-none pr-10 transition-all ${errors.gender && touched.gender ? 'ring-2 ring-red-500' : ''}`}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.gender && touched.gender && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.gender}
                        </p>
                      )}
                    </div>
                    
                    <div id="field-age">
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        AGE <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        onBlur={() => handleBlur('age')}
                        className={`w-full h-11 px-4 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all ${errors.age && touched.age ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="Enter age"
                      />
                      {errors.age && touched.age && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.age}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: POLICY DETAILS */}
              <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                  <div className="w-8 h-8 bg-[#0f3f3f]/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#0f3f3f]" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-800">Policy Details</h4>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                    <div id="field-providerName">
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        PROVIDER NAME <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.providerName}
                        onChange={(e) => handleChange('providerName', e.target.value)}
                        onBlur={() => handleBlur('providerName')}
                        className={`w-full h-11 px-4 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all ${errors.providerName && touched.providerName ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="Enter provider name"
                      />
                      {errors.providerName && touched.providerName && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.providerName}
                        </p>
                      )}
                    </div>
                    
                    <div id="field-policyNumber">
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        POLICY NUMBER <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.policyNumber}
                        onChange={(e) => handleChange('policyNumber', e.target.value)}
                        onBlur={() => handleBlur('policyNumber')}
                        className={`w-full h-11 px-4 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all ${errors.policyNumber && touched.policyNumber ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="Enter policy number"
                      />
                      {errors.policyNumber && touched.policyNumber && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.policyNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div id="field-policyAmount">
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        POLICY AMOUNT <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.policyAmount}
                          onChange={(e) => handleChange('policyAmount', e.target.value)}
                          onBlur={() => handleBlur('policyAmount')}
                          className={`w-full pl-10 pr-4 h-11 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all ${errors.policyAmount && touched.policyAmount ? 'ring-2 ring-red-500' : ''}`}
                          placeholder="Enter policy amount"
                        />
                      </div>
                      {errors.policyAmount && touched.policyAmount && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.policyAmount}
                        </p>
                      )}
                    </div>
                    
                    <div id="field-facility">
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        FACILITY <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.facility}
                          onChange={(e) => handleChange('facility', e.target.value)}
                          onBlur={() => handleBlur('facility')}
                          className={`w-full pl-10 pr-4 h-11 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all ${errors.facility && touched.facility ? 'ring-2 ring-red-500' : ''}`}
                          placeholder="Enter facility name"
                        />
                      </div>
                      {errors.facility && touched.facility && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.facility}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: PROFESSIONAL & ADDITIONAL INFO */}
              <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                  <div className="w-8 h-8 bg-[#0f3f3f]/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-[#0f3f3f]" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-800">Professional & Additional Info</h4>
                </div>
                <div className="p-3 space-y-3">
                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                      APPLICATION SCOPE <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleChange('applicationScope', 'Universal')}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          formData.applicationScope === 'Universal'
                            ? 'bg-[#01154d] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Universal Scope
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('applicationScope', 'Specific')}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          formData.applicationScope === 'Specific'
                            ? 'bg-[#01154d] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Specific Scope
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        OCCUPATION
                      </label>
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => handleChange('occupation', e.target.value)}
                        className="w-full h-11 px-4 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all"
                        placeholder="Enter occupation"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                        EMPLOYEE ID
                      </label>
                      <input
                        type="text"
                        value={formData.employeeId}
                        onChange={(e) => handleChange('employeeId', e.target.value)}
                        className="w-full h-11 px-4 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all"
                        placeholder="Enter employee ID"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-wide text-gray-900 mb-2">
                      SPECIAL INSTRUCTIONS
                    </label>
                    <textarea
                      value={formData.specialInstructions}
                      onChange={(e) => handleChange('specialInstructions', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all resize-none"
                      placeholder="Enter any special instructions..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 pb-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#01154d] hover:bg-[#01154d] text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </AppLayout>
  );
};

export default PatientInfo;