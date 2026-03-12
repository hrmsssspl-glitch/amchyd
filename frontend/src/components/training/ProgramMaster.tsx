import React from 'react';
import { TrainingProgram } from '../../types/training';

interface Props {
    programs: TrainingProgram[];
}

const ProgramMaster: React.FC<Props> = ({ programs }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '22px', fontWeight: '800' }}>Training Program Definition</h3>
                <button style={{ padding: '12px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-plus"></i> Initialize Program
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {programs.map(p => (
                    <div key={p.id} style={{ border: '1px solid #e2e8f0', borderRadius: '20px', padding: '25px', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: p.status === 'Completed' ? '#10b981' : '#4f46e5' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase' }}>{p.id}</span>
                            <span style={{
                                padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                                background: p.status === 'Completed' ? '#dcfce7' : '#e0f2fe',
                                color: p.status === 'Completed' ? '#166534' : '#0369a1'
                            }}>{p.status}</span>
                        </div>

                        <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1e293b' }}>{p.name}</h4>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                            <i className="fas fa-user-tie" style={{ marginRight: '8px' }}></i> Trainer: <strong>{p.trainerName}</strong>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>DATES</div>
                                <div style={{ fontSize: '12px', fontWeight: '700' }}>{p.fromDate}</div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>MODE</div>
                                <div style={{ fontSize: '12px', fontWeight: '700' }}>{p.mode}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#1e293b' }}>
                                <i className="fas fa-clock" style={{ color: '#4f46e5', marginRight: '6px' }}></i> {p.duration}
                            </div>
                            <button style={{ border: 'none', background: 'none', color: '#4f46e5', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>View Syllabus <i className="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgramMaster;
