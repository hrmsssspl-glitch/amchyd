import React from 'react';
import { db } from '../database/dbService';

const DatabaseStats: React.FC = () => {
  const stats = db.getDashboardStats();
  const employees = db.getEmployees();
  const departments = db.getDepartments();

  return (
    <div className="database-stats">
      <h3>Database Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{employees.length}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{departments.length}</div>
          <div className="stat-label">Departments</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{db.getLeaves().length}</div>
          <div className="stat-label">Leave Records</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{db.getAttendance().length}</div>
          <div className="stat-label">Attendance Records</div>
        </div>
      </div>
      
      <div className="recent-data">
        <h4>Recent Employees</h4>
        <div className="employee-list">
          {employees.slice(0, 5).map(emp => (
            <div key={emp.id} className="employee-card">
              <div className="employee-avatar">
                {emp.profileImage ? (
                  <img src={emp.profileImage} alt={emp.firstName} />
                ) : (
                  <div className="avatar-fallback">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                )}
              </div>
              <div className="employee-info">
                <h5>{emp.firstName} {emp.lastName}</h5>
                <p>{emp.designation} • {emp.department}</p>
              </div>
              <div className="employee-status">
                <span className={`status-badge ${emp.status}`}>
                  {emp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatabaseStats;