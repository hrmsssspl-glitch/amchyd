import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader, Search, RefreshCw, Calendar, User, Phone, Building2, CreditCard, Clock, FileText, Printer, X, FileSpreadsheet, CheckCircle2, AlertCircle, UserCheck, MapPin } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const stateBranchData = {
    'Andhra Pradesh': [
        'Vijayawada', 'Autonagar', 'Bhimavaram', 'Chimakaruthy', 'Gajwaka', 'Guntur',
        'Kakinada', 'Rajahmundry', 'Srikakulam', 'Tekkali', 'Vishakapatnam', 'Vijayanagaram',
        'Kadapa', 'Kurnool', 'Ananthapur', 'Tirupathi', 'Chittor', 'Nellore', 'Kothagudem'
    ],
    'Telangana': [
        'Hyderabad', 'Karimnagar', 'Khammamm', 'Nalgonda', 'Nizamabad', 'Warangal',
        'Mahaboobnagar', 'Ramagundam', 'Uppal', 'Balanagar', 'Hyderguda', 'Katedan',
        'Suryapet', 'Peddamberpet', 'Jadcherla', 'Shamshabad'
    ]
};

const AMCMonthlyScheduler = () => {
    const { user } = useContext(AuthContext);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [selectedState, setSelectedState] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [schedulingData, setSchedulingData] = useState({
        scheduleDate: '',
        scheduledBy: user?.employeeName || '',
        sonNumber: '',
        sonDate: '',
        visitStatus: 'Pending',
        actualVisitDate: '',
        visitRemarks: '',
        isBreakdownVisit: '',
        breakdownVisitDate: '',
        breakdownVisitDetails: ''
    });

    useEffect(() => {
        fetchLiveAssets();
    }, []);

    const fetchLiveAssets = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/assets?status=Active&pageSize=1000', config);
            setAssets(data.assets || []);
        } catch (error) {
            console.error('Error fetching live assets:', error);
            setAssets([]);
        }
        setLoading(false);
    };

    const handleOpenSchedule = (asset) => {
        setSelectedAsset(asset);
        setSchedulingData({
            scheduleDate: asset.scheduleDate ? asset.scheduleDate.split('T')[0] : '',
            scheduledBy: asset.scheduledBy || user.employeeName,
            sonNumber: asset.sonNumber || '',
            sonDate: asset.sonDate ? asset.sonDate.split('T')[0] : '',
            visitStatus: asset.visitStatus || 'Pending',
            actualVisitDate: asset.actualVisitDate ? asset.actualVisitDate.split('T')[0] : '',
            visitRemarks: asset.visitRemarks || '',
            isBreakdownVisit: asset.isBreakdownVisit || '',
            breakdownVisitDate: asset.breakdownVisitDate ? asset.breakdownVisitDate.split('T')[0] : '',
            breakdownVisitDetails: asset.breakdownVisitDetails || ''
        });
        setShowPreview(true);
    };

    const handleSaveSchedule = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/assets/${selectedAsset._id}`, schedulingData, config);
            alert(`Schedule ${schedulingData.visitStatus === 'Assigned' ? 'assigned' : 'updated'} successfully`);
            setShowPreview(false);
            fetchLiveAssets();
        } catch (error) {
            alert('Error updating schedule');
        }
    };

    const isAssetDueInSelectedMonth = (asset, selectedMonthStr) => {
        if (!selectedMonthStr || !asset.contractStartDate) return true;

        const [selYear, selMonth] = selectedMonthStr.split('-').map(Number);
        const startDate = new Date(asset.contractStartDate);
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth() + 1; // 1-indexed

        const monthDiff = (selYear - startYear) * 12 + (selMonth - startMonth);
        if (monthDiff < 0) return false; // Before contract start

        const frequency = asset.typeOfVisits || 'Monthly';

        if (frequency === 'Monthly') return true;
        if (frequency === 'By Monthly' || frequency === 'Bi Monthly') return monthDiff % 2 === 0;
        if (frequency === 'Quarterly') return monthDiff % 3 === 0;
        if (frequency === 'Half Yearly') return monthDiff % 6 === 0;

        return true;
    };

    const filteredAssets = (assets || []).filter(asset => {
        // Role-based filtering: Service Engineers only see their own assigned assets
        if (user?.role === 'Service Engineer') {
            const isAssignedToMe = asset.engineerName && asset.engineerName.toLowerCase() === user.employeeName?.toLowerCase();
            if (!isAssignedToMe) return false;
        }

        const matchesSearch = !searchTerm ||
            (asset.assetNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.customerName?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesState = !selectedState || asset.state === selectedState;
        const matchesBranch = !selectedBranch || asset.branch === selectedBranch;

        // Logic: 
        // 1. If an asset has a scheduleDate, it must match the selectedMonth.
        // 2. If an asset has NO scheduleDate, it should only be visible if it is DUE this month based on frequency.
        // 3. If no selectedMonth is set, show everything (common for initial load or global search).

        let matchesMonth = true;
        if (selectedMonth) {
            if (asset.scheduleDate) {
                const assetMonth = asset.scheduleDate.split('T')[0].slice(0, 7);
                matchesMonth = assetMonth === selectedMonth;
            } else {
                // If it's a pending visit, check if it's actually DUE this month
                matchesMonth = isAssetDueInSelectedMonth(asset, selectedMonth);
            }
        }

        return matchesSearch && matchesState && matchesBranch && matchesMonth;
    });

    // Summary Calculations based on filtered list (or maybe based on total matching branch?)
    // Usually summaries should reflect the state of the CURRENTLY VISIBLE month's plan.
    const totalAssetsCount = filteredAssets.length;
    const completedCount = filteredAssets.filter(a => a.visitStatus === 'Completed').length;
    const assignedCount = filteredAssets.filter(a => a.visitStatus === 'Assigned').length;
    const pendingCount = filteredAssets.filter(a => !a.visitStatus || a.visitStatus === 'Pending' || (a.visitStatus === '' && !a.scheduleDate)).length;
    const postponedCount = filteredAssets.filter(a => a.visitStatus === 'Postponed').length;

    // Visit Frequency Breakdown
    const frequencyCounts = filteredAssets.reduce((acc, asset) => {
        const freq = asset.typeOfVisits || 'Monthly';
        acc[freq] = (acc[freq] || 0) + 1;
        return acc;
    }, {});

    const handleExportExcel = () => {
        const exportData = filteredAssets.map(asset => ({
            'Asset Number': asset.assetNumber || 'N/A',
            'Customer Name': asset.customerName || 'N/A',
            'Branch': asset.branch || 'N/A',
            'Model': asset.model || 'N/A',
            'KVA': asset.kva || 'N/A',
            'Contact Person': asset.contactPerson || 'N/A',
            'Contact Number': asset.contactNumber || 'N/A',
            'Engineer': asset.engineerName || 'N/A',
            'Contract Start': asset.contractStartDate ? new Date(asset.contractStartDate).toLocaleDateString() : 'N/A',
            'Contract End': asset.contractEndDate ? new Date(asset.contractEndDate).toLocaleDateString() : 'N/A',
            'Visits': asset.noOfVisits || 0,
            'Visit Type': asset.typeOfVisits || 'N/A',
            'Schedule Date': asset.scheduleDate ? new Date(asset.scheduleDate).toLocaleDateString() : 'N/A',
            'Scheduled By': asset.scheduledBy || 'N/A',
            'SON Number': asset.sonNumber || 'N/A',
            'Visit Status': asset.visitStatus || 'Pending',
            'Breakdown Visit': asset.isBreakdownVisit === 'Yes' ? 'Yes' : 'No',
            'Breakdown Date': asset.breakdownVisitDate ? new Date(asset.breakdownVisitDate).toLocaleDateString() : 'N/A'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "AMC Schedule");

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, `AMC_Schedule_${selectedMonth}_${selectedBranch || 'AllBranches'}.xlsx`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="amc-scheduler">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 style={{ margin: 0 }}>AMC Monthly Scheduler</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Monthly Schedule for All Live Engines</p>
                </div>
                <div className="flex gap-2 no-print">
                    <button className="btn-secondary" onClick={handleExportExcel}>
                        <FileSpreadsheet size={18} className="mr-2" /> Export Excel
                    </button>
                    <button className="btn-secondary" onClick={fetchLiveAssets}>
                        <RefreshCw size={18} className="mr-2" /> Refresh
                    </button>
                </div>
            </div>

            {/* Visit Frequency Breakdown Chips */}
            <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 no-print">
                <span className="text-sm font-semibold text-gray-500 w-full mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Visit Frequency (Due this Month)
                </span>
                {['Monthly', 'Bi Monthly', 'By Monthly', 'Quarterly', 'Half Yearly'].map(freq => {
                    const count = frequencyCounts[freq] || 0;
                    if (count === 0 && freq === 'By Monthly') return null;
                    return (
                        <div key={freq} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                            <span className="text-xs font-bold text-gray-700">{freq}:</span>
                            <span className="text-xs font-black text-blue-600">{count}</span>
                        </div>
                    );
                })}
            </div>

            {/* Summary Cards */}
            <div className="summary-grid no-print">
                <div className="summary-card total">
                    <div className="icon-box"><Building2 size={24} /></div>
                    <div className="content">
                        <div className="label">Total Assets</div>
                        <div className="value">{totalAssetsCount}</div>
                    </div>
                </div>
                <div className="summary-card completed">
                    <div className="icon-box"><CheckCircle2 size={24} /></div>
                    <div className="content">
                        <div className="label">Completed</div>
                        <div className="value">{completedCount}</div>
                    </div>
                </div>
                <div className="summary-card assigned">
                    <div className="icon-box"><UserCheck size={24} /></div>
                    <div className="content">
                        <div className="label">Assigned</div>
                        <div className="value">{assignedCount}</div>
                    </div>
                </div>
                <div className="summary-card pending">
                    <div className="icon-box"><AlertCircle size={24} /></div>
                    <div className="content">
                        <div className="label">Pending</div>
                        <div className="value">{pendingCount}</div>
                    </div>
                </div>
                <div className="summary-card postponed">
                    <div className="icon-box"><Clock size={24} /></div>
                    <div className="content">
                        <div className="label">Postponed</div>
                        <div className="value">{postponedCount}</div>
                    </div>
                </div>
            </div>

            <div className="filter-bar no-print">
                <div className="filter-item" style={{ flexGrow: 1 }}>
                    <label>Search Engines</label>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Asset Number, Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="filter-item" style={{ width: '200px' }}>
                    <label>Select Month</label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                </div>
                <div className="filter-item" style={{ width: '180px' }}>
                    <label>State</label>
                    <select
                        value={selectedState}
                        onChange={(e) => { setSelectedState(e.target.value); setSelectedBranch(''); }}
                    >
                        <option value="">All States</option>
                        {Object.keys(stateBranchData).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="filter-item" style={{ width: '180px' }}>
                    <label>Branch</label>
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value="">All Branches</option>
                        {selectedState ?
                            (stateBranchData[selectedState] || []).map(b => <option key={b} value={b}>{b}</option>) :
                            Object.values(stateBranchData).flat().map(b => <option key={b} value={b}>{b}</option>)
                        }
                    </select>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th>Asset Info</th>
                                <th>Customer Details</th>
                                <th>Contact Info</th>
                                <th>Contract Period</th>
                                <th>Visits Info</th>
                                <th>Schedule Details</th>
                                <th className="no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.length > 0 ? (
                                filteredAssets.map((asset) => {
                                    const amountPerVisit = (asset.noOfVisits && asset.noOfVisits > 0)
                                        ? (asset.basicAmount / asset.noOfVisits).toFixed(2)
                                        : '0.00';
                                    return (
                                        <tr key={asset._id} className="border-b hover:bg-gray-50">
                                            <td>
                                                <div className="font-bold text-blue-600">{asset.assetNumber || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{asset.model || '-'} | {asset.kva || '-'} KVA</div>
                                                <div className="text-xs text-gray-500">{asset.branch || '-'}</div>
                                            </td>
                                            <td>
                                                <div className="font-medium">{asset.customerName || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{asset.engineHpRange || '-'}</div>
                                            </td>
                                            <td>
                                                <div className="text-sm"><User size={12} className="inline mr-1" /> {asset.contactPerson || '-'}</div>
                                                <div className="text-xs"><Phone size={12} className="inline mr-1" /> {asset.contactNumber || '-'}</div>
                                                <div className="text-xs font-semibold mt-1">Eng: {asset.engineerName || '-'}</div>
                                                <div className="text-xs">{asset.engineerContact || '-'}</div>
                                            </td>
                                            <td>
                                                <div className="text-xs text-green-600 font-bold">Start: {asset.contractStartDate ? new Date(asset.contractStartDate).toLocaleDateString() : '-'}</div>
                                                <div className="text-xs text-red-600 font-bold">End: {asset.contractEndDate ? new Date(asset.contractEndDate).toLocaleDateString() : '-'}</div>
                                            </td>
                                            <td>
                                                <div className="text-xs">Visits: {asset.noOfVisits || 0} ({asset.typeOfVisits || '-'})</div>
                                                <div className="text-xs font-bold text-blue-700">₹{amountPerVisit}/visit</div>
                                            </td>
                                            <td>
                                                <div className="text-xs">Date: {asset.scheduleDate ? new Date(asset.scheduleDate).toLocaleDateString() : '-'}</div>
                                                <div className="text-xs">By: {asset.scheduledBy || '-'}</div>
                                                <div className="text-xs">SON: {asset.sonNumber || '-'}</div>
                                                <div className="text-xs mb-1">Status: <span className={`p-1 px-2 rounded-full text-xs ${asset.visitStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    asset.visitStatus === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                                                        asset.visitStatus === 'Postponed' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>{asset.visitStatus || 'Pending'}</span></div>
                                                {asset.isBreakdownVisit === 'Yes' && (
                                                    <div className="text-xs font-bold text-red-600">Breakdown: {asset.breakdownVisitDate ? new Date(asset.breakdownVisitDate).toLocaleDateString() : 'Yes'}</div>
                                                )}
                                            </td>
                                            <td className="no-print">
                                                <button className="p-2 hover:bg-blue-50 text-blue-600 rounded" onClick={() => handleOpenSchedule(asset)}>
                                                    <FileText size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center text-gray-500">
                                        No active assets (live engines) found.
                                        Only assets with an "Active" status are displayed here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showPreview && selectedAsset && (
                <div className="modal-overlay no-print" style={{ zIndex: 10001 }}>
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 style={{ margin: 0 }}>Schedule Asset: {selectedAsset.assetNumber}</h3>
                            <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-black"><X size={20} /></button>
                        </div>

                        {/* Asset Info Summary (Read-only) */}
                        <div className="bg-gray-50 p-3 rounded-lg border mb-4 text-sm">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div><span className="text-gray-500">Customer:</span> <span className="font-semibold">{selectedAsset.customerName}</span></div>
                                <div><span className="text-gray-500">Branch:</span> <span className="font-semibold">{selectedAsset.branch}</span></div>
                                <div><span className="text-gray-500">Model:</span> <span className="font-semibold">{selectedAsset.model}</span></div>
                                <div><span className="text-gray-500">KVA:</span> <span className="font-semibold">{selectedAsset.kva}</span></div>
                                <div><span className="text-gray-500">Visits:</span> <span className="font-semibold">{selectedAsset.noOfVisits} ({selectedAsset.typeOfVisits})</span></div>
                                <div><span className="text-gray-500">Contract End:</span> <span className="font-semibold text-red-600">{new Date(selectedAsset.contractEndDate).toLocaleDateString()}</span></div>
                            </div>
                            <div className="mt-3 pt-2 border-t grid grid-cols-2 gap-x-4">
                                <div className="form-group mb-0">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Asset Ownership - Engineer</label>
                                    <input type="text" readOnly value={selectedAsset.engineerName || ''} style={{ background: '#fff' }} />
                                </div>
                                <div className="form-group mb-0">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Engineer - Contact Number</label>
                                    <input type="text" readOnly value={selectedAsset.engineerContact || ''} style={{ background: '#fff' }} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label>Schedule Date</label>
                                <input type="date" readOnly={user?.role === 'Service Engineer'} value={schedulingData.scheduleDate} onChange={(e) => setSchedulingData({ ...schedulingData, scheduleDate: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Scheduled By</label>
                                <input type="text" readOnly={user?.role === 'Service Engineer'} value={schedulingData.scheduledBy} onChange={(e) => setSchedulingData({ ...schedulingData, scheduledBy: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>SON Number</label>
                                <input type="text" readOnly={user?.role === 'Service Engineer'} value={schedulingData.sonNumber} onChange={(e) => setSchedulingData({ ...schedulingData, sonNumber: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>SON Date</label>
                                <input type="date" readOnly={user?.role === 'Service Engineer'} value={schedulingData.sonDate} onChange={(e) => setSchedulingData({ ...schedulingData, sonDate: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Visit Status</label>
                                <select value={schedulingData.visitStatus} onChange={(e) => setSchedulingData({ ...schedulingData, visitStatus: e.target.value })}>
                                    {user?.role === 'Service Engineer' ? (
                                        <>
                                            <option value="Assigned" disabled>Assigned</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Postponed">Postponed</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Pending">Pending</option>
                                            <option value="Assigned">Assigned</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Postponed">Postponed</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Completed Date</label>
                                <input type="date" value={schedulingData.actualVisitDate} onChange={(e) => setSchedulingData({ ...schedulingData, actualVisitDate: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Visit Remarks</label>
                                <textarea
                                    value={schedulingData.visitRemarks}
                                    onChange={(e) => setSchedulingData({ ...schedulingData, visitRemarks: e.target.value })}
                                    placeholder="Enter completion or postponement details..."
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px' }}
                                />
                            </div>

                            {/* Breakdown Visit Section */}
                            <div className="form-group" style={{ gridColumn: 'span 2', background: '#fff1f2', padding: '12px', borderRadius: '8px', border: '1px solid #ffe4e6' }}>
                                <h4 className="text-red-700 text-sm font-bold mb-3 flex items-center gap-2">
                                    <AlertCircle size={16} /> Emergency / Breakdown Visit
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group mb-0">
                                        <label className="text-red-800">Is Breakdown Visit?</label>
                                        <select value={schedulingData.isBreakdownVisit} onChange={(e) => setSchedulingData({ ...schedulingData, isBreakdownVisit: e.target.value })} style={{ borderColor: '#fecdd3' }}>
                                            <option value="">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </div>
                                    <div className="form-group mb-0">
                                        <label className="text-red-800">Breakdown Date</label>
                                        <input type="date" value={schedulingData.breakdownVisitDate} onChange={(e) => setSchedulingData({ ...schedulingData, breakdownVisitDate: e.target.value })} disabled={schedulingData.isBreakdownVisit !== 'Yes'} style={{ borderColor: '#fecdd3' }} />
                                    </div>
                                    <div className="form-group mb-0" style={{ gridColumn: 'span 2' }}>
                                        <label className="text-red-800">Breakdown Details</label>
                                        <input type="text" value={schedulingData.breakdownVisitDetails} onChange={(e) => setSchedulingData({ ...schedulingData, breakdownVisitDetails: e.target.value })} disabled={schedulingData.isBreakdownVisit !== 'Yes'} placeholder="Nature of emergency or breakdown..." style={{ borderColor: '#fecdd3', width: '100%' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Amount per visit</label>
                                <input type="text" readOnly value={`₹${(selectedAsset.basicAmount / selectedAsset.noOfVisits).toFixed(2)}`} style={{ background: '#f8f9fa' }} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button className="btn-secondary" onClick={() => setShowPreview(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSaveSchedule}>Save Schedule</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
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
                .summary-card.completed .icon-box { background: #dcfce7; color: #15803d; }
                .summary-card.assigned .icon-box { background: #e0e7ff; color: #4338ca; }
                .summary-card.pending .icon-box { background: #fef3c7; color: #b45309; }
                .summary-card.postponed .icon-box { background: #f3e8ff; color: #7e22ce; }
                
                .summary-card .label { font-size: 0.85rem; color: #64748b; font-weight: 500; }
                .summary-card .value { font-size: 1.75rem; font-weight: 800; color: #1e293b; }

                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .amc-scheduler { padding: 0 !important; }
                    table { border-collapse: collapse !important; }
                    th, td { border: 1px solid #ddd !important; padding: 8px !important; }
                }
            `}</style>
        </div>
    );
};

export default AMCMonthlyScheduler;
