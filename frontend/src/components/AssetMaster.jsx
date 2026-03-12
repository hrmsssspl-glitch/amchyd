import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Download, Upload, FileText, Search, X, Loader, Calculator, RefreshCw, FileSpreadsheet, Eye, Printer, CheckCircle2, AlertCircle, Building2, MapPin } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AssetMaster = () => {
    const { user } = useContext(AuthContext);

    const [states, setStates] = useState([]);
    const [allBranches, setAllBranches] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [employeesList, setEmployeesList] = useState([]);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        assetNumber: '', kva: '', engineHpRange: '', state: '', branch: '',
        coordinator: '', customerName: '', status: '',
        purchaseOrderNo: '', poMonth: '', billingMonth: '',
        contractPeriod: '', contractMonthsPending: '', engineerName: '', advisor: '',
        contractEndMonth: ''
    });

    const [selectedIds, setSelectedIds] = useState([]);
    const [totalAssets, setTotalAssets] = useState(0);
    const [selectAllGlobally, setSelectAllGlobally] = useState(false);
    const [stats, setStats] = useState({ total: 0, branches: [], hpRanges: [], status: { active: 0, inactive: 0 } });
    const [showStats, setShowStats] = useState(true);

    const [showPreview, setShowPreview] = useState(false);
    const [previewAsset, setPreviewAsset] = useState(null);

    const [formData, setFormData] = useState({
        assetNumber: '', model: '', kva: '', engineHpRange: '', state: '', branch: '',
        customerName: '', gstNumber: '', contactPerson: '', contactNumber: '', mailId: '',
        purchaseManagerName: '', purchaseManagerContact: '', purchaseManagerEmail: '',
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
        coordinator: '', engineerName: '', engineerContact: '', advisor: '', status: 'Active', remarks: ''
    });

    const [duplicateCheck, setDuplicateCheck] = useState({ loading: false, exists: false, module: '', customer: '' });
    const [checkTimeout, setCheckTimeout] = useState(null);

    const isAdmin = ['Super Admin', 'Admin'].includes(user.role);

    useEffect(() => {
        fetchAssets();
        fetchStats();
        fetchEmployees();
        fetchMasterData();
    }, [page, searchTerm, searchFilters]);

    const fetchMasterData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const { data: statesData } = await axios.get('/api/hrms/organization/states', config);
            setStates(statesData);
            const { data: branchesData } = await axios.get('/api/hrms/organization/branches', config);
            setAllBranches(branchesData);
        } catch (error) {
            console.error('Error fetching master data:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/employees?pageSize=1000', config);
            if (data && data.employees) {
                // Filter only actve/relevant employees if needed, for now just all
                setEmployeesList(data.employees);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/assets/stats', config);
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

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
            setTotalAssets(data.total);
            setSelectAllGlobally(false); // Reset global selection on new fetch
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
            assetNumber: '', kva: '', engineHpRange: '', state: '', branch: '',
            coordinator: '', customerName: '', status: '',
            purchaseOrderNo: '', poMonth: '', billingMonth: '',
            contractPeriod: '', contractMonthsPending: '', engineerName: '', advisor: '',
            contractEndMonth: ''
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

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const { data } = await axios.post('/api/assets/import', formDataFile, config);

            if (data.summary) {
                const s = data.summary;
                let msg = `Import Completed:\n`;
                msg += `✅ Successfully Imported: ${s.successfullyImported}\n`;
                msg += `⚠️ Validation Errors: ${s.validationErrors}\n`;
                msg += `🆔 Already in Database: ${s.alreadyInDatabase}\n`;
                msg += `📄 Duplicates in File: ${s.duplicateInFile}\n`;
                if (s.skippedEmpty > 0) {
                    msg += `⚪ Skipped (Empty Rows): ${s.skippedEmpty}\n`;
                }
                msg += `-------------------\n`;
                msg += `Total Rows Processed: ${s.totalRows}`;

                if (data.errors && data.errors.length > 0) {
                    msg += `\n\nFirst few errors:\n` + data.errors.join('\n');
                }
                alert(msg);
            } else {
                alert(data.message || 'Assets imported successfully');
            }
            fetchAssets();
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData?.errors) {
                const errorMsg = `Import failed:\n` + errorData.errors.join('\n');
                alert(errorMsg);
            } else {
                alert(errorData?.message || 'Error importing file');
            }
        }
        setLoading(false);
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

            // Auto-calculate Status
            const endDate = new Date(formData.contractEndDate);
            endDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const newStatus = endDate < today ? 'Inactive' : 'Active';
            if (formData.status !== newStatus) {
                setFormData(prev => ({ ...prev, status: newStatus }));
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

        // Client-side Date Validation
        const startDate = new Date(formData.contractStartDate);
        const endDate = new Date(formData.contractEndDate);

        if (isNaN(startDate.getTime())) {
            alert('Invalid Contract Start Date. Please select a valid date.');
            return;
        }
        if (isNaN(endDate.getTime())) {
            alert('Invalid Contract End Date. Please select a valid date.');
            return;
        }

        if (!window.confirm(`Are you sure you want to ${editMode ? 'update' : 'save'} this asset?`)) {
            return;
        }

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
        setDuplicateCheck({ loading: false, exists: false, module: '', customer: '' });
    };

    const handleAssetNumberChange = (e) => {
        const value = e.target.value.trim();
        setFormData({ ...formData, assetNumber: e.target.value });

        if (editMode) return; // Don't check duplicates in edit mode as the number is already fixed

        if (checkTimeout) clearTimeout(checkTimeout);

        if (!value) {
            setDuplicateCheck({ loading: false, exists: false, module: '', customer: '' });
            return;
        }

        const timeout = setTimeout(async () => {
            setDuplicateCheck(prev => ({ ...prev, loading: true, exists: false }));
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`/api/check-duplicate/${value}`, config);
                setDuplicateCheck({
                    loading: false,
                    exists: data.exists,
                    module: data.module || '',
                    customer: data.customerName || ''
                });
            } catch (error) {
                console.error('Duplicate check error:', error);
                setDuplicateCheck(prev => ({ ...prev, loading: false }));
            }
        }, 600);

        setCheckTimeout(timeout);
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

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0 && !selectAllGlobally) return;

        const countToDelete = selectAllGlobally ? totalAssets : selectedIds.length;
        const confirmMsg = selectAllGlobally
            ? `Are you sure you want to delete ALL ${totalAssets} assets matching your current filters? This action cannot be undone.`
            : `Are you sure you want to delete ${selectedIds.length} selected assets? This action cannot be undone.`;

        if (window.confirm(confirmMsg)) {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const payload = selectAllGlobally
                    ? { filters: { keyword: searchTerm, ...searchFilters } }
                    : { ids: selectedIds };

                console.log('Sending Bulk Delete Request (POST):', payload);
                await axios.post('/api/assets/bulk-delete', payload, config);
                setSelectedIds([]);
                setSelectAllGlobally(false);
                fetchAssets();
                alert('Assets deleted successfully');
            } catch (error) {
                alert(error.response?.data?.message || 'Error performing bulk delete');
            }
            setLoading(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === assets.length) {
            setSelectedIds([]);
            setSelectAllGlobally(false);
        } else {
            setSelectedIds(assets.map(a => a._id));
        }
    };

    const toggleSelectAsset = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
            setSelectAllGlobally(false);
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const resetForm = () => {
        setFormData({
            assetNumber: '', model: '', kva: '', engineHpRange: '', state: '', branch: '',
            customerName: '', gstNumber: '', contactPerson: '', contactNumber: '', mailId: '',
            purchaseManagerName: '', purchaseManagerContact: '', purchaseManagerEmail: '',
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
            coordinator: '', engineerEmpId: '', engineerName: '', engineerContact: '', advisor: '', status: 'Active', remarks: ''
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
                    <h2 style={{ margin: 0 }}>AMC Master</h2>
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
                    {(selectedIds.length > 0 || selectAllGlobally) && isAdmin && (
                        <button id="btn-bulk-delete" className="btn-primary" onClick={handleBulkDelete} style={{ background: 'var(--primary-red)' }}>
                            <Trash2 size={18} className="mr-2" /> Delete {selectAllGlobally ? `All ${totalAssets}` : `Selected (${selectedIds.length})`}
                        </button>
                    )}
                    {isAdmin && (
                        <button id="btn-add-asset" className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                            <Plus size={18} className="mr-2" /> {showForm ? 'Close Form' : 'Add Asset'}
                        </button>
                    )}
                </div>
            </div>

            {showStats && stats && (
                <div className="stats-section no-print mb-6 overflow-x-auto pb-2 custom-scrollbar bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex gap-4 min-w-max">
                        <div className="summary-card total" style={{ flex: '1 1 280px' }}>
                            <div className="icon-box"><Download size={24} /></div>
                            <div className="content">
                                <div className="label">Total Assets</div>
                                <div className="value">{stats.total}</div>
                            </div>
                        </div>
                        <div className="summary-card active" style={{ flex: '1 1 280px' }}>
                            <div className="icon-box"><CheckCircle2 size={24} /></div>
                            <div className="content">
                                <div className="label">Active Assets</div>
                                <div className="value">{stats.status?.active || 0}</div>
                            </div>
                        </div>
                        <div className="summary-card inactive" style={{ flex: '1 1 280px' }}>
                            <div className="icon-box"><AlertCircle size={24} /></div>
                            <div className="content">
                                <div className="label">Inactive Assets</div>
                                <div className="value">{stats.status?.inactive || 0}</div>
                            </div>
                        </div>
                        <div className="summary-card branches-count" style={{ flex: '1 1 280px' }}>
                            <div className="icon-box"><Building2 size={24} /></div>
                            <div className="content">
                                <div className="label">Total Branches</div>
                                <div className="value">{stats.branches?.length || 0}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="card shadow-sm p-5 bg-white rounded-2xl border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-700 mb-5 flex items-center">
                                <Building2 size={18} className="mr-2 text-blue-500" /> Branch Wise Breakdown
                            </h4>
                            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {stats.branches.map((b, idx) => (
                                    <div key={idx} className="breakdown-item">
                                        {b.name} - <span className="text-blue-600 ml-1">{b.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card shadow-sm p-5 bg-white rounded-2xl border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-700 mb-5 flex items-center">
                                <Calculator size={18} className="mr-2 text-purple-500" /> Engine HP Range Breakdown
                            </h4>
                            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {stats.hpRanges.map((h, idx) => (
                                    <div key={idx} className="breakdown-item">
                                        {h.range || 'N/A'} - <span className="text-purple-600 ml-1">{h.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    <label>Filter by State</label>
                    <select
                        value={searchFilters.state}
                        onChange={(e) => { setSearchFilters({ ...searchFilters, state: e.target.value, branch: '' }); setPage(1); }}
                    >
                        <option value="">All States</option>
                        {states.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                    </select>
                </div>
                <div className="filter-item">
                    <label>Filter by Branch</label>
                    <select
                        value={searchFilters.branch}
                        onChange={(e) => { setSearchFilters({ ...searchFilters, branch: e.target.value }); setPage(1); }}
                    >
                        <option value="">All Branches</option>
                        {allBranches.filter(b => b.state === searchFilters.state).map(b => (
                            <option key={b._id} value={b.branchName}>{b.branchName}</option>
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
                        <option value="Inactive">Inactive</option>
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
                            <label>Advisor</label>
                            <input name="advisor" value={searchFilters.advisor} onChange={handleSearchChange} placeholder="Search by Advisor" />
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
                        <div className="form-group">
                            <label>Contract End Month (Renewal)</label>
                            <select name="contractEndMonth" value={searchFilters.contractEndMonth} onChange={handleSearchChange}>
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
                                    <input
                                        type="text"
                                        value={formData.assetNumber}
                                        onChange={handleAssetNumberChange}
                                        required
                                        className={duplicateCheck.exists ? 'border-red-500' : ''}
                                        placeholder="e.g. ASSET8454"
                                    />
                                    {duplicateCheck.loading && <div className="text-xs text-gray-500 mt-1 flex items-center"><Loader size={12} className="animate-spin mr-1" /> Checking registry...</div>}
                                    {duplicateCheck.exists && (
                                        <div className="text-xs mt-1 font-medium bg-red-50 p-2 rounded border border-red-100" style={{ color: '#c0392b' }}>
                                            <AlertCircle size={14} className="inline mr-1" />
                                            Already registered in <strong>{duplicateCheck.module}</strong> for customer <strong>{duplicateCheck.customer}</strong>.
                                        </div>
                                    )}
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
                                    <label>State *</label>
                                    <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value, branch: '' })} required>
                                        <option value="">Select State</option>
                                        {states.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Branch *</label>
                                    <select value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} required>
                                        <option value="">Select Branch</option>
                                        {allBranches.filter(b => b.state === formData.state).map(b => (
                                            <option key={b._id} value={b.branchName}>{b.branchName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Coordinator</label>
                                    <input type="text" value={formData.coordinator} onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Asset Ownership - Engineer EMP Id</label>
                                    <select
                                        value={formData.engineerEmpId}
                                        onChange={(e) => {
                                            const selectedId = e.target.value;
                                            const employee = employeesList.find(emp => emp.employeeId === selectedId);
                                            setFormData({
                                                ...formData,
                                                engineerEmpId: selectedId,
                                                engineerName: employee ? employee.employeeName : '',
                                                engineerContact: employee ? (employee.contactNumber || employee.contactPhone || '') : ''
                                            });
                                        }}
                                    >
                                        <option value="">Select Engineer ID</option>
                                        {employeesList.map(emp => (
                                            <option key={emp._id} value={emp.employeeId}>{emp.employeeId} - {emp.employeeName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Asset Ownership - Engineer</label>
                                    <input type="text" value={formData.engineerName} onChange={(e) => setFormData({ ...formData, engineerName: e.target.value })} placeholder="Engineer Name" readOnly style={{ backgroundColor: '#f9fafb' }} />
                                </div>
                                <div className="form-group">
                                    <label>Engineer - Contact Number</label>
                                    <input type="text" value={formData.engineerContact} onChange={(e) => setFormData({ ...formData, engineerContact: e.target.value })} placeholder="Contact Number" readOnly style={{ backgroundColor: '#f9fafb' }} />
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
                                    <label>Purchase Manager Name</label>
                                    <input type="text" value={formData.purchaseManagerName} onChange={(e) => setFormData({ ...formData, purchaseManagerName: e.target.value })} placeholder="Manager Name" />
                                </div>
                                <div className="form-group">
                                    <label>Purchase Manager Contact</label>
                                    <input type="text" value={formData.purchaseManagerContact} onChange={(e) => setFormData({ ...formData, purchaseManagerContact: e.target.value })} placeholder="Contact Number" />
                                </div>
                                <div className="form-group">
                                    <label>Purchase Manager Email</label>
                                    <input type="email" value={formData.purchaseManagerEmail} onChange={(e) => setFormData({ ...formData, purchaseManagerEmail: e.target.value })} placeholder="Email ID" />
                                </div>
                                <div className="form-group">
                                    <label>Advisor</label>
                                    <input type="text" value={formData.advisor} onChange={(e) => setFormData({ ...formData, advisor: e.target.value })} placeholder="Advisor Name" />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <input type="text" value={formData.status} readOnly style={{ background: formData.status === 'Active' ? '#e8f5e9' : '#fce4e4', color: formData.status === 'Active' ? '#2e7d32' : '#c0392b', fontWeight: 'bold' }} />
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 5: Remarks */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <FileText size={18} /> Remarks
                            </div>
                            <div className="form-group" style={{ width: '100%' }}>
                                <textarea
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                    placeholder="Enter any additional remarks or notes here..."
                                    style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                        </div>

                        <div className="inline-form-footer">
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} style={{ width: '150px' }}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{ width: '220px' }}>{editMode ? 'Update Asset' : 'Save Asset'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container overflow-x-auto custom-scrollbar">
                {selectedIds.length === assets.length && assets.length > 0 && totalAssets > assets.length && !selectAllGlobally && (
                    <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', borderBottom: '1px solid #dbeafe' }}>
                        All {assets.length} assets on this page are selected.
                        <button
                            className="ml-2 font-bold hover:underline"
                            style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => setSelectAllGlobally(true)}
                        >
                            Select all {totalAssets} assets matching current filters
                        </button>
                    </div>
                )}
                {selectAllGlobally && (
                    <div style={{ backgroundColor: '#dbeafe', padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', borderBottom: '1px solid #bfdbfe' }}>
                        All {totalAssets} assets matching current filters are selected.
                        <button
                            className="ml-2 font-bold hover:underline"
                            style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => {
                                setSelectedIds([]);
                                setSelectAllGlobally(false);
                            }}
                        >
                            Clear selection
                        </button>
                    </div>
                )}
                {loading ? (
                    <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        checked={assets.length > 0 && (selectAllGlobally || selectedIds.length === assets.length)}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>Asset No</th>
                                <th style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>KVA</th>
                                <th style={{ minWidth: '200px', padding: '12px 8px' }}>Customer Name</th>
                                <th style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>Contact Person</th>
                                <th style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>Start Date</th>
                                <th style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>End Date</th>
                                <th style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>Visits</th>
                                <th style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>Basic Amount</th>
                                <th style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>Status</th>
                                <th style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset._id} className={selectedIds.includes(asset._id) ? 'selected-row' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(asset._id)}
                                            onChange={() => toggleSelectAsset(asset._id)}
                                        />
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}><strong>{asset.assetNumber}</strong></td>
                                    <td style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>{asset.kva || '-'}</td>
                                    <td style={{ minWidth: '200px', padding: '12px 8px' }}>{asset.customerName}</td>
                                    <td style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>{asset.contactPerson || '-'}</td>
                                    <td style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>{asset.contractStartDate ? new Date(asset.contractStartDate).toLocaleDateString() : '-'}</td>
                                    <td style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>{asset.contractEndDate ? new Date(asset.contractEndDate).toLocaleDateString() : '-'}</td>
                                    <td style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>{asset.noOfVisits || '0'}</td>
                                    <td style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>₹{(asset.basicAmount ?? 0).toLocaleString()}</td>
                                    <td style={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>
                                        <span className={`badge ${asset.status === 'Active' ? 'badge-user' : 'badge-admin'}`}
                                            style={{
                                                backgroundColor: asset.status === 'Active' ? '#dcfce7' : '#fef2f2',
                                                color: asset.status === 'Active' ? '#15803d' : '#dc2626'
                                            }}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <div className="flex gap-2">
                                            <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded" title="Preview" onClick={() => { setPreviewAsset(asset); setShowPreview(true); }}><Eye size={16} /></button>
                                            {isAdmin ? (
                                                <>
                                                    <button className="p-1.5 hover:bg-gray-100 rounded" onClick={() => handleEdit(asset)}><Edit2 size={16} /></button>
                                                    <button className="p-1.5 hover:bg-red-50 text-red rounded" onClick={() => handleDelete(asset._id)}><Trash2 size={16} /></button>
                                                </>
                                            ) : null}
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

            {/* Asset Preview Modal */}
            {showPreview && previewAsset && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', zIndex: 9999,
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    overflowY: 'auto', padding: '2rem 1rem'
                }} className="no-print">
                    <div id="asset-preview-content" style={{
                        background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '900px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden'
                    }}>
                        {/* Preview Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
                            color: '#fff', padding: '1.5rem 2rem',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Asset Details Preview</h2>
                                <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '0.9rem' }}>Asset No: <strong>{previewAsset.assetNumber}</strong></p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button onClick={() => window.print()} style={{
                                    background: '#fff', color: '#c0392b', border: 'none',
                                    borderRadius: '8px', padding: '0.5rem 1.2rem',
                                    cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <Printer size={16} /> Print to PDF
                                </button>
                                <button onClick={() => setShowPreview(false)} style={{
                                    background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)',
                                    borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600
                                }}>
                                    <X size={16} style={{ verticalAlign: 'middle' }} /> Close
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '2rem' }}>
                            {/* Section 1: Basic Asset Details */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ color: '#c0392b', borderBottom: '2px solid #fce4e4', paddingBottom: '0.5rem', margin: '0 0 1rem' }}>Basic Asset Details</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    {[['Asset Number', previewAsset.assetNumber], ['Model', previewAsset.model], ['KVA', previewAsset.kva], ['Engine HP Range', previewAsset.engineHpRange], ['Branch', previewAsset.branch], ['Coordinator', previewAsset.coordinator], ['Engineer Name', previewAsset.engineerName], ['Engineer Contact', previewAsset.engineerContact], ['Status', previewAsset.status], ['Remarks', previewAsset.remarks]].map(([label, val]) => (
                                        <div key={label} style={{ background: '#f8f9fa', borderRadius: '8px', padding: '0.75rem' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>{label}</div>
                                            <div style={{ fontWeight: 600, color: '#222' }}>{val || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2: Customer & Contract */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ color: '#c0392b', borderBottom: '2px solid #fce4e4', paddingBottom: '0.5rem', margin: '0 0 1rem' }}>Customer & Contract Information</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    {[
                                        ['Customer Name', previewAsset.customerName],
                                        ['GST Number', previewAsset.gstNumber],
                                        ['Contact Person', previewAsset.contactPerson],
                                        ['Contact Number', previewAsset.contactNumber],
                                        ['Mail ID', previewAsset.mailId],
                                        ['Purchase Manager Name', previewAsset.purchaseManagerName],
                                        ['Purchase Manager Contact', previewAsset.purchaseManagerContact],
                                        ['Purchase Manager Email', previewAsset.purchaseManagerEmail],
                                        ['Advisor', previewAsset.advisor],
                                        ['Contract Start Date', previewAsset.contractStartDate ? new Date(previewAsset.contractStartDate).toLocaleDateString() : '-'],
                                        ['Contract End Date', previewAsset.contractEndDate ? new Date(previewAsset.contractEndDate).toLocaleDateString() : '-'],
                                        ['Contract Period', previewAsset.contractPeriod],
                                        ['Months Pending', previewAsset.contractMonthsPending],
                                        ['No. of Visits', previewAsset.noOfVisits],
                                        ['Type of Visits', previewAsset.typeOfVisits],
                                    ].map(([label, val]) => (
                                        <div key={label} style={{ background: '#f8f9fa', borderRadius: '8px', padding: '0.75rem' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>{label}</div>
                                            <div style={{ fontWeight: 600, color: '#222' }}>{val || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 3: PO & Financials */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ color: '#c0392b', borderBottom: '2px solid #fce4e4', paddingBottom: '0.5rem', margin: '0 0 1rem' }}>PO & Financial Details</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    {[
                                        ['PO Type', previewAsset.poType],
                                        ['PO Number', previewAsset.purchaseOrderNo],
                                        ['PO Date', previewAsset.purchaseOrderDate ? new Date(previewAsset.purchaseOrderDate).toLocaleDateString() : '-'],
                                        ['Actual PO Received', previewAsset.actualPOReceived],
                                        ['Actual PO Received Date', previewAsset.actualPoReceivedDate ? new Date(previewAsset.actualPoReceivedDate).toLocaleDateString() : '-'],
                                        ['Quotation No', previewAsset.quotationNo],
                                        ['Quotation Date', previewAsset.quoteDate ? new Date(previewAsset.quoteDate).toLocaleDateString() : '-'],
                                        ['Payment Terms', previewAsset.paymentTerms],
                                        ['Billing Type', previewAsset.billingType],
                                    ].map(([label, val]) => (
                                        <div key={label} style={{ background: '#f8f9fa', borderRadius: '8px', padding: '0.75rem' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>{label}</div>
                                            <div style={{ fontWeight: 600, color: '#222' }}>{val || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                                {/* Amount Summary Bar */}
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <div style={{ flex: 1, background: '#e8f5e9', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#555' }}>Basic Amount</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2e7d32' }}>₹{(previewAsset.basicAmount ?? 0).toLocaleString()}</div>
                                    </div>
                                    <div style={{ flex: 1, background: '#fff3e0', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#555' }}>GST (18%)</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e65100' }}>₹{(previewAsset.gstAmount ?? 0).toLocaleString()}</div>
                                    </div>
                                    <div style={{ flex: 1, background: '#fce4e4', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#555' }}>Total Amount</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#c0392b' }}>₹{(previewAsset.totalAmount ?? 0).toLocaleString()}</div>
                                    </div>
                                    <div style={{ flex: 1, background: '#e3f2fd', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#555' }}>Last Year Basic</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1565c0' }}>₹{(previewAsset.lastYearPriceBasic ?? 0).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Billing Milestones */}
                            <div>
                                <h4 style={{ color: '#c0392b', borderBottom: '2px solid #fce4e4', paddingBottom: '0.5rem', margin: '0 0 1rem' }}>Billing Milestones</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                    {[1, 2, 3, 4].map(i => {
                                        const date = previewAsset[`q${i}Date`];
                                        const amount = previewAsset[`q${i}Amount`];
                                        const invNo = previewAsset[`q${i}TallyInvoiceNo`];
                                        const invDate = previewAsset[`q${i}InvoiceDate`];
                                        const payStatus = previewAsset[`q${i}PaymentStatus`];
                                        const payDetails = previewAsset[`q${i}PaymentDetails`];
                                        const payRecv = previewAsset[`q${i}PaymentReceivedDate`];
                                        const statusColor = payStatus === 'Yes' ? '#2e7d32' : payStatus === 'No' ? '#c0392b' : '#e65100';
                                        return (
                                            <div key={i} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '1rem', background: '#fafafa' }}>
                                                <div style={{ fontWeight: 700, color: '#c0392b', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Milestone {i}</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                    {[
                                                        ['Schedule Date', date ? new Date(date).toLocaleDateString() : '-'],
                                                        ['Amount', amount ? `₹${Number(amount).toLocaleString()}` : '-'],
                                                        ['Invoice No', invNo],
                                                        ['Invoice Date', invDate ? new Date(invDate).toLocaleDateString() : '-'],
                                                        ['Payment Details', payDetails],
                                                        ['Payment Recv Date', payRecv ? new Date(payRecv).toLocaleDateString() : '-'],
                                                    ].map(([lbl, v]) => (
                                                        <div key={lbl}>
                                                            <div style={{ fontSize: '0.7rem', color: '#999' }}>{lbl}</div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{v || '-'}</div>
                                                        </div>
                                                    ))}
                                                    <div style={{ gridColumn: '1 / -1' }}>
                                                        <div style={{ fontSize: '0.7rem', color: '#999' }}>Payment Status</div>
                                                        <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', background: payStatus ? statusColor + '22' : '#eee', color: payStatus ? statusColor : '#999', fontWeight: 700, fontSize: '0.85rem', marginTop: '2px' }}>
                                                            {payStatus || '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Styles */}
            <style>{`
            /* Summary Cards Styling */
            .summary-card {
                display: flex;
                align-items: center;
                padding: 1.25rem;
                border-radius: 16px;
                background: #fff;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                border: 1px solid rgba(0,0,0,0.03);
                transition: transform 0.2s;
            }
            .summary-card:hover { transform: translateY(-2px); }
            .summary-card .icon-box {
                padding: 12px;
                border-radius: 12px;
                margin-right: 1rem;
            }
            .summary-card.total .icon-box { background: #e0f2fe; color: #0369a1; }
            .summary-card.active .icon-box { background: #dcfce7; color: #15803d; }
            .summary-card.inactive .icon-box { background: #fef2f2; color: #dc2626; }
            .summary-card.branches-count .icon-box { background: #f3e8ff; color: #7e22ce; }
            
            .summary-card .label { font-size: 0.85rem; color: #64748b; font-weight: 500; }
            .summary-card .value { font-size: 1.75rem; font-weight: 800; color: #1e293b; }

            /* Breakdown Lists */
            .breakdown-item {
                display: inline-flex;
                align-items: center;
                padding: 6px 12px;
                background: #f8fafc;
                border-radius: 20px;
                border: 1px solid #e2e8f0;
                margin-bottom: 4px;
                font-size: 0.8rem;
                font-weight: 700;
                color: #1e293b;
                transition: all 0.2s;
            }
            .breakdown-item:hover {
                background: #f1f5f9;
                transform: translateY(-1px);
            }

            .table-container {
                background: white;
                border-radius: 16px;
                overflow-x: auto !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                margin-top: 1.5rem;
                border: 1px solid #eef0f2;
            }
            .table-container table {
                min-width: 1300px;
            }
            
            @media print {
                body > * { display: none !important; }
                #asset-preview-content { 
                    display: block !important; 
                    position: absolute !important; 
                    left: 0 !important; 
                    top: 0 !important; 
                    width: 100% !important; 
                    box-shadow: none !important; 
                    border-radius: 0 !important; 
                    background: white !important;
                }
                #asset-preview-content * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .no-print { display: none !important; }
            }

            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
        `}</style>
        </div>
    );
};

export default AssetMaster;
