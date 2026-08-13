import React from 'react';
import { Card, CardHeader, CardTitle } from '../common/Card';
import type { RiskAssessment } from '../../types/member';
import { AlertTriangle, Database } from 'lucide-react';
import { RiskBadge } from '../common/Badge';

export const RiskFactorExplanation: React.FC<{ risk: RiskAssessment }> = ({ risk }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Why is this member high risk?
        </CardTitle>
        <span className="text-xs text-slate-400">Explainable AI Drivers</span>
      </CardHeader>

      <div className="space-y-3 my-2">
        {risk.primaryRiskFactors.map((rf, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-xs text-slate-900">{rf.factor}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full flex items-center gap-1">
                  <Database className="h-3 w-3" /> {rf.source}
                </span>
                <RiskBadge level={rf.severity} size="sm" />
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-snug">{rf.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
