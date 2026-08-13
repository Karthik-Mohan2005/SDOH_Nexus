import React from 'react';
import { Card, CardHeader, CardTitle } from '../common/Card';
import type { IntegrationHealth } from '../../types/integration';

export const IntegrationHealthCard: React.FC<{ health: IntegrationHealth }> = ({ health }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Data Pipeline Health</CardTitle>
        <span className="text-xs text-slate-400">System Monitoring</span>
      </CardHeader>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-2 text-xs">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-medium">Sources Connected</span>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{health.sourcesConnected} / {health.totalSources}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-medium">Records Processed</span>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{health.recordsProcessed.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-slate-500 font-medium">Geographic Match</span>
          <p className="text-lg font-bold text-emerald-600 mt-0.5">{health.geographicMatchRate}%</p>
        </div>
      </div>
    </Card>
  );
};
