import React from 'react';
import { Card, CardHeader, CardTitle } from '../common/Card';

export const RiskTrendChart: React.FC = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>12-Month High-Risk Member Trend</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical volume of members in High & Critical risk tiers
          </p>
        </div>
      </CardHeader>

      <div className="flex-1 min-h-[240px] w-full flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-sm font-medium text-slate-600">
            Historical trend data is not available yet.
          </p>

          <p className="text-xs text-slate-400 mt-1">
            This section will be connected to the backend analytics data.
          </p>
        </div>
      </div>
    </Card>
  );
};