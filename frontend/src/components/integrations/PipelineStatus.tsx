import React from 'react';
import { Card, CardHeader, CardTitle } from '../common/Card';
import type { PipelineStep } from '../../types/integration';
import { CheckCircle2 } from 'lucide-react';

export const PipelineStatus: React.FC<{ steps: PipelineStep[] }> = ({ steps }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Enrichment Pipeline Execution</CardTitle>
        <span className="text-xs text-slate-400">Automated Pipeline</span>
      </CardHeader>

      <div className="space-y-3 my-2">
        {steps.map((step, idx) => (
          <div key={step.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Step {idx + 1}: {step.name}</span>
                <p className="text-slate-500 text-[11px] mt-0.5">{step.description}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Complete ({step.duration})
              </span>
              {step.records && <p className="text-[10px] text-slate-400 mt-1">{step.records.toLocaleString()} records</p>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
