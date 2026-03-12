import React from 'react';
import { Module } from '../types';

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  // Get color based on module ID for consistent theming
  const getModuleColor = (id: number) => {
    const colors = [
      '#6366f1', '#10b981', '#f59e0b', '#14b8a6', '#ec4899',
      '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16', '#a855f7',
      '#f97316', '#3b82f6', '#0ea5e9', '#d946ef', '#0a9396',
      '#9b2226', '#ee9b00', '#001219', '#005f73', '#94d2bd'
    ];
    return colors[(id - 1) % colors.length];
  };

  return (
    <div className="module-card" style={{ borderLeftColor: getModuleColor(module.id) }}>
      <div className="module-header">
        <div className="module-icon" style={{ backgroundColor: getModuleColor(module.id) }}>
          <i className={`fas ${module.icon}`}></i>
        </div>
        <h4>{module.title}</h4>
      </div>
      <p className="module-description">{module.description}</p>
      <div className="module-features">
        <h5>Features:</h5>
        <ul>
          {module.features.map((feature, index) => (
            <li key={index}>
              <i className="fas fa-check-circle"></i>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="module-footer">
        <span className="access-badge">
          <i className="fas fa-user-shield"></i>
          Access: {module.roles.map(r => r.toUpperCase()).join(', ')}
        </span>
      </div>
    </div>
  );
};

export default ModuleCard;