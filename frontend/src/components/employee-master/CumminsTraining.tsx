import React from 'react';
import { EmployeeTrainingDetails } from '../../types/employee';

interface CumminsTrainingProps {
    data: EmployeeTrainingDetails;
    updateData: (data: Partial<EmployeeTrainingDetails>) => void;
}

const CumminsTraining: React.FC<CumminsTrainingProps> = ({ data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateData({ [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 115 * 1024) {
                alert(`File size exceeds 115KB limit. (Current: ${(file.size / 1024).toFixed(2)} KB)`);
                e.target.value = '';
                return;
            }
            updateData({
                trainingCertificate: file.name,
                trainingCertificateSize: (file.size / 1024).toFixed(2) + ' KB'
            });
        }
    };

    return (
        <div className="form-section">
            <h3>Cummins Training Details</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Cummins Training Field <span className="required">*</span></label>
                    <select
                        name="cumminsTrainingType"
                        value={data.cumminsTrainingType}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Training Type</option>
                        <option value="LHP">LHP (Light Horse Power)</option>
                        <option value="MHP">MHP (Medium Horse Power)</option>
                        <option value="HHP">HHP (High Horse Power)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Cummins Training Completion Id</label>
                    <input
                        type="text"
                        name="cumminsTrainingCompletionId"
                        value={data.cumminsTrainingCompletionId || ''}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter Completion ID"
                    />
                </div>
                <div className="form-group">
                    <label>Training Start Date</label>
                    <input
                        type="date"
                        name="trainingStartDate"
                        value={data.trainingStartDate || ''}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Training End Date</label>
                    <input
                        type="date"
                        name="trainingEndDate"
                        value={data.trainingEndDate || ''}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Training Result</label>
                    <select
                        name="trainingResult"
                        value={data.trainingResult || ''}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Result</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Not Qualified">Not Qualified</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Training Completed Date</label>
                    <input
                        type="date"
                        name="trainingCompletedDate"
                        value={data.trainingCompletedDate || ''}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Training Certificate</label>
                <div style={{
                    padding: '15px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: data.trainingCertificate ? '#f0fdf4' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: data.trainingCertificate ? '#dcfce7' : '#f1f5f9',
                        color: data.trainingCertificate ? '#22c55e' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                    }}>
                        <i className="fas fa-certificate"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>Certificate Document</div>
                        <div style={{ fontSize: '12px', color: data.trainingCertificate ? '#166534' : '#94a3b8' }}>
                            {data.trainingCertificate ? (
                                <span>
                                    {data.trainingCertificate}
                                    {data.trainingCertificateSize && <span style={{ marginLeft: '10px', color: '#64748b' }}>({data.trainingCertificateSize})</span>}
                                </span>
                            ) : 'No certificate uploaded'}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <label style={{
                            padding: '8px 12px',
                            background: '#4f46e5',
                            color: 'white',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textAlign: 'center',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <i className="fas fa-cloud-upload-alt" style={{ marginRight: '6px' }}></i>
                            {data.trainingCertificate ? 'Replace' : 'Upload'}
                            <input
                                type="file"
                                accept=".pdf,image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </label>
                        {data.trainingCertificate && (
                            <button
                                onClick={() => updateData({ trainingCertificate: '', trainingCertificateSize: '' })}
                                style={{
                                    padding: '8px 12px',
                                    background: '#fee2e2',
                                    color: '#ef4444',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <p className="form-note" style={{ marginTop: '15px' }}>
                <i className="fas fa-info-circle"></i> specific to technical staff undergoing Cummins certification.
            </p>
        </div>
    );
};

export default CumminsTraining;
