import React from 'react';
import { Card, CardHeader, CardTitle } from '../common/Card';
import type { GeographicMatchStats } from '../../types/integration';
import { ProgressBar } from '../common/ProgressBar';

export const GeographicMatchCard: React.FC<{ stats: GeographicMatchStats }> = ({ stats }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Geographic Data Matching Rate</CardTitle>
        <span className="text-xs text-slate-400">Match Efficiency</span>
      </CardHeader>

      <div className="space-y-3.5 my-2">
        <div>
          <ProgressBar
            label="ZIP Code Match"
            value={(stats.zipMatches / stats.zipTotal) * 100}
            variant="green"
            size="sm"
          />
          <span className="text-[11px] text-slate-500">
            {stats.zipMatches.toLocaleString()} / {stats.zipTotal.toLocaleString()} members matched by ZIP
          </span>
        </div>

        <div>
          <ProgressBar
            label="County Level Match"
            value={(stats.countyMatches / stats.countyTotal) * 100}
            variant="green"
            size="sm"
          />
          <span className="text-[11px] text-slate-500">
            {stats.countyMatches.toLocaleString()} / {stats.countyTotal.toLocaleString()} members matched by County FIPS
          </span>
        </div>

        <div>
          <ProgressBar
            label="Census Tract Resolution"
            value={(stats.censusTractMatches / stats.censusTractTotal) * 100}
            variant="blue"
            size="sm"
          />
          <span className="text-[11px] text-slate-500">
            {stats.censusTractMatches.toLocaleString()} / {stats.censusTractTotal.toLocaleString()} census tract resolution
          </span>
        </div>
      </div>
    </Card>
  );
};
