import React from 'react';
import { ReportsData } from '../../types/reports';

interface Props {
    data: ReportsData;
}

const AnalyticsDashboard: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {data.kpis.map((kpi, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '6px solid #6366f1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</span>
                            <i className={`fas fa-chevron-circle-${kpi.trend === 'up' ? 'up' : kpi.trend === 'down' ? 'down' : 'right'}`} style={{ color: kpi.trend === 'up' ? '#10b981' : kpi.trend === 'down' ? '#f43f5e' : '#6366f1' }}></i>
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>{kpi.value}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{kpi.description}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
                <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Headcount by Department</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {data.headcount.map((h, idx) => (
                            <div key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 600 }}>{h.department}</span>
                                    <span style={{ color: '#6366f1', fontWeight: 800 }}>{h.total}</span>
                                </div>
                                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: '#6366f1', width: `${(h.total / 115) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Gender Diversity Analysis</h4>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px', gap: '40px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', color: '#3b82f6' }}><i className="fas fa-mars"></i></div>
                            <div style={{ fontSize: '24px', fontWeight: 800 }}>65%</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Male</div>
                        </div>
                        <div style={{ height: '60px', width: '1px', background: '#e2e8f0' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', color: '#ec4899' }}><i className="fas fa-venus"></i></div>
                            <div style={{ fontSize: '24px', fontWeight: 800 }}>35%</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Female</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '12px', fontSize: '12px', color: '#64748b' }}>
                        <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                        Target diversity ratio for 2024 is 60:40 across all departments.
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Monthly Attendance Trends (Avg %)</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px', padding: '0 20px' }}>
                    {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => {
                        const heights = [78, 82, 85, 80, 88, 92];
                        return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1 }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1' }}>{heights[idx]}%</div>
                                <div style={{ width: '30px', background: 'linear-gradient(to top, #6366f1, #a5b4fc)', height: `${heights[idx]}px`, borderRadius: '6px 6px 0 0' }}></div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{month}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
