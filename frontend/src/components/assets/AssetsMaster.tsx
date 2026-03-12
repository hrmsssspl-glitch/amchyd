import React, { useState } from 'react';
import AssetInventory from './AssetInventory';
import AssetAllocationForm from './AssetAllocationForm';
import AssetConditionTracker from './AssetConditionTracker';
import AssetReturnRecovery from './AssetReturnRecovery';
import AssetsReports from './AssetsReports';
import { AssetsData, Asset, AssetAllocation, AssetReturn } from '../../types/assets';

const AssetsMaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('inventory');

    // Mock Data
    const [assetsData, setAssetsData] = useState<AssetsData>({
        inventory: [
            { id: 'AST001', type: 'Laptop', model: 'Dell Latitude 5420', code: 'SSS-LP-021', value: 75000, purchaseDate: '2023-05-10', hasWarranty: true, vendorName: 'Dell India', status: 'Issued' },
            { id: 'AST002', type: 'Mobile', model: 'Samsung Galaxy A54', code: 'SSS-MB-005', value: 35000, purchaseDate: '2023-08-15', hasWarranty: true, vendorName: 'Reliance Digital', status: 'Available' },
            { id: 'AST003', type: 'Tool Kit', model: 'Standard Maintenance Kit', code: 'SSS-TK-012', value: 12000, purchaseDate: '2024-01-05', hasWarranty: false, vendorName: 'Local Vendor', status: 'Issued' }
        ],
        allocations: [
            { id: 'ALC001', employeeId: 'EMP001', employeeName: 'John Doe', department: 'IT', designation: 'SDE-02', assetType: 'Laptop', assetCode: 'SSS-LP-021', accessories: ['Charger', 'Bag'], toolkitIncluded: false, issueDate: '2023-05-12', issuedBy: 'IT Admin', conditionAtIssue: 'New', acknowledgementSigned: true }
        ],
        inspections: [],
        returns: []
    });

    const tabs = [
        { id: 'inventory', label: 'Asset Inventory', icon: 'fa-boxes' },
        { id: 'allocation', label: 'Issue / Allocation', icon: 'fa-user-tag' },
        { id: 'condition', label: 'Condition Tracking', icon: 'fa-microscope' },
        { id: 'return', label: 'Return & Recovery', icon: 'fa-undo' },
        { id: 'reports', label: 'Asset Reports', icon: 'fa-file-invoice' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'inventory': return <AssetInventory data={assetsData.inventory} onUpdate={(inv: Asset[]) => setAssetsData({ ...assetsData, inventory: inv })} />;
            case 'allocation': return <AssetAllocationForm data={assetsData} onUpdate={(alc: AssetAllocation[]) => setAssetsData({ ...assetsData, allocations: alc })} />;
            case 'condition': return <AssetConditionTracker data={assetsData} />;
            case 'return': return <AssetReturnRecovery data={assetsData} onUpdate={(ret: AssetReturn[]) => setAssetsData({ ...assetsData, returns: ret })} />;
            case 'reports': return <AssetsReports data={assetsData} />;
            default: return null;
        }
    };

    return (
        <div className="module-container" style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 80px)' }}>
            {/* Header */}
            <div style={{ marginBottom: '25px', background: 'white', padding: '20px 30px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '6px solid #f59e0b' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '26px', fontWeight: '800' }}>Assets Management System</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '15px' }}>Track company assets, allocations, and recovery</p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ textAlign: 'right', background: '#fffbeb', padding: '10px 20px', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                        <span style={{ display: 'block', fontSize: '11px', color: '#d97706', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Asset Value</span>
                        <span style={{ color: '#92400e', fontWeight: '800', fontSize: '18px' }}>₹ 1,22,000</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: 'white', padding: '8px', borderRadius: '16px', width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '12px',
                            background: activeTab === tab.id ? '#f59e0b' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            fontWeight: activeTab === tab.id ? '700' : '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease',
                            boxShadow: activeTab === tab.id ? '0 10px 15px -3px rgba(245, 158, 11, 0.3)' : 'none'
                        }}
                    >
                        <i className={`fas ${tab.icon}`}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="tab-content" style={{ animation: 'fadeIn 0.4s ease-in' }}>
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

export default AssetsMaster;
