import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Download, Upload, FileText, Search, X, Loader, Calculator, RefreshCw, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AssetMaster = () => {
    const { user } = useContext(AuthContext);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        assetNumber: '', kva: '', engineHpRange: '', branch: '',
        coordinator: '', customerName: '', status: '',
        purchaseOrderNo: '', poMonth: '', billingMonth: '',
        contractPeriod: '', contractMonthsPending: '', engineerName: ''
    });

    const [formData, setFormData] = useState({
        assetNumber: '', model: '', kva: '', engineHpRange: '', branch: '',
        customerName: '', gstNumber: '', contactPerson: '', contactNumber: '', mailId: '',
        contractStartDate: '', contractEndDate: '', noOfVisits: '', typeOfVisits: '',
        contractPeriod: '', contractMonthsPending: '',
        purchaseOrderNo: '', purchaseOrderDate: '',
        quotationNo: '', quoteDate: '',
        actualPOReceived: '', actualPoReceivedDate: '', poAttachment: '',
        poType: '', basicAmount: 0, gstAmount: 0, totalAmount: 0,
        lastYearPriceBasic: 0, amountHike: 0, hikePercentage: 0, hikeGetBy: '',
        paymentTerms: '', billingType: '',
        q1Date: '', q1Amount: 0, q1TallyInvoiceNo: '', q1InvoiceDate: '', q1PaymentStatus: '', q1PaymentDetails: '', q1PaymentReceivedDate: '',
        q2Date: '', q2Amount: 0, q2TallyInvoiceNo: '', q2InvoiceDate: '', q2PaymentStatus: '', q2PaymentDetails: '', q2PaymentReceivedDate: '',
        q3Date: '', q3Amount: 0, q3TallyInvoiceNo: '', q3InvoiceDate: '', q3PaymentStatus: '', q3PaymentDetails: '', q3PaymentReceivedDate: '',
        q4Date: '', q4Amount: 0, q4TallyInvoiceNo: '', q4InvoiceDate: '', q4PaymentStatus: '', q4PaymentDetails: '', q4PaymentReceivedDate: '',
        coordinator: '', engineerName: '', engineerContact: '', status: ''
    });

    const isAdmin = ['Super Admin', 'Admin'].includes(user.role);

    useEffect(() => {
        fetchAssets();
    }, [page]);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const queryParams = new URLSearchParams({
                pageNumber: page,
                keyword: searchTerm,
                ...searchFilters
            }).toString();
            const { data } = await axios.get(`/api/assets?${queryParams}`, config);
            setAssets(data.assets);
            setPages(data.pages);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
        setLoading(false);
    };

    const handleSearchChange = (e) => {
        setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
    };

    const applyAdvancedSearch = () => {
        setPage(1);
        fetchAssets();
    };

    const resetSearch = () => {
        setSearchFilters({
            assetNumber: '', kva: '', engineHpRange: '', branch: '',
            coordinator: '', customerName: '', status: '',
            purchaseOrderNo: '', poMonth: '', billingMonth: '',
            contractPeriod: '', contractMonthsPending: '', engineerName: ''
        });
        setSearchTerm('');
        setPage(1);
        fetchAssets();
    };

    const downloadFullReport = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const { data } = await axios.get('/api/assets/export', config);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = `AssetReport_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting report:', error);
            alert('Export failed');
        }
    };

    const handleBulkImport = async (e) => {
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
            await axios.post('/api/assets/import', formDataFile, config);
            alert('Assets imported successfully');
            fetchAssets();
        } catch (error) {
            alert(error.response?.data?.message || 'Error importing file');
        }
    };

    const downloadTemplate = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const { data } = await axios.get('/api/assets/template', config);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'asset_import_template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading template:', error);
            alert('Template download failed');
        }
    };

    // Auto-calculations (rest of the code...)
    useEffect(() => {
        const basic = Number(formData.basicAmount) || 0;
        const gst = Number((basic * 0.18).toFixed(2));
        const total = Number((basic + gst).toFixed(2));

        if (formData.gstAmount !== gst || formData.totalAmount !== total) {
            setFormData(prev => ({ ...prev, gstAmount: gst, totalAmount: total }));
        }

        // Price Hike Calculations
        const lastYear = Number(formData.lastYearPriceBasic) || 0;
        if (lastYear > 0) {
            const hike = Number((basic - lastYear).toFixed(2));
            const percentage = Number(((hike / lastYear) * 100).toFixed(2));
            if (formData.amountHike !== hike || formData.hikePercentage !== percentage) {
                setFormData(prev => ({ ...prev, amountHike: hike, hikePercentage: percentage }));
            }
        }

        if (formData.contractStartDate && formData.contractEndDate) {
            const start = new Date(formData.contractStartDate);
            const end = new Date(formData.contractEndDate);
            const today = new Date();

            const diffTime = Math.abs(end - start);
            const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));

            const pendingTime = end - today;
            const pendingMonths = Math.max(0, Math.ceil(pendingTime / (1000 * 60 * 60 * 24 * 30.44)));

            if (formData.contractPeriod !== `${diffMonths} Months` || formData.contractMonthsPending !== pendingMonths) {
                setFormData(prev => ({
                    ...prev,
                    contractPeriod: `${diffMonths} Months`,
                    contractMonthsPending: pendingMonths
                }));
            }

            // Billing Milestones Calculation
            if (formData.paymentTerms && formData.billingType) {
                calculateBilling(start, total, formData.paymentTerms, formData.billingType);
            }
        }
    }, [formData.basicAmount, formData.lastYearPriceBasic, formData.contractStartDate, formData.contractEndDate, formData.paymentTerms, formData.billingType]);

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const { data } = await axios.post('/api/upload', uploadData, config);
            setFormData(prev => ({ ...prev, [field]: data.filePath }));
            alert('File uploaded successfully');
        } catch (error) {
            alert('Error uploading file');
        }
    };

    const calculateBilling = (startDate, totalAmount, terms, type) => {
        let updates = {};
        const isAdvance = type.toLowerCase().includes('advance');

        if (terms === 'Quarterly') {
            const qAmount = Number((totalAmount / 4).toFixed(2));
            for (let i = 1; i <= 4; i++) {
                const date = new Date(startDate);
                // If Quarterly After, dates are at 3, 6, 9, 12 months. If Advance, 0, 3, 6, 9.
                const monthOffset = isAdvance ? (i - 1) * 3 : i * 3;
                date.setMonth(date.getMonth() + monthOffset);
                updates[`q${i}Date`] = date.toISOString().split('T')[0];
                updates[`q${i}Amount`] = qAmount;
            }
        } else if (terms === 'Half Yearly') {
            const hAmount = Number((totalAmount / 2).toFixed(2));
            for (let i = 1; i <= 2; i++) {
                const date = new Date(startDate);
                const monthOffset = isAdvance ? (i - 1) * 6 : i * 6;
                date.setMonth(date.getMonth() + monthOffset);
                updates[`q${i}Date`] = date.toISOString().split('T')[0];
                updates[`q${i}Amount`] = hAmount;
            }
            updates.q3Date = ''; updates.q3Amount = 0;
            updates.q4Date = ''; updates.q4Amount = 0;
        } else if (terms === '100%') {
            const date = new Date(startDate);
            if (!isAdvance) date.setMonth(date.getMonth() + 12);
            updates.q1Date = date.toISOString().split('T')[0];
            updates.q1Amount = totalAmount;
            updates.q2Date = ''; updates.q2Amount = 0;
            updates.q3Date = ''; updates.q3Amount = 0;
            updates.q4Date = ''; updates.q4Amount = 0;
        } else if (terms === 'Monthly') {
            // Simplification for UI: just show Q1 as first month
            updates.q1Date = startDate.toISOString().split('T')[0];
            updates.q1Amount = Number((totalAmount / 12).toFixed(2));
        }

        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editMode) {
                await axios.put(`/api/assets/${selectedId}`, formData, config);
            } else {
                await axios.post('/api/assets', formData, config);
            }
            setShowForm(false);
            resetForm();
            fetchAssets();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving asset');
        }
    };

    const handleEdit = (asset) => {
        const mappedData = { ...asset };
        // Map all date fields to YYYY-MM-DD
        const dateFields = [
            'contractStartDate', 'contractEndDate', 'purchaseOrderDate', 'quoteDate', 'actualPoReceivedDate',
            'q1Date', 'q1InvoiceDate', 'q1PaymentReceivedDate',
            'q2Date', 'q2InvoiceDate', 'q2PaymentReceivedDate',
            'q3Date', 'q3InvoiceDate', 'q3PaymentReceivedDate',
            'q4Date', 'q4InvoiceDate', 'q4PaymentReceivedDate'
        ];
        dateFields.forEach(field => {
            if (mappedData[field]) {
                mappedData[field] = mappedData[field].split('T')[0];
            }
        });
        setFormData(mappedData);
        setSelectedId(asset._id);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/assets/${id}`, config);
                fetchAssets();
            } catch (error) {
                alert('Error deleting asset');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            assetNumber: '', model: '', kva: '', engineHpRange: '', branch: '',
            customerName: '', gstNumber: '', contactPerson: '', contactNumber: '', mailId: '',
            contractStartDate: '', contractEndDate: '', noOfVisits: '', typeOfVisits: '',
            contractPeriod: '', contractMonthsPending: '',
            purchaseOrderNo: '', purchaseOrderDate: '',
            quotationNo: '', quoteDate: '',
            actualPOReceived: '', actualPoReceivedDate: '', poAttachment: '',
            poType: '', basicAmount: 0, gstAmount: 0, totalAmount: 0,
            lastYearPriceBasic: 0, amountHike: 0, hikePercentage: 0, hikeGetBy: '',
            paymentTerms: '', billingType: '',
            q1Date: '', q1Amount: 0, q1TallyInvoiceNo: '', q1InvoiceDate: '', q1PaymentStatus: '', q1PaymentDetails: '', q1PaymentReceivedDate: '',
            q2Date: '', q2Amount: 0, q2TallyInvoiceNo: '', q2InvoiceDate: '', q2PaymentStatus: '', q2PaymentDetails: '', q2PaymentReceivedDate: '',
            q3Date: '', q3Amount: 0, q3TallyInvoiceNo: '', q3InvoiceDate: '', q3PaymentStatus: '', q3PaymentDetails: '', q3PaymentReceivedDate: '',
            q4Date: '', q4Amount: 0, q4TallyInvoiceNo: '', q4InvoiceDate: '', q4PaymentStatus: '', q4PaymentDetails: '', q4PaymentReceivedDate: '',
            coordinator: '', engineerName: '', engineerContact: '', status: ''
        });
        setEditMode(false);
        setSelectedId(null);
    };

    const months = [
        { val: 1, label: 'January' }, { val: 2, label: 'February' }, { val: 3, label: 'March' },
        { val: 4, label: 'April' }, { val: 5, label: 'May' }, { val: 6, label: 'June' },
        { val: 7, label: 'July' }, { val: 8, label: 'August' }, { val: 9, label: 'September' },
        { val: 10, label: 'October' }, { val: 11, label: 'November' }, { val: 12, label: 'December' }
    ];

    return (
        <div className="asset-master">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 style={{ margin: 0 }}>Asset Master</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Manage AMC assets, contracts and billing milestones</p>
                </div>
                <div className="flex gap-2">
                    <button id="btn-download-template" type="button" className="btn-secondary" onClick={downloadTemplate}>
                        <FileText size={18} className="mr-2" /> Template
                    </button>
                    <label id="btn-bulk-import" className="btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                        <Upload size={18} className="mr-2" /> Bulk Import
                        <input type="file" hidden onChange={handleBulkImport} accept=".xlsx, .xls" />
                    </label>
                    <button id="btn-export-excel" type="button" className="btn-secondary" onClick={downloadFullReport}>
                        <FileSpreadsheet size={18} className="mr-2" /> Export Excel
                    </button>
                    {isAdmin && (
                        <button id="btn-add-asset" className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                            <Plus size={18} className="mr-2" /> {showForm ? 'Close Form' : 'Add Asset'}
                        </button>
                    )}
                </div>
            </div>

            <div className="filter-bar">
                <div className="filter-item">
                    <label>Search Asset</label>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Asset Number, Customer..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="filter-item">
                    <label>Filter by Branch</label>
                    <select
                        value={searchFilters.branch}
                        onChange={(e) => { setSearchFilters({ ...searchFilters, branch: e.target.value }); setPage(1); }}
                    >
                        <option value="">All Branches</option>
                        {['BALANAGAR', 'HI-Tech City', 'KARIMNAGAR', 'KATEDAN', 'NARAYANGUDA', 'NIZAMABAD', 'SURYAPET', 'UPPAL', 'WARANGAL'].map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-item">
                    <label>Status</label>
                    <select
                        value={searchFilters.status}
                        onChange={(e) => { setSearchFilters({ ...searchFilters, status: e.target.value }); setPage(1); }}
                    >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                        <option value="Renewed">Renewed</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button className="btn-reset" onClick={resetSearch}>
                        <RefreshCw size={18} /> Reset
                    </button>
                    <button className="btn-secondary" onClick={() => setShowAdvancedSearch(!showAdvancedSearch)} style={{ padding: '0.5rem' }}>
                        <Calculator size={18} />
                    </button>
                </div>
            </div>

            {showAdvancedSearch && (
                <div className="card mb-6" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '12px' }}>
                    <h4 style={{ margin: '0 0 1rem', color: 'var(--primary-red)' }}>Advanced Filters</h4>
                    <div className="search-grid">
                        <div className="form-group">
                            <label>Asset Number</label>
                            <input name="assetNumber" value={searchFilters.assetNumber} onChange={handleSearchChange} />
                        </div>
                        <div className="form-group">
                            <label>Engineer</label>
                            <input name="engineerName" value={searchFilters.engineerName} onChange={handleSearchChange} placeholder="Search by Engineer" />
                        </div>
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input name="customerName" value={searchFilters.customerName} onChange={handleSearchChange} />
                        </div>
                        <div className="form-group">
                            <label>KVA</label>
                            <input name="kva" value={searchFilters.kva} onChange={handleSearchChange} />
                        </div>
                        <div className="form-group">
                            <label>HP Range</label>
                            <input name="engineHpRange" value={searchFilters.engineHpRange} onChange={handleSearchChange} />
                        </div>
                        <div className="form-group">
                            <label>PO Month</label>
                            <select name="poMonth" value={searchFilters.poMonth} onChange={handleSearchChange}>
                                <option value="">Any</option>
                                {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Billing Month</label>
                            <select name="billingMonth" value={searchFilters.billingMonth} onChange={handleSearchChange}>
                                <option value="">Any</option>
                                {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {showForm && (
                <div className="inline-form-card">
                    <div className="inline-form-header">
                        <h3>
                            <Plus size={24} className="text-red" />
                            {editMode ? 'Edit Asset Details' : 'Register New Asset'}
                        </h3>
                        <div className="flex gap-2">
                            <button className="btn-secondary" onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1.2rem' }}>
                                <X size={18} style={{ marginRight: '8px' }} /> Cancel
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Basic Asset Details */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Plus size={18} /> Basic Asset Details
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Asset Number *</label>
                                    <input type="text" value={formData.assetNumber} onChange={(e) => setFormData({ ...formData, assetNumber: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Model *</label>
                                    <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>KVA</label>
                                    <input type="text" value={formData.kva} onChange={(e) => setFormData({ ...formData, kva: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Engine HP Range</label>
                                    <input type="text" value={formData.engineHpRange} onChange={(e) => setFormData({ ...formData, engineHpRange: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Branch *</label>
                                    <select value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} required>
                                        <option value="">Select Branch</option>
                                        {['BALANAGAR', 'HI-Tech City', 'KARIMNAGAR', 'KATEDAN', 'NARAYANGUDA', 'NIZAMABAD', 'SURYAPET', 'UPPAL', 'WARANGAL'].map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Coordinator</label>
                                    <input type="text" value={formData.coordinator} onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Asset Ownership - Engineer</label>
                                    <input type="text" value={formData.engineerName} onChange={(e) => setFormData({ ...formData, engineerName: e.target.value })} placeholder="Engineer Name" />
                                </div>
                                <div className="form-group">
                                    <label>Engineer - Contact Number</label>
                                    <input type="text" value={formData.engineerContact} onChange={(e) => setFormData({ ...formData, engineerContact: e.target.value })} placeholder="Contact Number" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Customer & Contract Details */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <FileText size={18} /> Customer & Contract Information
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Customer Name *</label>
                                    <input type="text" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>GST Number</label>
                                    <input type="text" value={formData.gstNumber} onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Contact Person</label>
                                    <input type="text" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Contact Number</label>
                                    <input type="text" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Mail ID</label>
                                    <input type="email" value={formData.mailId} onChange={(e) => setFormData({ ...formData, mailId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <input type="text" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} placeholder="Active/Inactive" />
                                </div>
                                <div className="form-group">
                                    <label>Contract Start Date *</label>
                                    <input type="date" value={formData.contractStartDate} onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Contract End Date *</label>
                                    <input type="date" value={formData.contractEndDate} onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ background: '#fbfbfc', padding: '15px', borderRadius: '8px', border: '1px solid #eef0f2' }}>
                                    <label style={{ color: 'var(--primary-red)' }}>Calculated Duration</label>
                                    <div className="flex gap-6">
                                        <div><small>Period:</small> <span style={{ fontWeight: 700 }}>{formData.contractPeriod || '-'}</span></div>
                                        <div><small>Months Pending:</small> <span style={{ fontWeight: 700, color: 'var(--primary-red)' }}>{formData.contractMonthsPending || '0'}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: PO & Financials */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Download size={18} /> PO & Financial Details
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>PO Type</label>
                                    <select value={formData.poType} onChange={(e) => setFormData({ ...formData, poType: e.target.value })}>
                                        <option value="">Select</option>
                                        <option value="New">New</option>
                                        <option value="Renewal">Renewal</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>PO Number</label>
                                    <input type="text" value={formData.purchaseOrderNo} onChange={(e) => setFormData({ ...formData, purchaseOrderNo: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>PO Date</label>
                                    <input type="date" value={formData.purchaseOrderDate} onChange={(e) => setFormData({ ...formData, purchaseOrderDate: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Actual PO Received?</label>
                                    <select value={formData.actualPOReceived} onChange={(e) => setFormData({ ...formData, actualPOReceived: e.target.value })}>
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Actual PO Received Date</label>
                                    <input type="date" value={formData.actualPoReceivedDate} onChange={(e) => setFormData({ ...formData, actualPoReceivedDate: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Quotation Number</label>
                                    <input type="text" value={formData.quotationNo} onChange={(e) => setFormData({ ...formData, quotationNo: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Quotation Date</label>
                                    <input type="date" value={formData.quoteDate} onChange={(e) => setFormData({ ...formData, quoteDate: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>PO Attachment</label>
                                    <div className="flex gap-2 items-center">
                                        <input type="file" onChange={(e) => handleFileUpload(e, 'poAttachment')} style={{ fontSize: '0.8rem' }} />
                                        {formData.poAttachment && <small className="text-green-600">Uploaded</small>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>No. of Visits</label>
                                    <select value={formData.noOfVisits} onChange={(e) => setFormData({ ...formData, noOfVisits: e.target.value })}>
                                        <option value="">Select</option>
                                        {[...Array(36)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Type of Visits</label>
                                    <select value={formData.typeOfVisits} onChange={(e) => setFormData({ ...formData, typeOfVisits: e.target.value })}>
                                        <option value="">Select</option>
                                        {['Monthly', 'By Monthly', 'Quarterly', 'Half Yearly'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Basic Amount (₹)</label>
                                    <input type="number" value={formData.basicAmount} onChange={(e) => setFormData({ ...formData, basicAmount: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>GST Amount (18%)</label>
                                    <input type="number" value={formData.gstAmount} readOnly style={{ background: '#f8f9fa' }} />
                                </div>
                                <div className="form-group">
                                    <label>Total Amount (₹)</label>
                                    <input type="number" value={formData.totalAmount} readOnly style={{ background: '#fdf2f2', fontWeight: 'bold', color: 'var(--primary-red)' }} />
                                </div>
                                <div className="form-group">
                                    <label>Last Year Price Basic (₹)</label>
                                    <input type="number" value={formData.lastYearPriceBasic} onChange={(e) => setFormData({ ...formData, lastYearPriceBasic: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Amount Hike (₹)</label>
                                    <input type="number" value={formData.amountHike} readOnly style={{ background: '#f8f9fa' }} />
                                </div>
                                <div className="form-group">
                                    <label>Hike Percentage (%)</label>
                                    <input type="number" value={formData.hikePercentage} readOnly style={{ background: '#f8f9fa' }} />
                                </div>
                                <div className="form-group">
                                    <label>Hike Get By</label>
                                    <input type="text" value={formData.hikeGetBy} onChange={(e) => setFormData({ ...formData, hikeGetBy: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Billing Milestones */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Calculator size={18} /> Billing Milestones & Schedule
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Payment Terms</label>
                                    <select value={formData.paymentTerms} onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}>
                                        <option value="">Select</option>
                                        {['Monthly', 'Quarterly', 'Half Yearly', '100%'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Billing Type</label>
                                    <select value={formData.billingType} onChange={(e) => setFormData({ ...formData, billingType: e.target.value })}>
                                        <option value="">Select</option>
                                        {['Monthly Advance', 'Monthly After', 'Quarterly Advance', 'Quarterly After', 'Half Yearly Advance', 'Half Yearly After', '100% Advance', '100% After'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 milestone-container">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="milestone-box">
                                        <div className="milestone-header">Milestone {i}</div>
                                        <div className="milestone-body">
                                            <div className="milestone-row">
                                                <div className="milestone-field flex-grow">
                                                    <label>Schedule Date & Amount</label>
                                                    <div className="flex gap-1">
                                                        <input type="date" value={formData[`q${i}Date`]} onChange={(e) => setFormData({ ...formData, [`q${i}Date`]: e.target.value })} />
                                                        <input type="number" value={formData[`q${i}Amount`]} onChange={(e) => setFormData({ ...formData, [`q${i}Amount`]: e.target.value })} placeholder="0" style={{ width: '45%' }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="milestone-row">
                                                <div className="milestone-field flex-grow">
                                                    <label>Tally Invoice No & Date</label>
                                                    <div className="flex gap-1">
                                                        <input type="text" value={formData[`q${i}TallyInvoiceNo`]} onChange={(e) => setFormData({ ...formData, [`q${i}TallyInvoiceNo`]: e.target.value })} placeholder="Inv No" />
                                                        <input type="date" value={formData[`q${i}InvoiceDate`]} onChange={(e) => setFormData({ ...formData, [`q${i}InvoiceDate`]: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="milestone-row flex gap-2">
                                                <div className="milestone-field" style={{ width: '35%' }}>
                                                    <label>Payment Status</label>
                                                    <select value={formData[`q${i}PaymentStatus`]} onChange={(e) => setFormData({ ...formData, [`q${i}PaymentStatus`]: e.target.value })}>
                                                        <option value="">Select</option>
                                                        <option value="Yes">Yes</option>
                                                        <option value="No">No</option>
                                                        <option value="Pending">Pending</option>
                                                    </select>
                                                </div>
                                                <div className="milestone-field flex-grow">
                                                    <label>Payment Details & Recv Date</label>
                                                    <div className="flex gap-1">
                                                        <input type="text" value={formData[`q${i}PaymentDetails`]} onChange={(e) => setFormData({ ...formData, [`q${i}PaymentDetails`]: e.target.value })} placeholder="Details" />
                                                        <input type="date" value={formData[`q${i}PaymentReceivedDate`]} onChange={(e) => setFormData({ ...formData, [`q${i}PaymentReceivedDate`]: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="inline-form-footer">
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} style={{ width: '150px' }}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{ width: '220px' }}>{editMode ? 'Update Asset' : 'Save Asset'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                {loading ? (
                    <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Asset No</th>
                                <th>Customer Name</th>
                                <th>Branch</th>
                                <th>End Date</th>
                                <th>Total Amount</th>
                                <th>Billing Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset._id}>
                                    <td><strong>{asset.assetNumber}</strong></td>
                                    <td>{asset.customerName}</td>
                                    <td>{asset.branch}</td>
                                    <td>{new Date(asset.contractEndDate).toLocaleDateString()}</td>
                                    <td>₹{asset.totalAmount.toLocaleString()}</td>
                                    <td>
                                        <div style={{ fontSize: '0.8rem' }}>
                                            Next: {asset.q1Date ? new Date(asset.q1Date).toLocaleDateString() : '-'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {isAdmin ? (
                                                <>
                                                    <button className="p-2 hover:bg-gray-100 rounded" onClick={() => handleEdit(asset)}><Edit2 size={16} /></button>
                                                    <button className="p-2 hover:bg-red-50 text-red rounded" onClick={() => handleDelete(asset._id)}><Trash2 size={16} /></button>
                                                </>
                                            ) : (
                                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>View Only</span>
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
        </div>
    );
};

export default AssetMaster;
