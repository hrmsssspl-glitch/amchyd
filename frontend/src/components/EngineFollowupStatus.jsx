import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, MessageSquareQuote, X, Calendar, User, Phone, Mail, CheckCircle2, Database, MapPin, Building2, RefreshCw, Calculator, History, AlertCircle, Loader2, Save, Eye, Percent, Landmark } from 'lucide-react';

const EngineFollowupStatus = () => {
    const { user } = useContext(AuthContext);
    const [engines, setEngines] = useState([]);
    const [filteredEngines, setFilteredEngines] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;
    const [showFollowupModal, setShowFollowupModal] = useState(false);
    const [selectedEngine, setSelectedEngine] = useState(null);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [empLookupStatus, setEmpLookupStatus] = useState('');  // '', 'found', 'notfound'
    const [searchFilters, setSearchFilters] = useState({
        assetNumber: '', branch: '', customerName: ''
    });

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
    const [successMsg, setSuccessMsg] = useState('');
    const lookupTimeout = useRef(null);

    // Fetch inactive engines (backend now filters by assignment for non-admins)
    const fetchEngines = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const queryParams = new URLSearchParams({
                status: 'Inactive',
                pageSize: 1000,
                keyword: searchTerm,
                ...searchFilters
            }).toString();
            const response = await axios.get(`/api/engines?${queryParams}`, config);
            const inactiveEngines = response.data.assets || [];
            setEngines(inactiveEngines);
            setFilteredEngines(inactiveEngines);
        } catch (error) {
            console.error('Error fetching engines:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('/api/employees?pageSize=1000', config);
            setEmployees(res.data.employees || []);
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    useEffect(() => {
        fetchEngines();
        fetchEmployees();
    }, [searchTerm, searchFilters]);

    useEffect(() => {
        const filtered = engines.filter(engine => {
            const engineNo = String(engine.assetNumber || '').toLowerCase();
            const customer = String(engine.customerName || '').toLowerCase();
            const search = searchTerm.toLowerCase();
            return engineNo.includes(search) || customer.includes(search);
        });
        setFilteredEngines(filtered);
        setPage(1);
    }, [searchTerm, engines]);

    const pages = Math.ceil(filteredEngines.length / limit);
    const currentEngines = filteredEngines.slice((page - 1) * limit, page * limit);

    const handleOpenFollowup = (engine) => {
        setSelectedEngine(engine);
        setEmpLookupStatus('');
        setSuccessMsg('');

        // Auto-fill logged in user if they are an employee
        const defaultEmpId = user.employeeId || '';
        const defaultEmpName = user.name || '';
        const targetEmp = employees.find(e => e.employeeId === defaultEmpId);

        setFollowupForm({
            employeeId: defaultEmpId,
            employeeName: defaultEmpName,
            empContactNumber: targetEmp ? targetEmp.contactNumber : '',
            followUpDate: new Date().toISOString().split('T')[0],
            customerContactedName: engine.contactPerson || '',
            customerContactNumber: engine.contactNumber || '',
            customerContactEmail: engine.mailId || '',
            remarks: ''
        });
        if (defaultEmpId) setEmpLookupStatus('found');
        setShowFollowupModal(true);
    };

    const handleCloseFollowup = () => {
        setShowFollowupModal(false);
        setSelectedEngine(null);
        setEmpLookupStatus('');
        setSuccessMsg('');
    };

    const handleEmpIdChange = (e) => {
        const val = e.target.value;
        setFollowupForm(prev => ({ ...prev, employeeId: val, employeeName: '', empContactNumber: '' }));
        setEmpLookupStatus('');

        if (lookupTimeout.current) clearTimeout(lookupTimeout.current);
        lookupTimeout.current = setTimeout(() => {
            if (!val.trim()) return;
            const match = employees.find(
                emp => emp.employeeId?.toLowerCase() === val.trim().toLowerCase()
            );
            if (match) {
                setFollowupForm(prev => ({
                    ...prev,
                    employeeName: match.employeeName || '',
                    empContactNumber: match.contactNumber || ''
                }));
                setEmpLookupStatus('found');
            } else {
                setEmpLookupStatus('notfound');
            }
        }, 400);
    };

    const handleFormChange = (e) => {
        setFollowupForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const submitFollowup = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMsg('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.post(`/api/engines/${selectedEngine._id}/followups`, followupForm, config);

            // Refresh local state
            const updatedEngine = response.data;
            setEngines(prev => prev.map(e => e._id === updatedEngine._id ? updatedEngine : e));
            setSelectedEngine(updatedEngine);

            setSuccessMsg('Follow-up record saved successfully!');
            // Keep employee info but clear remark/date
            setFollowupForm(prev => ({
                ...prev,
                followUpDate: new Date().toISOString().split('T')[0],
                remarks: ''
            }));
        } catch (error) {
            console.error('Error submitting followup:', error);
            alert('Failed to submit follow-up.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="engine-master p-6 bg-[#f0f2f5] min-h-screen font-sans">
            <div className="max-w-[1700px] mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-red-600 rounded-lg shadow-lg">
                                <MessageSquareQuote className="text-white" size={24} />
                            </div>
                            <h1 className="text-3xl font-black text-[#1a1c21] tracking-tight">Engine Followup Status</h1>
                        </div>
                        <p className="text-gray-500 font-medium ml-12">Track interactions for Inactive & Assigned conversion assets</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-4 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 flex items-center justify-center rounded-2xl text-red-600">
                                <RefreshCw size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting Conversion</div>
                                <div className="text-2xl font-black text-gray-900">{filteredEngines.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[40px] shadow-xl shadow-black/[0.03] border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-2xl text-gray-400">
                                <Search size={22} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Asset Lookup</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Find engines assigned to you</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={() => setShowAdvancedSearch(!showAdvancedSearch)} className={`flex items-center gap-2 px-6 py-3 border-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${showAdvancedSearch ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                                <Filter size={18} /> Filters
                            </button>
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                <input
                                    type="text"
                                    placeholder="Engine Serial or Customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-14 pr-8 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-red-500 w-80 font-bold transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-20 text-center">
                            <Loader2 className="animate-spin text-red-600 mx-auto mb-4" size={48} />
                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Accessing Engine Database...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-left">Asset Details</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-left">Customer & Region</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-left">Conversion Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-left">Assigned To</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-left">Last Contact</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {currentEngines.map((engine) => (
                                        <tr key={engine._id} className="hover:bg-red-50/[0.1] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-black text-gray-900 group-hover:text-red-700 transition-colors">{engine.assetNumber}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{engine.model} | {engine.kva} KVA</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-bold text-gray-800">{engine.customerName}</div>
                                                <div className="flex items-center gap-1 mt-1 text-[10px] font-black text-red-500 uppercase">
                                                    <MapPin size={10} /> {engine.branch}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`status-pill ${String(engine.conversionQuoteStatus || 'None').toLowerCase()}`}>
                                                    {engine.conversionQuoteStatus || 'Not Started'}
                                                </span>
                                                <div className="text-[9px] font-bold text-gray-400 mt-1.5 uppercase">
                                                    {engine.conversionQuotationNo || 'No Quote No'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                        <User size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-gray-800 leading-none mb-1">{engine.conversionQuoteAssignedToName || '-'}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase">{engine.conversionQuoteAssignedToId || 'Unassigned'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="px-3 py-1 bg-gray-50 rounded-lg inline-block text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                    {(engine.inactiveFollowups?.length || 0)} Interactions
                                                </div>
                                                {(engine.inactiveFollowups?.length > 0) && (
                                                    <div className="text-[10px] font-bold text-gray-800 mt-1">
                                                        {new Date(engine.inactiveFollowups[engine.inactiveFollowups.length - 1].followUpDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <button onClick={() => handleOpenFollowup(engine)} className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-red-100">
                                                    <MessageSquareQuote size={14} /> Add Followup
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Follow Up Premium Modal - 3 Column Inspired Side Layout */}
            {showFollowupModal && selectedEngine && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[48px] w-full max-w-[1200px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] animate-in zoom-in-95 duration-300">

                        {/* Left Section: Form */}
                        <div className="w-full md:w-[480px] bg-[#fffbfc] border-r border-gray-100 flex flex-col pt-10 px-10 pb-10 overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-red-600 rounded-2xl shadow-xl shadow-red-100">
                                    <Edit className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">Post Update</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Record New Follow-up</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 mb-8 shadow-sm">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Database size={12} /> Asset Identified
                                </div>
                                <div className="text-lg font-black text-red-600 mb-1">{selectedEngine.assetNumber}</div>
                                <div className="text-xs font-bold text-gray-800 line-clamp-1">{selectedEngine.customerName}</div>
                            </div>

                            <form onSubmit={submitFollowup} className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6">
                                <div className="space-y-4">
                                    <div className="form-group-custom">
                                        <label>Representative / Agent ID</label>
                                        <input type="text" value={followupForm.employeeId} onChange={handleEmpIdChange} placeholder="Emp ID..." className={`${empLookupStatus === 'found' ? '!border-green-500' : ''}`} required />
                                        {empLookupStatus === 'found' && <div className="text-[10px] font-black text-green-500 uppercase mt-1">✓ Agent Verified: {followupForm.employeeName}</div>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-group-custom">
                                            <label>Interaction Date</label>
                                            <input type="date" name="followUpDate" value={followupForm.followUpDate} onChange={handleFormChange} required />
                                        </div>
                                        <div className="form-group-custom">
                                            <label>Customer Contact Name</label>
                                            <input type="text" name="customerContactedName" value={followupForm.customerContactedName} onChange={handleFormChange} placeholder="Contacted..." required />
                                        </div>
                                    </div>

                                    <div className="form-group-custom">
                                        <label>Discussion Remarks / Points</label>
                                        <textarea name="remarks" value={followupForm.remarks} onChange={handleFormChange} rows="5" placeholder="Summary of call/visit..." className="!rounded-[24px]" required />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    {successMsg && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-xs font-bold mb-4 flex items-center gap-2 animate-in slide-in-from-top-2"><CheckCircle2 size={16} /> {successMsg}</div>}
                                    <button type="submit" disabled={submitting} className="w-full py-4.5 bg-red-600 hover:bg-black text-white rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-red-100 transition-all active:scale-95 h-[64px]">
                                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Create interaction Record</>}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Section: History */}
                        <div className="flex-1 bg-white flex flex-col relative">
                            <button onClick={handleCloseFollowup} className="absolute top-8 right-8 w-12 h-12 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-2xl flex items-center justify-center transition-all z-10">
                                <X size={24} />
                            </button>

                            <div className="p-12 border-b border-gray-50 bg-gray-50/30">
                                <div className="flex items-center gap-3 mb-2">
                                    <History className="text-gray-400" size={20} />
                                    <h3 className="text-xl font-black text-gray-800 tracking-tight">Activity Timeline</h3>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-8">{(selectedEngine.inactiveFollowups || []).length} Recorded interactions</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-8">
                                {!selectedEngine.inactiveFollowups || selectedEngine.inactiveFollowups.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300 pb-20">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                            <Database size={40} className="opacity-20" />
                                        </div>
                                        <p className="font-black uppercase tracking-[0.2em] text-xs">No Audit Log Found</p>
                                    </div>
                                ) : (
                                    <div className="relative pl-8 border-l-2 border-gray-100 space-y-12">
                                        {[...selectedEngine.inactiveFollowups].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((fu, idx) => (
                                            <div key={idx} className="relative group">
                                                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white border-4 border-red-600 shadow-sm z-10 group-hover:scale-125 transition-transform"></div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10">
                                                        {new Date(fu.followUpDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                        Logged {new Date(fu.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm hover:border-red-100 transition-colors">
                                                    <div className="text-base font-medium text-gray-700 leading-relaxed mb-6 font-serif">
                                                        "{fu.remarks}"
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200/50">
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                            <User size={14} className="text-gray-400" />
                                                            <div>
                                                                <div className="text-[8px] font-black text-gray-400 uppercase leading-none mb-0.5">representative</div>
                                                                <div className="text-[10px] font-black text-gray-900">{fu.employeeName} <span className="text-red-500">[{fu.employeeId}]</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                            <Phone size={14} className="text-gray-400" />
                                                            <div>
                                                                <div className="text-[8px] font-black text-gray-400 uppercase leading-none mb-0.5">Point of Contact</div>
                                                                <div className="text-[10px] font-black text-gray-900">{fu.customerContactedName} <span className="text-gray-400">({fu.customerContactNumber})</span></div>
                                                            </div>
                                                        </div>
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
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                
                .engine-master { font-family: 'Inter', sans-serif; }
                
                .form-group-custom { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group-custom label { font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em; padding-left: 2px; }
                .form-group-custom input, .form-group-custom select, .form-group-custom textarea { 
                    padding: 0.875rem 1.25rem; 
                    background: #f8fafc; 
                    border: 2px solid #eef2f6; 
                    border-radius: 16px; 
                    font-size: 0.9rem; 
                    font-weight: 700;
                    color: #1a1c21;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .form-group-custom input:focus, .form-group-custom select:focus, .form-group-custom textarea:focus {
                    background: #fff;
                    border-color: #dc2626;
                    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.08);
                    outline: none;
                }
                
                .status-pill { 
                    display: inline-flex;
                    padding: 5px 14px; 
                    border-radius: 10px; 
                    font-size: 0.65rem; 
                    font-weight: 900; 
                    text-transform: uppercase; 
                    letter-spacing: 0.05em;
                }
                .status-pill.hot { background: #fff1f2; color: #e11d48; border: 1px solid #ffe4e6; }
                .status-pill.warm { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }
                .status-pill.cold { background: #f0f9ff; color: #0284c7; border: 1px solid #e0f2fe; }
                .status-pill.none { background: #f1f5f9; color: #94a3b8; border: 1px solid #e2e8f0; }

                .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid white; }
            `}</style>
        </div>
    );
};

export default EngineFollowupStatus;
