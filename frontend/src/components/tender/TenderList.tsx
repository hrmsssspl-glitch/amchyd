import React from 'react';
import { Tender } from '../../types/tender';
import './TenderMaster.css';

interface TenderListProps {
    tenders: Tender[];
    onEdit: (tender: Tender) => void;
    onDelete: (id: string) => void;
    isSuperAdmin?: boolean;
}

const TenderList: React.FC<TenderListProps> = ({ tenders, onEdit, onDelete, isSuperAdmin }) => {
    return (
        <div className="tender-list-content">
            <h4 className="list-title">My Active Requests</h4>
            <div className="table-responsive clean-table">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="th-rounded-start">Tender No</th>
                            <th>Customer</th>
                            <th>Branch</th>
                            <th>Value (₹)</th>
                            <th>Last Date</th>
                            <th>Status</th>
                            <th className="th-rounded-end text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenders.map((tender) => (
                            <tr key={tender.id}>
                                <td className="fw-bold text-primary text-nowrap">{tender.tenderNumber || tender.id}</td>
                                <td className="text-nowrap">{tender.customerName}</td>
                                <td><span className="badge bg-light text-dark border">{tender.branch}</span></td>
                                <td className="fw-medium text-nowrap">₹ {tender.tenderValue?.toLocaleString()}</td>
                                <td className="text-secondary text-nowrap">{tender.tenderLastDate}</td>
                                <td>
                                    <span className={`status-pill ${tender.tenderStatus?.toLowerCase().replace(' ', '-')}`}>
                                        {tender.tenderStatus}
                                    </span>
                                </td>
                                <td className="text-center text-nowrap">
                                    <div className="d-flex justify-content-center gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary btn-action"
                                            onClick={() => onEdit(tender)}
                                            title={isSuperAdmin ? "Edit" : "View"}
                                        >
                                            <i className={`fas ${isSuperAdmin ? 'fa-edit' : 'fa-eye'}`}></i>
                                        </button>
                                        {isSuperAdmin && (
                                            <button
                                                className="btn btn-sm btn-outline-danger btn-action"
                                                onClick={() => onDelete(tender.id)}
                                                title="Delete"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {tenders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-5 text-muted">
                                    <i className="fas fa-inbox fa-2x mb-3 d-block"></i>
                                    No active tenders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TenderList;
