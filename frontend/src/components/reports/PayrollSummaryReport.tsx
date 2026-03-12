import React from 'react';
import { PayrollSummary } from '../../types/reports';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: PayrollSummary[];
}

const PayrollSummaryReport: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Organization Payroll & Compensation MIS</h3>
                <button
                    onClick={() => exportToCSV(data, 'Payroll_Summary_Report')}
                    style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fas fa-file-excel"></i> Export CSV
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Gross Salary</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Statutory Deductions</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Bonus/Incentive</th>
                            <th style={{ padding: '15px', color: '#64748b', fontWeight: 800 }}>Net Payable</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>PF Contrib.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((p, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{p.name}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{p.employeeId} • {p.department}</div>
                                </td>
                                <td style={{ padding: '15px', fontWeight: 600 }}>₹{p.grossSalary.toLocaleString()}</td>
                                <td style={{ padding: '15px', color: '#dc2626' }}>₹{p.deductions.toLocaleString()}</td>
                                <td style={{ padding: '15px', color: '#166534' }}>₹{(p.bonus + p.incentives).toLocaleString()}</td>
                                <td style={{ padding: '15px', fontWeight: 800, color: '#1e293b', fontSize: '15px' }}>₹{p.netPay.toLocaleString()}</td>
                                <td style={{ padding: '15px', color: '#64748b', fontSize: '12px' }}>₹{p.pfContribution}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Total Payroll Cost</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>₹{data.reduce((acc, curr) => acc + curr.grossSalary, 0).toLocaleString()}</div>
                </div>
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Total Net Payout</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>₹{data.reduce((acc, curr) => acc + curr.netPay, 0).toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
};

export default PayrollSummaryReport;
