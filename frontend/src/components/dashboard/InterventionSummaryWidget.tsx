import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../common/Card';
import { ShoppingCart, Car, Home, HeartPulse, Shield, Stethoscope, ChevronRight } from 'lucide-react';

const INTERVENTION_OPPORTUNITIES = [
  { category: 'Food Assistance', count: '186 referrals', icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { category: 'Transportation', count: '145 members', icon: Car, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { category: 'Housing Support', count: '118 members', icon: Home, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { category: 'Disease Management', count: '210 members', icon: HeartPulse, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { category: 'Environmental Support', count: '94 members', icon: Shield, color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  { category: 'Healthcare Access', count: '162 members', icon: Stethoscope, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
];

export const InterventionSummaryWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Intervention Opportunities</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Active SDOH action items by domain</p>
        </div>
        <button
          onClick={() => navigate('/interventions')}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          View All <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
        {INTERVENTION_OPPORTUNITIES.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.category}
              onClick={() => navigate('/interventions')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer bg-white flex flex-col justify-between"
            >
              <div className={`p-2 rounded-lg w-fit ${item.color} mb-2`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800 leading-tight">{item.category}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{item.count}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
