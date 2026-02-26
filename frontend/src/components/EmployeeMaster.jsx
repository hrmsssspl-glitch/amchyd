import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Download, Upload, FileText, Search, X, Loader, RefreshCw, FileSpreadsheet } from 'lucide-react';
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

    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        status: '',
        gender: '',
        dateOfJoining: '',
        designation: '',
        department: '',
        aadharNo: '',
        panNo: ''
    });

    const isAdmin = ['Super Admin', 'Admin'].includes(user.role);

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

    const handleEdit = (emp) => {
        setFormData({
            employeeId: emp.employeeId,
            employeeName: emp.employeeName,
            status: emp.status || 'Active',
            gender: emp.gender || '',
            dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.split('T')[0] : '',
            designation: emp.designation || '',
            department: emp.department || '',
            aadharNo: emp.aadharNo || '',
            panNo: emp.panNo || ''
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
        setFormData({
            employeeId: '',
            employeeName: '',
            status: '',
            gender: '',
            dateOfJoining: '',
            designation: '',
            department: '',
            aadharNo: '',
            panNo: ''
        });
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
            await axios.post('/api/employees/import', formDataFile, config);
            alert('Employees imported successfully');
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
                panNo: 'ABCDE1234F'
            }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "employee_template.xlsx");
    };

    return (
        <div className="employee-master">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 style={{ margin: 0 }}>Employee Master</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Manage workforce details and compliance documents</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary" onClick={downloadTemplate}>
                        <FileText size={18} className="mr-2" /> Template
                    </button>
                    <label className="btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                        <Upload size={18} className="mr-2" /> Bulk Import
                        <input type="file" hidden onChange={handleFileUpload} accept=".xlsx, .xls" />
                    </label>
                    <button className="btn-secondary" onClick={handleExport}>
                        <FileSpreadsheet size={18} className="mr-2" /> Export Excel
                    </button>
                    {isAdmin && (
                        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                            <Plus size={18} className="mr-2" /> {showForm ? 'Close Form' : 'Add Employee'}
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-item">
                    <label>Search Employee</label>
                    <input
                        type="text"
                        placeholder="ID, Name, Designation..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="filter-item">
                    <label>Filter by Dept</label>
                    <input
                        type="text"
                        placeholder="Department..."
                        value={filterDept}
                        onChange={(e) => { setFilterDept(e.target.value); setPage(1); }}
                    />
                </div>
                <button className="btn-reset" onClick={resetFilters}>
                    <RefreshCw size={18} /> Reset Filters
                </button>
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

                <div className="flex justify-between items-center p-4 border-t">
                    <div className="text-sm text-gray-500">Page {page} of {pages}</div>
                    <div className="flex gap-2">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-secondary" style={{ padding: '0.4rem 1rem' }}>Prev</button>
                        <button disabled={page === pages} onClick={() => setPage(page + 1)} className="btn-secondary" style={{ padding: '0.4rem 1rem' }}>Next</button>
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
                        {/* Section 1: Personal Identity */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Plus size={18} /> Identity & Basic Details
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Employee ID *</label>
                                    <input type="text" value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Employee Name *</label>
                                    <input type="text" value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Organization & Work */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <FileText size={18} /> Organization & Work Details
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Designation</label>
                                    <input type="text" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} placeholder="Role/Title" />
                                </div>
                                <div className="form-group">
                                    <label>Department</label>
                                    <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Select or type" />
                                </div>
                                <div className="form-group">
                                    <label>Date of Joining</label>
                                    <input type="date" value={formData.dateOfJoining} onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Compliance & Documents */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Search size={18} /> Compliance & KYC Information
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Aadhar No</label>
                                    <input type="text" value={formData.aadharNo} onChange={(e) => setFormData({ ...formData, aadharNo: e.target.value })} placeholder="12 Digit No" />
                                </div>
                                <div className="form-group">
                                    <label>PAN No</label>
                                    <input type="text" value={formData.panNo} onChange={(e) => setFormData({ ...formData, panNo: e.target.value })} placeholder="ABCD1234E" />
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
