import React, { useState } from 'react';
import { LoginCredentials } from '../types';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  error?: string;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error, isLoading }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(credentials);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev: LoginCredentials) => ({
      ...prev,
      [name]: value,
    }));
  };

  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'Super Admin', color: '#5c6bc0' },
    { username: 'hr.john', password: 'hr123', role: 'HR Manager', color: '#42a5f5' },
    { username: 'manager.sarah', password: 'manager123', role: 'Department Manager', color: '#66bb6a' },
    { username: 'employee.mike', password: 'employee123', role: 'Employee', color: '#ffb74d' },
  ];

  const useDemoAccount = (demo: { username: string; password: string }) => {
    setCredentials(demo);
    if (rememberMe) {
      localStorage.setItem('rememberedUser', demo.username);
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Branding & Info */}
      <div className="login-left">
        <div className="brand-section">
          <div className="brand-logo">
            <i className="fas fa-users-cog"></i>
            <h1>HRMS Pro</h1>
          </div>
          <p className="brand-tagline">Enterprise Human Resource Management System</p>
        </div>

        <div className="features-section">
          <h3>Everything you need to manage your workforce</h3>
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-users"></i>
              <div>
                <h4>Employee Management</h4>
                <p>Centralized employee database & profiles</p>
              </div>
            </div>
            <div className="feature">
              <i className="fas fa-chart-line"></i>
              <div>
                <h4>Performance Tracking</h4>
                <p>Monitor and improve employee performance</p>
              </div>
            </div>
            <div className="feature">
              <i className="fas fa-money-bill-wave"></i>
              <div>
                <h4>Payroll Automation</h4>
                <p>Automated salary processing & compliance</p>
              </div>
            </div>
            <div className="feature">
              <i className="fas fa-calendar-check"></i>
              <div>
                <h4>Attendance System</h4>
                <p>Real-time attendance & leave management</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Companies</span>
          </div>
          <div className="stat">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Employees</span>
          </div>
          <div className="stat">
            <span className="stat-number">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-container">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your HRMS account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-user"></i>
                <span>Username</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                  className="login-input"
                />
                <i className="input-icon fas fa-envelope"></i>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                <span>Password</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="login-input"
                />
                <i className="input-icon fas fa-key"></i>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>

            <div className="divider">
              <span>Quick Access</span>
            </div>

            <div className="demo-section">
              <h4>Demo Accounts</h4>
              <p className="demo-subtitle">Try different roles and permissions</p>
              <div className="demo-grid">
                {demoCredentials.map((demo, index) => (
                  <button
                    key={index}
                    type="button"
                    className="demo-card"
                    onClick={() => useDemoAccount(demo)}
                    disabled={isLoading}
                    style={{ borderTopColor: demo.color }}
                  >
                    <div className="demo-role">
                      <div className="demo-icon" style={{ backgroundColor: demo.color }}>
                        <i className={`fas fa-${demo.role.includes('Admin') ? 'crown' : demo.role.includes('HR') ? 'users' : demo.role.includes('Manager') ? 'user-tie' : 'user'}`}></i>
                      </div>
                      <span className="demo-role-name">{demo.role}</span>
                    </div>
                    <div className="demo-credentials">
                      <div className="demo-username">
                        <i className="fas fa-user"></i>
                        <span>{demo.username}</span>
                      </div>
                      <div className="demo-password">
                        <i className="fas fa-key"></i>
                        <span>{demo.password}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="password-note">
                <i className="fas fa-info-circle"></i>
                Default password: <strong>[username]123</strong>
              </p>
            </div>

            <div className="login-footer">
              <p>
                Don't have an account? <a href="#">Contact Administrator</a>
              </p>
              <p className="version">HRMS Pro v2.0 • Secure Login • © 2024</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;