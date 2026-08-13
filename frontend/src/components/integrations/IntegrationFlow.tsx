import React from 'react';
import { Card, CardHeader, CardTitle } from '../common/Card';
import { Database, ShieldCheck, Cpu, HeartPulse } from 'lucide-react';

export const IntegrationFlow: React.FC = () => {
  const steps = [
    { title: 'Healthcare Payer System', desc: 'Member ID, Age, Claims, Conditions', icon: Database, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { title: 'Geographic Matcher', desc: 'FIPS, ZIP & Census Tract Matching', icon: ShieldCheck, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { title: 'SDOH Data Enrichment', desc: 'CDC SVI + Census + USDA + EPA', icon: Cpu, color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { title: 'Risk Intelligence Engine', desc: 'Composite SDOH Risk Scoring', icon: HeartPulse, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  ];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>SDOH Intelligence & Enrichment Architecture</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            How SDOH Nexus integrates external datasets on top of existing healthcare/payer infrastructure
          </p>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 my-2 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative flex flex-col justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${step.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                  Step 0{idx + 1}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{step.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
