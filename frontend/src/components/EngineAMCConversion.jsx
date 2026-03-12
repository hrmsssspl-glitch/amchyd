import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
    Search, Filter, MessageSquareQuote, X, Calendar, User,
    Phone, Mail, CheckCircle, Plus, Landmark, Calculator,
    Percent, ShieldCheck, FileSpreadsheet, Edit, Eye,
    TrendingUp, AlertCircle, Loader2, ChevronLeft, ChevronRight,
    Database
} from 'lucide-react';
import * as XLSX from 'xlsx';

const EngineAMCConversion = () => {
    const { user } = useContext(AuthContext);
    const [engines, setEngines] = useState([]);
    const [filteredEngines, setFilteredEngines] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    // Search Node States
    const [assetSearchTerm, setAssetSearchTerm] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [fetchedEngine, setFetchedEngine] = useState(null);

    // UI States
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showFollowupModal, setShowFollowupModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [selectedEngine, setSelectedEngine] = useState(null);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [searchFilters, setSearchFilters] = useState({
        assetNumber: '', branch: '', customerName: ''
    });

    // Conversion Form State
    const [conversionForm, setConversionForm] = useState({
        conversionQuotationNo: '',
        conversionQuoteDate: '',
        conversionQuoteValue: '',
        conversionGstValue: '',
        conversionTotalValue: '',
        conversionQuoteCreatedBy: '',
        conversionRevisedQuoteDate: '',
        conversionRevisedQuoteValue: '',
        conversionRevisedGstValue: '',
        conversionRevisedTotalValue: '',
        conversionRevisedPriceApprovedBy: '',
        conversionQuoteStatus: '',
        conversionNoOfVisits: '',
        conversionTypeOfVisits: '',
        conversionQuoteAssignedToId: '',
        conversionQuoteAssignedToName: '',
        conversionModifiedById: user?.employeeId || '',
        conversionModifiedByName: user?.employeeName || ''
    });

    // Follow-up Form State
    const [followupForm, setFollowupForm] = useState({
        employeeId: '',
        employeeName: '',
        empContactNumber: '',
        followUpDate: new Date().toISOString().split('T')[0],
        customerContactedName: '',
        customerContactNumber: '',
        customerContactEmail: '',
        remarks: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [empLookupStatus, setEmpLookupStatus] = useState('');
    const lookupTimeout = useRef(null);

    // Initial Fetch
    useEffect(() => {
        fetchEngines();
        fetchEmployees();
        fetchStats();
    }, []);

    const fetchEngines = async () => {
        setLoading(true);
        try {
            if (!user?.token) return;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('/api/engines/all', config);
            setEngines(Array.isArray(res.data) ? res.data : []);
            setFilteredEngines(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Fetch Engines Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            if (!user?.token) return;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('/api/employees?pageSize=1000', config);
            setEmployees(res.data.employees || []);
        } catch (err) {
            console.error('Fetch Employees Error:', err);
        }
    };

    const fetchStats = async () => {
        try {
            if (!user?.token) return;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('/api/engines/stats', config);
            setStats(res.data);
        } catch (err) {
            console.error('Stats Error:', err);
        }
    };

    // Filter Logic
    useEffect(() => {
        const filtered = engines.filter(e => {
            const assetNo = String(e.assetNumber || '').toLowerCase();
            const customer = String(e.customerName || '').toLowerCase();
            const branch = String(e.branch || '').toLowerCase();
            const search = searchTerm.toLowerCase();

            const matchesKeyword = assetNo.includes(search) || customer.includes(search) || branch.includes(search);
            const matchesAssetFilter = !searchFilters.assetNumber || assetNo.includes(searchFilters.assetNumber.toLowerCase());
            const matchesCustomerFilter = !searchFilters.customerName || customer.includes(searchFilters.customerName.toLowerCase());
            const matchesBranchFilter = !searchFilters.branch || branch === searchFilters.branch.toLowerCase();

            return matchesKeyword && matchesAssetFilter && matchesCustomerFilter && matchesBranchFilter;
        });
        setFilteredEngines(filtered);
        setPage(1);
    }, [searchTerm, searchFilters, engines]);

    // Financial Calculations
    useEffect(() => {
        const val = parseFloat(conversionForm.conversionQuoteValue) || 0;
        const gst = parseFloat((val * 0.18).toFixed(2));
        const total = parseFloat((val + gst).toFixed(2));
        setConversionForm(prev => ({ ...prev, conversionGstValue: gst, conversionTotalValue: total }));
    }, [conversionForm.conversionQuoteValue]);

    useEffect(() => {
        const val = parseFloat(conversionForm.conversionRevisedQuoteValue) || 0;
        const gst = parseFloat((val * 0.18).toFixed(2));
        const total = parseFloat((val + gst).toFixed(2));
        setConversionForm(prev => ({ ...prev, conversionRevisedGstValue: gst, conversionRevisedTotalValue: total }));
    }, [conversionForm.conversionRevisedQuoteValue]);

    // Registration Node Search
    const fetchEngineByAssetNo = async () => {
        if (!assetSearchTerm || !user?.token) return;
        setIsFetching(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`/api/engines/asset/${assetSearchTerm}`, config);
            if (res.data) {
                setFetchedEngine(res.data);
                startEditing(res.data);
            } else {
                alert('Engine not localized in system registry.');
            }
        } catch (err) {
            console.error('Search Error:', err);
            alert('Search failed or Asset not localized.');
        } finally {
            setIsFetching(false);
        }
    };

    const startEditing = (engine) => {
        setFetchedEngine(engine);
        setConversionForm({
            conversionQuotationNo: engine.conversionQuotationNo || '',
            conversionQuoteDate: engine.conversionQuoteDate ? new Date(engine.conversionQuoteDate).toISOString().split('T')[0] : '',
            conversionQuoteValue: engine.conversionQuoteValue || '',
            conversionGstValue: engine.conversionGstValue || '',
            conversionTotalValue: engine.conversionTotalValue || '',
            conversionQuoteCreatedBy: engine.conversionQuoteCreatedBy || '',
            conversionRevisedQuoteDate: engine.conversionRevisedQuoteDate ? new Date(engine.conversionRevisedQuoteDate).toISOString().split('T')[0] : '',
            conversionRevisedQuoteValue: engine.conversionRevisedQuoteValue || '',
            conversionRevisedGstValue: engine.conversionRevisedGstValue || '',
            conversionRevisedTotalValue: engine.conversionRevisedTotalValue || '',
            conversionRevisedPriceApprovedBy: engine.conversionRevisedPriceApprovedBy || '',
            conversionQuoteStatus: engine.conversionQuoteStatus || '',
            conversionNoOfVisits: engine.conversionNoOfVisits || '',
            conversionTypeOfVisits: engine.conversionTypeOfVisits || '',
            conversionQuoteAssignedToId: engine.conversionQuoteAssignedToId || '',
            conversionQuoteAssignedToName: engine.conversionQuoteAssignedToName || '',
            conversionModifiedById: user?.employeeId || '',
            conversionModifiedByName: user?.employeeName || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const saveChanges = async () => {
        if (!fetchedEngine || !user?.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/engines/update/${fetchedEngine._id}`, conversionForm, config);
            alert('Chronological Registry Secured Successfully.');
            setFetchedEngine(null);
            setShowSearchModal(false);
            fetchEngines();
        } catch (err) {
            console.error('Update Error:', err);
            alert('Failed to secure registry entry.');
        }
    };

    // Follow-up Logic
    const handleOpenFollowup = (engine) => {
        setSelectedEngine(engine);
        setEmpLookupStatus('');
        setFollowupForm({
            employeeId: '',
            employeeName: '',
            empContactNumber: '',
            followUpDate: new Date().toISOString().split('T')[0],
            customerContactedName: engine.contactPerson || '',
            customerContactNumber: engine.contactNumber || '',
            customerContactEmail: engine.mailId || '',
            remarks: ''
        });
        setShowFollowupModal(true);
    };

    const handleEmpIdChange = (e) => {
        const val = e.target.value;
        setFollowupForm(prev => ({ ...prev, employeeId: val, employeeName: '', empContactNumber: '' }));
        setEmpLookupStatus('');
        if (lookupTimeout.current) clearTimeout(lookupTimeout.current);
        lookupTimeout.current = setTimeout(() => {
            if (!val.trim()) return;
            const match = employees.find(emp => emp.employeeId?.toLowerCase() === val.trim().toLowerCase());
            if (match) {
                setFollowupForm(prev => ({ ...prev, employeeName: match.employeeName || '', empContactNumber: match.contactNumber || '' }));
                setEmpLookupStatus('found');
            } else {
                setEmpLookupStatus('notfound');
            }
        }, 400);
    };

    const submitFollowup = async (e) => {
        e.preventDefault();
        if (!user?.token) return;
        setSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(`/api/engines/followup/${selectedEngine._id}`, followupForm, config);
            setSelectedEngine(res.data);
            setEngines(prev => prev.map(en => en._id === res.data._id ? res.data : en));
            setFollowupForm(prev => ({ ...prev, remarks: '' }));
            alert('Follow-up record committed to audit trail.');
        } catch (err) {
            console.error('Followup Error:', err);
            alert('Communication log failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const exportToExcel = () => {
        const data = filteredEngines.map(e => ({
            'Asset No': e.assetNumber,
            'Customer Name': e.customerName,
            'Branch': e.branch,
            'Quotation': e.conversionQuotationNo || '-',
            'Status': e.conversionQuoteStatus || 'PENDING',
            'Value': e.conversionQuoteValue || 0,
            'Assigned To': e.conversionQuoteAssignedToName || '-'
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registration Registry");
        XLSX.writeFile(wb, "Engine_AMC_Conversion.xlsx");
    };

    const pages = Math.ceil(filteredEngines.length / limit);
    const currentEngines = filteredEngines.slice((page - 1) * limit, page * limit);

    return (
        <div className="asset-master p-6 bg-gray-50 min-h-screen">
            <div className="max-w-[1600px] mx-auto pt-4">

                {/* Card 1: Registration Node (Search & Entry) */}
                <div className="table-container-fux mb-10">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1.5rem 1.75rem', borderBottom: '1px solid #f1f5f9', borderRadius: '24px 24px 0 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.625rem', background: '#fef2f2', color: '#ef4444', borderRadius: '0.75rem', display: 'flex' }}>
                                <Landmark size={20} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Registration Node</h2>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Initialize new AMC conversion record</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <button
                                onClick={() => {
                                    setAssetSearchTerm('');
                                    setFetchedEngine(null);
                                    setShowSearchModal(true);
                                }}
                                className="btn-primary flex items-center gap-2"
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.2)' }}
                            >
                                <Plus size={18} /> New Transformation
                            </button>
                            <div className="flex items-center gap-3 py-2 px-5 bg-gray-50 border border-gray-100 rounded-2xl">
                                <TrendingUp size={16} className="text-red-500" />
                                <div className="flex flex-col">
                                    <span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Node</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b' }}>{stats.total} <span className="text-[10px] text-gray-300">UNITS</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white">
                        <div className="flex flex-col xl:flex-row items-stretch gap-8 mb-10">
                            <div className="w-full xl:w-[400px]">
                                <label style={labelStyle}>Search Asset Number</label>
                                <div style={{ position: 'relative', display: 'flex', gap: '0.75rem' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            type="text"
                                            placeholder="845XXXXXX"
                                            value={assetSearchTerm}
                                            onChange={(e) => setAssetSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && fetchEngineByAssetNo()}
                                            style={{ ...inputStyle, paddingLeft: '3rem', height: '58px', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em' }}
                                        />
                                    </div>
                                    <button
                                        onClick={fetchEngineByAssetNo}
                                        disabled={isFetching}
                                        style={{ width: '58px', height: '58px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.2)', transition: 'all 0.2s', flexShrink: 0 }}
                                    >
                                        {isFetching ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                {fetchedEngine ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 animate-fade-in items-end">
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                            <span style={labelStyle}>Customer Identity</span>
                                            <p className="text-sm font-black text-[#1e293b] truncate uppercase">{fetchedEngine.customerName}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                            <span style={labelStyle}>Branch & State</span>
                                            <p className="text-sm font-black text-[#1e293b] truncate uppercase">{fetchedEngine.branch} | {fetchedEngine.state || 'N/A'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center">
                                            <span style={labelStyle}>Interactions</span>
                                            <div className="flex items-center justify-center gap-2 mt-1">
                                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500">
                                                    {fetchedEngine.inactiveFollowups?.length || 0} NODES
                                                </span>
                                                <button onClick={() => handleOpenFollowup(fetchedEngine)} className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors" title="Audit Interaction">
                                                    <MessageSquareQuote size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                            <span style={labelStyle}>Contact person</span>
                                            <p className="text-sm font-black text-[#1e293b] truncate uppercase">{fetchedEngine.contactPerson || 'N/A'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                            <span style={labelStyle}>Coordinator</span>
                                            <p className="text-sm font-black text-[#1e293b] truncate uppercase">{fetchedEngine.coordinatorName || 'N/A'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center gap-4 py-4 px-6 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-2xl opacity-40">
                                        <Database size={24} />
                                        <span className="text-sm font-bold uppercase tracking-widest italic leading-none">System Initialized: Awaiting Data Sync</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {fetchedEngine && (
                            <div className="mt-12 animate-fade-up">
                                <hr className="border-gray-100 mb-12" />
                                <div className="space-y-8">
                                    {/* Quotation Parameters */}
                                    <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                        <h4 style={sectionHeaderStyle} className="mb-6"><Calendar size={14} /> Quotation Parameters</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="form-group-std"><label>Quotation Number</label><input type="text" value={conversionForm.conversionQuotationNo} onChange={e => setConversionForm({ ...conversionForm, conversionQuotationNo: e.target.value })} placeholder="QTN/..." /></div>
                                            <div className="form-group-std"><label>Quotation Date</label><input type="date" value={conversionForm.conversionQuoteDate} onChange={e => setConversionForm({ ...conversionForm, conversionQuoteDate: e.target.value })} /></div>
                                            <div className="form-group-std">
                                                <label>Priority Status</label>
                                                <select value={conversionForm.conversionQuoteStatus} onChange={e => setConversionForm({ ...conversionForm, conversionQuoteStatus: e.target.value })}>
                                                    <option value="">Select Priority</option>
                                                    <option value="Hot">🔥 Hot</option>
                                                    <option value="Warm">⚡ Warm</option>
                                                    <option value="Cold">❄️ Cold</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Service Logistics */}
                                    <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                        <h4 style={sectionHeaderStyle} className="mb-6"><Landmark size={14} /> Service Logistics</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="form-group-std">
                                                <label>Planned Visits</label>
                                                <select value={conversionForm.conversionNoOfVisits} onChange={e => setConversionForm({ ...conversionForm, conversionNoOfVisits: e.target.value })}>
                                                    <option value="">Select Visits</option>
                                                    {[...Array(36)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1} Visits</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group-std">
                                                <label>Frequency Type</label>
                                                <select value={conversionForm.conversionTypeOfVisits} onChange={e => setConversionForm({ ...conversionForm, conversionTypeOfVisits: e.target.value })}>
                                                    <option value="">Select Type</option>
                                                    <option value="Monthly">Monthly</option>
                                                    <option value="By Monthly">By Monthly</option>
                                                    <option value="Quarterly">Quarterly</option>
                                                    <option value="Half Yearly">Half Yearly</option>
                                                </select>
                                            </div>
                                            <div className="form-group-std"><label>Assigned Stakeholder</label>
                                                <select value={conversionForm.conversionQuoteAssignedToId} onChange={e => {
                                                    const emp = employees.find(emp => emp.employeeId === e.target.value);
                                                    setConversionForm({ ...conversionForm, conversionQuoteAssignedToId: e.target.value, conversionQuoteAssignedToName: emp ? emp.employeeName : '' });
                                                }}>
                                                    <option value="">Select Representative</option>
                                                    {employees.map(emp => <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeId} - {emp.employeeName}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Projections */}
                                    <div className="p-8 bg-[#0f172a] rounded-[2rem] text-white relative overflow-hidden group shadow-2xl">
                                        <div className="absolute -top-10 -right-10 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Calculator size={180} /></div>

                                        <h4 className="mb-6" style={{ fontSize: '12px', fontWeight: 900, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Percent size={16} className="text-red-500" /> Financial Projections (18% GST)
                                        </h4>

                                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                            <div className="form-group-dark"><label>Basic Valuation</label><input type="number" value={conversionForm.conversionQuoteValue} onChange={e => setConversionForm({ ...conversionForm, conversionQuoteValue: e.target.value })} placeholder="₹ 0.00" /></div>
                                            <div className="form-group-dark"><label>GST Allocation</label><input type="number" readOnly value={conversionForm.conversionGstValue} /></div>
                                            <div className="form-group-dark"><label>Total Payload</label><input type="number" readOnly value={conversionForm.conversionTotalValue} style={{ color: '#f87171', fontWeight: 800 }} /></div>
                                        </div>

                                        <button onClick={saveChanges} className="relative z-10 w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg transition-all active:scale-[0.98] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                                            <ShieldCheck size={20} /> Secure Registry Node
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL SEARCH & CONVERSION */}
                {showSearchModal && (
                    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)' }}>
                        <div className="modal-content" style={{ maxWidth: '1100px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', padding: 0, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e31e24', padding: '1.5rem 2rem', color: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Search size={24} />
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>AMC Conversion Node</h2>
                                </div>
                                <button onClick={() => setShowSearchModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-10 bg-white max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="flex flex-col gap-8">
                                    <div className="w-full">
                                        <label style={labelStyle}>Search Asset Number to Transform</label>
                                        <div style={{ position: 'relative', display: 'flex', gap: '0.75rem' }}>
                                            <div style={{ position: 'relative', flex: 1 }}>
                                                <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                                <input
                                                    type="text"
                                                    placeholder="Enter Engine No (e.g. 845XXXXXX)"
                                                    value={assetSearchTerm}
                                                    onChange={(e) => setAssetSearchTerm(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && fetchEngineByAssetNo()}
                                                    style={{ ...inputStyle, paddingLeft: '3.5rem', height: '64px', fontSize: '1.2rem', fontWeight: 800, border: '2px solid #f1f5f9' }}
                                                />
                                            </div>
                                            <button
                                                onClick={fetchEngineByAssetNo}
                                                disabled={isFetching}
                                                style={{ width: '64px', height: '64px', background: '#e31e24', color: 'white', border: 'none', borderRadius: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(227, 30, 36, 0.2)', transition: 'all 0.2s', flexShrink: 0 }}
                                            >
                                                {isFetching ? <Loader2 className="animate-spin" size={24} /> : <ChevronRight size={24} />}
                                            </button>
                                        </div>
                                    </div>

                                    {fetchedEngine ? (
                                        <div className="animate-fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                                <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                                                    <span style={labelStyle}>Customer</span>
                                                    <p className="text-sm font-black text-[#1e293b] uppercase">{fetchedEngine.customerName}</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                                    <span style={labelStyle}>Branch & State</span>
                                                    <p className="text-sm font-black text-[#1e293b] uppercase">{fetchedEngine.branch} | {fetchedEngine.state || 'N/A'}</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                                    <span style={labelStyle}>Model / KVA</span>
                                                    <p className="text-sm font-black text-[#1e293b] uppercase">{fetchedEngine.model} {fetchedEngine.kva ? ` / ${fetchedEngine.kva} KVA` : ''}</p>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <div className="space-y-8">
                                                    {/* Quotation Parameters */}
                                                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                                                        <h4 style={sectionHeaderStyle} className="mb-6"><Calendar size={14} /> Quotation Parameters</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            <div className="form-group-std"><label>Quotation Number</label><input type="text" value={conversionForm.conversionQuotationNo} onChange={e => setConversionForm({ ...conversionForm, conversionQuotationNo: e.target.value })} placeholder="QTN/..." /></div>
                                                            <div className="form-group-std"><label>Quotation Date</label><input type="date" value={conversionForm.conversionQuoteDate} onChange={e => setConversionForm({ ...conversionForm, conversionQuoteDate: e.target.value })} /></div>
                                                            <div className="form-group-std">
                                                                <label>Priority Status</label>
                                                                <select value={conversionForm.conversionQuoteStatus} onChange={e => setConversionForm({ ...conversionForm, conversionQuoteStatus: e.target.value })}>
                                                                    <option value="">Select Priority</option>
                                                                    <option value="Hot">🔥 Hot</option>
                                                                    <option value="Warm">⚡ Warm</option>
                                                                    <option value="Cold">❄️ Cold</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Service Logistics */}
                                                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                                                        <h4 style={sectionHeaderStyle} className="mb-6"><Landmark size={14} /> Service Logistics</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            <div className="form-group-std"><label>Planned Visits</label><input type="number" value={conversionForm.conversionNoOfVisits} onChange={e => setConversionForm({ ...conversionForm, conversionNoOfVisits: e.target.value })} placeholder="0" /></div>
                                                            <div className="form-group-std">
                                                                <label>Frequency Offset</label>
                                                                <select value={conversionForm.conversionTypeOfVisits} onChange={e => setConversionForm({ ...conversionForm, conversionTypeOfVisits: e.target.value })}>
                                                                    <option value="">Select Frequency</option>
                                                                    <option value="Monthly">Monthly</option>
                                                                    <option value="By Monthly">Bi-Monthly</option>
                                                                    <option value="Quarterly">Quarterly</option>
                                                                    <option value="Half Yearly">Half Yearly</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group-std">
                                                                <label>Assigned Stakeholder</label>
                                                                <select value={conversionForm.conversionQuoteAssignedToId} onChange={e => {
                                                                    const emp = employees.find(emp => emp.employeeId === e.target.value);
                                                                    setConversionForm({ ...conversionForm, conversionQuoteAssignedToId: e.target.value, conversionQuoteAssignedToName: emp ? emp.employeeName : '' });
                                                                }}>
                                                                    <option value="">Select Employee</option>
                                                                    {employees.map(emp => <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeId} - {emp.employeeName}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Financial Audit */}
                                                    <div className="p-6 bg-red-50/50 border border-red-100 rounded-2xl">
                                                        <h4 style={sectionHeaderStyle} className="mb-6"><Calculator size={14} /> Financial Audit</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            <div className="form-group-std"><label>Base Quotation Value</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">₹</span><input type="number" value={conversionForm.conversionQuoteValue} onChange={e => setConversionForm({ ...conversionForm, conversionQuoteValue: e.target.value })} style={{ paddingLeft: '2.5rem' }} /></div></div>
                                                            <div className="form-group-std"><label>GST Ledger (18%)</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">₹</span><input type="text" value={conversionForm.conversionGstValue} readOnly className="bg-slate-50 border-dashed" style={{ paddingLeft: '2.5rem' }} /></div></div>
                                                            <div className="form-group-std"><label>Gross Total Commitment</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-red-400">₹</span><input type="text" value={conversionForm.conversionTotalValue} readOnly className="bg-white text-red-600 border-red-200 font-extrabold shadow-sm" style={{ paddingLeft: '2.5rem' }} /></div></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button onClick={saveChanges} className="w-full mt-10 py-5 bg-[#e31e24] text-white font-black rounded-2xl shadow-2xl shadow-red-200 transition-all active:scale-[0.98] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                                                    <ShieldCheck size={20} /> Secure Transformation Registry
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
                                            <div style={{ padding: '1.5rem', background: 'white', borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', marginBottom: '1.5rem' }}>
                                                <Database size={48} className="text-slate-200" />
                                            </div>
                                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Awaiting Asset Localization</h3>
                                            <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.5rem' }}>Synchronize system records by searching asset number</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Card 2: System Registry (Table) */}
                <div className="table-container-fux">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1.5rem 1.75rem', borderBottom: '1px solid #f1f5f9', borderRadius: '24px 24px 0 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.625rem', background: '#f8fafc', color: '#64748b', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                <MessageSquareQuote size={24} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>System Registry</h2>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Archive of all AMC conversion transitions</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', border: `1px solid ${showAdvancedSearch ? '#ef4444' : '#e2e8f0'}`, background: showAdvancedSearch ? '#fef2f2' : 'white', color: showAdvancedSearch ? '#ef4444' : '#64748b', borderRadius: '0.875rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, transition: 'all 0.2s' }}
                            >
                                <Filter size={18} /> {showAdvancedSearch ? 'Hide Advanced' : 'Filters'}
                            </button>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="Search global registry..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', border: '1.5px solid #f1f5f9', borderRadius: '0.875rem', fontSize: '0.875rem', fontWeight: 700, outline: 'none', width: '280px', background: '#f8fafc' }}
                                />
                            </div>
                            <button onClick={exportToExcel} className="w-12 h-12 flex items-center justify-center bg-[#1e293b] hover:bg-black text-white rounded-xl transition-all shadow-md active:scale-95" title="Export Local Cache">
                                <FileSpreadsheet size={20} />
                            </button>
                        </div>
                    </div>

                    {showAdvancedSearch && (
                        <div style={{ padding: '1.5rem 1.75rem', background: '#fffbf5', borderBottom: '1px solid #fed7aa' }} className="animate-fade-up">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label style={filterLabelStyle}>Asset Hierarchy Node</label>
                                    <input type="text" placeholder="e.g. 845..." value={searchFilters.assetNumber} onChange={e => setSearchFilters({ ...searchFilters, assetNumber: e.target.value })} style={filterInputStyle} />
                                </div>
                                <div>
                                    <label style={filterLabelStyle}>Entity Identity</label>
                                    <input type="text" placeholder="Search customer..." value={searchFilters.customerName} onChange={e => setSearchFilters({ ...searchFilters, customerName: e.target.value })} style={filterInputStyle} />
                                </div>
                                <div>
                                    <label style={filterLabelStyle}>Branch Attribution</label>
                                    <select value={searchFilters.branch} onChange={e => setSearchFilters({ ...searchFilters, branch: e.target.value })} style={filterInputStyle}>
                                        <option value="">All Branches</option>
                                        {['BALANAGAR', 'HI-Tech City', 'KARIMNAGAR', 'KATEDAN', 'NARAYANGUDA', 'NIZAMABAD', 'SURYAPET', 'UPPAL', 'WARANGAL'].map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button onClick={() => setSearchFilters({ assetNumber: '', branch: '', customerName: '' })} style={{ background: 'none', border: 'none', color: '#c2410c', fontSize: '11px', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <X size={14} /> Purge Filter Buffer
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Asset No</th>
                                    <th style={thStyle}>Customer Name</th>
                                    <th style={thStyle}>Branch</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Valuation</th>
                                    <th style={thStyle}>Visits</th>
                                    <th style={thStyle}>Assigned</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Follow-ups</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Registry Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="10" className="py-32 text-center"><div className="flex flex-col items-center gap-3"><Loader2 className="animate-spin text-red-500" size={32} /><span className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">Syncing Cluster...</span></div></td></tr>
                                ) : currentEngines.length === 0 ? (
                                    <tr><td colSpan="10" className="py-32 text-center opacity-30 italic font-bold text-slate-400 uppercase tracking-widest text-xs">No localized nodes detected in system registry</td></tr>
                                ) : (
                                    currentEngines.map((engine, idx) => (
                                        <tr key={engine._id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50">
                                            <td className="px-7 py-5 text-xs font-black text-slate-300">{(page - 1) * limit + idx + 1}</td>
                                            <td className="px-7 py-5 text-sm font-black text-[#1e293b]">{engine.assetNumber}</td>
                                            <td className="px-7 py-5 max-w-[280px]"><p className="text-sm font-black text-[#1e293b] truncate uppercase mb-0">{engine.customerName}</p></td>
                                            <td className="px-7 py-5 text-xs font-bold text-slate-500 uppercase">{engine.branch}</td>
                                            <td className="px-7 py-5">
                                                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${String(engine.conversionQuoteStatus).toLowerCase() === 'hot' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    String(engine.conversionQuoteStatus).toLowerCase() === 'warm' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                        String(engine.conversionQuoteStatus).toLowerCase() === 'cold' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            'bg-gray-50 text-gray-400 border-gray-100'
                                                    }`}>
                                                    {engine.conversionQuoteStatus || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-7 py-5 text-sm font-black text-[#1e293b]">₹{Number(engine.conversionQuoteValue || 0).toLocaleString()}</td>
                                            <td className="px-7 py-5"><span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-black text-slate-500">{engine.conversionNoOfVisits || 0} V</span></td>
                                            <td className="px-7 py-5 text-xs font-bold text-slate-500">{engine.conversionQuoteAssignedToName || '-'}</td>
                                            <td className="px-7 py-5 text-center">
                                                <span style={{ background: (engine.inactiveFollowups?.length || 0) > 0 ? '#fef3c7' : '#f1f5f9', color: (engine.inactiveFollowups?.length || 0) > 0 ? '#d97706' : '#94a3b8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900, border: '1px solid rgba(0,0,0,0.02)' }}>
                                                    {engine.inactiveFollowups?.length || 0} Interactions
                                                </span>
                                            </td>
                                            <td className="px-7 py-5">
                                                <div className="flex justify-center gap-3">
                                                    <button onClick={() => handleOpenFollowup(engine)} style={actionBtnStyle} className="hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"><MessageSquareQuote size={14} /> Audit Log</button>
                                                    <button onClick={() => startEditing(engine)} style={iconBtnStyle}><Edit size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc/50' }}>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Cache: {page} of {pages} Intervals</span>
                        <div className="flex gap-2">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 disabled:opacity-30 transition-all"><ChevronLeft size={20} /></button>
                            <div className="px-5 flex items-center bg-white border border-red-100 rounded-xl text-sm font-black text-red-600 shadow-sm">{page}</div>
                            <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 disabled:opacity-30 transition-all"><ChevronRight size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Follow-up Interaction Portal */}
            {showFollowupModal && selectedEngine && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem' }} onClick={() => setShowFollowupModal(false)}>
                    <div style={{ background: 'white', borderRadius: '2.5rem', width: '100%', maxWidth: '1200px', height: '85vh', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'row', overflow: 'hidden' }} onClick={e => e.stopPropagation()} className="animate-scale-up">

                        {/* LEFT: FORM */}
                        <div style={{ width: '45%', background: '#fffbf5', borderRight: '1px solid #fed7aa', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '2.5rem', borderBottom: '1px solid #fed7aa', background: 'white' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e293b', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>Interaction Log</h3>
                                <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '1rem', padding: '0.75rem 1rem' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#92400e', margin: 0, fontWeight: 800 }}>Asset Local: <span className="text-orange-600">{selectedEngine.assetNumber}</span></p>
                                    <p style={{ fontSize: '0.75rem', color: '#b45309', margin: '4px 0 0', fontWeight: 600, opacity: 0.8 }} className="truncate uppercase">{selectedEngine.customerName}</p>
                                </div>
                            </div>

                            <div style={{ padding: '2.5rem', flex: 1, overflowY: 'auto' }}>
                                <form onSubmit={submitFollowup} className="space-y-8">
                                    <div className="form-group-std">
                                        <label>Representative Identifier *</label>
                                        <input type="text" value={followupForm.employeeId} onChange={handleEmpIdChange} placeholder="Enter ID..." style={{ ...inputStyle, borderColor: empLookupStatus === 'found' ? '#16a34a' : empLookupStatus === 'notfound' ? '#ef4444' : '#f1f5f9' }} required />
                                        {empLookupStatus === 'found' && <p className="text-[10px] font-black text-green-600 mt-2 uppercase tracking-widest">✓ Linked to {followupForm.employeeName}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="form-group-std"><label>Stakeholder Name</label><input type="text" value={followupForm.customerContactedName} onChange={e => setFollowupForm({ ...followupForm, customerContactedName: e.target.value })} placeholder="Person Contacted" /></div>
                                        <div className="form-group-std"><label>Interaction Date</label><input type="date" value={followupForm.followUpDate} onChange={e => setFollowupForm({ ...followupForm, followUpDate: e.target.value })} /></div>
                                    </div>
                                    <div className="form-group-std"><label>Mobile Link & Secure Email</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" value={followupForm.customerContactNumber} onChange={e => setFollowupForm({ ...followupForm, customerContactNumber: e.target.value })} placeholder="+91 ..." />
                                            <input type="email" value={followupForm.customerContactEmail} onChange={e => setFollowupForm({ ...followupForm, customerContactEmail: e.target.value })} placeholder="email@domain.com" />
                                        </div>
                                    </div>
                                    <div className="form-group-std"><label>Discussion Logs *</label><textarea rows="5" value={followupForm.remarks} onChange={e => setFollowupForm({ ...followupForm, remarks: e.target.value })} placeholder="Synchronize conversation summary..." required /></div>
                                    <button type="submit" disabled={submitting} className="w-full py-5 bg-[#1e293b] text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-[11px] disabled:opacity-50">
                                        {submitting ? <Loader2 className="animate-spin m-auto" /> : 'Commit Interaction to Audit'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT: HISTORY */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
                            <div style={{ padding: '2.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div><h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Audit History</h3><p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{(selectedEngine.inactiveFollowups || []).length} Recorded nodes</p></div>
                                <button onClick={() => setShowFollowupModal(false)} style={{ background: '#f8fafc', border: 'none', borderRadius: '1rem', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
                                {(!selectedEngine.inactiveFollowups || selectedEngine.inactiveFollowups.length === 0) ? (
                                    <div className="flex flex-col items-center justify-center h-full opacity-20"><Database size={64} className="mb-4" /><p className="font-black uppercase tracking-[0.3em] text-[10px]">Zeroized History Buffer</p></div>
                                ) : (
                                    <div className="space-y-10 relative">
                                        <div className="absolute left-[20px] top-6 bottom-6 w-1 bg-slate-50 rounded-full"></div>
                                        {[...selectedEngine.inactiveFollowups].reverse().map((fu, idx) => (
                                            <div key={idx} className="pl-14 relative group">
                                                <div className="absolute left-[15px] top-3 w-2.5 h-2.5 bg-red-500 rounded-full ring-8 ring-white group-hover:scale-125 transition-transform"></div>
                                                <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-4 py-1.5 rounded-full uppercase tracking-widest">{new Date(fu.followUpDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><User size={12} /> Logged by {fu.employeeName}</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-700 italic border-l-4 border-slate-100 pl-4 py-2 leading-relaxed mb-6">"{fu.remarks}"</p>
                                                    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                                                        <div className="flex flex-col"><span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">STAKEHOLDER</span><span className="text-xs font-black text-slate-600">{fu.customerContactedName || 'ADMIN'}</span></div>
                                                        <div className="flex flex-col text-right"><span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">LINKAGE</span><span className="text-xs font-black text-slate-600">{fu.customerContactNumber || '-'}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .table-container-fux { background: white; border-radius: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; overflow: hidden; }
                .form-group-std label { display: block; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.75rem; padding-left: 0.25rem; }
                .form-group-std input, .form-group-std select, .form-group-std textarea { width: 100%; padding: 0.875rem 1.25rem; background: #ffffff; border: 1.5px solid #f1f5f9; border-radius: 1rem; font-size: 14px; font-weight: 700; color: #1e293b; transition: all 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01); }
                .form-group-std input:focus, .form-group-std select:focus, .form-group-std textarea:focus { outline: none; border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.08); }
                .form-group-dark label { display: block; font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 0.75rem; }
                .form-group-dark input { width: 100%; padding: 0.875rem 1.25rem; background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.06); border-radius: 1rem; font-size: 15px; font-weight: 900; color: #ffffff; transition: all 0.2s; }
                .form-group-dark input:focus { outline: none; border-color: #ef4444; background: rgba(255,255,255,0.08); }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scale-up { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.5s ease forwards; }
                .animate-fade-up { animation: fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-scale-up { animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

const labelStyle = { display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' };
const inputStyle = { width: '100%', padding: '0.625rem 1rem', border: '1.5px solid #f1f5f9', borderRadius: '1rem', fontSize: '0.9rem', outline: 'none', background: 'white', boxSizing: 'border-box', transition: 'all 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' };
const thStyle = { background: '#f8fafc', color: '#64748b', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '1.25rem 1.75rem', borderBottom: '1.5px solid #f1f5f9' };
const sectionHeaderStyle = { fontSize: '0.7rem', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.25em', paddingBottom: '1rem', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' };
const actionBtnStyle = { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.875rem', background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s' };
const iconBtnStyle = { width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1.5px solid #f1f5f9', borderRadius: '0.75rem', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s' };
const filterLabelStyle = { display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' };
const filterInputStyle = { width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #fed7aa', borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: 700, outline: 'none', background: 'white', boxSizing: 'border-box' };

export default EngineAMCConversion;
