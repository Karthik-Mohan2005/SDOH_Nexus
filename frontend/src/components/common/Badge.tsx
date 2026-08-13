import React from 'react';
import type { RiskLevel } from '../../types/common';
import { getRiskBadgeClass, getRiskLabel } from '../../utils/risk';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    outline: 'bg-white text-slate-700 border-slate-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export const RiskBadge: React.FC<{ level: RiskLevel; size?: 'sm' | 'md'; showScore?: number; className?: string }> = ({
  level,
  size = 'md',
  showScore,
  className = '',
}) => {
  const badgeClass = getRiskBadgeClass(level);
  const label = getRiskLabel(level);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${badgeClass} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
        level === 'critical' ? 'bg-red-600' :
        level === 'high' ? 'bg-orange-500' :
        level === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
      }`} />
      {label} Risk
      {showScore !== undefined && <span className="font-semibold">({showScore})</span>}
    </span>
  );
};
