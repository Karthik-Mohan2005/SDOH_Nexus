import React from 'react';
import type { Intervention } from '../../types/intervention';
import type { InterventionStatus } from '../../types/common';
import { RiskBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { Eye } from 'lucide-react';

export interface InterventionTableProps {
  interventions: Intervention[];
  onSelectIntervention: (intervention: Intervention) => void;
  onUpdateStatus: (id: string, status: InterventionStatus) => void;
}

export const InterventionTable: React.FC<InterventionTableProps> = ({
  interventions,
  onSelectIntervention,
  onUpdateStatus,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Priority</th>
              <th className="px-4 py-3.5">Target (Community/Member)</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Risk Factor</th>
              <th className="px-4 py-3.5">Affected Members</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Owner</th>
              <th className="px-4 py-3.5">Last Updated</th>
              <th className="px-4 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {interventions.map(item => (
              <tr
                key={item.id}
                onClick={() => onSelectIntervention(item)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-5 py-3.5">
                  <RiskBadge level={item.priority} size="sm" />
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-900">{item.targetName}</td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-700 font-medium">{item.riskFactor}</td>
                <td className="px-4 py-3.5 font-bold text-slate-900">{item.affectedMembers}</td>
                <td className="px-4 py-3.5">
                  <select
                    value={item.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => onUpdateStatus(item.id, e.target.value as InterventionStatus)}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-medium">{item.owner}</td>
                <td className="px-4 py-3.5 text-slate-400">{formatDate(item.lastUpdated, 'MMM d, yyyy')}</td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectIntervention(item);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
