import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle } from '../common/Card';
import { RiskBadge } from '../common/Badge';
import { mockMembers } from '../../data/members';
import { ChevronRight } from 'lucide-react';

export const RecentMembersTable: React.FC = () => {
  const navigate = useNavigate();
  const highRiskMembers = mockMembers
    .filter(m => m.riskLevel === 'critical' || m.riskLevel === 'high')
    .slice(0, 5);

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <CardTitle>Recent High-Risk Members</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Members needing care coordination</p>
        </div>
        <button
          onClick={() => navigate('/members')}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          View All Members <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Member ID</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Condition</th>
              <th className="px-4 py-3">Community</th>
              <th className="px-4 py-3">SDOH Score</th>
              <th className="px-4 py-3">Hospitalization Risk</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {highRiskMembers.map(m => (
              <tr
                key={m.memberId}
                onClick={() => navigate(`/members/${m.memberId}`)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-5 py-3 font-semibold text-blue-600 hover:underline">{m.memberId}</td>
                <td className="px-4 py-3">{m.age}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{m.primaryCondition}</td>
                <td className="px-4 py-3 text-slate-500">{m.communityName}</td>
                <td className="px-4 py-3 font-bold text-slate-900">{m.sdohScore}</td>
                <td className="px-4 py-3 text-orange-600 font-semibold">{m.hospitalizationRisk}%</td>
                <td className="px-4 py-3">
                  <RiskBadge level={m.riskLevel} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
