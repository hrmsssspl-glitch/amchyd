import React, { useState } from 'react';
import TravelPolicyMaster from './TravelPolicyMaster';
import TravelRequestForm from './TravelRequestForm';
import ExpenseClaimForm from './ExpenseClaimForm';
import TravelSettlementHub from './TravelSettlementHub';
import TravelReports from './TravelReports';
import { TravelData, TravelRequest, ExpenseClaim, TravelSettlement } from '../../types/travel';

const TravelMaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('request');

    // Mock Travel Data
    const [travelData, setTravelData] = useState<TravelData>({
        policies: [
            { id: 'POL001', type: 'Outstation', grade: 'M1-M3', limitPerDay: 5000, hotelCategory: '4 Star', transportMode: 'Flight/AC Train' },
            { id: 'POL002', type: 'Local', grade: 'All', limitPerDay: 1000, hotelCategory: 'N/A', transportMode: 'Cab/Auto' }
        ],
        requests: [
            {
                id: 'TRQ-1001', employeeId: 'EMP001', employeeName: 'John Doe', purpose: 'Client Meeting',
                type: 'Outstation', fromLocation: 'Delhi', toLocation: 'Mumbai', fromDate: '2024-02-15',
                toDate: '2024-02-17', expectedExpense: 15000, advanceRequired: true, advanceAmount: 5000,
                requestDate: '2024-02-10', status: 'Approved'
            }
        ],
        claims: [
            { id: 'CLM-001', requestId: 'TRQ-1001', employeeId: 'EMP001', category: 'Tickets', date: '2024-02-15', amountClaimed: 8500, status: 'Pending', billsUploaded: true }
        ],
        settlements: []
    });

    const tabs = [
        { id: 'request', label: 'Travel Request', icon: 'fa-plane-departure' },
        { id: 'claims', label: 'Expense Claims', icon: 'fa-file-invoice-dollar' },
        { id: 'settlement', label: 'Finance Settlement', icon: 'fa-hand-holding-usd' },
        { id: 'policies', label: 'Policy Master', icon: 'fa-shield-halved' },
        { id: 'reports', label: 'Reports & Analytics', icon: 'fa-chart-area' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'request': return <TravelRequestForm requests={travelData.requests} />;
            case 'claims': return <ExpenseClaimForm claims={travelData.claims} requests={travelData.requests} />;
            case 'settlement': return <TravelSettlementHub data={travelData} />;
            case 'policies': return <TravelPolicyMaster policies={travelData.policies} />;
            case 'reports': return <TravelReports data={travelData} />;
            default: return null;
        }
    };

    return (
        <div className="module-container" style={{ padding: '24px', background: '#f0f9ff', minHeight: 'calc(100vh - 80px)' }}>
            {/* Header */}
            <div style={{ marginBottom: '25px', background: 'white', padding: '25px 35px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '5px solid #0ea5e9' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#0c4a6e', fontSize: '28px', fontWeight: '800' }}>Travel & Expense Management</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#0369a1', fontSize: '15px' }}>Automated workflow for business travel and reimbursements</p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ textAlign: 'center', background: '#e0f2fe', padding: '10px 20px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                        <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Current Period Requests</span>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#0c4a6e' }}>24 Active</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', background: '#fff', padding: '8px', borderRadius: '18px', width: 'fit-content', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '14px',
                            background: activeTab === tab.id ? '#0ea5e9' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: activeTab === tab.id ? '0 10px 15px -3px rgba(14, 165, 233, 0.3)' : 'none'
                        }}
                    >
                        <i className={`fas ${tab.icon}`} style={{ fontSize: '16px' }}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="travel-content" style={{ animation: 'fadeIn 0.5s ease' }}>
                {renderContent()}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default TravelMaster;
