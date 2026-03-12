import React, { useState } from 'react';
import { Tender } from '../../types/tender';
import { getUserDetails } from '../../auth/authService';
import TenderList from './TenderList';
import TenderForm from './TenderForm';
import './TenderMaster.css';

// Mock Data
const MOCK_TENDERS: Tender[] = [
    {
        id: 'TN-001',
        state: 'Andhra Pradesh',
        branch: 'Vijayawada',
        tenderFloatingDate: '2023-10-01',
        tenderType: 'Parts',
        customerName: 'AP Transco',
        contactPersonName: 'Rao',
        contactNumber: '9876543210',
        contactEmailId: 'rao@aptransco.gov.in',
        tenderWebLink: 'http://aptransco.gov.in/tenders/123',
        tenderNumber: 'APT-2023-001',
        tenderPublishedDate: '2023-09-25',
        tenderDescription: 'Supply of heavy machinery parts',
        tenderValue: 500000,
        tenderLastDate: '2023-10-15',
        emdDetails: 'Cheque',
        emdValue: 10000,
        emdValidityFromDate: '2023-10-01',
        emdValidityEndDate: '2023-12-31',
        emdReturnedByCustomer: 'No',
        sssplAuthorisedName: 'Manager 1',
        tenderSubmissionDate: '2023-10-14',
        tenderQuotedValue: 550000,
        tenderNegotiationValue: 520000,
        tenderStatus: 'In Progress',
        paymentStatus: 'Pending',
        createdBy: 'superadmin',
        createdDate: '2023-09-25T10:00:00Z'
    }
];

const TenderMaster: React.FC = () => {
    const [tenders, setTenders] = useState<Tender[]>(MOCK_TENDERS);
    const [activeTab, setActiveTab] = useState<'list' | 'create' | 'reports'>('list');
    const [editingTender, setEditingTender] = useState<Tender | null>(null);

    const currentUser = getUserDetails();
    const isSuperAdmin = currentUser?.role === 'superadmin';

    const handleEdit = (tender: Tender) => {
        setEditingTender(tender);
        setActiveTab('create');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this Tender?')) {
            setTenders(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleSave = (tender: Tender) => {
        if (editingTender) {
            setTenders(prev => prev.map(t => t.id === tender.id ? tender : t));
            setEditingTender(null);
        } else {
            setTenders(prev => [...prev, { ...tender, id: `TN-${Date.now()}` }]);
        }
        setActiveTab('list');
    };

    const handleCancel = () => {
        setEditingTender(null);
        setActiveTab('list');
    };

    return (
        <div className="tender-dashboard-container">
            {/* Top Navigation Tabs */}
            <div className="tender-tabs-wrapper">
                <div
                    className={`tender-tab ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('list'); setEditingTender(null); }}
                >
                    <i className="fas fa-list-ul"></i> All Tenders
                </div>
                {(isSuperAdmin || currentUser?.role === 'admin') && (
                    <div
                        className={`tender-tab ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('create'); setEditingTender(null); }}
                    >
                        <i className="fas fa-file-signature"></i> {editingTender ? 'Edit Tender' : 'Create New Tender'}
                    </div>
                )}
                <div
                    className={`tender-tab ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    <i className="fas fa-chart-pie"></i> Analytics
                </div>
            </div>

            {/* Main Content Area */}
            <div className="tender-content-area">
                {activeTab === 'list' && (
                    <div className="fade-in">
                        <TenderList
                            tenders={tenders}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isSuperAdmin={isSuperAdmin}
                        />
                    </div>
                )}

                {activeTab === 'create' && (
                    <div className="tender-creation-layout fade-in">
                        <div className="tender-form-section">
                            <div className="form-header-row">
                                <i className="fas fa-paper-plane text-primary fs-4"></i>
                                <h3>{editingTender ? 'Update Tender Details' : 'Submit New Tender Request'}</h3>
                            </div>
                            <TenderForm
                                initialData={editingTender}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                readOnly={!!editingTender && !isSuperAdmin}
                            />
                        </div>

                        {/* Side Panel (Similar to "My Active Requests" in screenshot) */}
                        <div className="tender-side-panel">
                            <h4>Recent Activity</h4>
                            <div className="recent-items-list">
                                {tenders.slice(0, 3).map(t => (
                                    <div key={t.id} className="recent-item-card">
                                        <div className="d-flex justify-content-between">
                                            <span className="recent-id">{t.tenderNumber || t.id}</span>
                                            <span className={`status-dot ${t.tenderStatus?.toLowerCase().replace(' ', '-')}`}></span>
                                        </div>
                                        <div className="recent-title">{t.customerName}</div>
                                        <div className="recent-date">{t.tenderLastDate}</div>
                                        <div className="recent-value">₹ {t.tenderValue?.toLocaleString()}</div>
                                    </div>
                                ))}
                                {tenders.length === 0 && <p className="text-muted small">No recent activity.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="text-center p-5 text-muted fade-in">
                        <i className="fas fa-chart-bar fa-3x mb-3"></i>
                        <h4>Analytics Module Coming Soon</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenderMaster;
