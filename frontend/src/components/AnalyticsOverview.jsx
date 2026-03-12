import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart3, TrendingUp, Building2, CalendarDays, Loader, Database, Activity, ShieldOff, Zap, IndianRupee, Receipt, CheckCircle, Clock } from 'lucide-react';

const AnalyticsOverview = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/assets/stats', config);
            setStats(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to load analytics data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader className="animate-spin mb-4" size={32} />
                <p>Gathering latest metrics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center justify-center h-64">
                <p>{error}</p>
            </div>
        );
    }

    if (!stats) return null;

    // Calculate percentages for branch bars
    const maxBranchCount = stats.branches && stats.branches.length > 0
        ? Math.max(...stats.branches.map(b => b.count))
        : 1;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <div className="analytics-dashboard">
            {/* Top Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="stat-card total-assets">
                    <div className="icon-wrapper"><Database size={24} /></div>
                    <div className="stat-info">
                        <h3>Total Assets</h3>
                        <p className="value">{stats.total}</p>
                        <span className="subtitle flex items-center gap-1 text-blue-600"><TrendingUp size={14} /> Registered in system</span>
                    </div>
                </div>
                <div className="stat-card active-assets">
                    <div className="icon-wrapper"><Activity size={24} /></div>
                    <div className="stat-info">
                        <h3>Active Contracts</h3>
                        <p className="value">{stats.status?.active || 0}</p>
                        <span className="subtitle flex items-center gap-1 text-green-600"><TrendingUp size={14} /> Currently serviceable</span>
                    </div>
                </div>
                <div className="stat-card inactive-assets">
                    <div className="icon-wrapper"><ShieldOff size={24} /></div>
                    <div className="stat-info">
                        <h3>Inactive/Expired</h3>
                        <p className="value">{stats.status?.inactive || 0}</p>
                        <span className="subtitle text-red-500">Requires renewal</span>
                    </div>
                </div>
            </div>

            {/* Financial Metrics Row */}
            {stats.financials && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card basic-amount">
                        <div className="icon-wrapper"><IndianRupee size={24} /></div>
                        <div className="stat-info">
                            <h3 style={{ fontSize: '0.8rem' }}>Total Basic Amount</h3>
                            <p className="value" style={{ fontSize: '1.6rem' }}>{formatCurrency(stats.financials.totalBasicAmount)}</p>
                            <span className="subtitle flex items-center gap-1 text-purple-600">Base Contract Value</span>
                        </div>
                    </div>
                    <div className="stat-card projection-amount">
                        <div className="icon-wrapper"><Receipt size={24} /></div>
                        <div className="stat-info">
                            <h3 style={{ fontSize: '0.8rem' }}>AMC Invoice Projection</h3>
                            <p className="value" style={{ fontSize: '1.6rem' }}>{formatCurrency(stats.financials.totalProjection)}</p>
                            <span className="subtitle flex items-center gap-1 text-indigo-600">Total Expected Milestones</span>
                        </div>
                    </div>
                    <div className="stat-card invoiced-amount">
                        <div className="icon-wrapper"><CheckCircle size={24} /></div>
                        <div className="stat-info">
                            <h3 style={{ fontSize: '0.8rem' }}>Invoiced Amount</h3>
                            <p className="value" style={{ fontSize: '1.6rem' }}>{formatCurrency(stats.financials.totalInvoiced)}</p>
                            <span className="subtitle flex items-center gap-1 text-green-600">Received Payments</span>
                        </div>
                    </div>
                    <div className="stat-card pending-amount">
                        <div className="icon-wrapper"><Clock size={24} /></div>
                        <div className="stat-info">
                            <h3 style={{ fontSize: '0.8rem' }}>Pending Invoice Amount</h3>
                            <p className="value" style={{ fontSize: '1.6rem' }}>{formatCurrency(stats.financials.totalPending)}</p>
                            <span className="subtitle flex items-center gap-1 text-orange-600">Awaiting Invoice/Payment</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Branch Distribution */}
                <div className="dashboard-panel">
                    <div className="panel-header">
                        <Building2 size={20} className="text-gray-500" />
                        <h2>Asset Distribution by Branch</h2>
                    </div>
                    <div className="panel-body">
                        {stats.branches && stats.branches.length > 0 ? (
                            <div className="branch-list">
                                {stats.branches.map((branch, index) => {
                                    const percentage = Math.max(5, (branch.count / maxBranchCount) * 100);
                                    return (
                                        <div key={index} className="branch-item">
                                            <div className="branch-info">
                                                <span className="branch-name" title={branch.name}>{branch.name}</span>
                                                <span className="branch-count font-bold">{branch.count}</span>
                                            </div>
                                            <div className="progress-track">
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: `${percentage}%`, backgroundColor: index < 3 ? 'var(--primary)' : '#94a3b8' }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No branch data available.</p>
                        )}
                    </div>
                </div>

                {/* Visit Frequencies */}
                <div className="dashboard-panel">
                    <div className="panel-header">
                        <CalendarDays size={20} className="text-gray-500" />
                        <h2>Schedule Frequencies</h2>
                    </div>
                    <div className="panel-body">
                        <div className="grid grid-cols-2 gap-4">
                            {stats.frequencies && stats.frequencies.map((freq, i) => (
                                <div key={i} className="freq-card">
                                    <div className="freq-type">{freq.type || 'Undefined'}</div>
                                    <div className="freq-count">{freq.count}</div>
                                </div>
                            ))}
                            {(!stats.frequencies || stats.frequencies.length === 0) && (
                                <p className="text-gray-500 text-sm col-span-2">No frequency data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Engine HP Ranges */}
                <div className="dashboard-panel">
                    <div className="panel-header">
                        <Zap size={20} className="text-gray-500" />
                        <h2>Engine Capacity (HP Range)</h2>
                    </div>
                    <div className="panel-body">
                        <div className="flex flex-wrap gap-2">
                            {stats.hpRanges && stats.hpRanges.map((hp, index) => {
                                if (!hp.range || hp.range.trim() === '') return null;
                                return (
                                    <div key={index} className="hp-badge">
                                        <span className="hp-val">{hp.range}</span>
                                        <span className="hp-count">{hp.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .analytics-dashboard {
                    animation: fadeIn 0.4s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    display: flex;
                    align-items: flex-start;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    border: 1px solid rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                }
                
                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }

                .icon-wrapper {
                    padding: 14px;
                    border-radius: 14px;
                    margin-right: 18px;
                }

                .total-assets .icon-wrapper { background: #eff6ff; color: #3b82f6; }
                .active-assets .icon-wrapper { background: #f0fdf4; color: #22c55e; }
                .inactive-assets .icon-wrapper { background: #fef2f2; color: #ef4444; }
                
                .basic-amount .icon-wrapper { background: #faf5ff; color: #a855f7; }
                .projection-amount .icon-wrapper { background: #eef2ff; color: #6366f1; }
                .invoiced-amount .icon-wrapper { background: #f0fdf4; color: #22c55e; }
                .pending-amount .icon-wrapper { background: #fff7ed; color: #f97316; }

                .stat-info h3 {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin: 0 0 6px 0;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .stat-info .value {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 4px 0;
                    line-height: 1;
                }

                .stat-info .subtitle {
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .dashboard-panel {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .panel-header {
                    padding: 16px 24px;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #f8fafc;
                }

                .panel-header h2 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #334155;
                }

                .panel-body {
                    padding: 24px;
                    flex: 1;
                }

                /* Branch List Styles */
                .branch-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .branch-item {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .branch-info {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.875rem;
                    color: #475569;
                }

                .branch-name {
                    font-weight: 500;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .progress-track {
                    height: 8px;
                    background: #f1f5f9;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-bar {
                    height: 100%;
                    border-radius: 4px;
                    transition: width 1s ease-out;
                }

                /* Frequency Cards */
                .freq-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 16px;
                    text-align: center;
                    transition: border-color 0.2s;
                }
                
                .freq-card:hover {
                    border-color: #cbd5e1;
                }

                .freq-type {
                    font-size: 0.75rem;
                    color: #64748b;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                }

                .freq-count {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #0f172a;
                }

                /* HP Badges */
                .hp-badge {
                    display: inline-flex;
                    align-items: center;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    overflow: hidden;
                    font-size: 0.85rem;
                }

                .hp-val {
                    padding: 6px 12px;
                    font-weight: 600;
                    color: #334155;
                }

                .hp-count {
                    background: #e2e8f0;
                    padding: 6px 12px;
                    font-weight: 700;
                    color: #0f172a;
                }
            `}</style>
        </div>
    );
};

export default AnalyticsOverview;
