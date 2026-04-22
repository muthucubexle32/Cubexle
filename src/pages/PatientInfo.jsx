// src/pages/PatientInfo.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User, Shield, Briefcase, Calendar, ChevronDown, DollarSign,
  Building, Save, ArrowLeft, CheckCircle, AlertCircle, FileText,
  Eye, Search, X, File, FolderOpen, Clock, User as UserIcon,
  Activity, Heart, Phone, Mail, MapPin, Maximize2, Download,
  Printer, RotateCcw, ZoomIn, ZoomOut, ChevronRight
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

const PatientInfo = ({ onLogout, toggleTheme, dark }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sourceFile, patientId, existingData, returnTo } = location.state || {};

  // State for selected PDF to view (no modal – opens in new tab)
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false); // kept for compatibility, not used
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfRotation, setPdfRotation] = useState(0);
  
  // State for dropdown
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    age: '',
    // Policy Details
    providerName: '',
    policyNumber: '',
    policyAmount: '',
    facility: '',
    // Professional & Additional Info
    applicationScopes: [], // array of selected scopes (Universal, Specific)
    occupation: '',
    employeeId: '',
    specialInstructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // PDF Source Files state - Grouped by source file name
  const [pdfGroups, setPdfGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);

  // Generate dummy PDF content for each source file
  const getDummyPdfContent = (sourceFileName, pdfItem) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .pdf-container { max-width: 800px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
          .pdf-header { background: linear-gradient(135deg, #0f3f3f, #1a5a5a); color: white; padding: 20px; }
          .pdf-content { padding: 30px; }
          .page { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .page-number { color: #666; font-size: 12px; text-align: center; margin-top: 20px; }
          h1 { font-size: 24px; margin: 0 0 10px 0; }
          h2 { font-size: 18px; color: #0f3f3f; border-bottom: 2px solid #0f3f3f; padding-bottom: 5px; margin-top: 20px; }
          .info-row { display: flex; margin-bottom: 10px; }
          .info-label { width: 150px; font-weight: bold; color: #555; }
          .info-value { flex: 1; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <div class="pdf-container">
          <div class="pdf-header">
            <h1>Medical Report</h1>
            <p>Source File: ${sourceFileName}</p>
            <p>Document: ${pdfItem?.documentType || 'Medical Report'}</p>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="pdf-content">
            <div class="page">
              <h2>Patient Information</h2>
              <div class="info-row">
                <div class="info-label">Patient Name:</div>
                <div class="info-value">${formData.firstName || 'John'} ${formData.lastName || 'Doe'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Date of Birth:</div>
                <div class="info-value">${formData.dob || '1990-01-01'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Gender:</div>
                <div class="info-value">${formData.gender || 'Not specified'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Age:</div>
                <div class="info-value">${formData.age || '35'} years</div>
              </div>
            </div>

            <div class="page">
              <h2>Policy Details</h2>
              <div class="info-row">
                <div class="info-label">Provider Name:</div>
                <div class="info-value">${formData.providerName || 'ABC Insurance'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Policy Number:</div>
                <div class="info-value">${formData.policyNumber || 'POL-2024-001'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Policy Amount:</div>
                <div class="info-value">$${formData.policyAmount || '100,000'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Facility:</div>
                <div class="info-value">${formData.facility || 'City Hospital'}</div>
              </div>
            </div>

            <div class="page">
              <h2>Document Details</h2>
              <div class="info-row">
                <div class="info-label">Document Type:</div>
                <div class="info-value">${pdfItem?.documentType || 'Medical Report'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Case Number:</div>
                <div class="info-value">${pdfItem?.caseNumber || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Uploaded Date:</div>
                <div class="info-value">${pdfItem?.uploadedDate ? new Date(pdfItem.uploadedDate).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>

            <div class="page-number">Page 1 of 1</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Load existing data and PDF source files
  useEffect(() => {
    if (existingData) {
      setFormData({
        firstName: existingData.firstName || '',
        lastName: existingData.lastName || '',
        dob: existingData.dob || '',
        gender: existingData.gender || '',
        age: existingData.age || '',
        providerName: existingData.providerName || '',
        policyNumber: existingData.policyNumber || '',
        policyAmount: existingData.policyAmount || '',
        facility: existingData.facility || '',
        applicationScopes: existingData.applicationScopes || [],
        occupation: existingData.occupation || '',
        employeeId: existingData.employeeId || '',
        specialInstructions: existingData.specialInstructions || ''
      });
    }

    // Load PDF source files from localStorage
    loadPdfSourceFiles();
  }, [existingData]);

  // Load PDF source files from localStorage and group them
  const loadPdfSourceFiles = () => {
    // Get all patient data
    const allPatients = JSON.parse(localStorage.getItem('patientData') || '{}');
    
    // Create a map to group PDFs by source file name
    const groupsMap = new Map();

    // Add from all patients (multiple PDFs per patient)
    Object.keys(allPatients).forEach(key => {
      const patient = allPatients[key];
      if (patient.sourceFile) {
        if (!groupsMap.has(patient.sourceFile)) {
          groupsMap.set(patient.sourceFile, {
            sourceFile: patient.sourceFile,
            patientName: patient.fullName || `${patient.firstName} ${patient.lastName}`,
            documents: []
          });
        }
        
        // Add document to the group
        groupsMap.get(patient.sourceFile).documents.push({
          id: key,
          documentType: ['Medical Report', 'Lab Results', 'Prescription', 'Insurance Claim', 'Discharge Summary', 'Referral Letter'][Math.floor(Math.random() * 6)],
          uploadedDate: patient.lastUpdated || new Date().toISOString(),
          pages: Math.floor(Math.random() * 50) + 10,
          caseNumber: patient.policyNumber || `CASE-${key.substring(0, 8)}`,
          status: 'Processed'
        });
      }
    });

    // Add current source file if not already in list
    if (sourceFile && !groupsMap.has(sourceFile)) {
      groupsMap.set(sourceFile, {
        sourceFile: sourceFile,
        patientName: `${formData.firstName} ${formData.lastName}` || 'Pending',
        documents: []
      });
      
      groupsMap.get(sourceFile).documents.push({
        id: Date.now(),
        documentType: 'Medical Report',
        uploadedDate: new Date().toISOString(),
        pages: 25,
        caseNumber: formData.policyNumber || 'New Case',
        status: 'Draft'
      });
    }

    // Add some dummy PDF files for demonstration
    if (groupsMap.size === 0) {
      const dummySourceFile = sourceFile || 'SRC-DOC-2024001';
      groupsMap.set(dummySourceFile, {
        sourceFile: dummySourceFile,
        patientName: `${formData.firstName || 'John'} ${formData.lastName || 'Doe'}`,
        documents: []
      });
      
      for (let i = 1; i <= 3; i++) {
        groupsMap.get(dummySourceFile).documents.push({
          id: `dummy-${i}`,
          documentType: ['Medical Report', 'Lab Results', 'Prescription'][i - 1],
          uploadedDate: new Date().toISOString(),
          pages: Math.floor(Math.random() * 100) + 10,
          caseNumber: `CASE-${2024}${String(i).padStart(4, '0')}`,
          status: 'Processed'
        });
      }
    }

    // Convert map to array
    const groups = Array.from(groupsMap.values());
    setPdfGroups(groups);
    setFilteredGroups(groups);
  };

  // Auto-calculate age from DOB (expects format MM-DD-YYYY)
  const calculateAgeFromDob = (dobStr) => {
    if (!dobStr) return '';
    // Parse MM-DD-YYYY
    const parts = dobStr.split('-');
    if (parts.length !== 3) return '';
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return '';
    const birthDate = new Date(year, month, day);
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month || birthDate.getDate() !== day) return '';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age.toString() : '';
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    // Gender is optional
    if (!formData.providerName.trim()) newErrors.providerName = 'Provider name is required';
    if (!formData.policyNumber.trim()) newErrors.policyNumber = 'Policy number is required';
    if (!formData.policyAmount.trim()) newErrors.policyAmount = 'Policy amount is required';
    if (!formData.facility.trim()) newErrors.facility = 'Facility is required';
    // Application scopes are optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    if (field === 'dob') {
      const calculatedAge = calculateAgeFromDob(value);
      setFormData(prev => ({
        ...prev,
        dob: value,
        age: calculatedAge
      }));
    } else if (field === 'gender') {
      setFormData(prev => ({ ...prev, gender: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Toggle application scope pill
  const toggleApplicationScope = (scope) => {
    setFormData(prev => {
      const current = [...prev.applicationScopes];
      if (current.includes(scope)) {
        return { ...prev, applicationScopes: current.filter(s => s !== scope) };
      } else {
        return { ...prev, applicationScopes: [...current, scope] };
      }
    });
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

    // Save to localStorage
    const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
    savedData[patientId || sourceFile] = {
      ...formData,
      sourceFile,
      patientId,
      fullName: `${formData.firstName} ${formData.lastName}`,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('patientData', JSON.stringify(savedData));

    // Save current patient context
    const currentPatient = {
      sourceFile: sourceFile,
      patientName: `${formData.firstName} ${formData.lastName}`,
      dob: formData.dob,
      gender: formData.gender,
      pages: '1-500',
      providerName: formData.providerName,
      policyNumber: formData.policyNumber,
      age: formData.age
    };
    localStorage.setItem('currentPatient', JSON.stringify(currentPatient));

    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      navigate('/tool', {
        state: {
          message: `Patient information for ${sourceFile} saved successfully!`,
          patientData: currentPatient
        }
      });
    }, 1500);
  };

  // Handle cancel - go back to dashboard
  const handleCancel = () => {
    navigate('/dashboard');
  };

  // Handle PDF view - opens PDF in a new tab
  const handleViewPdf = (pdfItem, sourceFileName) => {
    const pdfContent = getDummyPdfContent(sourceFileName, pdfItem);
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };

  // Filter PDF source files
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = pdfGroups.filter(group =>
      group.sourceFile.toLowerCase().includes(term.toLowerCase()) ||
      group.patientName.toLowerCase().includes(term.toLowerCase()) ||
      group.documents.some(doc => doc.documentType.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredGroups(filtered);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredGroups(pdfGroups);
  };

  // Toggle dropdown
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Get total documents count
  const getTotalDocuments = () => {
    return filteredGroups.reduce((total, group) => total + group.documents.length, 0);
  };

  return (
    <AppLayout onLogout={onLogout} toggleTheme={toggleTheme} dark={dark}>
      <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-[#f4f6f8]">
        <div className="py-4 px-3 sm:py-6 sm:px-6 lg:py-8 lg:px-8 xl:py-8 xl:px-8">
          <div className="max-w-[1600px] mx-auto w-full">
            {/* Header */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Back</span>
                </button>
                <div className="h-6 sm:h-8 w-px bg-gray-300 hidden sm:block"></div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Patient Information</h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Source file: {sourceFile || 'New entry'}</p>
                </div>
              </div>

              {showSuccess && (
                <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-fadeIn">
                  <CheckCircle size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium">Saved successfully! Redirecting...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* ROW 1: Personal Information + Policy Details (2 columns) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {/* SECTION 1: PERSONAL INFORMATION */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 border-b border-gray-100 bg-gray-50/30">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0f3f3f]/10 rounded-lg flex items-center justify-center">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0f3f3f]" />
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800">Personal information</h4>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div id="field-firstName">
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          First name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          onBlur={() => handleBlur('firstName')}
                          className={`w-full h-9 sm:h-10 px-2 sm:px-3 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all text-xs sm:text-sm ${errors.firstName && touched.firstName ? 'ring-2 ring-red-500' : ''}`}
                          placeholder="Enter first name"
                        />
                        {errors.firstName && touched.firstName && (
                          <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={10} className="sm:w-3 sm:h-3" /> {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div id="field-lastName">
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          Last name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          onBlur={() => handleBlur('lastName')}
                          className={`w-full h-9 sm:h-10 px-2 sm:px-3 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all text-xs sm:text-sm ${errors.lastName && touched.lastName ? 'ring-2 ring-red-500' : ''}`}
                          placeholder="Enter last name"
                        />
                        {errors.lastName && touched.lastName && (
                          <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={10} className="sm:w-3 sm:h-3" /> {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div id="field-dob">
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          Date of birth <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="MM-DD-YYYY"
                            value={formData.dob}
                            onChange={(e) => handleChange('dob', e.target.value)}
                            onBlur={() => handleBlur('dob')}
                            className={`w-full h-9 sm:h-10 px-2 sm:px-3 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all text-xs sm:text-sm ${errors.dob && touched.dob ? 'ring-2 ring-red-500' : ''}`}
                          />
                          <Calendar className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.dob && touched.dob && (
                          <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errors.dob}</p>
                        )}
                      </div>

                      <div id="field-gender">
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          Gender
                        </label>
                        <div className="relative">
                          <select
                            value={formData.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            onBlur={() => handleBlur('gender')}
                            className={`w-full h-9 sm:h-10 px-2 sm:px-3 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 appearance-none pr-6 sm:pr-8 transition-all text-xs sm:text-sm ${errors.gender && touched.gender ? 'ring-2 ring-red-500' : ''}`}
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.gender && touched.gender && (
                          <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errors.gender}</p>
                        )}
                      </div>

                      <div id="field-age">
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          Age <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.age}
                          readOnly
                          className="w-full h-9 sm:h-10 px-2 sm:px-3 rounded-lg text-gray-800 cursor-default text-xs sm:text-sm bg-gray-100"
                          placeholder="Auto-age from DOB"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: POLICY DETAILS */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 border-b border-gray-100 bg-gray-50/30">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0f3f3f]/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0f3f3f]" />
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800">Policy details</h4>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div id="field-providerName">
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          Provider name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.providerName}
                          onChange={(e) => handleChange('providerName', e.target.value)}
                          onBlur={() => handleBlur('providerName')}
                          className={`w-full h-9 sm:h-10 px-2 sm:px-3 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all text-xs sm:text-sm ${errors.providerName && touched.providerName ? 'ring-2 ring-red-500' : ''}`}
                          placeholder="Enter provider name"
                        />
                        {errors.providerName && touched.providerName && (
                          <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errors.providerName}</p>
                        )}
                      </div>

                      <div id="field-policyNumber">
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          Policy number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.policyNumber}
                          onChange={(e) => handleChange('policyNumber', e.target.value)}
                          onBlur={() => handleBlur('policyNumber')}
                          className={`w-full h-9 sm:h-10 px-2 sm:px-3 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all text-xs sm:text-sm ${errors.policyNumber && touched.policyNumber ? 'ring-2 ring-red-500' : ''}`}
                          placeholder="Enter policy number"
                        />
                        {errors.policyNumber && touched.policyNumber && (
                          <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errors.policyNumber}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div id="field-policyAmount">
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          Policy amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.policyAmount}
                            onChange={(e) => handleChange('policyAmount', e.target.value)}
                            onBlur={() => handleBlur('policyAmount')}
                            className={`w-full pl-7 sm:pl-9 pr-2 sm:pr-3 h-9 sm:h-10 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all text-xs sm:text-sm ${errors.policyAmount && touched.policyAmount ? 'ring-2 ring-red-500' : ''}`}
                            placeholder="Enter policy amount"
                          />
                        </div>
                        {errors.policyAmount && touched.policyAmount && (
                          <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errors.policyAmount}</p>
                        )}
                      </div>

                      <div id="field-facility">
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          Facility <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.facility}
                            onChange={(e) => handleChange('facility', e.target.value)}
                            onBlur={() => handleBlur('facility')}
                            className={`w-full pl-7 sm:pl-9 pr-2 sm:pr-3 h-9 sm:h-10 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all text-xs sm:text-sm ${errors.facility && touched.facility ? 'ring-2 ring-red-500' : ''}`}
                            placeholder="Enter facility name"
                          />
                        </div>
                        {errors.facility && touched.facility && (
                          <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errors.facility}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 2: Professional Info + PDF Source Files (2 columns) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {/* SECTION 3: PROFESSIONAL & ADDITIONAL INFO */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-[380px] sm:h-[400px] md:h-[420px]">
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 border-b border-gray-100 bg-gray-50/30 flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0f3f3f]/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0f3f3f]" />
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800">Professional & additional info</h4>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1.5 sm:mb-2">
                        Application scope
                      </label>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => toggleApplicationScope('Universal')}
                          className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                            formData.applicationScopes.includes('Universal')
                              ? 'bg-[#0f3f3f] text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Universal scope
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleApplicationScope('Specific')}
                          className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                            formData.applicationScopes.includes('Specific')
                              ? 'bg-[#0f3f3f] text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Specific scope
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          Occupation
                        </label>
                        <input
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => handleChange('occupation', e.target.value)}
                          className="w-full h-9 sm:h-10 px-2 sm:px-3 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all text-xs sm:text-sm"
                          placeholder="Enter occupation"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                          Employee ID
                        </label>
                        <input
                          type="text"
                          value={formData.employeeId}
                          onChange={(e) => handleChange('employeeId', e.target.value)}
                          className="w-full h-9 sm:h-10 px-2 sm:px-3 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all text-xs sm:text-sm"
                          placeholder="Enter employee ID"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wide text-gray-500 mb-1 sm:mb-1.5">
                        Special instructions
                      </label>
                      <textarea
                        value={formData.specialInstructions}
                        onChange={(e) => {
                          handleChange('specialInstructions', e.target.value);
                          const textarea = e.target;
                          textarea.style.height = 'auto';
                          textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
                        }}
                        rows={5}
                        className="w-full px-2 sm:px-3 py-2 bg-[#e8f0f3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:bg-[#e0eaf0] text-gray-800 transition-all resize-none text-xs sm:text-sm"
                        placeholder="Enter any special instructions..."
                        style={{ minHeight: '80px', maxHeight: '130px', overflowY: 'auto' }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: PDF SOURCE FILES WITH DROPDOWN */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-[380px] sm:h-[400px] md:h-[420px]">
                  <div className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 border-b border-gray-100 bg-gray-50/30 flex-shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0f3f3f]/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0f3f3f]" />
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-800">PDF source files</h4>
                      <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                        {getTotalDocuments()} documents
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-32 sm:w-48 md:w-56 h-7 sm:h-8 px-2 sm:px-3 pr-6 sm:pr-8 text-xs sm:text-sm bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/30 focus:border-[#0f3f3f]"
                      />
                      {searchTerm ? (
                        <X
                          size={12}
                          className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                          onClick={clearSearch}
                        />
                      ) : (
                        <Search
                          size={12}
                          className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="divide-y divide-gray-100">
                      {filteredGroups.length > 0 ? (
                        filteredGroups.map((group, groupIndex) => (
                          <div key={group.sourceFile} className="border-b border-gray-100 last:border-b-0">
                            {/* Source File Header - Clickable to expand/collapse */}
                            <button
                              onClick={() => toggleDropdown(groupIndex)}
                              className="w-full px-3 sm:px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <FolderOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <div className="flex-1 text-left">
                                  <span className="text-sm font-semibold text-gray-800">{group.sourceFile}</span>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {group.patientName} • {group.documents.length} document(s)
                                  </div>
                                </div>
                              </div>
                              <ChevronRight 
                                size={16} 
                                className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${openDropdownId === groupIndex ? 'rotate-90' : ''}`}
                              />
                            </button>
                            
                            {/* Dropdown Content - Documents List */}
                            {openDropdownId === groupIndex && (
                              <div className="bg-gray-50/50 pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 space-y-1">
                                {group.documents.map((doc, docIndex) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between py-2 px-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      <File className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                      <div className="flex-1">
                                        <div className="text-xs font-medium text-gray-700">{doc.documentType}</div>
                                        <div className="text-[10px] text-gray-400">
                                          Case: {doc.caseNumber} • {doc.pages} pages • {new Date(doc.uploadedDate).toLocaleDateString()}
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleViewPdf(doc, group.sourceFile)}
                                      className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                      title="View PDF"
                                    >
                                      <Eye size={14} />
                                      <span className="text-xs">View</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <FolderOpen size={32} className="opacity-50" />
                            <p className="text-sm">No PDF source files found</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {filteredGroups.length > 0 && (
                    <div className="px-3 sm:px-4 py-1.5 border-t border-gray-100 bg-gray-50 text-[10px] sm:text-xs text-gray-500 flex-shrink-0">
                      Showing {filteredGroups.length} source file(s) with {getTotalDocuments()} total document(s)
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 pb-2 sm:pb-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 sm:px-5 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 sm:px-5 py-1.5 sm:py-2 bg-[#0f3f3f] hover:bg-[#0a2f2f] text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 font-medium text-xs sm:text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} className="sm:w-4 sm:h-4" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal is removed – now opens in new tab */}

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