import React from 'react';

const AttendanceFlow: React.FC = () => {
    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#1e293b' }}>Attendance Flow & Rules</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '60px', height: '60px', background: '#e0f2fe', borderRadius: '50%', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-sign-in-alt" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Employee Check-In / Leave</div>
                </div>
                <div style={{ fontSize: '24px', color: '#94a3b8' }}>→</div>

                <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '60px', height: '60px', background: '#e0f2fe', borderRadius: '50%', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-clipboard-list" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Daily Attendance Record</div>
                </div>
                <div style={{ fontSize: '24px', color: '#94a3b8' }}>→</div>

                <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '60px', height: '60px', background: '#e0f2fe', borderRadius: '50%', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-calculator" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Late / Early / OT Calculation</div>
                </div>
                <div style={{ fontSize: '24px', color: '#94a3b8' }}>→</div>

                <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '60px', height: '60px', background: '#e0f2fe', borderRadius: '50%', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-check-double" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Attendance Approval</div>
                </div>
                <div style={{ fontSize: '24px', color: '#94a3b8' }}>→</div>

                <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '60px', height: '60px', background: '#dcfce7', borderRadius: '50%', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-calendar-check" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Monthly Attendance Summary</div>
                </div>
                <div style={{ fontSize: '24px', color: '#94a3b8' }}>→</div>

                <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '60px', height: '60px', background: '#ffedd5', borderRadius: '50%', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-money-check-alt" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Payroll Processing</div>
                </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Attendance Rules & Controls</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
                    <li>Attendance linked to <strong>Employee ID</strong>.</li>
                    <li><strong>Shift-based</strong> working hours calculation.</li>
                    <li><strong>Late marks & early exits</strong> are configurable (configurable grace periods).</li>
                    <li><strong>Excess hours approval</strong> is mandatory for OT/Comp Off.</li>
                    <li>Attendance Cycle: <strong>1st to 30th/31st</strong> of every month.</li>
                    <li>All changes (corrections, overrides) are <strong>tracked in audit trail</strong>.</li>
                </ul>
            </div>
        </div>
    );
};

export default AttendanceFlow;
