import React, { useState } from 'react';
import { EmployeeMasterData } from '../../types/employee';
import { exportToCSV } from '../../utils/csvExport';
import { flattenEmployee } from '../../utils/employeeCsvUtils';
import { Branch } from '../../types/organization';

interface EmployeeReportsProps {
    employees: EmployeeMasterData[];
    onImportClick: () => void;
    branches: Branch[];
}

const EmployeeReports: React.FC<EmployeeReportsProps> = ({ employees, onImportClick, branches }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'employment' | 'training' | 'search'>('all');
    const [filterBranch, setFilterBranch] = useState('');

    const filteredEmployees = employees.filter(emp => {
        const fullName = `${emp.personal.name} ${emp.personal.surname}`;
        const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.id && emp.id.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesBranch = filterBranch === '' || emp.employment.branch === filterBranch;
        return matchesSearch && matchesBranch;
    });

    const availableBranches = Array.from(new Set(branches.map(b => b.branchName)));

    const handleDownload = () => {
        const dataToExport = filteredEmployees.map(flattenEmployee);
        exportToCSV(dataToExport, `Employee_Master_Report_${new Date().toISOString().split('T')[0]}`);
    };

    const tabs = [
        { id: 'all', label: 'Detailed List' },
        { id: 'personal', label: 'Personal Summary' },
        { id: 'employment', label: 'Employment Details' },
        { id: 'training', label: 'Training Records' },
        { id: 'search', label: 'Visual Search' }
    ];

    const currentTab = searchTerm ? 'search' : activeTab;

    return (
        <div className="form-section" style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Employee Master Reports</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onImportClick}
                        style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fas fa-file-import"></i> Bulk Import
                    </button>
                    <button
                        onClick={handleDownload}
                        style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fas fa-file-export"></i> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                    <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5' }}></i>
                    <input
                        type="text"
                        placeholder="Search name/ID..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (e.target.value && activeTab !== 'search') setActiveTab('search');
                            if (!e.target.value && activeTab === 'search') setActiveTab('all');
                        }}
                        style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '2px solid #5d5fef', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <select
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '13px', color: '#475569', cursor: 'pointer' }}
                >
                    <option value="">Filter by Branch</option>
                    {availableBranches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                flex: 1,
                                padding: '6px 4px',
                                border: 'none',
                                borderRadius: '6px',
                                background: activeTab === tab.id ? 'white' : 'transparent',
                                color: activeTab === tab.id ? '#4f46e5' : '#64748b',
                                fontWeight: '700',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                cursor: 'pointer'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'search' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {filteredEmployees.map((emp, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '12px',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #5d5fef'
                            }}>
                                <i className={`fas ${emp.documents?.photo ? 'fa-user-check' : 'fa-user'}`} style={{ fontSize: '30px', color: emp.documents?.photo ? '#5d5fef' : '#cbd5e1' }}></i>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12px', color: '#5d5fef', fontWeight: 'bold' }}>{emp.id || 'N/A'}</div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>{emp.personal.name} {emp.personal.surname}</div>
                                <div style={{ fontSize: '13px', color: '#4a5568', marginTop: '4px' }}>{emp.employment.designation}</div>
                                <div style={{ fontSize: '12px', color: '#718096' }}>{emp.employment.branch} | {emp.employment.rolls}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ overflowX: 'auto', border: '1.5px solid #e2e8f0', borderRadius: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Photo</th>
                                <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Employee ID</th>
                                <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Full Name</th>
                                {activeTab === 'all' && (
                                    <>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Branch</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Rolls</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Created On</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Created By</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Dept / Desig</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Basic Medical</th>
                                    </>
                                )}
                                {activeTab === 'personal' && (
                                    <>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Gender</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>DOB</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Personal Mobile</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Email</th>
                                    </>
                                )}
                                {activeTab === 'employment' && (
                                    <>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Joined On</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Branch</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Reporting To</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Roll Type</th>
                                    </>
                                )}
                                {activeTab === 'training' && (
                                    <>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Training Type</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Result</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Comp. ID</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Cert</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fcfcfc' }}>
                                    <td style={{ padding: '12px 15px' }}>
                                        <div style={{
                                            width: '35px',
                                            height: '35px',
                                            borderRadius: '50%',
                                            background: '#e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}>
                                            <i className="fas fa-user" style={{ color: '#94a3b8' }}></i>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 15px', fontWeight: '600', color: '#4f46e5' }}>{emp.id || 'N/A'}</td>
                                    <td style={{ padding: '12px 15px', fontWeight: '600' }}>{emp.personal.name} {emp.personal.surname}</td>
                                    {activeTab === 'all' && (
                                        <>
                                            <td style={{ padding: '12px 15px' }}>{emp.employment.branch}</td>
                                            <td style={{ padding: '12px 15px' }}>{emp.employment.rolls}</td>
                                            <td style={{ padding: '12px 15px', color: '#64748b' }}>{emp.createdDate || '-'}</td>
                                            <td style={{ padding: '12px 15px' }}>
                                                <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>{emp.createdBy || 'System'}</span>
                                            </td>
                                            <td style={{ padding: '12px 15px' }}>
                                                <div style={{ fontWeight: '500' }}>{emp.employment.department}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>{emp.employment.designation}</div>
                                            </td>
                                            <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                                <span title={`BP: ${emp.medical?.bloodPressure || 'N/A'}, Sugar: ${emp.medical?.sugar || 'N/A'}`}>
                                                    {emp.personal.bloodGroup}
                                                </span>
                                            </td>
                                        </>
                                    )}
                                    {activeTab === 'personal' && (
                                        <>
                                            <td style={{ padding: '12px 15px' }}>{emp.personal.gender}</td>
                                            <td style={{ padding: '12px 15px' }}>{emp.personal.dob}</td>
                                            <td style={{ padding: '12px 15px' }}>{emp.contact.personalNumber}</td>
                                            <td style={{ padding: '12px 15px' }}>{emp.contact.personalEmail}</td>
                                        </>
                                    )}
                                    {activeTab === 'employment' && (
                                        <>
                                            <td style={{ padding: '12px 15px' }}>{emp.employment.doj}</td>
                                            <td style={{ padding: '12px 15px' }}>{emp.employment.branch}</td>
                                            <td style={{ padding: '12px 15px' }}>{emp.employment.reportingManager}</td>
                                            <td style={{ padding: '12px 15px' }}>{emp.employment.rolls}</td>
                                        </>
                                    )}
                                    {activeTab === 'training' && (
                                        <>
                                            <td style={{ padding: '12px 15px' }}>{emp.training?.cumminsTrainingType || '-'}</td>
                                            <td style={{ padding: '12px 15px' }}>{emp.training?.trainingResult || '-'}</td>
                                            <td style={{ padding: '12px 15px' }}>{emp.training?.cumminsTrainingCompletionId || '-'}</td>
                                            <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                                {emp.training?.trainingCertificate && <i className="fas fa-file-pdf" style={{ color: '#ef4444' }}></i>}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeeReports;
