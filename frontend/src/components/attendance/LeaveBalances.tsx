import React from 'react';
import { LeaveBalance } from '../../types/leave';

interface Props {
    data: LeaveBalance[];
}

const LeaveBalances: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b' }}>
                <i className="fas fa-wallet" style={{ color: '#4f46e5' }}></i>
                Leave Balance (Type Wise)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {data.map(balance => (
                    <div key={balance.employeeId} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{balance.employeeName}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{balance.employeeId}</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>CASUAL (CL)</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4f46e5' }}>{balance.cl}</div>
                            </div>
                            <div style={{ background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>SICK (SL)</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>{balance.sl}</div>
                            </div>
                            <div style={{ background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>EARNED (EL)</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{balance.el}</div>
                            </div>
                            <div style={{ background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>COMP-OFF (CO)</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>{balance.co}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '15px', padding: '10px', background: '#4f46e5', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>TOTAL BALANCE</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{balance.total}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '25px', padding: '15px', background: '#fff7ed', borderRadius: '8px', color: '#9a3412', fontSize: '12px' }}>
                <i className="fas fa-sync-alt"></i>
                <span style={{ marginLeft: '10px' }}>Note: Balances are auto-updated after HR approval and synced with monthly attendance & payroll.</span>
            </div>
        </div>
    );
};

export default LeaveBalances;
