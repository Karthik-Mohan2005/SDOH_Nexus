import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { MemberFilters as MemberFiltersType } from '../../types/member';
import { CONDITIONS, SDOH_FACTORS } from '../../utils/constants';
import { Button } from '../common/Button';

export interface MemberFiltersProps {
  filters: Partial<MemberFiltersType>;
  onFilterChange: (newFilters: Partial<MemberFiltersType>) => void;
  onReset: () => void;
}

export const MemberFilters: React.FC<MemberFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Member ID, ZIP..."
            value={filters.search || ''}
            onChange={e => onFilterChange({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Risk Level Filter */}
        <select
          value={filters.riskLevel || 'all'}
          onChange={e => onFilterChange({ riskLevel: e.target.value as MemberFiltersType['riskLevel'] })}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        >
          <option value="all">All Risk Levels</option>
          <option value="critical">Critical Risk (80-100)</option>
          <option value="high">High Risk (60-79)</option>
          <option value="moderate">Moderate Risk (40-59)</option>
          <option value="low">Low Risk (0-39)</option>
        </select>

        {/* Primary Condition Filter */}
        <select
          value={filters.condition || 'all'}
          onChange={e => onFilterChange({ condition: e.target.value })}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        >
          <option value="all">All Conditions</option>
          {CONDITIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* SDOH Factor Filter */}
        <select
          value={filters.sdohFactor || 'all'}
          onChange={e => onFilterChange({ sdohFactor: e.target.value })}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        >
          <option value="all">All SDOH Barriers</option>
          {SDOH_FACTORS.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs">
        <span className="text-slate-500 font-medium">Filter member directory</span>
        <Button variant="ghost" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
