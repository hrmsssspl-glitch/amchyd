import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Database, Search, Filter, Eye, Printer, FileText, ChevronDown, CheckCircle2, AlertCircle, Building2, Download, Calculator, X, FileSpreadsheet, MapPin } from 'lucide-react';
import * as XLSX from 'xlsx';

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

const AssetInactiveStatus = () => {
    const { user } = useContext(AuthContext);
    const [assets, setAssets] = useState([]);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;
    const [showPreview, setShowPreview] = useState(false);
    const [previewAsset, setPreviewAsset] = useState(null);
    const [stats, setStats] = useState({ total: 0, branches: [], hpRanges: [] });
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        assetNumber: '', kva: '', engineHpRange: '', state: '', branch: '',
        coordinator: '', customerName: '',
        contractEndMonth: '', contractStartDateFrom: '', contractEndDateTo: '',
        engineerName: ''
    });

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const queryParams = new URLSearchParams({
                status: 'Inactive',
                pageSize: 1000,
                keyword: searchTerm,
                ...searchFilters
            }).toString();
            const response = await axios.get(`/api/assets?${queryParams}`, config);
            const inactiveAssets = response.data.assets || [];
            setAssets(inactiveAssets);
            setFilteredAssets(inactiveAssets);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching assets:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, [searchTerm, searchFilters]);

    useEffect(() => {
        const filtered = assets.filter(asset => {
            const assetNo = String(asset.assetNumber || '').toLowerCase();
            const customer = String(asset.customerName || '').toLowerCase();
            const search = searchTerm.toLowerCase();
            return assetNo.includes(search) || customer.includes(search);
        });
        setFilteredAssets(filtered);
        setPage(1);

        // Calculate stats whenever assets change
        const branches = {};
        const hpRanges = {};
        assets.forEach(asset => {
            if (asset.branch) branches[asset.branch] = (branches[asset.branch] || 0) + 1;
            if (asset.engineHpRange) hpRanges[asset.engineHpRange] = (hpRanges[asset.engineHpRange] || 0) + 1;
        });

        setStats({
            total: assets.length,
            branches: Object.entries(branches).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
            hpRanges: Object.entries(hpRanges).map(([range, count]) => ({ range, count })).sort((a, b) => b.count - a.count)
        });
    }, [searchTerm, assets]);

    const pages = Math.ceil(filteredAssets.length / limit);
    const currentAssets = filteredAssets.slice((page - 1) * limit, page * limit);

    const handlePreview = (asset) => {
        setPreviewAsset(asset);
        setShowPreview(true);
    };

    const exportToExcel = () => {
        if (!filteredAssets.length) return alert('No data to export');

        const dataToExport = filteredAssets.map(asset => ({
            'Asset No': asset.assetNumber,
            'Model': asset.model,
            'KVA': asset.kva,
            'HP Range': asset.engineHpRange,
            'Branch': asset.branch,
            'Customer Name': asset.customerName,
            'Contact Person': asset.contactPerson,
            'Contact Number': asset.contactNumber,
            'Contract Start Date': asset.contractStartDate ? new Date(asset.contractStartDate).toLocaleDateString() : '',
            'Contract End Date': asset.contractEndDate ? new Date(asset.contractEndDate).toLocaleDateString() : '',
            'Basic Amount': asset.basicAmount,
            'GST Amount': asset.gstAmount,
            'Total Amount': asset.totalAmount,
            'Coordinator': asset.coordinator,
            'Engineer Name': asset.engineerName,
            'Status': asset.status,
            'Remarks': asset.remarks
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, 'Inactive Assets');
        XLSX.writeFile(wb, `Inactive_Assets_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="asset-master p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 custom-scrollbar mb-6" style={{ minWidth: '100%' }}>
                    <div className="summary-card total" style={{ flex: '1 1 280px' }}>
                        <div className="icon-box"><Download size={24} /></div>
                        <div className="content">
                            <div className="label">Total Inactive</div>
                            <div className="value">{stats.total}</div>
                        </div>
                    </div>
                    <div className="summary-card branches-count" style={{ flex: '1 1 280px' }}>
                        <div className="icon-box"><Building2 size={24} /></div>
                        <div className="content">
                            <div className="label">Inactive Branches</div>
                            <div className="value">{stats.branches.length}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="card shadow-sm p-5 bg-white rounded-2xl border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-700 mb-5 flex items-center">
                            <Building2 size={18} className="mr-2 text-blue-500" /> Branch Wise Inactive
                        </h4>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {stats.branches.map((b, idx) => (
                                <div key={idx} className="breakdown-item">
                                    {b.name} - <span className="text-blue-600 ml-1">{b.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card shadow-sm p-5 bg-white rounded-2xl border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-700 mb-5 flex items-center">
                            <Calculator size={18} className="mr-2 text-purple-500" /> HP Range Inactive
                        </h4>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {stats.hpRanges.map((h, idx) => (
                                <div key={idx} className="breakdown-item">
                                    {h.range || 'N/A'} - <span className="text-purple-600 ml-1">{h.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-header flex justify-between items-center bg-white p-6 border-b rounded-t-2xl">
                    <div className="flex items-center gap-3 text-gray-800">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">AMC Status View</h2>
                            <p className="text-xs text-gray-500">List of all Currently Inactive AMC assets</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-4 py-2 border border-green-200 text-green-700 bg-green-50 rounded-xl text-sm font-semibold transition-all hover:bg-green-100"
                        >
                            <FileSpreadsheet size={18} />
                            Export Excel
                        </button>
                        <button
                            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all ${showAdvancedSearch ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Filter size={18} />
                            {showAdvancedSearch ? 'Hide Filters' : 'Advanced Filters'}
                        </button>
                        <div className="search-bar relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Quick search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Advanced Search Panel */}
                {showAdvancedSearch && (
                    <div className="p-6 bg-red-50/30 border-b border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-red-700 uppercase tracking-wider px-1">Asset No</label>
                                <input
                                    type="text"
                                    name="assetNumber"
                                    placeholder="e.g. 2547..."
                                    value={searchFilters.assetNumber}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, assetNumber: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-red-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-red-700 uppercase tracking-wider px-1">Customer</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    placeholder="Customer name..."
                                    value={searchFilters.customerName}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, customerName: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-red-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-red-700 uppercase tracking-wider px-1">State</label>
                                <select
                                    name="state"
                                    value={searchFilters.state}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, state: e.target.value, branch: '' })}
                                    className="w-full px-3 py-2 bg-white border border-red-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <option value="">All States</option>
                                    {Object.keys(stateBranchData).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-red-700 uppercase tracking-wider px-1">Branch</label>
                                <select
                                    name="branch"
                                    value={searchFilters.branch}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, branch: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-red-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <option value="">All Branches</option>
                                    {searchFilters.state ?
                                        (stateBranchData[searchFilters.state] || []).map(b => <option key={b} value={b}>{b}</option>) :
                                        Object.values(stateBranchData).flat().map(b => <option key={b} value={b}>{b}</option>)
                                    }
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-red-700 uppercase tracking-wider px-1">Month Wise (Renewal)</label>
                                <select
                                    name="contractEndMonth"
                                    value={searchFilters.contractEndMonth}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, contractEndMonth: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-red-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <option value="">All Months</option>
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-red-700 uppercase tracking-wider px-1">Contract Start Date (From)</label>
                                <input
                                    type="date"
                                    name="contractStartDateFrom"
                                    value={searchFilters.contractStartDateFrom}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, contractStartDateFrom: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-red-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-red-700 uppercase tracking-wider px-1">Contract End Date (To)</label>
                                <input
                                    type="date"
                                    name="contractEndDateTo"
                                    value={searchFilters.contractEndDateTo}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, contractEndDateTo: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-red-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setSearchFilters({
                                    assetNumber: '', kva: '', engineHpRange: '', state: '', branch: '',
                                    coordinator: '', customerName: '',
                                    contractEndMonth: '', contractStartDateFrom: '', contractEndDateTo: '',
                                    engineerName: ''
                                })}
                                className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-red-100 transition-all"
                            >
                                <X size={14} /> Reset All Filters
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading inactive assets...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table style={{ minWidth: '1300px' }}>
                            <thead>
                                <tr>
                                    <th style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>Asset No</th>
                                    <th style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>KVA</th>
                                    <th style={{ minWidth: '220px', padding: '12px 16px' }}>Customer Name</th>
                                    <th style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>Contact Person</th>
                                    <th style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>Start Date</th>
                                    <th style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>End Date</th>
                                    <th style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>Visits</th>
                                    <th style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>Basic Amount</th>
                                    <th style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>Status</th>
                                    <th style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAssets.map((asset) => (
                                    <tr key={asset._id}>
                                        <td style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}><strong>{asset.assetNumber}</strong></td>
                                        <td style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>{asset.kva || '-'}</td>
                                        <td style={{ minWidth: '220px', padding: '12px 16px' }}>{asset.customerName}</td>
                                        <td style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>{asset.contactPerson || '-'}</td>
                                        <td style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>{asset.contractStartDate ? new Date(asset.contractStartDate).toLocaleDateString() : '-'}</td>
                                        <td style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>{asset.contractEndDate ? new Date(asset.contractEndDate).toLocaleDateString() : '-'}</td>
                                        <td style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>{asset.noOfVisits || '0'}</td>
                                        <td style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>₹{(asset.basicAmount ?? 0).toLocaleString()}</td>
                                        <td style={{ whiteSpace: 'nowrap', padding: '12px 16px' }}>
                                            <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <button className="p-2 hover:bg-gray-100 rounded text-blue-600 transition-colors" onClick={() => handlePreview(asset)} title="View Full Details">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {currentAssets.length === 0 && (
                                    <tr>
                                        <td colSpan="10" className="p-12 text-center text-gray-400 italic">No inactive assets found matching your criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {pages > 1 && (
                    <div className="flex justify-between items-center p-4 border-t" style={{ fontSize: '0.85rem' }}>
                        <div className="text-gray-600">Showing page {page} of {pages > 0 ? pages : 1} entries</div>
                        <div className="pagination-controls">
                            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                            <button className="active">{page}</button>
                            <button disabled={page === pages || pages === 0} onClick={() => setPage(page + 1)}>Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Asset Preview Modal (same as AssetMaster) */}
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
                            color: '#fff', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.2)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: 800 }}>{previewAsset.assetNumber}</h2>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9, fontWeight: 500 }}>{previewAsset.customerName}</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="no-print">
                                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                                    {previewAsset.status}
                                </span>
                                <button
                                    onClick={() => window.print()}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none',
                                        padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                >
                                    <Printer size={18} /> Print PDF
                                </button>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    style={{
                                        background: 'rgba(0,0,0,0.2)', color: '#fff', border: 'none',
                                        width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.3)'}
                                    onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.2)'}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Summary Bar */}
                        <div style={{ display: 'flex', background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                            <div style={{ flex: 1, padding: '1rem', borderRight: '1px solid #eee', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Basic Amount</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2c3e50' }}>₹ {previewAsset.basicAmount?.toLocaleString()}</div>
                            </div>
                            <div style={{ flex: 1, padding: '1rem', borderRight: '1px solid #eee', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>GST (18%)</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2c3e50' }}>₹ {previewAsset.gstAmount?.toLocaleString()}</div>
                            </div>
                            <div style={{ flex: 1, padding: '1rem', borderRight: '1px solid #eee', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Amount</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c0392b' }}>₹ {previewAsset.totalAmount?.toLocaleString()}</div>
                            </div>
                            <div style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Last Year Basic</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#7f8c8d' }}>₹ {previewAsset.lastYearPriceBasic?.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Details Content */}
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                                {/* Block 1: Basic Details */}
                                <div>
                                    <h4 style={{ color: '#c0392b', borderBottom: '2px solid #fce4e4', paddingBottom: '0.5rem', margin: '0 0 1rem' }}>Basic Asset Details</h4>
                                    <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                        <tbody>
                                            <tr><td style={{ padding: '8px 0', color: '#666', width: '40%' }}>Branch</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.branch}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Engine HP Range</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.engineHpRange}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>KVA</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.kva}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Model</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.model}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Category</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.category}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Coordinator</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.coordinator}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Engineer Name</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.engineerName}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Engineer Contact</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.engineerContact}</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Block 2: Customer & Contract Info */}
                                <div>
                                    <h4 style={{ color: '#c0392b', borderBottom: '2px solid #fce4e4', paddingBottom: '0.5rem', margin: '0 0 1rem' }}>Customer & Contract</h4>
                                    <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                        <tbody>
                                            <tr><td style={{ padding: '8px 0', color: '#666', width: '40%' }}>Contact Person</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.contactPerson}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Contact Number</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.contactNumber}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Mail ID</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.mailId}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>PM Name</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.purchaseManagerName}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>PM Contact</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.purchaseManagerContact}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>PM Email</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.purchaseManagerEmail}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Contract Start Date</td><td style={{ padding: '8px 0', fontWeight: 600, color: '#2980b9' }}>{previewAsset.contractStartDate ? new Date(previewAsset.contractStartDate).toLocaleDateString() : 'N/A'}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Contract End Date</td><td style={{ padding: '8px 0', fontWeight: 600, color: '#c0392b' }}>{previewAsset.contractEndDate ? new Date(previewAsset.contractEndDate).toLocaleDateString() : 'N/A'}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Contract Period</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.contractPeriod}</td></tr>
                                            <tr><td style={{ padding: '8px 0', color: '#666' }}>Months Pending</td><td style={{ padding: '8px 0', fontWeight: 600 }}>{previewAsset.contractMonthsPending} Month(s)</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Remarks */}
                            {previewAsset.remarks && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <h4 style={{ color: '#c0392b', borderBottom: '2px solid #fce4e4', paddingBottom: '0.5rem', margin: '0 0 1rem' }}>Remarks</h4>
                                    <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '1rem', whiteSpace: 'pre-wrap', color: '#333' }}>
                                        {previewAsset.remarks}
                                    </div>
                                </div>
                            )}
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
                    padding: 1.5rem;
                    border-radius: 20px;
                    background: #fff;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                    border: 1px solid rgba(0,0,0,0.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .summary-card:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(0,0,0,0.06); }
                .summary-card .icon-box {
                    padding: 14px;
                    border-radius: 14px;
                    margin-right: 1.25rem;
                }
                .summary-card.total .icon-box { background: #fee2e2; color: #dc2626; }
                .summary-card.branches-count .icon-box { background: #f3e8ff; color: #7e22ce; }
                
                .summary-card .label { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
                .summary-card .value { font-size: 2rem; font-weight: 800; color: #1e293b; line-height: 1; margin-top: 4px; }

                /* Breakdown Chips */
                .breakdown-item {
                    display: inline-flex;
                    align-items: center;
                    padding: 7px 14px;
                    background: #f8fafc;
                    border-radius: 24px;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 4px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #334155;
                    transition: all 0.2s ease;
                }
                .breakdown-item:hover {
                    background: #fff;
                    border-color: #cbd5e1;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    transform: translateY(-1px);
                }

                .table-container {
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                    border: 1px solid #f1f5f9;
                    overflow: hidden;
                }
                
                table { width: 100%; border-collapse: collapse; }
                th { background: #f8fafc; color: #64748b; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; border-bottom: 1px solid #f1f5f9; }
                tr { border-bottom: 1px solid #f8fafc; transition: background 0.2s; }
                tr:hover { background: #fcfdfe; }
                td { color: #334155; font-size: 0.9rem; }

                @media print {
                    body > * { visibility: hidden !important; }
                    #asset-preview-content, #asset-preview-content * { visibility: visible !important; }
                    #asset-preview-content { 
                        position: absolute !important; 
                        left: 0 !important; 
                        top: 0 !important; 
                        width: 100% !important; 
                        box-shadow: none !important; 
                        border-radius: 0 !important; 
                        background: white !important;
                    }
                    .no-print { display: none !important; }
                }

                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
        </div>
    );
};

export default AssetInactiveStatus;
