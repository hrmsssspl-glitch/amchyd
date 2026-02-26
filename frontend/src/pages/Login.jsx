import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(employeeId, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 140px)',
            background: 'linear-gradient(135deg, #f0f2f5 0%, #eef0f2 100%)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: '#e31e24', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>SSSP AMC</h2>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>Management Dashboard</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        border: '1px solid #fecaca'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Employee ID</label>
                        <input
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="Enter your ID"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password (For Admins)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    padding: '5px',
                                    color: '#666',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <small style={{ color: '#888', display: 'block', marginTop: '0.5rem' }}>
                            Field service staff login with Employee ID only.
                        </small>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
