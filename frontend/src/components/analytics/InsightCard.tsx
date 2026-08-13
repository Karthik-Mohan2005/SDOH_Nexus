import React from 'react';
import { Card } from '../common/Card';
import type { InsightData } from '../../types/analytics';
import { MapPin, Car, ShoppingCart, AlertTriangle, Layers } from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  MapPin,
  Car,
  ShoppingCart,
  AlertTriangle,
  Layers,
};

export const InsightCard: React.FC<{ insight: InsightData }> = ({ insight }) => {
  const Icon = ICONS[insight.icon] || MapPin;

  return (
    <Card className="h-full flex flex-col justify-between hover:border-blue-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {insight.title}
          </span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 tracking-tight my-1">
          {insight.value}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          {insight.description}
        </p>
      </div>

      {insight.trend && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-blue-600">{insight.trend}</span>
          <span className="text-slate-400">Prototype model insight</span>
        </div>
      )}
    </Card>
  );
};
