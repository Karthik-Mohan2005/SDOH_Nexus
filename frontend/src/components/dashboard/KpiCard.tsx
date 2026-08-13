import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp, TrendingDown, Users, AlertTriangle, MapPin, HeartPulse } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string;
  trend: string;
  trendLabel: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  iconName: 'Users' | 'AlertTriangle' | 'MapPin' | 'HeartPulse';
  onClick?: () => void;
}

const ICONS = {
  Users: Users,
  AlertTriangle: AlertTriangle,
  MapPin: MapPin,
  HeartPulse: HeartPulse,
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trend,
  trendLabel,
  trendDirection = 'up',
  iconName,
  onClick,
}) => {
  const Icon = ICONS[iconName];
  const isPositive = trendDirection === 'up' && !trend.startsWith('-');

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={`cursor-pointer transition-all ${onClick ? 'hover:border-blue-300' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs">
        <span
          className={`inline-flex items-center gap-0.5 font-semibold ${
            isPositive ? 'text-emerald-600' : 'text-amber-600'
          }`}
        >
          {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {trend}
        </span>
        <span className="text-slate-400">{trendLabel}</span>
      </div>
    </Card>
  );
};
