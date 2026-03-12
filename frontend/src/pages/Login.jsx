import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    Zap, 
    Wrench, 
    Globe, 
    FileText, 
    ShieldCheck, 
    Users, 
    Clock, 
    Network,
    ChevronRight,
    Search,
    Monitor
} from 'lucide-react';
import './Login.css';

const Login = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(employeeId, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        {
            icon: <Zap size={20} className="text-white" />,
            title: "Interaction-Native",
            description: "Every call, email, and document becomes structured operational evidence."
        },
        {
            icon: <FileText size={20} className="text-white" />,
            title: "Service-First Delivery",
            description: "Built for expert field service execution and quick parts turnaround."
        },
        {
            icon: <Wrench size={20} className="text-white" />,
            title: "Equipment Expertise",
            description: "Aligned for compressors, pumps, diesel engines, and concrete equipment."
        },
        {
            icon: <Network size={20} className="text-white" />,
            title: "RBAC by Hierarchy",
            description: "Role and org scope determine exactly what each persona can access."
        },
        {
            icon: <Globe size={20} className="text-white" />,
            title: "Multi-Region Coverage",
            description: "Telangana, Andhra Pradesh, and Odisha operations in one platform."
        },
        {
            icon: <ShieldCheck size={20} className="text-white" />,
            title: "Enterprise Security",
            description: "Keycloak SSO with PKCE, token-based RBAC, and audit trails."
        }
    ];

    return (
        <div className="login-container-new">
            {/* Left Panel: Feature Showcase */}
            <div className="login-left-panel">
                <div className="top-branding">
                    <div className="brand-header">
                    </div>
                    <div className="hero-section">
                        <h2>The Complete CRM for Field Service Excellence</h2>
                        <p className="hero-subtitle">
                            Lead-to-Cash and Field Service Management for Srinivasa Sales and Service Pvt. Ltd. — Authorized Cummins Partner.
                        </p>
                    </div>
                </div>

                <div className="features-grid-new">
                    {features.map((feature, idx) => (
                        <div key={idx} className="feature-card-new">
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <div className="feature-info">
                                <h4>{feature.title}</h4>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="platform-coverage-box">
                    <div className="coverage-header">
                        <Globe size={18} />
                        <span>Platform Coverage</span>
                    </div>
                    <div className="coverage-stats">
                        <div className="flow-step">
                            <div className="icon-box">
                                <Users size={20} />
                            </div>
                            <span>All Roles</span>
                        </div>
                        
                        <ChevronRight className="connector" size={16} />
                        
                        <div className="flow-step active">
                            <div className="icon-box" style={{ background: 'rgba(255,255,255,0.2)', width: '160px', borderRadius: '12px', height: '60px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <Zap size={16} style={{ marginBottom: '4px' }} />
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>CRM Core</div>
                                    <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>Sales • Service • Field Ops</div>
                                </div>
                            </div>
                        </div>

                        <ChevronRight className="connector" size={16} />

                        <div className="flow-step">
                            <div className="icon-box">
                                <ShieldCheck size={20} />
                            </div>
                            <span>Keycloak SSO</span>
                        </div>

                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)', margin: '0 20px' }}></div>

                        <div className="stat-item-new">
                            <p>13</p>
                            <p>User Roles</p>
                        </div>
                        <div className="stat-item-new">
                            <p>3</p>
                            <p>Regions</p>
                        </div>
                        <div className="stat-item-new">
                            <p>∞</p>
                            <p>Scalable</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="login-right-panel">
                <div className="login-glass-card">
                    <div className="login-card-header">
                        <span className="realm-tag">SSSPL ENTERPRISE REALM</span>
                        <div className="mini-logo-container">
                            <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
                                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>SSSPL</span>
                            </div>
                        </div>
                        <h2>Sign in to your account</h2>
                        <p>Select your organization to continue</p>
                    </div>

                    {error && <div className="error-alert-new">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group-new">
                            <label>Organization / Region</label>
                            <div className="input-container-new">
                                <select defaultValue="enterprise">
                                    <option value="enterprise">ssspl enterprise realm</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group-new">
                            <label>Employee ID</label>
                            <div className="input-container-new">
                                <input 
                                    type="text" 
                                    placeholder="Enter your Employee ID"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-new">
                            <label>Password</label>
                            <div className="input-container-new">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle-new"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'HIDE' : 'SHOW'}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="signin-button-new"
                            disabled={isLoading}
                        >
                            {isLoading ? 'SIGNING IN...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="card-footer-note">
                        SSSPL · Authorized Cummins Partner · PSense.ai
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
