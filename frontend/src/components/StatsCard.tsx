import React from 'react';
import { StatCard } from '../types';

interface StatsCardProps {
  stat: StatCard;
}

const StatsCard: React.FC<StatsCardProps> = ({ stat }) => {
  return (
    <div className="stat-card">
      <div className="stat-value">{stat.value}</div>
      <div className="stat-label">{stat.title}</div>
      <div className="stat-icon">
        <i className={`fas ${stat.icon}`} style={{ color: stat.color }}></i>
      </div>
    </div>
  );
};

export default StatsCard;