import React from 'react';
import { EmployeeDocuments } from '../../types/employee';

interface DocumentUploadProps {
    data: EmployeeDocuments;
    updateData: (data: Partial<EmployeeDocuments>) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ data, updateData }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof EmployeeDocuments) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 115 * 1024) {
                alert(`File size exceeds 115KB limit. (Current: ${(file.size / 1024).toFixed(2)} KB)`);
                e.target.value = '';
                return;
            }

            const sizeKB = (file.size / 1024).toFixed(2) + ' KB';
            updateData({
                [field]: file.name,
                docSizes: {
                    ...(data.docSizes || {}),
                    [field]: sizeKB
                }
            });
        }
    };

    const docItems = [
        { id: 'photo', label: 'Personal Photo', icon: 'fa-user-circle', type: 'image/*' },
        { id: 'aadhaarCard', label: 'Aadhar Card', icon: 'fa-id-card', type: '.pdf,image/*' },
        { id: 'panCard', label: 'PAN Card', icon: 'fa-credit-card', type: '.pdf,image/*' },
        { id: 'resume', label: 'Resume / CV', icon: 'fa-file-pdf', type: '.pdf,.doc,.docx' },
        { id: 'bioData', label: 'Bio-Data', icon: 'fa-file-alt', type: '.pdf,.doc,.docx' },
        { id: 'familyPhoto', label: 'Family Photo', icon: 'fa-users', type: 'image/*' },
        { id: 'educationalCertificates', label: 'Educational Certificates', icon: 'fa-graduation-cap', type: '.pdf,image/*' },
        { id: 'technicalCertificates', label: 'Technical Certificates', icon: 'fa-certificate', type: '.pdf,image/*' },
        { id: 'bankStatement', label: 'Bank Statement', icon: 'fa-university', type: '.pdf,image/*' }
    ];

    return (
        <div className="form-section">
            <h3>Documents & Uploads</h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                Please upload the required documents. Supported formats: JPG, PNG, PDF, DOCX. Max size 115KB each.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {docItems.map(item => (
                    <div key={item.id} style={{
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        background: (data as any)[item.id] ? '#f0fdf4' : 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: (data as any)[item.id] ? '#dcfce7' : '#f1f5f9',
                                color: (data as any)[item.id] ? '#22c55e' : '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                <i className={`fas ${item.icon}`}></i>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{item.label}</div>
                                <div style={{ fontSize: '12px', color: (data as any)[item.id] ? '#166534' : '#94a3b8' }}>
                                    {(data as any)[item.id] ? (
                                        <span>
                                            {(data as any)[item.id]}
                                            {data.docSizes && data.docSizes[item.id] && (
                                                <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '5px' }}>
                                                    ({data.docSizes[item.id]})
                                                </span>
                                            )}
                                        </span>
                                    ) : 'No file uploaded'}
                                </div>
                            </div>
                            {(data as any)[item.id] && (
                                <i className="fas fa-check-circle" style={{ color: '#22c55e', fontSize: '18px' }}></i>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <label style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: '#4f46e5',
                                color: 'white',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                textAlign: 'center',
                                fontWeight: '600',
                                transition: 'background 0.2s'
                            }}>
                                <i className="fas fa-cloud-upload-alt" style={{ marginRight: '6px' }}></i>
                                {(data as any)[item.id] ? 'Replace File' : 'Upload File'}
                                <input
                                    type="file"
                                    accept={item.type}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileChange(e, item.id as keyof EmployeeDocuments)}
                                />
                            </label>
                            {(data as any)[item.id] && (
                                <button
                                    onClick={() => {
                                        const newSizes = { ...(data.docSizes || {}) };
                                        delete newSizes[item.id];
                                        updateData({ [item.id]: '', docSizes: newSizes });
                                    }}
                                    style={{
                                        padding: '8px 12px',
                                        background: '#fee2e2',
                                        color: '#ef4444',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentUpload;
