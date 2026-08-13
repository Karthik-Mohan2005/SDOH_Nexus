import type { RiskLevel } from '../types/common';

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

export function getRiskLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    critical: 'Critical',
  };
  return labels[level];
}

export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: '#16a34a',
    moderate: '#d97706',
    high: '#ea580c',
    critical: '#dc2626',
  };
  return colors[level];
}

export function getRiskBgColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: '#f0fdf4',
    moderate: '#fffbeb',
    high: '#fff7ed',
    critical: '#fef2f2',
  };
  return colors[level];
}

export function getRiskBorderColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: '#bbf7d0',
    moderate: '#fde68a',
    high: '#fed7aa',
    critical: '#fecaca',
  };
  return colors[level];
}

export function getRiskTextClass(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    low: 'text-green-700',
    moderate: 'text-amber-700',
    high: 'text-orange-700',
    critical: 'text-red-700',
  };
  return classes[level];
}

export function getRiskBadgeClass(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    low: 'bg-green-50 text-green-700 border-green-200',
    moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
  };
  return classes[level];
}

export function getRiskDotClass(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    low: 'bg-green-500',
    moderate: 'bg-amber-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
  };
  return classes[level];
}

export function getRiskProgressClass(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    low: 'bg-green-500',
    moderate: 'bg-amber-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
  };
  return classes[level];
}
