import React from 'react';
import { UserRole } from '../types';

interface WelcomeSectionProps {
  activeRecruitments: number;
  userName?: string;
  userRole?: UserRole;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  activeRecruitments,
  userName,
  userRole = 'employee'
}) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'superadmin': return 'fa-crown';
      case 'admin': return 'fa-user-shield';
      case 'hr_manager': return 'fa-users';
      default: return 'fa-user';
    }
  };

  const getRoleMessage = (role: UserRole) => {
    switch (role) {
      case 'superadmin': return 'You have full system control and administrative access';
      case 'admin': return 'You have administrative access to manage users and operations';
      case 'hr_manager': return 'Manage HR operations and employee data';
      default: return 'Access your attendance, leaves, and training';
    }
  };

  return (
    <>
      <div className="welcome-section">
        <div className="welcome-header">
          <div>
            <h3>Welcome, {userName || 'User'}</h3>
            <p className="role-message">
              <i className={`fas ${getRoleIcon(userRole)}`}></i>
              {getRoleMessage(userRole)}
            </p>
          </div>
          <div className="role-icon-large">
            <i className={`fas ${getRoleIcon(userRole)}`}></i>
          </div>
        </div>
        <p>Your centralized HR ecosystem is ready. Manage the entire employee lifecycle—from recruitment and payroll to performance, compliance, and strategic exit management—all in one place.</p>
      </div>

      <div className="recruitment-highlight">
        <div className="recruitment-content">
          <h4>Active Recruitments</h4>
          <p>Currently open positions that need attention</p>
        </div>
        <div className="recruitment-number">{activeRecruitments}</div>
      </div>
    </>
  );
};

export default WelcomeSection;