import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Member } from '../../types/member';
import { RiskBadge } from '../common/Badge';
import type { PaginationMeta } from '../../types/common';
import { formatDate } from '../../utils/formatters';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export interface MemberTableProps {
  members: Member[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Member ID</th>
              <th className="px-4 py-3.5">Age</th>
              <th className="px-4 py-3.5">Primary Condition</th>
              <th className="px-4 py-3.5">Community</th>
              <th className="px-4 py-3.5">SDOH Score</th>
              <th className="px-4 py-3.5">Hospitalization Risk</th>
              <th className="px-4 py-3.5">Risk Level</th>
              <th className="px-4 py-3.5">Last Updated</th>
              <th className="px-4 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map(m => (
              <tr
                key={m.memberId}
                onClick={() => navigate(`/members/${m.memberId}`)}
                className="hover:bg-blue-50/40 cursor-pointer transition-colors"
              >
                <td className="px-5 py-3.5 font-bold text-blue-600 hover:underline">{m.memberId}</td>
                <td className="px-4 py-3.5 font-medium text-slate-800">{m.age}</td>
                <td className="px-4 py-3.5 font-medium text-slate-800">{m.primaryCondition}</td>
                <td className="px-4 py-3.5 text-slate-600 font-medium">{m.communityName}</td>
                <td className="px-4 py-3.5 font-extrabold text-slate-900">{m.sdohScore}</td>
                <td className="px-4 py-3.5 font-semibold text-orange-600">{m.hospitalizationRisk}%</td>
                <td className="px-4 py-3.5">
                  <RiskBadge level={m.riskLevel} size="sm" />
                </td>
                <td className="px-4 py-3.5 text-slate-400">{formatDate(m.lastUpdated, 'MMM d, yyyy')}</td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/members/${m.memberId}`);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="View Profile"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span>Show</span>
          <select
            value={pagination.pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className="bg-white border border-slate-300 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>per page • Total {pagination.total} members</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">
            Page {pagination.page} of {pagination.totalPages || 1}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
