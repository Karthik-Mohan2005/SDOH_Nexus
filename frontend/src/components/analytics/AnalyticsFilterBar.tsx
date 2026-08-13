import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export interface AnalyticsFilterBarProps {
  timePeriod: string;
  onTimePeriodChange: (val: string) => void;
  community: string;
  onCommunityChange: (val: string) => void;
  condition: string;
  onConditionChange: (val: string) => void;
  onReset: () => void;
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  timePeriod,
  onTimePeriodChange,
  community,
  onCommunityChange,
  condition,
  onConditionChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        {/* Time Period */}
        <select
          value={timePeriod}
          onChange={e => onTimePeriodChange(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none"
        >
          <option value="12m">Trailing 12 Months</option>
          <option value="6m">Trailing 6 Months</option>
          <option value="3m">Trailing 3 Months</option>
          <option value="ytd">Year to Date (2026)</option>
        </select>

        {/* Community */}
        <select
          value={community}
          onChange={e => onCommunityChange(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none"
        >
          <option value="all">All Communities (15)</option>
          <option value="C001">Riverside Heights</option>
          <option value="C002">Eastview District</option>
          <option value="C003">Southgate Commons</option>
        </select>

        {/* Primary Condition */}
        <select
          value={condition}
          onChange={e => onConditionChange(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none"
        >
          <option value="all">All Chronic Conditions</option>
          <option value="Diabetes">Diabetes</option>
          <option value="Hypertension">Hypertension</option>
          <option value="COPD">COPD</option>
          <option value="Asthma">Asthma</option>
        </select>
      </div>

      <Button variant="ghost" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
};
