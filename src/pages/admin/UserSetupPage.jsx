// src/pages/admin/UserSetupPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, ChevronLeft, ChevronRight, Search, Eye, ChevronDown } from 'lucide-react';

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

// Multi-Select Dropdown Component for Carriers with scroll only for carrier list
const MultiSelectDropdown = ({ label, options, selectedValues, onChange, placeholder, searchPlaceholder, required, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (value) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter(v => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    const removeSelected = (value) => {
        onChange(selectedValues.filter(v => v !== value));
    };

    return (
        <div className="flex flex-col gap-1.5 w-full" ref={dropdownRef}>
            {label && (
                <label className="text-[14px] font-semibold  tracking-wide text-gray-900">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {/* Selected carriers container - scrolls when many carriers selected */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`min-h-10 max-h-32 overflow-y-auto px-3 py-1.5 border rounded-lg bg-white cursor-pointer flex flex-wrap gap-1.5 items-center ${error ? 'border-red-500' : 'border-gray-300'}`}
                >
                    {selectedValues.length === 0 ? (
                        <span className="text-gray-400 text-sm">{placeholder || "Select carriers..."}</span>
                    ) : (
                        selectedValues.map(value => (
                            <span
                                key={value}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0f3f3f]/10 text-[#0f3f3f] rounded-full text-xs shrink-0"
                            >
                                <span className="max-w-[150px] truncate">{value}</span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSelected(value);
                                    }}
                                    className="hover:text-red-500"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))
                    )}
                </div>

                {isOpen && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                            <input
                                type="text"
                                placeholder={searchPlaceholder || "Search carriers..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0f3f3f]"
                            />
                        </div>
                        {/* Options container - scrolls when many options */}
                        <div className="py-1 max-h-48 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-400 text-center">No carriers found</div>
                            ) : (
                                filteredOptions.map(option => (
                                    <label
                                        key={option}
                                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedValues.includes(option)}
                                            onChange={() => toggleOption(option)}
                                            className="rounded border-gray-300 text-[#0f3f3f] focus:ring-[#0f3f3f]"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
        </div>
    );
};

// Reusable Toggle Switch Component with inline option
const ToggleSwitch = ({ label, subtext, checked, onChange, inline = false }) => {
    if (inline) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-[14px] font-semibold  tracking-wide text-gray-00">{label}</span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    onClick={() => onChange(!checked)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#001438] focus:ring-offset-2 ${checked ? 'bg-[#001438]' : 'bg-gray-300'}`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </button>
                {subtext && <span className="text-xs text-gray-500">{subtext}</span>}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-[14px] font-semibold uppercase tracking-wide text-gray-800">{label}</span>
                {subtext && <span className="text-xs text-gray-500 mt-0.5">{subtext}</span>}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#001438] focus:ring-offset-2 ${checked ? 'bg-[#001438]' : 'bg-gray-300'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
};

// Large Pill Button for Role Access in form
const LargeRolePill = ({ label, active, onClick }) => (
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

// Modal Component with proper scroll behavior
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
                className="bg-white rounded-xl shadow-2xl w-full max-w-7xl min-h-[600px] max-h-[99vh] overflow-y-auto"
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
// Table Cell with scroll for assigned carriers
const AssignedCarriersCell = ({ carriers }) => {
    const [showAll, setShowAll] = useState(false);
    const displayCarriers = showAll ? carriers : carriers.slice(0, 3);
    const hasMore = carriers.length > 3;

    return (
        <div className="px-3 sm:px-4 py-3">
            <div className="flex flex-wrap gap-1 max-w-[200px] sm:max-w-[250px]">
                {displayCarriers.map(carrier => (
                    <span key={carrier} className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium truncate max-w-[100px]">
                        {carrier}
                    </span>
                ))}
                {hasMore && !showAll && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                        +{carriers.length - 3} more
                    </button>
                )}
                {showAll && (
                    <button
                        onClick={() => setShowAll(false)}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                        Show less
                    </button>
                )}
            </div>
        </div>
    );
};

const UserSetupPanel = () => {
    // Get carriers from global state
    const [carrierOptions, setCarrierOptions] = useState([]);

    // Listen for carrier updates from CarrierSetupPanel
    useEffect(() => {
        // Initial load - get carrier names from global carriers
        const loadCarriers = () => {
            if (typeof window !== 'undefined' && window.__carriersData) {
                setCarrierOptions(window.__carriersData.map(c => c.carrierName));
            } else if (typeof window !== 'undefined' && window.carriersGlobal) {
                setCarrierOptions(window.carriersGlobal.map(c => c.carrierName));
            } else {
                // Fallback sample carriers
                setCarrierOptions(['ABC Insurance', 'XYZ Health', 'Global Care', 'United Health', 'Blue Cross', 'Aetna', 'Cigna', 'Humana']);
            }
        };

        loadCarriers();

        // Listen for updates
        const handleCarriersUpdate = (event) => {
            if (event.detail && event.detail.length > 0) {
                setCarrierOptions(event.detail.map(c => c.carrierName));
            }
        };

        window.addEventListener('carriersUpdated', handleCarriersUpdate);

        return () => {
            window.removeEventListener('carriersUpdated', handleCarriersUpdate);
        };
    }, []);

    // Form state for entry - Complete form with all fields
    const [formData, setFormData] = useState({
        empId: '',
        firstName: '',
        lastName: '',
        initial: '',
        userName: '',
        email: '',
        pageMin: '',
        pageMax: '',
        qcEnabled: false,
        userRoles: [],
        assignedCarriers: [],
        isActive: true
    });

    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Table data state with sample data including multiple carriers
    const [users, setUsers] = useState([
        {
            id: 1,
            empId: 'EMP001',
            firstName: 'John',
            lastName: 'Doe',
            initial: 'JD',
            userName: 'johndoe',
            email: 'john.doe@example.com',
            pageMin: '1',
            pageMax: '100',
            qcEnabled: true,
            userRoles: ['Admin'],
            assignedCarriers: ['ABC Insurance', 'XYZ Health'],
            isActive: true
        },
        {
            id: 2,
            empId: 'EMP002',
            firstName: 'Jane',
            lastName: 'Smith',
            initial: 'JS',
            userName: 'janesmith',
            email: 'jane.smith@example.com',
            pageMin: '1',
            pageMax: '200',
            qcEnabled: false,
            userRoles: ['Underwriter'],
            assignedCarriers: ['Global Care', 'United Health', 'Blue Cross', 'Aetna'],
            isActive: true
        },
        {
            id: 3,
            empId: 'EMP003',
            firstName: 'Robert',
            lastName: 'Brown',
            initial: 'RB',
            userName: 'robertb',
            email: 'robert.brown@example.com',
            pageMin: '10',
            pageMax: '500',
            qcEnabled: true,
            userRoles: ['Team Lead', 'Indexer'],
            assignedCarriers: ['Cigna', 'Humana'],
            isActive: false
        },
    ]);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userRoles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination calculation
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const roleOptions = ['Admin', 'Underwriter', 'Team Lead', 'Indexer'];

    const toggleRole = (role) => {
        setFormData(prev => {
            const currentRoles = [...prev.userRoles];
            if (currentRoles.includes(role)) {
                return { ...prev, userRoles: currentRoles.filter(r => r !== role) };
            } else {
                return { ...prev, userRoles: [...currentRoles, role] };
            }
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.empId.trim()) newErrors.empId = 'EMP ID is required';
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (isEditing && editId) {
            setUsers(prev => prev.map(user =>
                user.id === editId ? { ...formData, id: editId } : user
            ));
            alert('User updated successfully!');
        } else {
            const newUser = {
                ...formData,
                id: Date.now(),
            };
            setUsers(prev => [...prev, newUser]);
            alert('User added successfully!');
        }

        resetForm();
        setIsModalOpen(false);
    };

    const resetForm = () => {
        setFormData({
            empId: '',
            firstName: '',
            lastName: '',
            initial: '',
            userName: '',
            email: '',
            pageMin: '',
            pageMax: '',
            qcEnabled: false,
            userRoles: [],
            assignedCarriers: [],
            isActive: true
        });
        setIsEditing(false);
        setEditId(null);
        setErrors({});
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setFormData({
            empId: user.empId,
            firstName: user.firstName,
            lastName: user.lastName,
            initial: user.initial || '',
            userName: user.userName || '',
            email: user.email || '',
            pageMin: user.pageMin || '',
            pageMax: user.pageMax || '',
            qcEnabled: user.qcEnabled || false,
            userRoles: [...user.userRoles],
            assignedCarriers: user.assignedCarriers || [],
            isActive: user.isActive
        });
        setIsEditing(true);
        setEditId(user.id);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(user => user.id !== id));
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
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3f3f]/20 focus:border-[#0f3f3f]"
                        />
                    </div>

                    <Button variant="primary" onClick={openAddModal}>
                        <Plus size={16} /> Add New User
                    </Button>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-900">EMP ID</th>
                                    <th className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-900">First Name</th>
                                    <th className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-900">Last Name</th>
                                    <th className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-900">User Role Access</th>

                                    <th className="px-3 sm:px-4 py-3 text-center text-sm font-semibold text-gray-900">Is Active</th>
                                    <th className="px-3 sm:px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-3 sm:px-4 py-3 text-sm text-gray-800 font-medium">{user.empId}</td>
                                            <td className="px-3 sm:px-4 py-3 text-sm text-gray-800">{user.firstName}</td>
                                            <td className="px-3 sm:px-4 py-3 text-sm text-gray-800">{user.lastName}</td>
                                            <td className="px-3 sm:px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.userRoles.map(role => (
                                                        <span key={role} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="px-3 sm:px-4 py-3 text-center">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
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
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search size={32} className="opacity-50" />
                                                <p>No users found</p>
                                                <Button variant="primary" onClick={openAddModal}>
                                                    <Plus size={14} /> Add New User
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
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-3 sm:px-4 py-3 border-t border-gray-200 bg-gray-50">
                            <div className="text-xs sm:text-sm text-gray-500">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
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
                                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-xs sm:text-sm transition-colors ${currentPage === pageNum
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

            {/* Modal for Add/Edit User */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditing ? 'Edit User' : 'Add New User'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: EMP ID, FIRST NAME, LAST NAME, INITIAL, USER NAME */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <Input
                            label="EMP ID"
                            placeholder="EMP001"
                            value={formData.empId}
                            onChange={(e) => updateField('empId', e.target.value)}
                            error={errors.empId}
                            required
                        />
                        <Input
                            label="First Name"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            error={errors.firstName}
                            required
                        />
                        <Input
                            label="Last Name"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            error={errors.lastName}
                            required
                        />
                        <Input
                            label="Initial"
                            placeholder="JD"
                            value={formData.initial}
                            onChange={(e) => updateField('initial', e.target.value)}
                        />
                        <Input
                            label="User Name"
                            placeholder="johndoe"
                            value={formData.userName}
                            onChange={(e) => updateField('userName', e.target.value)}
                            error={errors.userName}
                            required
                        />
                    </div>

                    {/* Row 2: EMAIL ADDRESS + QC + PAGE RANGE */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                        <div className="lg:col-span-5">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="admin@example.com"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                error={errors.email}
                                required
                            />
                        </div>
                        <div className="lg:col-span-2 flex items-center pb-2 pl-4">
                            <ToggleSwitch
                                label="QC"
                                checked={formData.qcEnabled}
                                onChange={(val) => updateField('qcEnabled', val)}
                            />
                        </div>
                        <div className="lg:col-span-5">
                            <label className="text-[14px] font-semibold tracking-wide text-gray-900 block mb-1.5">
                                Page Range
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Min"
                                    value={formData.pageMin}
                                    onChange={(e) => updateField('pageMin', e.target.value)}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3f3f] focus:border-[#0f3f3f] text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Max"
                                    value={formData.pageMax}
                                    onChange={(e) => updateField('pageMax', e.target.value)}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f3f3f] focus:border-[#0f3f3f] text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Access & Carrier Assigned */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <div className="lg:col-span-7">
                            <label className="text-[14px] font-semibold  tracking-wide text-gray-900 block mb-2">
                                User Roles Access <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {roleOptions.map(role => (
                                    <LargeRolePill
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
                            <MultiSelectDropdown
                                label="Carriers Assigned"
                                placeholder="Select carriers..."
                                searchPlaceholder="Search carriers..."
                                options={carrierOptions}
                                selectedValues={formData.assignedCarriers}
                                onChange={(values) => updateField('assignedCarriers', values)}
                            />
                        </div>
                    </div>

                    {/* Status Toggle - inline layout */}
                    <div className="pt-1">
                        <ToggleSwitch
                            label="Is Active"
                            checked={formData.isActive}
                            onChange={(val) => updateField('isActive', val)}
                            inline={true}
                        />
                    </div>

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

export default UserSetupPanel;