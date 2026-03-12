import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, FileSpreadsheet, RefreshCw, Loader, Clock, CreditCard } from 'lucide-react';
import * as XLSX from 'xlsx';

const AmcBilling = () => {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [activeTab, setActiveTab] = useState('billing'); // 'billing', 'payments', 'outstanding'

    useEffect(() => {
        fetchPayments();
    }, [searchTerm, filterStatus]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/assets?pageSize=1000`, config);

            let allMilestones = [];
            data.assets.forEach(asset => {
                [1, 2, 3, 4].forEach(i => {
                    const date = asset[`q${i}Date`];
                    if (date) {
                        allMilestones.push({
                            _id: `${asset._id}_${i}`,
                            assetId: asset._id,
                            assetNumber: asset.assetNumber,
                            customerName: asset.customerName,
                            branch: asset.branch,
                            milestone: `Milestone ${i}`,
                            scheduleDate: date,
                            amount: asset[`q${i}Amount`] || 0,
                            tallyInvoiceNo: asset[`q${i}TallyInvoiceNo`] || '',
                            invoiceDate: asset[`q${i}InvoiceDate`] || '',
                            paymentStatus: asset[`q${i}PaymentStatus`] || 'Pending',
                            paymentDetails: asset[`q${i}PaymentDetails`] || '',
                            paymentReceivedDate: asset[`q${i}PaymentReceivedDate`] || '',
                            rawAsset: asset,
                            milestoneIndex: i
                        });
                    }
                });
            });

            // Apply Filters
            let filtered = allMilestones.filter(m => {
                const matchesSearch = m.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    m.customerName.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = filterStatus ? m.paymentStatus === filterStatus : true;
                return matchesSearch && matchesStatus;
            });

            // Sort by Date
            filtered.sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));
            setPayments(filtered);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
        setLoading(false);
    };

    const handleUpdateTracking = async (item, field, value) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const updatedAsset = { ...item.rawAsset };
            const fieldName = `q${item.milestoneIndex}${field}`;
            updatedAsset[fieldName] = value;

            await axios.put(`/api/assets/${item.assetId}`, updatedAsset, config);
            setPayments(prev => prev.map(p => p._id === item._id ? { ...p, [field.charAt(0).toLowerCase() + field.slice(1)]: value } : p));
        } catch (error) {
            alert('Update failed');
        }
    };

    const handleExport = () => {
        const exportData = payments.map(p => ({
            'Asset No': p.assetNumber,
            'Customer Name': p.customerName,
            'Branch': p.branch,
            'Milestone': p.milestone,
            'Invoice Amount': p.amount,
            'Payment Status': p.paymentStatus,
            'Payment Details': p.paymentDetails,
            'Payment Received Date': p.paymentReceivedDate ? new Date(p.paymentReceivedDate).toLocaleDateString() : '',
            'Outstanding Amount': p.paymentStatus === 'Yes' ? 0 : p.amount
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Payments_Outstanding');
        XLSX.writeFile(wb, 'AMC_Payments_Outstanding.xlsx');
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterStatus('');
    };

    // Calculate totals
    const totalOutstanding = payments.filter(p => p.paymentStatus !== 'Yes').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalReceived = payments.filter(p => p.paymentStatus === 'Yes').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const renderTabMenu = () => (
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 w-fit border border-slate-200 shadow-inner">
            <button
                onClick={() => setActiveTab('billing')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'billing' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
                AMC Billing
            </button>
            <button
                onClick={() => setActiveTab('payments')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'payments' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
                AMC Payments & Outstanding
            </button>
            <button
                onClick={() => setActiveTab('outstanding')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'outstanding' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
                Outstanding Followup
            </button>
        </div>
    );

    const renderPaymentsTab = () => (
        <>
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Outstanding</p>
                        <h3 className="text-3xl font-black text-slate-800">₹{totalOutstanding.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="p-6 bg-green-50/50 border border-green-100 rounded-2xl flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-1">Total Received</p>
                        <h3 className="text-3xl font-black text-green-700">₹{totalReceived.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="filter-bar bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 items-end mb-6 shadow-sm">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Search Asset/Customer</label>
                    <div className="relative">
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '35px', width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                    </div>
                </div>
                <div className="w-48">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Payment Status</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <option value="">All Status</option>
                        <option value="Yes">Received</option>
                        <option value="No">Not Received</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
                <button className="h-[42px] px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg flex items-center gap-2 transition-colors" onClick={resetFilters}>
                    <RefreshCw size={16} /> Reset
                </button>
            </div>

            <div className="table-container bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-10"><Loader className="animate-spin text-slate-400" /></div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">Asset & Customer</th>
                                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">Invoice Amount</th>
                                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">Payment Tracking</th>
                                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((item) => (
                                <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{item.assetNumber}</div>
                                        <div className="text-sm text-slate-500 mt-1">{item.customerName}</div>
                                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                            {item.branch} • <span className="text-red-500 font-bold">{item.milestone}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <strong className="text-lg text-slate-800">₹{item.amount.toLocaleString()}</strong>
                                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                            <Clock size={12} /> {new Date(item.scheduleDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="text"
                                                placeholder="Payment Details (Ref/Mode)"
                                                value={item.paymentDetails}
                                                onBlur={(e) => handleUpdateTracking(item, 'PaymentDetails', e.target.value)}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setPayments(prev => prev.map(p => p._id === item._id ? { ...p, paymentDetails: val } : p));
                                                }}
                                                className="w-full text-sm p-2 border border-slate-200 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                                            />
                                            <input
                                                type="date"
                                                value={item.paymentReceivedDate ? item.paymentReceivedDate.split('T')[0] : ''}
                                                onChange={(e) => handleUpdateTracking(item, 'PaymentReceivedDate', e.target.value)}
                                                className="w-full text-sm p-2 border border-slate-200 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={item.paymentStatus}
                                            onChange={(e) => handleUpdateTracking(item, 'PaymentStatus', e.target.value)}
                                            className="text-sm p-2 rounded-lg font-bold outline-none cursor-pointer"
                                            style={{
                                                backgroundColor: item.paymentStatus === 'Yes' ? '#e6f4ea' : item.paymentStatus === 'No' ? '#fde7e7' : '#fff9db',
                                                color: item.paymentStatus === 'Yes' ? '#1e7e34' : item.paymentStatus === 'No' ? '#e31e24' : '#b45309',
                                                border: '1px solid transparent'
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Yes">Received</option>
                                            <option value="No">Not Received</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 text-slate-400">No payment records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );

    return (
        <div className="invoice-projection animate-fade-in">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CreditCard size={24} className="text-red-500" />
                        AMC - Billing
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Manage AMC billing, payments, and followups</p>
                </div>
                <button className="btn-secondary" onClick={handleExport}>
                    <FileSpreadsheet size={18} className="mr-2" /> Export Report
                </button>
            </div>

            {renderTabMenu()}

            {activeTab === 'billing' && (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 mb-6">
                    <FileSpreadsheet size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-xl font-black text-slate-700 uppercase tracking-widest mb-2">AMC Billing</h3>
                    <p className="text-slate-500">Manage invoices and billing milestones for AMC contracts.</p>
                </div>
            )}

            {activeTab === 'payments' && renderPaymentsTab()}

            {activeTab === 'outstanding' && (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                    <Clock size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-xl font-black text-slate-700 uppercase tracking-widest mb-2">Outstanding Followups</h3>
                    <p className="text-slate-500">Track and log interactions for pending AMC payments.</p>
                </div>
            )}

        </div>
    );
};

export default AmcBilling;
