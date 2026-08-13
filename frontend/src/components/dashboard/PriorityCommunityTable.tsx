import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle } from '../common/Card';
import { RiskBadge } from '../common/Badge';
import { ChevronRight } from 'lucide-react';
import { getCommunities } from '../../services/communityService';
import type { Community } from '../../types/community';

export const PriorityCommunityTable: React.FC = () => {
  const navigate = useNavigate();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        const response = await getCommunities();

        const sorted = [...response.data]
          .filter(
            community =>
              community.riskLevel === 'critical' ||
              community.riskLevel === 'high' ||
              community.priority === 'Critical' ||
              community.priority === 'High',
          )
          .sort((a, b) => {
            // Highest priority first
            const priorityRank: Record<string, number> = {
              Critical: 4,
              High: 3,
              Moderate: 2,
              Low: 1,
            };

            const priorityDifference =
              (priorityRank[b.priority] ?? 0) -
              (priorityRank[a.priority] ?? 0);

            if (priorityDifference !== 0) {
              return priorityDifference;
            }

            // Then highest SDOH vulnerability
            return b.sdohScore - a.sdohScore;
          })
          .slice(0, 5);

        setCommunities(sorted);
      } catch (error) {
        console.error(
          'Failed to load priority communities:',
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, []);

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <CardTitle>Priority Communities</CardTitle>

          <p className="text-xs text-slate-500 mt-0.5">
            Highest SDOH vulnerability areas
          </p>
        </div>

        <button
          onClick={() => navigate('/communities')}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          View Map
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">
            Loading communities...
          </div>
        ) : communities.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No priority community data available.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">
                  Community
                </th>

                <th className="px-4 py-3">
                  Members
                </th>

                <th className="px-4 py-3">
                  SDOH Score
                </th>

                <th className="px-4 py-3">
                  High-Risk
                </th>

                <th className="px-4 py-3">
                  Primary Risk
                </th>

                <th className="px-4 py-3">
                  Priority
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {communities.map(community => (
                <tr
                  key={community.communityId}
                  onClick={() =>
                    navigate('/communities')
                  }
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {/* Community */}
                  <td className="px-5 py-3">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {community.name}
                      </div>

                      <div className="text-[11px] text-slate-400">
                        {community.state}
                      </div>
                    </div>
                  </td>

                  {/* Members */}
                  <td className="px-4 py-3">
                    {community.totalMembers.toLocaleString()}
                  </td>

                  {/* SDOH */}
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900">
                      {Number(
                        community.sdohScore ?? 0,
                      ).toFixed(1)}
                    </span>
                  </td>

                  {/* High Risk */}
                  <td className="px-4 py-3">
                    <span
                      className={
                        community.highRiskMembers > 0
                          ? 'text-red-600 font-semibold'
                          : 'text-slate-500'
                      }
                    >
                      {community.highRiskMembers}
                    </span>
                  </td>

                  {/* Primary Risk */}
                  <td className="px-4 py-3 text-slate-500 truncate max-w-[160px]">
                    {community.primaryRisk}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3">
                    <RiskBadge
                      level={community.riskLevel}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
};