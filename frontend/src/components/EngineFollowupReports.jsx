import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart3, Search, Filter, X, Calendar, User, Phone, Mail, FileSpreadsheet, RefreshCw, Eye, Trash2, Database } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EngineFollowupReports = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = ['Admin', 'Super Admin'].includes(user?.role);

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [filters, setFilters] = useState({
        employeeId: '',
        assetSearch: '',
        fromDate: '',
        toDate: new Date().toISOString().split('T')[0]
    });
    const [previewData, setPreviewData] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 15;

    // Group reports by date
    const groupedByDate = reports.reduce((acc, item) => {
        const dateStr = item.followup?.followUpDate
            ? new Date(item.followup.followUpDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })
            : 'Date Unknown';
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(item);
        return acc;
    }, {});

    const groupedDates = Object.keys(groupedByDate);
    const totalRecords = reports.length;

    const fetchReports = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const params = new URLSearchParams();
            if (isAdmin && filters.employeeId) params.append('employeeId', filters.employeeId);
            if (isAdmin && filters.assetSearch) params.append('assetSearch', filters.assetSearch);
            if (filters.fromDate) params.append('fromDate', filters.fromDate);
            if (filters.toDate) params.append('toDate', filters.toDate);
            const res = await axios.get(`/api/engines/followups/reports?${params.toString()}`, config);
            setReports(res.data || []);
        } catch (err) {
            console.error('Error fetching engine followup reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        if (!isAdmin) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('/api/employees?pageSize=1000', config);
            setEmployees(res.data.employees || []);
        } catch (err) { /* silent */ }
    };

    useEffect(() => {
        fetchReports();
        fetchEmployees();
    }, []);

    const handleApplyFilters = () => {
        setPage(1);
        fetchReports();
    };

    const exportToExcel = async () => {
        if (!reports.length) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const params = new URLSearchParams();
            if (isAdmin && filters.employeeId) params.append('employeeId', filters.employeeId);
            if (isAdmin && filters.assetSearch) params.append('assetSearch', filters.assetSearch);
            if (filters.fromDate) params.append('fromDate', filters.fromDate);
            if (filters.toDate) params.append('toDate', filters.toDate);

            const res = await axios.get(`/api/engines/followups/export?${params.toString()}`, config);
            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            saveAs(blob, `EngineFollowupReports_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (err) {
            console.error('Error exporting data', err);
            alert('Export failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this follow-up record?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/engines/followups/${id}`, config);
            fetchReports();
        } catch (err) {
            alert('Failed to delete follow-up record');
        }
    };

    return (
        <div style={{ padding: '0', fontFamily: 'inherit' }}>
            <div style={{ background: 'white', borderRadius: '20px', marginBottom: '1.25rem', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem' }}>
                            <BarChart3 size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Engine Followup Reports</h2>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                                {isAdmin ? 'View all employee engine follow-up activities' : 'Your personal engine follow-up activity log'}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                        <button onClick={exportToExcel} disabled={!reports.length}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: reports.length ? '#f0fdf4' : '#f8fafc', color: reports.length ? '#16a34a' : '#94a3b8', border: `1px solid ${reports.length ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: '0.625rem', cursor: reports.length ? 'pointer' : 'not-allowed', fontSize: '0.82rem', fontWeight: 600 }}>
                            <FileSpreadsheet size={15} /> Export Excel
                        </button>
                    </div>
                </div>

                <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', background: '#fff5f5' }}>
                    {isAdmin && (
                        <>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={labelStyle}>Employee ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. EMP001"
                                    value={filters.employeeId}
                                    onChange={e => setFilters(prev => ({ ...prev, employeeId: e.target.value }))}
                                    list="emp-list"
                                    style={inputStyle}
                                />
                                <datalist id="emp-list">
                                    {employees.map(e => <option key={e._id} value={e.employeeId}>{e.employeeName}</option>)}
                                </datalist>
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={labelStyle}>Engine Search (No/ID)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. ENG123"
                                    value={filters.assetSearch}
                                    onChange={e => setFilters(prev => ({ ...prev, assetSearch: e.target.value }))}
                                    style={inputStyle}
                                />
                            </div>
                        </>
                    )}
                    <div style={{ flex: '1 1 160px' }}>
                        <label style={labelStyle}>From Date</label>
                        <input type="date" value={filters.fromDate} onChange={e => setFilters(prev => ({ ...prev, fromDate: e.target.value }))} style={inputStyle} />
                    </div>
                    <div style={{ flex: '1 1 160px' }}>
                        <label style={labelStyle}>To Date</label>
                        <input type="date" value={filters.toDate} onChange={e => setFilters(prev => ({ ...prev, toDate: e.target.value }))} style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={handleApplyFilters}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.25rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '0.625rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
                            <Search size={15} /> Apply
                        </button>
                        <button onClick={() => { setFilters({ employeeId: '', assetSearch: '', fromDate: '', toDate: new Date().toISOString().split('T')[0] }); setTimeout(fetchReports, 0); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 0.875rem', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.625rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                            <RefreshCw size={14} /> Reset
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                {[
                    { label: 'Total Follow-ups', value: totalRecords, color: '#dc2626', bg: '#fff5f5' },
                    { label: 'Days with Activity', value: groupedDates.length, color: '#1e40af', bg: '#eff6ff' },
                    { label: 'Engines Covered', value: new Set(reports.map(r => r.assetNumber)).size, color: '#166534', bg: '#f0fdf4' }
                ].map(s => (
                    <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: '1rem', padding: '1rem 1.25rem', textAlign: 'center', border: `1px solid ${s.bg}` }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid #fee2e2', borderTopColor: '#dc2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                    <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Loading engine reports...</p>
                </div>
            ) : groupedDates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <Database size={48} style={{ color: '#e2e8f0', marginBottom: '0.75rem' }} />
                    <p style={{ color: '#94a3b8', fontWeight: 600 }}>No follow-up records found for engines.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {groupedDates.map((dateLabel) => (
                        <div key={dateLabel} style={{ background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ padding: '0.75rem 1.25rem', background: '#fff5f5', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <Calendar size={16} style={{ color: '#dc2626' }} />
                                <span style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.9rem' }}>{dateLabel}</span>
                                <span style={{ background: '#fecaca', color: '#dc2626', borderRadius: '20px', padding: '1px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                                    {groupedByDate[dateLabel].length} record{groupedByDate[dateLabel].length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {groupedByDate[dateLabel].map((item, idx) => {
                                    const fu = item.followup || {};
                                    return (
                                        <div key={idx} style={{ padding: '1rem 1.25rem', borderBottom: idx < groupedByDate[dateLabel].length - 1 ? '1px solid #f8fafc' : 'none', display: 'grid', gridTemplateColumns: '1fr 1.5fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.9rem' }}>{item.assetNumber}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{item.customerName}</div>
                                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>{item.branch}</div>
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                                                    <User size={13} style={{ color: '#94a3b8' }} />
                                                    <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem' }}>{fu.employeeName || '-'}</span>
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {fu.employeeId || '-'}</div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: '#be123c', marginBottom: '0.5rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                                                    "{fu.remarks || '-'}"
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
                                                    <button onClick={() => setPreviewData(item)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#475569', padding: '0.4rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer', display: 'flex', gap: '0.25rem', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        <Eye size={14} /> Preview
                                                    </button>
                                                    {isAdmin && (
                                                        <button onClick={() => handleDelete(fu._id)} style={{ background: '#fff1f2', border: '1px solid #fecaca', color: '#e11d48', padding: '0.4rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer', display: 'flex', gap: '0.25rem', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {previewData && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setPreviewData(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}><X size={18} color="#64748b" /></button>
                        <h2 style={{ marginTop: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', color: '#1e293b', fontSize: '1.25rem' }}>Engine Follow-up Detail</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                            <div><strong style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Engine No</strong> <span style={{ display: 'block' }}>{previewData.assetNumber}</span></div>
                            <div><strong style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Customer</strong> <span style={{ display: 'block' }}>{previewData.customerName}</span></div>
                            <div><strong style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Branch</strong> <span style={{ display: 'block' }}>{previewData.branch}</span></div>
                            <div><strong style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Follow-up Date</strong> <span style={{ display: 'block' }}>{new Date(previewData.followup?.followUpDate).toLocaleDateString()}</span></div>
                            <div><strong style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Employee</strong> <span style={{ display: 'block' }}>{previewData.followup?.employeeName} ({previewData.followup?.employeeId})</span></div>
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            <strong style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Remarks</strong>
                            <p style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', margin: '0.5rem 0 0', color: '#334155', border: '1px solid #e2e8f0' }}>{previewData.followup?.remarks}</p>
                        </div>
                    </div>
                </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

const labelStyle = { display: 'block', fontSize: '0.68rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' };
const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #fecaca', borderRadius: '0.5rem', fontSize: '0.85rem', outline: 'none', background: 'white', boxSizing: 'border-box' };

export default EngineFollowupReports;
