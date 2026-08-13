import React from 'react';
import { Card, CardHeader, CardTitle } from '../common/Card';
import type { MemberHealthProfile } from '../../types/member';
import { formatCurrency } from '../../utils/formatters';
import { Activity } from 'lucide-react';

export const HealthProfileCard: React.FC<{ health: MemberHealthProfile }> = ({ health }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          Payer Clinical & Utilization Profile
        </CardTitle>
        <span className="text-xs text-slate-400">Payer System Input</span>
      </CardHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-[11px] text-slate-500 font-medium">Hospital Admissions (12m)</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{health.hospitalAdmissions12m}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-[11px] text-slate-500 font-medium">ER Visits (12m)</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{health.erVisits12m}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-[11px] text-slate-500 font-medium">Outpatient Visits</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{health.outpatientVisits12m}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-[11px] text-slate-500 font-medium">Est. Annual Cost</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{formatCurrency(health.estimatedAnnualCost)}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs">
        <div>
          <span className="text-slate-500">Medication Adherence: </span>
          <span className={`font-semibold ${
            health.medicationAdherence === 'Poor' ? 'text-red-600' :
            health.medicationAdherence === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {health.medicationAdherence}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Utilization Trend: </span>
          <span className="font-semibold text-slate-800">{health.utilizationTrend}</span>
        </div>
        <div>
          <span className="text-slate-500">Comorbidities: </span>
          <span className="font-medium text-slate-700">
            {health.comorbidities.length > 0 ? health.comorbidities.join(', ') : 'None documented'}
          </span>
        </div>
      </div>
    </Card>
  );
};
