import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import type { Member } from '../../types/member';
import { RiskBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export const MemberHeader: React.FC<{ member: Member }> = ({ member }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/members')}
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          title="Back to members"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Member {member.memberId}
            </h1>
            <RiskBadge level={member.riskLevel} showScore={member.sdohScore} />
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>{member.age} yrs • {member.sex}</span>
            <span>•</span>
            <span>{member.communityName} ({member.zipCode})</span>
            <span>•</span>
            <span className="font-medium text-slate-700">{member.primaryCondition}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Last Enriched: {formatDate(member.lastUpdated, 'MMM d, yyyy HH:mm')}</span>
        </div>
        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 font-medium">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>FHIR Ready</span>
        </div>
      </div>
    </div>
  );
};
