import React from 'react';
import { Card, CardHeader, CardTitle } from '../common/Card';
import type { RiskAssessment } from '../../types/member';
import { ProgressBar } from '../common/ProgressBar';

export const OutcomePredictionCard: React.FC<{ risk: RiskAssessment }> = ({ risk }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Health Outcome Predictions</CardTitle>
        <span className="text-xs text-slate-400">Simulated Predictive Model</span>
      </CardHeader>

      <div className="space-y-4 my-2">
        <div>
          <ProgressBar
            label="Hospitalization Risk (12m)"
            value={risk.hospitalizationRisk}
            variant={risk.hospitalizationRisk > 70 ? 'red' : risk.hospitalizationRisk > 50 ? 'orange' : 'blue'}
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Likelihood of inpatient admission given current SDOH and utilization trend.
          </p>
        </div>

        <div>
          <ProgressBar
            label="Emergency Department Risk"
            value={risk.edRisk}
            variant={risk.edRisk > 70 ? 'red' : risk.edRisk > 50 ? 'amber' : 'blue'}
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Likelihood of non-emergent ED visit due to care access barriers.
          </p>
        </div>

        <div>
          <ProgressBar
            label="Poor Disease Control Risk"
            value={risk.diseaseControlRisk}
            variant={risk.diseaseControlRisk > 70 ? 'red' : risk.diseaseControlRisk > 50 ? 'orange' : 'blue'}
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Likelihood of unmanaged chronic conditions related to food/medication access.
          </p>
        </div>

        <div>
          <ProgressBar
            label="Care Gap Risk"
            value={risk.careGapRisk}
            variant={risk.careGapRisk > 70 ? 'red' : risk.careGapRisk > 50 ? 'amber' : 'blue'}
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Likelihood of missing routine preventive screenings or follow-ups.
          </p>
        </div>
      </div>
    </Card>
  );
};
