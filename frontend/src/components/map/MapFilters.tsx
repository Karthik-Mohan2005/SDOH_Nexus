import React from 'react';
import type { GetCommunitiesOptions } from '../../services/communityService';
import { Button } from '../common/Button';
import { RotateCcw } from 'lucide-react';

export interface MapFiltersProps {
  filters: GetCommunitiesOptions;
  onFilterChange: (filters: Partial<GetCommunitiesOptions>) => void;
  showResources: boolean;
  onToggleResources: (show: boolean) => void;
  onReset: () => void;
}

export const MapFilters: React.FC<MapFiltersProps> = ({
  filters,
  onFilterChange,
  showResources,
  onToggleResources,
  onReset,
}) => {
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        {/* Risk Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">Risk:</span>
          <select
            value={filters.riskLevel || 'all'}
            onChange={e => onFilterChange({ riskLevel: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical Risk</option>
            <option value="high">High Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        {/* Resource Layer Toggle */}
        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <input
            type="checkbox"
            checked={showResources}
            onChange={e => onToggleResources(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-semibold text-slate-800">Show Community Resources</span>
        </label>
      </div>

      <Button variant="ghost" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={onReset}>
        Reset Map View
      </Button>
    </div>
  );
};
