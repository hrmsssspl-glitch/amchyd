import React, { useState, useEffect } from 'react';
import { Tender } from '../../types/tender';
import { getUserDetails } from '../../auth/authService';
import './TenderMaster.css';

interface TenderFormProps {
    initialData: Tender | null;
    onSave: (tender: Tender) => void;
    onCancel: () => void;
    readOnly?: boolean;
}

const TenderForm: React.FC<TenderFormProps> = ({ initialData, onSave, onCancel, readOnly = false }) => {
    const defaultData: Partial<Tender> = {
        state: 'Andhra Pradesh',
        branch: '',
        tenderFloatingDate: '',
        tenderType: 'Parts',
        customerName: '',
        contactPersonName: '',
        contactNumber: '',
        contactEmailId: '',
        tenderWebLink: '',
        tenderNumber: '',
        tenderPublishedDate: '',
        tenderDescription: '',
        tenderValue: 0,
        tenderLastDate: '',
        emdDetails: 'Cheque',
        emdValue: 0,
        emdValidityFromDate: '',
        emdValidityEndDate: '',
        emdReturnedByCustomer: 'No',
        bgValue: 0,
        bgReturnedByCustomer: 'No',
        sssplAuthorisedName: '',
        tenderSubmissionDate: '',
        tenderQuotedValue: 0,
        tenderNegotiationValue: 0,
        tenderStatus: 'In Progress',
        paymentStatus: 'Pending',
        paymentMode: 'Cheque',
        createdBy: getUserDetails()?.username || 'system',
        createdDate: new Date().toISOString()
    };

    const [formData, setFormData] = useState<Partial<Tender>>(initialData || defaultData);

    const states = ['Andhra Pradesh', 'Telangana'];

    // Branch logic
    const getBranches = (state: string | undefined) => {
        if (state === 'Andhra Pradesh') return ['Vijayawada', 'Kadapa', 'Vishakapatnam'];
        if (state === 'Telangana') return ['Hyderabad'];
        return [];
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (readOnly) return;
        const { name, value, type } = e.target;

        let processedValue: any = value;
        if (type === 'number') {
            processedValue = value === '' ? 0 : parseFloat(value);
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Tender);
    };

    // Auto-select first branch if not set or invalid for state
    useEffect(() => {
        const branches = getBranches(formData.state);
        if (formData.branch && !branches.includes(formData.branch)) {
            setFormData(prev => ({ ...prev, branch: branches[0] }));
        } else if (!formData.branch && branches.length > 0) {
            setFormData(prev => ({ ...prev, branch: branches[0] }));
        }
    }, [formData.state]);

    return (
        <div className="tender-form-card">
            <div className="form-header-row">
                <i className="fas fa-edit text-primary"></i>
                <h3>{initialData ? (readOnly ? 'View Tender Details' : 'Edit Tender Details') : 'Create New Tender'}</h3>
            </div>

            <div className="form-body">
                <form onSubmit={handleSubmit}>
                    {/* Section 1: Basic Information */}
                    <div className="form-section-block">
                        <div className="section-title">
                            <h5>Basic Information</h5>
                        </div>
                        <div className="form-grid-4">
                            <div className="form-group">
                                <label className="form-label">State</label>
                                <select
                                    className="form-select"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                >
                                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Branch</label>
                                <select
                                    className="form-select"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                >
                                    {getBranches(formData.state).map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tender Floating Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="tenderFloatingDate"
                                    value={formData.tenderFloatingDate}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tender Type</label>
                                <select
                                    className="form-select"
                                    name="tenderType"
                                    value={formData.tenderType}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                >
                                    {['Parts', 'AMC', 'Parts & AMC', 'Engine Sales', 'Others'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        {formData.tenderType === 'Others' && (
                            <div className="form-grid-2 mt-3">
                                <div className="form-group">
                                    <label className="form-label">Specify Manual Type</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="tenderTypeManual"
                                        value={formData.tenderTypeManual || ''}
                                        onChange={handleChange}
                                        placeholder="Enter type manually"
                                        required
                                        disabled={readOnly}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 2: Customer & Contact */}
                    <div className="form-section-block">
                        <div className="section-title">
                            <h5>Customer & Contact Details</h5>
                        </div>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Customer Name</label>
                                <input type="text" className="form-control" name="customerName" value={formData.customerName} onChange={handleChange} disabled={readOnly} placeholder="e.g. AP Transco" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contact Person Name</label>
                                <input type="text" className="form-control" name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} disabled={readOnly} />
                            </div>
                        </div>
                        <div className="form-grid-2 mt-3">
                            <div className="form-group">
                                <label className="form-label">Contact Number</label>
                                <input type="text" className="form-control" name="contactNumber" value={formData.contactNumber} onChange={handleChange} disabled={readOnly} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contact Email Id</label>
                                <input type="email" className="form-control" name="contactEmailId" value={formData.contactEmailId} onChange={handleChange} disabled={readOnly} />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Tender Specifics */}
                    <div className="form-section-block">
                        <div className="section-title">
                            <h5>Tender Specifics</h5>
                        </div>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Tender Number</label>
                                <input type="text" className="form-control" name="tenderNumber" value={formData.tenderNumber} onChange={handleChange} disabled={readOnly} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tender Web Link</label>
                                <input type="url" className="form-control" name="tenderWebLink" value={formData.tenderWebLink} onChange={handleChange} disabled={readOnly} placeholder="https://" />
                            </div>
                        </div>
                        <div className="form-grid-4 mt-3">
                            <div className="form-group">
                                <label className="form-label">Published Date</label>
                                <input type="date" className="form-control" name="tenderPublishedDate" value={formData.tenderPublishedDate} onChange={handleChange} disabled={readOnly} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Date</label>
                                <input type="date" className="form-control" name="tenderLastDate" value={formData.tenderLastDate} onChange={handleChange} disabled={readOnly} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Submission Date</label>
                                <input type="date" className="form-control" name="tenderSubmissionDate" value={formData.tenderSubmissionDate} onChange={handleChange} disabled={readOnly} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tender Value (₹)</label>
                                <input type="number" className="form-control" name="tenderValue" value={formData.tenderValue} onChange={handleChange} disabled={readOnly} />
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label">Description / Scope of Work</label>
                            <textarea className="form-control" name="tenderDescription" value={formData.tenderDescription} onChange={handleChange} rows={3} disabled={readOnly} />
                        </div>
                    </div>

                    {/* Section 4: EMD & BG Details */}
                    <div className="form-section-block">
                        <div className="section-title">
                            <h5>Financials (EMD & BG)</h5>
                        </div>
                        <div className="form-grid-4">
                            <div className="form-group">
                                <label className="form-label">EMD Type</label>
                                <select className="form-select" name="emdDetails" value={formData.emdDetails} onChange={handleChange} disabled={readOnly}>
                                    <option value="Cheque">Cheque</option>
                                    <option value="BG">BG</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">EMD Value (₹)</label>
                                <input type="number" className="form-control" name="emdValue" value={formData.emdValue} onChange={handleChange} disabled={readOnly} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">EMD Valid From</label>
                                <input type="date" className="form-control" name="emdValidityFromDate" value={formData.emdValidityFromDate} onChange={handleChange} disabled={readOnly} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">EMD Valid To</label>
                                <input type="date" className="form-control" name="emdValidityEndDate" value={formData.emdValidityEndDate} onChange={handleChange} disabled={readOnly} />
                            </div>
                        </div>

                        <div className="form-grid-4 mt-3">
                            <div className="form-group">
                                <label className="form-label">BG Value (₹)</label>
                                <input type="number" className="form-control" name="bgValue" value={formData.bgValue} onChange={handleChange} disabled={readOnly} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">BG Returned?</label>
                                <select className="form-select" name="bgReturnedByCustomer" value={formData.bgReturnedByCustomer || 'No'} onChange={handleChange} disabled={readOnly}>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            {formData.bgReturnedByCustomer === 'Yes' && (
                                <div className="form-group">
                                    <label className="form-label">BG Returned Date</label>
                                    <input type="date" className="form-control" name="bgReturnedDate" value={formData.bgReturnedDate || ''} onChange={handleChange} disabled={readOnly} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 5: Status & Commercials */}
                    <div className="form-section-block">
                        <div className="section-title">
                            <h5>Status & Commercials</h5>
                        </div>
                        <div className="form-grid-3">
                            <div className="form-group">
                                <label className="form-label">Tender Status</label>
                                <select className="form-select" name="tenderStatus" value={formData.tenderStatus} onChange={handleChange} disabled={readOnly}
                                    style={{ fontWeight: 'bold', color: formData.tenderStatus === 'Order Received' ? '#16a34a' : '#1e293b' }}>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Order Received">Order Received</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Quoted Value (₹)</label>
                                <input type="number" className="form-control" name="tenderQuotedValue" value={formData.tenderQuotedValue} onChange={handleChange} disabled={readOnly} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Negotiation Value (₹)</label>
                                <input type="number" className="form-control" name="tenderNegotiationValue" value={formData.tenderNegotiationValue} onChange={handleChange} disabled={readOnly} />
                            </div>
                        </div>
                    </div>

                    {formData.tenderStatus === 'Order Received' && (
                        <div className="form-section-block" style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                            <div className="section-title">
                                <h5 style={{ color: '#166534', borderBottomColor: '#bbf7d0' }}>Order Details</h5>
                            </div>
                            <div className="form-grid-3">
                                <div className="form-group">
                                    <label className="form-label">PO Number</label>
                                    <input type="text" className="form-control" name="poNumber" value={formData.poNumber || ''} onChange={handleChange} disabled={readOnly} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">PO Value</label>
                                    <input type="number" className="form-control" name="poValue" value={formData.poValue || ''} onChange={handleChange} disabled={readOnly} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">PO Date</label>
                                    <input type="date" className="form-control" name="poDate" value={formData.poDate || ''} onChange={handleChange} disabled={readOnly} />
                                </div>
                            </div>
                            <div className="form-grid-3 mt-3">
                                <div className="form-group">
                                    <label className="form-label">Invoice Number</label>
                                    <input type="text" className="form-control" name="invoiceNumber" value={formData.invoiceNumber || ''} onChange={handleChange} disabled={readOnly} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Invoice Amount</label>
                                    <input type="number" className="form-control" name="invoiceAmount" value={formData.invoiceAmount || ''} onChange={handleChange} disabled={readOnly} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Payment Status</label>
                                    <select className="form-select" name="paymentStatus" value={formData.paymentStatus || 'Pending'} onChange={handleChange} disabled={readOnly}>
                                        <option value="Received">Received</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            {readOnly ? 'Close' : 'Cancel'}
                        </button>
                        {!readOnly && (
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-save me-2"></i> Save Tender Details
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TenderForm;
