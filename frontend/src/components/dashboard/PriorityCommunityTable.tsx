import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle } from '../common/Card';
import { RiskBadge } from '../common/Badge';
import { mockCommunities } from '../../data/communities';
import { ChevronRight } from 'lucide-react';

export const PriorityCommunityTable: React.FC = () => {
  const navigate = useNavigate();
  const topCommunities = mockCommunities
    .filter(c => c.riskLevel === 'critical' || c.riskLevel === 'high')
    .slice(0, 5);

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <CardTitle>Priority Communities</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Highest SDOH vulnerability areas</p>
        </div>
        <button
          onClick={() => navigate('/communities')}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          View Map <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Community</th>
              <th className="px-4 py-3">Population</th>
              <th className="px-4 py-3">SDOH Score</th>
              <th className="px-4 py-3">High-Risk Members</th>
              <th className="px-4 py-3">Primary Risk</th>
              <th className="px-4 py-3">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topCommunities.map(c => (
              <tr
                key={c.communityId}
                onClick={() => navigate('/communities')}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-5 py-3 font-semibold text-slate-900">{c.name}</td>
                <td className="px-4 py-3">{c.population.toLocaleString()}</td>
                <td className="px-4 py-3 font-bold text-slate-900">{c.sdohScore}</td>
                <td className="px-4 py-3 text-red-600 font-semibold">{c.highRiskMembers}</td>
                <td className="px-4 py-3 text-slate-500 truncate max-w-[160px]">{c.primaryRisk}</td>
                <td className="px-4 py-3">
                  <RiskBadge level={c.riskLevel} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
