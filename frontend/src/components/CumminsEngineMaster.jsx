import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Download, Upload, FileText, Search, X, Loader, Calculator, RefreshCw, FileSpreadsheet, Eye, Printer, CheckCircle2, AlertCircle, Building2, MapPin } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const CumminsEngineMaster = () => {
    const { user } = useContext(AuthContext);

    const [states, setStates] = useState([]);
    const [allBranches, setAllBranches] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);
    const [applications, setApplications] = useState([]);
    const [customerSegments, setCustomerSegments] = useState([]);
    const [industrySegments, setIndustrySegments] = useState([]);
    const [engines, setEngines] = useState([]);
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
        contractEndMonth: '', application: '', customerSegment: ''
    });

    const [selectedIds, setSelectedIds] = useState([]);
    const [totalEngines, setTotalEngines] = useState(0);
    const [selectAllGlobally, setSelectAllGlobally] = useState(false);
    const [stats, setStats] = useState({ total: 0, branches: [], hpRanges: [], status: { active: 0, inactive: 0 } });
    const [showStats, setShowStats] = useState(true);

    const [showPreview, setShowPreview] = useState(false);
    const [previewEngine, setPreviewEngine] = useState(null);

    const [formData, setFormData] = useState({
        assetNumber: '', model: '', kva: '', engineHpRange: '', state: '', branch: '',
        customerName: '', gstNumber: '', contactPerson: '', contactNumber: '', mailId: '',
        purchaseManagerName: '', purchaseManagerContact: '', purchaseManagerEmail: '',
        contractStartDate: '', contractEndDate: '', // Kept in state but removed from primary form as per request
        aCheckDatetime: '', calendarYear: '', installDatetime: '',
        industrySegment: '', application: '', customerSegment: '',
        noOfVisits: '', typeOfVisits: '',
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
        coordinator: '', engineerEmpId: '', engineerName: '', engineerContact: '', advisor: '', status: 'Active', remarks: '',
        assetType: '', bCheckDate: '', bCheckCalendarYear: '', bCheckValue: 0
    });

    const [duplicateCheck, setDuplicateCheck] = useState({ loading: false, exists: false, module: '', customer: '' });
    const [checkTimeout, setCheckTimeout] = useState(null);
    const [isCustomAssetType, setIsCustomAssetType] = useState(false);

    const isAdmin = ['Super Admin', 'Admin'].includes(user.role);
    const isSuperAdmin = user.role === 'Super Admin';

    useEffect(() => {
        fetchEngines();
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

            const { data: types } = await axios.get('/api/hrms/metadata?type=assetType', config);
            setAssetTypes(types);

            const { data: apps } = await axios.get('/api/hrms/metadata?type=application', config);
            setApplications(apps);

            const { data: segments } = await axios.get('/api/hrms/metadata?type=customerSegment', config);
            setCustomerSegments(segments);

            const { data: industries } = await axios.get('/api/hrms/metadata?type=industrySegment', config);
            setIndustrySegments(industries);

        } catch (error) {
            console.error('Error fetching master data:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/employees?pageSize=1000', config);
            if (data && data.employees) {
                setEmployeesList(data.employees);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/engines/stats', config);
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchEngines = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const queryParams = new URLSearchParams({
                pageNumber: page,
                keyword: searchTerm,
                ...searchFilters
            }).toString();
            const { data } = await axios.get(`/api/engines?${queryParams}`, config);
            setEngines(data.assets);
            setPages(data.pages);
            setTotalEngines(data.total);
            setSelectAllGlobally(false);
        } catch (error) {
            console.error('Error fetching engines:', error);
        }
        setLoading(false);
    };

    const handleSearchChange = (e) => {
        setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
    };

    const applyAdvancedSearch = () => {
        setPage(1);
        fetchEngines();
    };

    const resetSearch = () => {
        setSearchFilters({
            assetNumber: '', kva: '', engineHpRange: '', state: '', branch: '',
            coordinator: '', customerName: '', status: '',
            purchaseOrderNo: '', poMonth: '', billingMonth: '',
            contractPeriod: '', contractMonthsPending: '', engineerName: '', advisor: '',
            contractEndMonth: '', application: '', customerSegment: ''
        });
        setSearchTerm('');
        setPage(1);
        fetchEngines();
    };

    const downloadFullReport = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const { data } = await axios.get('/api/engines/export', config);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = `EngineReport_${new Date().toISOString().split('T')[0]}.xlsx`;
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
            const { data } = await axios.post('/api/engines/import', formDataFile, config);
            alert(`Import process completed.\nSuccessfully Imported: ${data.summary.successfullyImported}\nErrors: ${data.summary.validationErrors}`);
            fetchEngines();
        } catch (error) {
            alert(error.response?.data?.message || 'Error importing file');
        }
        setLoading(false);
    };

    const downloadTemplate = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const { data } = await axios.get('/api/engines/template', config);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'engine_import_template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading template:', error);
            alert('Template download failed');
        }
    };

    // Auto-calculations
    useEffect(() => {
        const basic = Number(formData.basicAmount) || 0;
        const gst = Number((basic * 0.18).toFixed(2));
        const total = Number((basic + gst).toFixed(2));

        if (formData.gstAmount !== gst || formData.totalAmount !== total) {
            setFormData(prev => ({ ...prev, gstAmount: gst, totalAmount: total }));
        }

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

            const endDate = new Date(formData.contractEndDate);
            endDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const newStatus = endDate < today ? 'Inactive' : 'Active';
            if (formData.status !== newStatus) {
                setFormData(prev => ({ ...prev, status: newStatus }));
            }
        }
    }, [formData.basicAmount, formData.lastYearPriceBasic, formData.contractStartDate, formData.contractEndDate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!window.confirm(`Are you sure you want to ${editMode ? 'update' : 'save'} this engine record?`)) {
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Ensure some default or legacy values if needed
            const submitData = { ...formData };
            if (editMode) {
                await axios.put(`/api/engines/${selectedId}`, submitData, config);
            } else {
                await axios.post('/api/engines', submitData, config);
            }
            setShowForm(false);
            resetForm();
            fetchEngines();
            fetchStats();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving engine');
        }
    };

    const handleEdit = (engine) => {
        const mappedData = { ...engine };
        const dateFields = [
            'contractStartDate', 'contractEndDate', 'purchaseOrderDate', 'quoteDate', 'actualPoReceivedDate',
            'q1Date', 'q1InvoiceDate', 'q1PaymentReceivedDate',
            'q2Date', 'q2InvoiceDate', 'q2PaymentReceivedDate',
            'q3Date', 'q3InvoiceDate', 'q3PaymentReceivedDate',
            'q4Date', 'q4InvoiceDate', 'q4PaymentReceivedDate',
            'aCheckDatetime', 'installDatetime'
        ];
        dateFields.forEach(field => {
            if (mappedData[field]) {
                mappedData[field] = mappedData[field].split('T')[0];
            }
        });
        setFormData(mappedData);
        setSelectedId(engine._id);
        setEditMode(true);
        setShowForm(true);
        setDuplicateCheck({ loading: false, exists: false, module: '', customer: '' });

        // Handle custom asset type
        const defaultAssetTypes = ['Oof', 'Paid', 'NEPI'];
        if (engine.assetType && !defaultAssetTypes.includes(engine.assetType)) {
            setIsCustomAssetType(true);
        } else {
            setIsCustomAssetType(false);
        }
    };

    const handleAssetNumberChange = (e) => {
        const value = e.target.value.trim();
        setFormData({ ...formData, assetNumber: e.target.value });

        if (editMode) return;

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
        if (window.confirm('Are you sure you want to delete this engine record?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/engines/${id}`, config);
                fetchEngines();
                fetchStats();
            } catch (error) {
                alert('Error deleting engine');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0 && !selectAllGlobally) return;
        const count = selectAllGlobally ? totalEngines : selectedIds.length;
        if (window.confirm(`Are you sure you want to delete ${count} engines?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.post('/api/engines/bulk-delete', {
                    ids: selectAllGlobally ? [] : selectedIds,
                    filters: selectAllGlobally ? { keyword: searchTerm, ...searchFilters } : null
                }, config);
                setSelectedIds([]);
                setSelectAllGlobally(false);
                fetchEngines();
                fetchStats();
            } catch (error) {
                alert('Error performing bulk delete');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            assetNumber: '', model: '', kva: '', engineHpRange: '', state: '', branch: '',
            customerName: '', gstNumber: '', contactPerson: '', contactNumber: '', mailId: '',
            purchaseManagerName: '', purchaseManagerContact: '', purchaseManagerEmail: '',
            contractStartDate: '', contractEndDate: '',
            aCheckDatetime: '', calendarYear: '', installDatetime: '',
            industrySegment: '', application: '', customerSegment: '',
            noOfVisits: '', typeOfVisits: '',
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
            coordinator: '', engineerEmpId: '', engineerName: '', engineerContact: '', advisor: '', status: 'Active', remarks: '',
            assetType: '', bCheckDate: '', bCheckCalendarYear: '', bCheckValue: 0
        });
        setEditMode(false);
        setSelectedId(null);
        setIsCustomAssetType(false);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === engines.length) {
            setSelectedIds([]);
            setSelectAllGlobally(false);
        } else {
            setSelectedIds(engines.map(e => e._id));
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

    return (
        <div className="engine-master-page p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <RefreshCw className="text-red" /> Engine Master
                    </h2>
                    <p className="text-gray-500 text-sm">Comprehensive Cummins engine inventory and lifecycle management</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary flex items-center gap-2" onClick={() => setShowStats(!showStats)}>
                        {showStats ? 'Hide Stats' : 'Show Stats'}
                    </button>
                    {isAdmin && (
                        <button className="btn-primary flex items-center gap-2" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                            <Plus size={18} /> {showForm ? 'Close Form' : 'Register New Engine'}
                        </button>
                    )}
                </div>
            </div>

            {showStats && (
                <div className="flex flex-wrap lg:flex-nowrap gap-4 mb-6">
                    <div className="summary-card total flex-1 min-w-[200px]">
                        <div className="icon-box"><FileText size={20} /></div>
                        <div className="content">
                            <div className="label">Total Engines</div>
                            <div className="value">{stats.total}</div>
                        </div>
                    </div>
                    <div className="summary-card active flex-1 min-w-[200px]">
                        <div className="icon-box"><CheckCircle2 size={20} /></div>
                        <div className="content">
                            <div className="label">Active Units</div>
                            <div className="value text-green-600">{stats.status?.active || 0}</div>
                        </div>
                    </div>
                    <div className="summary-card inactive flex-1 min-w-[200px]">
                        <div className="icon-box"><AlertCircle size={20} /></div>
                        <div className="content">
                            <div className="label">Inactive Units</div>
                            <div className="value text-red-600">{stats.status?.inactive || 0}</div>
                        </div>
                    </div>
                    <div className="summary-card branches-count flex-1 min-w-[200px]">
                        <div className="icon-box"><Building2 size={20} /></div>
                        <div className="content">
                            <div className="label">Regional Coverage</div>
                            <div className="value">{stats.branches?.length || 0} Branches</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0 md:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Global search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-full" />
                    </div>
                    <button className={`btn-secondary flex items-center gap-2 ${showAdvancedSearch ? 'bg-gray-200' : ''}`} onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                        <Search size={16} /> Advanced Search
                    </button>
                    <button className="btn-secondary" onClick={resetSearch} title="Reset all filters"><RefreshCw size={16} /></button>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="btn-secondary flex items-center gap-2 flex-grow md:flex-grow-0" onClick={downloadFullReport}><Download size={16} /> Export</button>
                    {isAdmin && (
                        <>
                            <div className="relative flex-grow md:flex-grow-0">
                                <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                                    <Upload size={16} /> Import <input type="file" className="hidden" onChange={handleBulkImport} accept=".xlsx,.xls" />
                                </label>
                            </div>
                            <button className="btn-secondary p-2" onClick={downloadTemplate} title="Download Template"><FileSpreadsheet size={16} /></button>
                            {isSuperAdmin && (selectedIds.length > 0 || selectAllGlobally) && (
                                <button className="btn-red flex items-center gap-2" onClick={handleBulkDelete}>
                                    <Trash2 size={16} /> Delete ({selectAllGlobally ? totalEngines : selectedIds.length})
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showAdvancedSearch && (
                <div className="card p-4 mb-4 bg-gray-50 border border-gray-200">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <input name="assetNumber" placeholder="Engine Number" value={searchFilters.assetNumber} onChange={handleSearchChange} />
                        <input name="customerName" placeholder="Customer Name" value={searchFilters.customerName} onChange={handleSearchChange} />
                        <select name="state" value={searchFilters.state} onChange={handleSearchChange}>
                            <option value="">All States</option>
                            {states.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                        </select>
                        <select name="branch" value={searchFilters.branch} onChange={handleSearchChange}>
                            <option value="">All Branches</option>
                            {allBranches.filter(b => b.state === searchFilters.state).map(b => (
                                <option key={b._id} value={b.branchName}>{b.branchName}</option>
                            ))}
                        </select>
                        <select name="status" value={searchFilters.status} onChange={handleSearchChange}>
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <input name="kva" placeholder="KVA" value={searchFilters.kva} onChange={handleSearchChange} />
                        <input name="engineHpRange" placeholder="HP Range" value={searchFilters.engineHpRange} onChange={handleSearchChange} />
                        <input name="application" placeholder="Application" value={searchFilters.application} onChange={handleSearchChange} />
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                        <button className="btn-secondary text-sm" onClick={resetSearch}>Clear All</button>
                        <button className="btn-primary text-sm" onClick={applyAdvancedSearch}>Search Engines</button>
                    </div>
                </div>
            )}

            {showForm && (
                <div className="card p-6 mb-6 relative border-t-4 border-red shadow-lg rounded-xl max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                            <Plus size={20} className="text-red-600" />
                            {editMode ? 'Edit Asset' : 'Register New Asset'}
                        </h3>
                        <button
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-semibold"
                            onClick={() => setShowForm(false)}
                        >
                            <X size={18} /> Cancel
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            {/* Section 1: Basic Details */}
                            <div className="col-span-full mb-4">
                                <h4 className="font-bold text-red flex items-center gap-2 section-header-premium">
                                    <span className="red-bar"></span> BASIC ASSET DETAILS
                                </h4>
                            </div>
                            <div className="form-group">
                                <label>Asset Number *</label>
                                <input
                                    type="text"
                                    value={formData.assetNumber}
                                    onChange={handleAssetNumberChange}
                                    placeholder="Asset Number"
                                    required
                                    className={duplicateCheck.exists ? 'border-red-500' : ''}
                                />
                                {duplicateCheck.loading && <div className="text-xs text-gray-500 mt-1 flex items-center"><Loader size={12} className="animate-spin mr-1" /> Checking registry...</div>}
                                {duplicateCheck.exists && (
                                    <div className="text-xs mt-1 font-medium bg-red-50 p-2 rounded border border-red-100" style={{ color: '#c0392b' }}>
                                        <AlertCircle size={14} className="inline mr-1" />
                                        Already registered in <strong>{duplicateCheck.module}</strong> for customer <strong>{duplicateCheck.customer}</strong>.
                                    </div>
                                )}
                            </div>
                            <div className="form-group"><label>Model *</label><input type="text" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} placeholder="Model" required /></div>
                            <div className="form-group"><label>KVA</label><input type="text" value={formData.kva} onChange={e => setFormData({ ...formData, kva: e.target.value })} placeholder="KVA" /></div>

                            <div className="form-group">
                                <label>Asset Type</label>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {!isCustomAssetType ? (
                                        <select
                                            value={formData.assetType}
                                            onChange={e => {
                                                if (e.target.value === 'CUSTOM_TYPE') {
                                                    setIsCustomAssetType(true);
                                                    setFormData({ ...formData, assetType: '' });
                                                } else {
                                                    setFormData({ ...formData, assetType: e.target.value });
                                                }
                                            }}
                                            className="w-full"
                                        >
                                            <option value="">Select Type</option>
                                            {assetTypes.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
                                            <option value="CUSTOM_TYPE">Other/Custom...</option>
                                        </select>
                                    ) : (
                                        <div style={{ flex: 1, display: 'flex', gap: '5px' }}>
                                            <input
                                                type="text"
                                                placeholder="Enter Asset Type"
                                                value={formData.assetType}
                                                onChange={e => setFormData({ ...formData, assetType: e.target.value })}
                                                className="w-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomAssetType(false);
                                                    setFormData({ ...formData, assetType: '' });
                                                }}
                                                className="btn-secondary"
                                                style={{ padding: '0 12px', height: '42px' }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group"><label>Engine HP Range</label><input type="text" value={formData.engineHpRange} onChange={e => setFormData({ ...formData, engineHpRange: e.target.value })} placeholder="Engine HP Range" /></div>
                            <div className="form-group">
                                <label>State *</label>
                                <select value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value, branch: '' })} required>
                                    <option value="">Select State</option>
                                    {states.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Branch *</label>
                                <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} required>
                                    <option value="">Select Branch</option>
                                    {allBranches.filter(b => b.state === formData.state).map(b => (
                                        <option key={b._id} value={b.branchName}>{b.branchName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group"><label>Coordinator</label><input type="text" value={formData.coordinator} onChange={e => setFormData({ ...formData, coordinator: e.target.value })} placeholder="Coordinator" /></div>
                            <div className="form-group">
                                <label>Asset Ownership - Engineer EMP Id</label>
                                <select value={formData.engineerEmpId} onChange={e => {
                                    const emp = employeesList.find(emp => emp.employeeId === e.target.value);
                                    setFormData({
                                        ...formData,
                                        engineerEmpId: e.target.value,
                                        engineerName: emp ? emp.employeeName : '',
                                        engineerContact: emp ? emp.phone : ''
                                    });
                                }}>
                                    <option value="">Select Engineer ID</option>
                                    {employeesList.map(emp => (
                                        <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeId} - {emp.employeeName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group"><label>Asset Ownership - Engineer</label><input type="text" value={formData.engineerName} readOnly className="bg-gray-50" placeholder="Engineer Name" /></div>

                            <div className="form-group"><label>Engineer - Contact Number</label><input type="text" value={formData.engineerContact} readOnly className="bg-gray-50" placeholder="Contact Number" /></div>

                            {/* Section 2: Engine Specific Details (NEW) */}
                            <div className="col-span-full mb-4 mt-6">
                                <h4 className="font-bold text-red flex items-center gap-2 section-header-premium">
                                    <span className="red-bar"></span> INSTALLATION & A-CHECK DETAILS
                                </h4>
                            </div>
                            <div className="form-group"><label>A Check Datetime</label><input type="date" value={formData.aCheckDatetime} onChange={e => setFormData({ ...formData, aCheckDatetime: e.target.value })} /></div>
                            <div className="form-group"><label>Calendar Year (Install/A Check)</label><input type="text" value={formData.calendarYear} onChange={e => setFormData({ ...formData, calendarYear: e.target.value })} placeholder="e.g. 2024" /></div>
                            <div className="form-group"><label>Install Datetime</label><input type="date" value={formData.installDatetime} onChange={e => setFormData({ ...formData, installDatetime: e.target.value })} /></div>
                            <div className="form-group"><label>Industry Segment</label><input type="text" value={formData.industrySegment} onChange={e => setFormData({ ...formData, industrySegment: e.target.value })} /></div>
                            <div className="form-group">
                                <label>Application</label>
                                <select value={formData.application} onChange={e => setFormData({ ...formData, application: e.target.value })}>
                                    <option value="">Select Application</option>
                                    {applications.map(a => <option key={a._id} value={a.name}>{a.name}</option>)}
                                </select>
                            </div>

                            {/* Section 2.1: B-Check Details (NEW) */}
                            <div className="col-span-full mb-4 mt-6">
                                <h4 className="font-bold text-red flex items-center gap-2 section-header-premium">
                                    <span className="red-bar"></span> B-CHECK DETAILS
                                </h4>
                            </div>
                            <div className="form-group"><label>B-Check Date</label><input type="date" value={formData.bCheckDate} onChange={e => setFormData({ ...formData, bCheckDate: e.target.value })} /></div>
                            <div className="form-group"><label>Calendar Year (B Check)</label><input type="text" value={formData.bCheckCalendarYear} onChange={e => setFormData({ ...formData, bCheckCalendarYear: e.target.value })} placeholder="e.g. 2024" /></div>
                            <div className="form-group"><label>Value of B-Check</label><input type="number" value={formData.bCheckValue} onChange={e => setFormData({ ...formData, bCheckValue: e.target.value })} placeholder="0" /></div>

                            <div className="form-group">
                                <label>Customer Segment</label>
                                <select value={formData.customerSegment} onChange={e => setFormData({ ...formData, customerSegment: e.target.value })}>
                                    <option value="">Select Segment</option>
                                    {customerSegments.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>

                            {/* Section 3: Customer Details */}
                            <div className="col-span-full mb-4 mt-6">
                                <h4 className="font-bold text-red flex items-center gap-2 section-header-premium">
                                    <span className="red-bar"></span> CUSTOMER & CONTRACT INFORMATION
                                </h4>
                            </div>
                            <div className="form-group"><label>Customer Name *</label><input type="text" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} required placeholder="Customer Name" /></div>
                            <div className="form-group"><label>GST Number</label><input type="text" value={formData.gstNumber} onChange={e => setFormData({ ...formData, gstNumber: e.target.value })} placeholder="GST Number" /></div>
                            <div className="form-group"><label>Contact Person</label><input type="text" value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} placeholder="Contact Person" /></div>

                            <div className="form-group"><label>Contact Number</label><input type="text" value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} placeholder="Contact Number" /></div>
                            <div className="form-group"><label>Mail ID</label><input type="email" value={formData.mailId} onChange={e => setFormData({ ...formData, mailId: e.target.value })} placeholder="Email Address" /></div>
                            <div className="form-group"><label>Purchase Manager Name</label><input type="text" value={formData.purchaseManagerName} onChange={e => setFormData({ ...formData, purchaseManagerName: e.target.value })} placeholder="Manager Name" /></div>

                            <div className="form-group"><label>Manager Contact</label><input type="text" value={formData.purchaseManagerContact} onChange={e => setFormData({ ...formData, purchaseManagerContact: e.target.value })} placeholder="Manager Phone" /></div>
                            <div className="form-group"><label>Manager Email</label><input type="email" value={formData.purchaseManagerEmail} onChange={e => setFormData({ ...formData, purchaseManagerEmail: e.target.value })} placeholder="Manager Email" /></div>
                            <div className="form-group"><label>Advisor</label><input type="text" value={formData.advisor} onChange={e => setFormData({ ...formData, advisor: e.target.value })} placeholder="Advisor" /></div>

                            <div className="col-span-full mt-8 flex justify-end gap-3 pt-6 border-t">
                                <button type="button" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-2.5 rounded-lg font-bold transition-all" onClick={() => setShowForm(false)}>Discard</button>
                                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-10 py-2.5 rounded-lg font-bold shadow-lg shadow-red-200 transition-all flex items-center gap-2">
                                    <CheckCircle2 size={18} /> {editMode ? 'Update' : 'Save'} Asset Details
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container custom-scrollbar">
                {selectedIds.length === engines.length && engines.length > 0 && totalEngines > engines.length && !selectAllGlobally && (
                    <div className="bg-blue-50 p-2 text-center text-sm border-b">
                        All {engines.length} engines on this page are selected.
                        <button className="ml-2 font-bold text-blue-600 hover:underline" onClick={() => setSelectAllGlobally(true)}>Select all {totalEngines} engines</button>
                    </div>
                )}
                <table>
                    <thead>
                        <tr>
                            <th className="w-10"><input type="checkbox" checked={engines.length > 0 && (selectAllGlobally || selectedIds.length === engines.length)} onChange={toggleSelectAll} /></th>
                            <th>Engine Number</th>
                            <th>Customer</th>
                            <th>Model</th>
                            <th>Application</th>
                            <th>Branch</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {engines.map(engine => (
                            <tr key={engine._id} className={selectedIds.includes(engine._id) ? 'bg-blue-50' : ''}>
                                <td><input type="checkbox" checked={selectedIds.includes(engine._id)} onChange={() => toggleSelectAsset(engine._id)} /></td>
                                <td className="font-bold">{engine.assetNumber}</td>
                                <td>{engine.customerName}</td>
                                <td>{engine.model}</td>
                                <td><span className="text-xs bg-gray-100 px-2 py-1 rounded">{engine.application || '-'}</span></td>
                                <td>{engine.branch}</td>
                                <td><span className={`badge ${engine.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{engine.status}</span></td>
                                <td>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setPreviewEngine(engine); setShowPreview(true); }} className="p-1.5 hover:bg-gray-100 rounded text-blue-600"><Eye size={16} /></button>
                                        {isAdmin && (
                                            <button onClick={() => handleEdit(engine)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Edit2 size={16} /></button>
                                        )}
                                        {isAdmin && (
                                            <button onClick={() => handleDelete(engine._id)} className="p-1.5 hover:bg-gray-100 rounded text-red-600"><Trash2 size={16} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-center p-4 border-t" style={{ fontSize: '0.85rem' }}>
                    <div className="text-gray-600">Showing page {page} of {pages > 0 ? pages : 1} entries ({totalEngines} total records)</div>
                    <div className="pagination-controls">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                        <button className="active">{page}</button>
                        <button disabled={page === pages || pages === 0} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                </div>
            </div>

            {showPreview && previewEngine && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    padding: '2.5rem 1rem', overflowY: 'auto'
                }} className="no-print animate-fade-in">
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '1000px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
                    }}>
                        {/* Preview Header */}
                        <div style={{
                            backgroundColor: '#cc3333', padding: '1.5rem 2rem', color: '#fff',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Asset Details Preview</h2>
                                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>Asset No: <strong>{previewEngine.assetNumber}</strong></p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
                                <button
                                    onClick={() => window.print()}
                                    style={{
                                        backgroundColor: '#fff', color: '#333', border: 'none',
                                        borderRadius: '8px', padding: '0.6rem 1.2rem', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                                    }}
                                >
                                    <Printer size={18} /> Print to PDF
                                </button>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px',
                                        padding: '0.6rem 1.2rem', fontWeight: 700, cursor: 'pointer'
                                    }}
                                >
                                    <X size={20} style={{ verticalAlign: 'middle' }} /> Close
                                </button>
                            </div>
                        </div>

                        <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible print:p-0">
                            {/* Section 1: Basic Asset Details */}
                            <div className="mb-8 print:mb-10">
                                <h3 className="text-[#cc3333] font-extrabold text-xl mb-6 pb-2 border-b-2 border-red-50 flex items-center gap-3 print:text-[#cc3333]">
                                    <Building2 size={20} className="text-red-600" /> Basic Asset Details
                                </h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '15px',
                                    width: '100%'
                                }}>
                                    {[
                                        ['Asset Number', previewEngine.assetNumber],
                                        ['Model', previewEngine.model],
                                        ['KVA', previewEngine.kva],
                                        ['Asset Type', previewEngine.assetType],
                                        ['HP Range', previewEngine.engineHpRange],
                                        ['Branch', previewEngine.branch],
                                        ['Coordinator', previewEngine.coordinator],
                                        ['Engineer Name', previewEngine.engineerName],
                                        ['Contact', previewEngine.engineerContact],
                                        ['Current Status', previewEngine.status],
                                        ['Remarks', previewEngine.remarks]
                                    ].map(([label, value]) => (
                                        <div key={label} style={{
                                            backgroundColor: '#fcfcfc',
                                            border: '1px solid #f1f3f5',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            height: '70px'
                                        }} className="preview-field-box">
                                            <div style={{ color: '#888', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
                                            <div style={{ color: '#222', fontSize: '14px', fontWeight: 700, wordBreak: 'break-all' }}>{value || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2: Maintenance Details */}
                            <div className="mb-8 print:mb-10">
                                <h3 className="text-[#cc3333] font-extrabold text-xl mb-6 pb-2 border-b-2 border-red-50 flex items-center gap-3 print:text-[#cc3333]">
                                    < Calculator size={20} className="text-red-600" /> Maintenance & B-Check
                                </h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '15px',
                                    width: '100%'
                                }}>
                                    {[
                                        ['A Check Date', previewEngine.aCheckDatetime ? new Date(previewEngine.aCheckDatetime).toLocaleDateString('en-GB') : '-'],
                                        ['Calendar Year (A)', previewEngine.calendarYear],
                                        ['Install Date', previewEngine.installDatetime ? new Date(previewEngine.installDatetime).toLocaleDateString('en-GB') : '-'],
                                        ['B Check Date', previewEngine.bCheckDate ? new Date(previewEngine.bCheckDate).toLocaleDateString('en-GB') : '-'],
                                        ['Calendar Year (B)', previewEngine.bCheckCalendarYear],
                                        ['Value of B-Check', previewEngine.bCheckValue ? `₹${Number(previewEngine.bCheckValue).toLocaleString()}` : '-'],
                                    ].map(([label, value]) => (
                                        <div key={label} style={{
                                            backgroundColor: '#fcfcfc',
                                            border: '1px solid #f1f3f5',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            height: '70px'
                                        }} className="preview-field-box">
                                            <div style={{ color: '#888', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
                                            <div style={{ color: '#222', fontSize: '14px', fontWeight: 700 }}>{value || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 3: Customer Information */}
                            <div className="mb-8 print:mb-0">
                                <h3 className="text-[#cc3333] font-extrabold text-xl mb-6 pb-2 border-b-2 border-red-50 flex items-center gap-3 print:text-[#cc3333]">
                                    < FileText size={20} className="text-red-600" /> Customer & Contract info
                                </h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '15px',
                                    width: '100%'
                                }}>
                                    {[
                                        ['Customer Name', previewEngine.customerName],
                                        ['GST Number', previewEngine.gstNumber],
                                        ['Contact Person', previewEngine.contactPerson],
                                        ['Contact Number', previewEngine.contactNumber],
                                        ['Mail ID', previewEngine.mailId],
                                        ['Manager Name', previewEngine.purchaseManagerName],
                                        ['Manager Phone', previewEngine.purchaseManagerContact],
                                        ['Manager Email', previewEngine.purchaseManagerEmail],
                                        ['Advisor', previewEngine.advisor],
                                        ['Start Date', previewEngine.contractStartDate ? new Date(previewEngine.contractStartDate).toLocaleDateString('en-GB') : '-'],
                                        ['End Date', previewEngine.contractEndDate ? new Date(previewEngine.contractEndDate).toLocaleDateString('en-GB') : '-'],
                                        ['Period', previewEngine.contractPeriod],
                                    ].map(([label, value]) => (
                                        <div key={label} style={{
                                            backgroundColor: '#fcfcfc',
                                            border: '1px solid #f1f3f5',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            height: '70px'
                                        }} className="preview-field-box">
                                            <div style={{ color: '#888', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
                                            <div style={{ color: '#222', fontSize: '14px', fontWeight: 700 }}>{value || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .engine-master-page .summary-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }
                .engine-master-page .icon-box {
                    padding: 0.75rem;
                    border-radius: 10px;
                }
                .summary-card.total .icon-box { background: #eff6ff; color: #2563eb; }
                .summary-card.active .icon-box { background: #ecfdf5; color: #10b981; }
                .summary-card.inactive .icon-box { background: #fef2f2; color: #ef4444; }
                .summary-card.branches-count .icon-box { background: #fdf4ff; color: #d946ef; }
                .engine-master-page .label { font-size: 0.875rem; color: #6b7280; }
                .engine-master-page .value { font-size: 1.5rem; font-weight: 800; color: #111827; }
                
                .engine-master-page .table-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1);
                }
                .engine-master-page table { width: 100%; border-collapse: collapse; }
                .engine-master-page th { background: #f9fafb; padding: 1rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: #4b5563; font-weight: 600; }
                .engine-master-page td { padding: 1rem; border-top: 1px solid #f3f4f6; font-size: 0.875rem; }
                .engine-master-page tr:hover { background: #f9fafb; }
                
                .badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
                .badge-success { background: #dcfce7; color: #166534; }
                .badge-danger { background: #fee2e2; color: #991b1b; }
                
                .btn-red { background: #dc2626; color: white; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; }
                .btn-red:hover { background: #b91c1c; }

                .section-header-premium {
                    background: #fdfdfd;
                    padding: 10px 15px;
                    border-radius: 4px;
                    position: relative;
                    letter-spacing: 0.5px;
                    font-size: 0.9rem;
                }
                .red-bar {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 24px;
                    background: #dc2626;
                    border-radius: 0 4px 4px 0;
                }
                .form-grid {
                    display: grid !important;
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 1rem;
                }
                .col-span-full {
                    grid-column: 1 / -1 !important;
                }
                .engine-master-page .form-group {
                    display: flex;
                    flex-direction: column;
                }
                .engine-master-page .form-group label {
                    font-size: 0.8rem;
                    color: #666;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                .engine-master-page input, .engine-master-page select {
                    width: 100%;
                    box-sizing: border-box;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    padding: 6px 10px;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                    background: #f9fafb;
                }
                .engine-master-page input:focus, .engine-master-page select:focus {
                    outline: none;
                    border-color: #dc2626;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.05);
                }

                @media print {
                    .no-print, header, nav, .btn-primary, .btn-secondary, .table-container, .card:not(.fixed *), .summary-card {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .fixed.inset-0 {
                        position: relative !important;
                        background: white !important;
                        display: block !important;
                        padding: 0 !important;
                        z-index: auto !important;
                    }
                    .fixed.inset-0 .bg-black {
                        display: none !important;
                    }
                    .fixed.inset-0 .bg-white {
                        max-width: none !important;
                        box-shadow: none !important;
                        border: none !important;
                        width: 100% !important;
                    }
                    .bg-[#cc3333] {
                        background-color: #cc3333 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .bg-gray-50 {
                        background-color: #f9fafb !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .form-grid {
                        display: grid !important;
                        grid-template-columns: repeat(3, 1fr) !important;
                        gap: 10px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default CumminsEngineMaster;
