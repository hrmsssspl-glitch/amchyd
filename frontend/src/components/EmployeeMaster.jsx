import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Download, Upload, FileText, Search, X, Loader, RefreshCw, FileSpreadsheet, Building2, Paperclip } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EmployeeMaster = () => {
    const { user } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');

    const [states, setStates] = useState([]);
    const [allBranches, setAllBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [roles, setRoles] = useState([]);

    const defaultFormData = {
        employeeId: '',
        employeeName: '',
        surname: '',
        fatherName: '',
        motherName: '',
        nationality: '',
        religion: '',
        status: 'Active',
        gender: '',
        dateOfJoining: '',
        dateOfBirth: '',
        designation: '',
        department: '',
        aadharNo: '',
        panNo: '',
        contactNumber: '',
        alternateContactNumber: '',
        personalMailId: '',
        officialMailId: '',
        reportingManager: '',
        employmentRole: '',
        presentAddress: '',
        permanentAddress: '',
        permanentAddressContact: '',
        drivingLicenseNo: '',
        maritalStatus: '',
        marriageDate: '',
        anyPhysicalDisabilities: '',
        bankName: '',
        bankAccountNo: '',
        bankBranch: '',
        ifscCode: '',
        qualifications: [{ board: '', specialization: '', passingYear: '' }],
        previousExperience: [{ employerName: '', designation: '', periodFrom: '', periodTo: '', totalExperience: '', responsibilities: '', salary: '', referenceName: '', referenceMobile: '' }],
        jobDescription: '',
        familyMembers: [{ name: '', relationship: '', dob: '', occupation: '' }],
        emergencyContacts: [{ contactPerson: '', relation: '', address: '', mobileNumber: '' }],
        bloodGroup: '',
        allergic: '',
        bloodPressure: '',
        sugarLevel: '',
        eyeSight: '',
        majorIllness: '',
        languages: { telugu: false, english: false, hindi: false },
        state: '',
        assignedBranches: [],

        // New Attachment Fields
        bioDataPath: '',
        aadharUploadPath: '',
        panUploadPath: '',
        personalPhotoPath: '',
        familyPhotoPath: '',
        educationalCertificatesPath: '',
        technicalCertificatesPath: '',
        bankStatementPath: '',
        isCustomDept: false,
        isCustomRole: false
    };

    const [formData, setFormData] = useState(defaultFormData);

    const isAdmin = ['Super Admin', 'Admin'].includes(user.role);

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };

                const { data: statesData } = await axios.get('/api/hrms/organization/states', config);
                setStates(statesData);

                const { data: branchesData } = await axios.get('/api/hrms/organization/branches', config);
                setAllBranches(branchesData);

                const { data: deptsData } = await axios.get('/api/hrms/metadata?type=designation', config);
                setDesignations(deptsData);

                const { data: rolesData } = await axios.get('/api/hrms/metadata?type=role', config);
                setRoles(rolesData);

                const { data: customDepts } = await axios.get('/api/hrms/metadata?type=department', config);
                setDepartments(customDepts);

            } catch (error) {
                console.error('Error fetching master data:', error);
            }
        };
        if (user?.token) fetchMasterData();
    }, [user?.token]);

    const handleBranchToggle = (branchName) => {
        const currentBranches = formData.assignedBranches || [];
        if (currentBranches.includes(branchName)) {
            setFormData({ ...formData, assignedBranches: currentBranches.filter(b => b !== branchName) });
        } else {
            setFormData({ ...formData, assignedBranches: [...currentBranches, branchName] });
        }
    };

    const addArrayItem = (field, itemTemplate) => {
        setFormData({ ...formData, [field]: [...formData[field], { ...itemTemplate }] });
    };

    const removeArrayItem = (field, index) => {
        const list = [...formData[field]];
        if (list.length > 1) {
            list.splice(index, 1);
            setFormData({ ...formData, [field]: list });
        }
    };

    const handleArrayChange = (field, index, subField, value) => {
        const list = [...formData[field]];
        list[index][subField] = value;
        setFormData({ ...formData, [field]: list });
    };

    const handleFileChange = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post('/api/upload', uploadData, config);
            setFormData({ ...formData, [field]: data.filePath });
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [page, searchTerm, filterDept]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/employees?pageNumber=${page}&searchTerm=${searchTerm}&department=${filterDept}`, config);
            setEmployees(data.employees);
            setPages(data.pages);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side duplicate check (basic check against current page data)
        if (!editMode) {
            const duplicate = employees.find(emp => emp.employeeId === formData.employeeId);
            if (duplicate) {
                alert(`Error: Employee ID ${formData.employeeId} already exists in the current view.`);
                return;
            }
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editMode) {
                await axios.put(`/api/employees/${selectedId}`, formData, config);
            } else {
                await axios.post('/api/employees', formData, config);
            }
            setShowForm(false);
            resetForm();
            fetchEmployees();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving employee');
        }
    };

    const fetchNextId = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/employees/next-id', config);
            setFormData(prev => ({ ...prev, employeeId: data.nextId }));
        } catch (error) {
            console.error('Error fetching next ID:', error);
        }
    };

    const handleAddClick = () => {
        resetForm();
        setShowForm(true);
        fetchNextId();
    };

    const handleEdit = (emp) => {
        const standardDepts = ['Sales', 'Service', 'Finance & Accounts', 'HR', 'Admin', 'Management'];
        const standardRoles = ['On Roll', 'Off roll', 'Railway', 'Contract'];

        setFormData({
            ...defaultFormData,
            ...emp,
            dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.split('T')[0] : '',
            dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '',
            marriageDate: emp.marriageDate ? emp.marriageDate.split('T')[0] : '',
            qualifications: emp.qualifications && emp.qualifications.length > 0 ? emp.qualifications : defaultFormData.qualifications,
            previousExperience: emp.previousExperience && emp.previousExperience.length > 0 ? emp.previousExperience.map(exp => ({
                ...exp,
                periodFrom: exp.periodFrom ? exp.periodFrom.split('T')[0] : '',
                periodTo: exp.periodTo ? exp.periodTo.split('T')[0] : ''
            })) : defaultFormData.previousExperience,
            familyMembers: emp.familyMembers && emp.familyMembers.length > 0 ? emp.familyMembers.map(fm => ({
                ...fm,
                dob: fm.dob ? fm.dob.split('T')[0] : ''
            })) : defaultFormData.familyMembers,
            emergencyContacts: emp.emergencyContacts && emp.emergencyContacts.length > 0 ? emp.emergencyContacts : defaultFormData.emergencyContacts,
            languages: emp.languages || defaultFormData.languages,
            isCustomDept: emp.department && !standardDepts.includes(emp.department),
            isCustomRole: emp.employmentRole && !standardRoles.includes(emp.employmentRole)
        });
        setSelectedId(emp._id);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/employees/${id}`, config);
                fetchEmployees();
            } catch (error) {
                alert('Error deleting employee');
            }
        }
    };

    const resetForm = () => {
        setFormData(defaultFormData);
        setEditMode(false);
        setSelectedId(null);
    };

    const handleExport = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const { data } = await axios.get(`/api/employees/export?searchTerm=${searchTerm}&department=${filterDept}`, config);
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            saveAs(blob, `employees_report.xlsx`);
        } catch (error) {
            alert('Error exporting data');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterDept('');
        setPage(1);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataFile = new FormData();
        formDataFile.append('file', file);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const { data } = await axios.post('/api/employees/import', formDataFile, config);
            let msg = data.message || 'Employees imported successfully';
            if (data.errorDetails && data.errorDetails.length > 0) {
                msg += '\n\nRecent Errors:\n' + data.errorDetails.slice(0, 10).join('\n');
                if (data.errorDetails.length > 10) msg += '\n... and more';
            }
            alert(msg);
            fetchEmployees();
        } catch (error) {
            alert(error.response?.data?.message || 'Error importing file');
        }
    };

    const downloadTemplate = () => {
        const template = [
            {
                employeeId: 'EMP001',
                employeeName: 'John Doe',
                status: 'Active',
                gender: 'Male',
                dateOfJoining: '2023-01-01',
                designation: 'Manager',
                department: 'Sales',
                aadharNo: '123456789012',
                panNo: 'ABCDE1234F',
                contactNumber: '9876543210'
            }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "employee_template.xlsx");
    };

    return (
        <div className="employee-master">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 style={{ margin: 0 }}>Employee Master</h2>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Workforce management, compliance records, and document repository</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary flex items-center gap-2" onClick={downloadTemplate} style={{ padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
                        <FileText size={18} /> Template
                    </button>
                    <label className="btn-secondary flex items-center gap-2" style={{ cursor: 'pointer', margin: 0, padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
                        <Upload size={18} /> Bulk Import
                        <input type="file" hidden onChange={handleFileUpload} accept=".xlsx, .xls" />
                    </label>
                    <button className="btn-secondary flex items-center gap-2" onClick={handleExport} style={{ padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
                        <FileSpreadsheet size={18} /> Export Excel
                    </button>
                    {isAdmin && (
                        <button className="btn-primary flex items-center gap-2" onClick={handleAddClick} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
                            <Plus size={20} /> {showForm ? 'Close Workspace' : 'Add Employee'}
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar shadow-sm border border-slate-100 mb-8" style={{ padding: '1.5rem', background: 'white', borderRadius: '20px' }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="filter-item">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Search Employee</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ID, Name, Designation..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                style={{ paddingLeft: '2.5rem', height: '48px', borderRadius: '12px' }}
                            />
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        </div>
                    </div>
                    <div className="filter-item">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Department</label>
                        <input
                            type="text"
                            placeholder="Filter by dept..."
                            value={filterDept}
                            onChange={(e) => { setFilterDept(e.target.value); setPage(1); }}
                            style={{ height: '48px', borderRadius: '12px' }}
                        />
                    </div>
                    <div>
                        <button className="btn-reset flex items-center justify-center gap-2 w-full" onClick={resetFilters} style={{ height: '48px', borderRadius: '12px', background: '#f8fafc' }}>
                            <RefreshCw size={18} /> Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Emp ID</th>
                                <th>Name</th>
                                <th>Designation</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp._id}>
                                    <td><strong>{emp.employeeId}</strong></td>
                                    <td>{emp.employeeName}</td>
                                    <td>{emp.designation || '-'}</td>
                                    <td>{emp.department || '-'}</td>
                                    <td>
                                        <span className={`badge ${emp.status === 'Active' ? 'badge-user' : 'badge-admin'}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {isAdmin ? (
                                                <>
                                                    <button className="p-2 hover:bg-gray-100 rounded" onClick={() => handleEdit(emp)}><Edit2 size={16} /></button>
                                                    <button className="p-2 hover:bg-red-50 text-red rounded" onClick={() => handleDelete(emp._id)}><Trash2 size={16} /></button>
                                                </>
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>View Only</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="flex justify-between items-center p-4 border-t" style={{ fontSize: '0.85rem' }}>
                    <div className="text-gray-600">Showing page {page} of {pages > 0 ? pages : 1} entries</div>
                    <div className="pagination-controls">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                        <button className="active">{page}</button>
                        <button disabled={page === pages || pages === 0} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="inline-form-card">
                    <div className="inline-form-header">
                        <h3>
                            <Plus size={24} className="text-red" />
                            {editMode ? 'Edit Employee Details' : 'Add New Employee Record'}
                        </h3>
                        <div className="flex gap-2">
                            <button className="btn-secondary" onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1.2rem' }}>
                                <X size={18} style={{ marginRight: '8px' }} /> Cancel
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Personal Profile */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Plus size={18} /> Personal Profile
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Surname</label>
                                    <input type="text" value={formData.surname} onChange={e => setFormData({ ...formData, surname: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Employee Name *</label>
                                    <input type="text" value={formData.employeeName} onChange={e => setFormData({ ...formData, employeeName: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Father's Name</label>
                                    <input type="text" value={formData.fatherName} onChange={e => setFormData({ ...formData, fatherName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Mother's Name</label>
                                    <input type="text" value={formData.motherName} onChange={e => setFormData({ ...formData, motherName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Nationality</label>
                                    <input type="text" value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Religion</label>
                                    <input type="text" value={formData.religion} onChange={e => setFormData({ ...formData, religion: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Marital Status</label>
                                    <select value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}>
                                        <option value="">Select Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                                {formData.maritalStatus === 'Married' && (
                                    <div className="form-group">
                                        <label>Date of Marriage</label>
                                        <input type="date" value={formData.marriageDate} onChange={e => setFormData({ ...formData, marriageDate: e.target.value })} />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Physical Disabilities</label>
                                    <input type="text" value={formData.anyPhysicalDisabilities} onChange={e => setFormData({ ...formData, anyPhysicalDisabilities: e.target.value })} placeholder="Describe if any" />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Organization & Work */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Building2 size={18} /> Organization & Work Details
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Employee ID (Emp No) *</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={formData.employeeId}
                                            onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                            required
                                            style={{ flex: 1 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={fetchNextId}
                                            className="btn btn-secondary"
                                            title="Get Next Available ID"
                                            style={{ padding: '8px', fontSize: '12px' }}
                                        >
                                            Auto ID
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Date of Joining</label>
                                    <input type="date" value={formData.dateOfJoining} onChange={e => setFormData({ ...formData, dateOfJoining: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Designation</label>
                                    <select value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })}>
                                        <option value="">Select Designation</option>
                                        {designations.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Department</label>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        {!formData.isCustomDept ? (
                                            <select
                                                value={formData.department}
                                                onChange={e => {
                                                    if (e.target.value === 'CUSTOM_DEPT') {
                                                        setFormData({ ...formData, isCustomDept: true, department: '' });
                                                    } else {
                                                        setFormData({ ...formData, department: e.target.value });
                                                    }
                                                }}
                                            >
                                                <option value="">Select Dept</option>
                                                <option value="Sales">Sales</option>
                                                <option value="Service">Service</option>
                                                <option value="Finance & Accounts">Finance & Accounts</option>
                                                <option value="HR">HR</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Management">Management</option>
                                                <option value="CUSTOM_DEPT">Other/Custom...</option>
                                            </select>
                                        ) : (
                                            <div style={{ flex: 1, display: 'flex', gap: '5px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Enter Department"
                                                    value={formData.department}
                                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, isCustomDept: false })}
                                                    className="btn-secondary"
                                                    style={{ padding: '0 8px' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Personal Number (Mobile)</label>
                                    <input type="text" value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Alternate Number</label>
                                    <input type="text" value={formData.alternateContactNumber} onChange={e => setFormData({ ...formData, alternateContactNumber: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Personal Email ID</label>
                                    <input type="email" value={formData.personalMailId} onChange={e => setFormData({ ...formData, personalMailId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Official Email ID</label>
                                    <input type="email" value={formData.officialMailId} onChange={e => setFormData({ ...formData, officialMailId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Reporting Manager</label>
                                    <input type="text" value={formData.reportingManager} onChange={e => setFormData({ ...formData, reportingManager: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Employment Role</label>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        {!formData.isCustomRole ? (
                                            <select
                                                value={formData.employmentRole}
                                                onChange={e => {
                                                    if (e.target.value === 'CUSTOM_ROLE') {
                                                        setFormData({ ...formData, isCustomRole: true, employmentRole: '' });
                                                    } else {
                                                        setFormData({ ...formData, employmentRole: e.target.value });
                                                    }
                                                }}
                                            >
                                                <option value="">Select Role</option>
                                                {roles.map(r => <option key={r._id} value={r.name}>{r.name}</option>)}
                                                <option value="On Roll">On Roll (Legacy)</option>
                                                <option value="Off roll">Off roll (Legacy)</option>
                                                <option value="CUSTOM_ROLE">Other/Custom...</option>
                                            </select>
                                        ) : (
                                            <div style={{ flex: 1, display: 'flex', gap: '5px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Enter Role"
                                                    value={formData.employmentRole}
                                                    onChange={e => setFormData({ ...formData, employmentRole: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, isCustomRole: false })}
                                                    className="btn-secondary"
                                                    style={{ padding: '0 8px' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Job Description</label>
                                    <textarea value={formData.jobDescription} onChange={e => setFormData({ ...formData, jobDescription: e.target.value })} rows="2" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Address Details */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <FileText size={18} /> Address Details
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Present Address</label>
                                    <textarea value={formData.presentAddress} onChange={e => setFormData({ ...formData, presentAddress: e.target.value })} rows="2" />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="m-0">Permanent Address</label>
                                        <button type="button" onClick={() => setFormData({ ...formData, permanentAddress: formData.presentAddress })} style={{ fontSize: '0.7rem', color: '#007bff', background: 'none' }}>Same as Present</button>
                                    </div>
                                    <textarea value={formData.permanentAddress} onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })} rows="2" />
                                </div>
                                <div className="form-group">
                                    <label>Permanent Address Contact No</label>
                                    <input type="text" value={formData.permanentAddressContact} onChange={e => setFormData({ ...formData, permanentAddressContact: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Bank & KYC */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <FileSpreadsheet size={18} /> Bank & KYC Details
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Aadhar No</label>
                                    <input type="text" value={formData.aadharNo} onChange={e => setFormData({ ...formData, aadharNo: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>PAN No</label>
                                    <input type="text" value={formData.panNo} onChange={e => setFormData({ ...formData, panNo: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Driving License No</label>
                                    <input type="text" value={formData.drivingLicenseNo} onChange={e => setFormData({ ...formData, drivingLicenseNo: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Bank Name</label>
                                    <input type="text" value={formData.bankName} onChange={e => setFormData({ ...formData, bankName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Account Number</label>
                                    <input type="text" value={formData.bankAccountNo} onChange={e => setFormData({ ...formData, bankAccountNo: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Bank Branch</label>
                                    <input type="text" value={formData.bankBranch} onChange={e => setFormData({ ...formData, bankBranch: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>IFSC Code</label>
                                    <input type="text" value={formData.ifscCode} onChange={e => setFormData({ ...formData, ifscCode: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Qualifications */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title flex justify-between items-center">
                                <div className="flex items-center gap-2"><Plus size={18} /> Qualifications</div>
                                <button type="button" className="btn-secondary text-xs p-1" onClick={() => addArrayItem('qualifications', { board: '', specialization: '', passingYear: '' })}>Add More</button>
                            </div>
                            {formData.qualifications.map((q, i) => (
                                <div key={i} className="inline-form-grid mb-4 border-b pb-4 last:border-b-0 last:pb-0 relative">
                                    {formData.qualifications.length > 1 && <button type="button" className="absolute top-0 right-0 text-red" onClick={() => removeArrayItem('qualifications', i)}><X size={16} /></button>}
                                    <div className="form-group">
                                        <label>Board / University / Institution</label>
                                        <input type="text" value={q.board} onChange={e => handleArrayChange('qualifications', i, 'board', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Area of Specialization</label>
                                        <input type="text" value={q.specialization} onChange={e => handleArrayChange('qualifications', i, 'specialization', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Year of Passing</label>
                                        <input type="text" value={q.passingYear} onChange={e => handleArrayChange('qualifications', i, 'passingYear', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section 6: Previous Experience */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title flex justify-between items-center">
                                <div className="flex items-center gap-2"><Plus size={18} /> Previous Experience</div>
                                <button type="button" className="btn-secondary text-xs p-1" onClick={() => addArrayItem('previousExperience', { employerName: '', designation: '', periodFrom: '', periodTo: '', totalExperience: '', responsibilities: '', salary: '', referenceName: '', referenceMobile: '' })}>Add More</button>
                            </div>
                            {formData.previousExperience.map((exp, i) => (
                                <div key={i} className="inline-form-grid mb-4 border-b pb-4 last:border-b-0 last:pb-0 relative">
                                    {formData.previousExperience.length > 1 && <button type="button" className="absolute top-0 right-0 text-red" onClick={() => removeArrayItem('previousExperience', i)}><X size={16} /></button>}
                                    <div className="form-group">
                                        <label>Employer Name</label>
                                        <input type="text" value={exp.employerName} onChange={e => handleArrayChange('previousExperience', i, 'employerName', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Designation</label>
                                        <input type="text" value={exp.designation} onChange={e => handleArrayChange('previousExperience', i, 'designation', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Period From</label>
                                        <input type="date" value={exp.periodFrom} onChange={e => handleArrayChange('previousExperience', i, 'periodFrom', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Period To</label>
                                        <input type="date" value={exp.periodTo} onChange={e => handleArrayChange('previousExperience', i, 'periodTo', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Total Experience</label>
                                        <input type="text" value={exp.totalExperience} onChange={e => handleArrayChange('previousExperience', i, 'totalExperience', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Salary</label>
                                        <input type="text" value={exp.salary} onChange={e => handleArrayChange('previousExperience', i, 'salary', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Reference Name</label>
                                        <input type="text" value={exp.referenceName} onChange={e => handleArrayChange('previousExperience', i, 'referenceName', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Reference Mobile</label>
                                        <input type="text" value={exp.referenceMobile} onChange={e => handleArrayChange('previousExperience', i, 'referenceMobile', e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Major Responsibilities</label>
                                        <textarea value={exp.responsibilities} onChange={e => handleArrayChange('previousExperience', i, 'responsibilities', e.target.value)} rows="1" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section 7: Family Details */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title flex justify-between items-center">
                                <div className="flex items-center gap-2"><Plus size={18} /> Family Details</div>
                                <button type="button" className="btn-secondary text-xs p-1" onClick={() => addArrayItem('familyMembers', { name: '', relationship: '', dob: '', occupation: '' })}>Add More</button>
                            </div>
                            {formData.familyMembers.map((fm, i) => (
                                <div key={i} className="inline-form-grid mb-4 border-b pb-4 last:border-b-0 last:pb-0 relative">
                                    {formData.familyMembers.length > 1 && <button type="button" className="absolute top-0 right-0 text-red" onClick={() => removeArrayItem('familyMembers', i)}><X size={16} /></button>}
                                    <div className="form-group">
                                        <label>Family Member Name</label>
                                        <input type="text" value={fm.name} onChange={e => handleArrayChange('familyMembers', i, 'name', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Relationship</label>
                                        <input type="text" value={fm.relationship} onChange={e => handleArrayChange('familyMembers', i, 'relationship', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input type="date" value={fm.dob} onChange={e => handleArrayChange('familyMembers', i, 'dob', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Occupation</label>
                                        <input type="text" value={fm.occupation} onChange={e => handleArrayChange('familyMembers', i, 'occupation', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section 8: Emergency Contacts */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title flex justify-between items-center">
                                <div className="flex items-center gap-2"><Plus size={18} /> Emergency Contacts</div>
                                <button type="button" className="btn-secondary text-xs p-1" onClick={() => addArrayItem('emergencyContacts', { contactPerson: '', relation: '', address: '', mobileNumber: '' })}>Add More</button>
                            </div>
                            {formData.emergencyContacts.map((ec, i) => (
                                <div key={i} className="inline-form-grid mb-4 border-b pb-4 last:border-b-0 last:pb-0 relative">
                                    {formData.emergencyContacts.length > 1 && <button type="button" className="absolute top-0 right-0 text-red" onClick={() => removeArrayItem('emergencyContacts', i)}><X size={16} /></button>}
                                    <div className="form-group">
                                        <label>Contact Person</label>
                                        <input type="text" value={ec.contactPerson} onChange={e => handleArrayChange('emergencyContacts', i, 'contactPerson', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Relationship</label>
                                        <input type="text" value={ec.relation} onChange={e => handleArrayChange('emergencyContacts', i, 'relation', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input type="text" value={ec.mobileNumber} onChange={e => handleArrayChange('emergencyContacts', i, 'mobileNumber', e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Address</label>
                                        <textarea value={ec.address} onChange={e => handleArrayChange('emergencyContacts', i, 'address', e.target.value)} rows="1" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section 9: Health & Medical */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Search size={18} /> Health & Medical Information
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Blood Group</label>
                                    <input type="text" value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Allergic To</label>
                                    <input type="text" value={formData.allergic} onChange={e => setFormData({ ...formData, allergic: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Blood Pressure</label>
                                    <input type="text" value={formData.bloodPressure} onChange={e => setFormData({ ...formData, bloodPressure: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Sugar Level</label>
                                    <input type="text" value={formData.sugarLevel} onChange={e => setFormData({ ...formData, sugarLevel: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Eye Sight</label>
                                    <input type="text" value={formData.eyeSight} onChange={e => setFormData({ ...formData, eyeSight: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Major Illness (if any)</label>
                                    <input type="text" value={formData.majorIllness} onChange={e => setFormData({ ...formData, majorIllness: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Languages Known</label>
                                    <div className="flex gap-6 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                                            <input type="checkbox" checked={formData.languages.telugu} onChange={e => setFormData({ ...formData, languages: { ...formData.languages, telugu: e.target.checked } })} /> Telugu
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                                            <input type="checkbox" checked={formData.languages.english} onChange={e => setFormData({ ...formData, languages: { ...formData.languages, english: e.target.checked } })} /> English
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                                            <input type="checkbox" checked={formData.languages.hindi} onChange={e => setFormData({ ...formData, languages: { ...formData.languages, hindi: e.target.checked } })} /> Hindi
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 10: Attachments & Documents */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Paperclip size={18} /> Attachments & Documents
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Bio-Data / Resume Upload</label>
                                    <input type="file" onChange={e => handleFileChange(e, 'bioDataPath')} />
                                    {formData.bioDataPath && <small style={{ color: 'green', display: 'block' }}>✓ Uploaded: {formData.bioDataPath.split('/').pop()}</small>}
                                </div>
                                <div className="form-group">
                                    <label>Aadhar Upload</label>
                                    <input type="file" onChange={e => handleFileChange(e, 'aadharUploadPath')} />
                                    {formData.aadharUploadPath && <small style={{ color: 'green', display: 'block' }}>✓ Uploaded</small>}
                                </div>
                                <div className="form-group">
                                    <label>PAN Upload</label>
                                    <input type="file" onChange={e => handleFileChange(e, 'panUploadPath')} />
                                    {formData.panUploadPath && <small style={{ color: 'green', display: 'block' }}>✓ Uploaded</small>}
                                </div>
                                <div className="form-group">
                                    <label>Personal Photo Upload</label>
                                    <input type="file" onChange={e => handleFileChange(e, 'personalPhotoPath')} />
                                    {formData.personalPhotoPath && <small style={{ color: 'green', display: 'block' }}>✓ Uploaded</small>}
                                </div>
                                <div className="form-group">
                                    <label>Family Photo Upload</label>
                                    <input type="file" onChange={e => handleFileChange(e, 'familyPhotoPath')} />
                                    {formData.familyPhotoPath && <small style={{ color: 'green', display: 'block' }}>✓ Uploaded</small>}
                                </div>
                                <div className="form-group">
                                    <label>Educational Certificates</label>
                                    <input type="file" onChange={e => handleFileChange(e, 'educationalCertificatesPath')} />
                                    {formData.educationalCertificatesPath && <small style={{ color: 'green', display: 'block' }}>✓ Uploaded</small>}
                                </div>
                                <div className="form-group">
                                    <label>Technical Certificates</label>
                                    <input type="file" onChange={e => handleFileChange(e, 'technicalCertificatesPath')} />
                                    {formData.technicalCertificatesPath && <small style={{ color: 'green', display: 'block' }}>✓ Uploaded</small>}
                                </div>
                                <div className="form-group">
                                    <label>Bank Statement Upload</label>
                                    <input type="file" onChange={e => handleFileChange(e, 'bankStatementPath')} />
                                    {formData.bankStatementPath && <small style={{ color: 'green', display: 'block' }}>✓ Uploaded</small>}
                                </div>
                            </div>
                        </div>

                        {/* Section 11: Location Allocation */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Building2 size={18} /> Location Allocation
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>State Allocation</label>
                                    <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value, assignedBranches: [] })}>
                                        <option value="">Select State</option>
                                        {states.map(s => (
                                            <option key={s._id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Allocated Branches</span>
                                        {formData.assignedBranches?.length > 0 && (
                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, assignedBranches: [] }))}
                                                style={{ fontSize: '0.72rem', color: '#dc2626', background: 'none', padding: '0 4px', fontWeight: 600 }}>
                                                Clear all
                                            </button>
                                        )}
                                    </label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', minHeight: '52px' }}>
                                        {allBranches.filter(b => b.state === formData.state).map(b => {
                                            const branchName = b.branchName;
                                            const isChecked = (formData.assignedBranches || []).includes(branchName);
                                            return (
                                                <label key={b._id}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', padding: '0.3rem 0.65rem', borderRadius: '1rem', fontSize: '0.82rem', fontWeight: 600, border: `1.5px solid ${isChecked ? '#c2410c' : '#e2e8f0'}`, background: isChecked ? '#fff7ed' : 'white', color: isChecked ? '#c2410c' : '#64748b', transition: 'all 0.15s', userSelect: 'none' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleBranchToggle(branchName)}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <Building2 size={12} />
                                                    {branchName}
                                                </label>
                                            );
                                        })}
                                        {!formData.state && <div style={{ color: '#94a3b8', fontSize: '0.85rem', width: '100%', textAlign: 'center', padding: '0.5rem 0' }}>Please select a state to view branches</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="inline-form-footer">
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} style={{ width: '150px' }}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{ width: '220px' }}>{editMode ? 'Update Employee' : 'Save Employee'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EmployeeMaster;
