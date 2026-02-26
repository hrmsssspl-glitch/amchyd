import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, FileSpreadsheet, RefreshCw, Loader, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AmcInvoiceProjection = () => {
    const { user } = useContext(AuthContext);
    const [projections, setProjections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchProjections();
    }, [searchTerm, filterMonth, filterStatus]);

    const fetchProjections = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // We fetch all assets and then flatten milestones for projection
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
                            amount: asset[`q${i}Amount`],
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
                const mDate = new Date(m.scheduleDate);
                const matchesMonth = filterMonth ? (mDate.getMonth() + 1) === Number(filterMonth) : true;
                return matchesSearch && matchesStatus && matchesMonth;
            });

            // Sort by Date
            filtered.sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));
            setProjections(filtered);
        } catch (error) {
            console.error('Error fetching projections:', error);
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
            // Update local state for immediate UI feedback
            setProjections(prev => prev.map(p => p._id === item._id ? { ...p, [field.charAt(0).toLowerCase() + field.slice(1)]: value } : p));
        } catch (error) {
            alert('Update failed');
        }
    };

    const handleExport = () => {
        const exportData = projections.map(p => ({
            'Asset No': p.assetNumber,
            'Customer Name': p.customerName,
            'Branch': p.branch,
            'Milestone': p.milestone,
            'Schedule Date': new Date(p.scheduleDate).toLocaleDateString(),
            'Amount': p.amount,
            'Tally Invoice No': p.tallyInvoiceNo,
            'Invoice Date': p.invoiceDate ? new Date(p.invoiceDate).toLocaleDateString() : '',
            'Payment Status': p.paymentStatus,
            'Payment Details': p.paymentDetails,
            'Payment Received Date': p.paymentReceivedDate ? new Date(p.paymentReceivedDate).toLocaleDateString() : ''
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
        XLSX.writeFile(wb, 'AMC_Invoice_Projection.xlsx');
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterMonth('');
        setFilterStatus('');
    };

    const months = [
        { val: 1, label: 'January' }, { val: 2, label: 'February' }, { val: 3, label: 'March' },
        { val: 4, label: 'April' }, { val: 5, label: 'May' }, { val: 6, label: 'June' },
        { val: 7, label: 'July' }, { val: 8, label: 'August' }, { val: 9, label: 'September' },
        { val: 10, label: 'October' }, { val: 11, label: 'November' }, { val: 12, label: 'December' }
    ];

    return (
        <div className="invoice-projection">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 style={{ margin: 0 }}>AMC Invoice Projection</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Track and manage billing milestones and payments</p>
                </div>
                <button className="btn-secondary" onClick={handleExport}>
                    <FileSpreadsheet size={18} className="mr-2" /> Export Projection
                </button>
            </div>

            <div className="filter-bar">
                <div className="filter-item">
                    <label>Search Asset/Customer</label>
                    <div className="relative">
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '35px' }}
                        />
                    </div>
                </div>
                <div className="filter-item">
                    <label>Month</label>
                    <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                        <option value="">All Months</option>
                        {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                    </select>
                </div>
                <div className="filter-item">
                    <label>Status</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="Yes">Received</option>
                        <option value="No">Not Received</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
                <button className="btn-reset" onClick={resetFilters}>
                    <RefreshCw size={18} /> Reset
                </button>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="flex justify-center p-10"><Loader className="animate-spin" /></div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Asset & Customer</th>
                                <th>Schedule Date</th>
                                <th>Amount</th>
                                <th>Invoice Info</th>
                                <th>Payment Tracking</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projections.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <div style={{ fontWeight: 700 }}>{item.assetNumber}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.customerName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#999' }}>{item.branch}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={14} color="#666" />
                                            {new Date(item.scheduleDate).toLocaleDateString()}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-red)' }}>{item.milestone}</div>
                                    </td>
                                    <td><strong style={{ color: '#1a1a1a' }}>₹{item.amount.toLocaleString()}</strong></td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="text"
                                                placeholder="Tally Inv No"
                                                value={item.tallyInvoiceNo}
                                                onBlur={(e) => handleUpdateTracking(item, 'TallyInvoiceNo', e.target.value)}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setProjections(prev => prev.map(p => p._id === item._id ? { ...p, tallyInvoiceNo: val } : p));
                                                }}
                                                style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                                            />
                                            <input
                                                type="date"
                                                value={item.invoiceDate ? item.invoiceDate.split('T')[0] : ''}
                                                onChange={(e) => handleUpdateTracking(item, 'InvoiceDate', e.target.value)}
                                                style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="text"
                                                placeholder="Payment Details"
                                                value={item.paymentDetails}
                                                onBlur={(e) => handleUpdateTracking(item, 'PaymentDetails', e.target.value)}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setProjections(prev => prev.map(p => p._id === item._id ? { ...p, paymentDetails: val } : p));
                                                }}
                                                style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                                            />
                                            <input
                                                type="date"
                                                value={item.paymentReceivedDate ? item.paymentReceivedDate.split('T')[0] : ''}
                                                onChange={(e) => handleUpdateTracking(item, 'PaymentReceivedDate', e.target.value)}
                                                style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <select
                                            value={item.paymentStatus}
                                            onChange={(e) => handleUpdateTracking(item, 'PaymentStatus', e.target.value)}
                                            style={{
                                                fontSize: '0.8rem',
                                                padding: '4px 8px',
                                                backgroundColor: item.paymentStatus === 'Yes' ? '#e6f4ea' : item.paymentStatus === 'No' ? '#fde7e7' : '#fff9db',
                                                color: item.paymentStatus === 'Yes' ? '#1e7e34' : item.paymentStatus === 'No' ? '#c82333' : '#856404',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontWeight: 600
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Yes">Received</option>
                                            <option value="No">Not Received</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AmcInvoiceProjection;
