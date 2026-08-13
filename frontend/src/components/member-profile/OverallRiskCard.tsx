import React from 'react';
import { Card, CardHeader, CardTitle } from '../common/Card';
import { RiskBadge } from '../common/Badge';
import type { RiskAssessment } from '../../types/member';
import { AlertCircle } from 'lucide-react';

export const OverallRiskCard: React.FC<{ risk: RiskAssessment }> = ({ risk }) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>Overall SDOH Risk Score</CardTitle>
          <RiskBadge level={risk.riskLevel} />
        </CardHeader>

        <div className="flex items-baseline gap-3 my-4">
          <span className="text-5xl font-black text-slate-900 tracking-tight">
            {risk.overallSdohScore}
          </span>
          <span className="text-slate-400 font-semibold text-sm">/ 100</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Enriched composite score combining CDC Social Vulnerability Index, Census ACS poverty/income metrics, USDA food access data, and EPA environmental burden indices.
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 font-medium text-slate-700">
          Model Confidence: <strong className="text-slate-900">{risk.confidence}%</strong>
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Simulated ML output
        </span>
      </div>
    </Card>
  );
};
