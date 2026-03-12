import React, { useState } from 'react';
import { RecruitmentData } from '../../types/recruitment';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: RecruitmentData;
}

const RecruitmentReports: React.FC<Props> = ({ data }) => {
    const [activeReport, setActiveReport] = useState('tracker');

    const handleExport = () => {
        let exportData: any[] = [];
        let fileName = 'Recruitment_Report';

        if (activeReport === 'tracker') {
            exportData = data.candidates.map(c => ({
                'ID': c.id,
                'Name': c.name,
                'Experience': c.experience,
                'Job Code': c.jobCode,
                'Status': c.status,
                'Expected CTC': c.expectedCTC
            }));
            fileName = 'Recruitment_Tracker';
        } else if (activeReport === 'offer') {
            exportData = data.offers.map(o => {
                const c = data.candidates.find(cand => cand.id === o.candidateId);
                return {
                    'Candidate': c?.name,
                    'Offered Salary': o.offeredSalary,
                    'Hike %': o.hikePercentage,
                    'Expected DOJ': o.expectedDOJ,
                    'Status': o.status
                };
            });
            fileName = 'Offer_Status_Report';
        } else if (activeReport === 'onboarding') {
            exportData = data.checklists.map(chk => {
                const c = data.candidates.find(cand => cand.id === chk.candidateId);
                return {
                    'Employee': c?.name,
                    'Induction': chk.inductionCompleted ? 'Completed' : 'Pending',
                    'ID Card': chk.idCardIssued ? 'Issued' : 'Pending',
                    'Uniform': chk.uniformIssued ? 'Issued' : 'Pending'
                };
            });
            fileName = 'Onboarding_Checklist_Report';
        }

        exportToCSV(exportData, fileName);
    };

    const reports = [
        { id: 'tracker', label: 'Candidate Pipeline Tracker', icon: 'fa-magnifying-glass-chart' },
        { id: 'interview', label: 'Interview Status Report', icon: 'fa-calendar-check' },
        { id: 'offer', label: 'Offer Issuance & Status', icon: 'fa-envelope-open-text' },
        { id: 'joining', label: 'Joining Status Report', icon: 'fa-user-plus' },
        { id: 'onboarding', label: 'Onboarding Checklist Report', icon: 'fa-list-check' }
    ];

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Recruitment & Onboarding Intelligence</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ padding: '8px 15px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', fontSize: '12px' }}><i className="fas fa-file-import"></i> Bulk Import</button>
                    <button onClick={handleExport} style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}><i className="fas fa-file-excel"></i> Export CSV</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '5px' }}>
                {reports.map(r => (
                    <button
                        key={r.id}
                        onClick={() => setActiveReport(r.id)}
                        style={{
                            padding: '10px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap',
                            background: activeReport === r.id ? '#1e293b' : '#f8fafc',
                            color: activeReport === r.id ? 'white' : '#64748b',
                            border: activeReport === r.id ? 'none' : '1px solid #e2e8f0',
                            cursor: 'pointer'
                        }}
                    >
                        <i className={`fas ${r.icon}`} style={{ marginRight: '8px' }}></i> {r.label}
                    </button>
                ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
                {activeReport === 'tracker' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Candidate</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Job Code</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Source</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Experience</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Interview Status</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Final Decision</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.candidates.map((c, idx) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{c.name}</td>
                                    <td style={{ padding: '12px' }}>{c.jobCode}</td>
                                    <td style={{ padding: '12px' }}>{c.source}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{c.experience}Y</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{c.status}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <span style={{ color: c.status === 'Selected' ? '#10b981' : '#64748b' }}>{c.status === 'Selected' ? 'HIRE' : 'PENDING'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeReport === 'offer' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Candidate</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Offer Date</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Salary Offered</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>DOJ</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.offers.map((o, idx) => {
                                const c = data.candidates.find(cand => cand.id === o.candidateId);
                                return (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{c?.name}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{o.issueDate}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>₹{o.offeredSalary.toLocaleString()}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{o.expectedDOJ}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{o.status}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RecruitmentReports;
