import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer } from '../common/Drawer';
import type { Intervention } from '../../types/intervention';
import type { InterventionStatus } from '../../types/common';
import { RiskBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/formatters';
import { UserCheck, ArrowRight, ShieldAlert } from 'lucide-react';

export interface InterventionDetailDrawerProps {
  intervention: Intervention | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: InterventionStatus) => void;
  onAssignOwner: (id: string, owner: string) => void;
}

export const InterventionDetailDrawer: React.FC<InterventionDetailDrawerProps> = ({
  intervention,
  isOpen,
  onClose,
  onUpdateStatus,
  onAssignOwner,
}) => {
  const navigate = useNavigate();
  const [newOwner, setNewOwner] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  if (!intervention) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Intervention ${intervention.id}`} width="lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {intervention.targetType}: {intervention.targetName}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{intervention.category}</h3>
          </div>
          <RiskBadge level={intervention.priority} />
        </div>

        {/* Actionable Rationale */}
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-blue-600" /> Rationale & Objective
          </h4>
          <p className="text-xs text-blue-800 leading-relaxed">{intervention.rationale}</p>
          <div className="pt-2 border-t border-blue-200/60 text-xs font-semibold text-blue-900">
            Target Objective: {intervention.expectedObjective}
          </div>
        </div>

        {/* Recommendation Detail */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Recommended Action
          </h4>
          <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
            {intervention.recommendation}
          </p>
        </div>

        {/* Primary Barriers */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Identified SDOH Barriers
          </h4>
          <div className="flex flex-wrap gap-2">
            {intervention.primaryBarriers.map(b => (
              <span key={b} className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-xs font-semibold">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Meta Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Affected Members</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">{intervention.affectedMembers}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Current Status</span>
            <p className="text-base font-bold text-blue-600 capitalize mt-0.5">{intervention.status.replace('_', ' ')}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Owner</span>
            <p className="text-xs font-bold text-slate-900 mt-0.5">{intervention.owner}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Last Updated</span>
            <p className="text-xs font-bold text-slate-900 mt-0.5">{formatDate(intervention.lastUpdated, 'MMM d, yyyy')}</p>
          </div>
        </div>

        {/* Status & Assignment Actions */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Change Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['not_started', 'planned', 'in_progress', 'completed'] as InterventionStatus[]).map(st => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(intervention.id, st)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                    intervention.status === st
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Owner Assignment */}
          <div className="pt-2">
            {!isAssigning ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                icon={<UserCheck className="h-4 w-4" />}
                onClick={() => setIsAssigning(true)}
              >
                Reassign Care Manager / Team
              </Button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter manager name..."
                  value={newOwner}
                  onChange={e => setNewOwner(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (newOwner.trim()) {
                      onAssignOwner(intervention.id, newOwner);
                      setIsAssigning(false);
                      setNewOwner('');
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          {/* Navigation Action */}
          <div className="pt-2">
            {intervention.targetType === 'Member' ? (
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
                onClick={() => {
                  onClose();
                  navigate(`/members/${intervention.targetId}`);
                }}
              >
                View Target Member Profile ({intervention.targetId})
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
                onClick={() => {
                  onClose();
                  navigate('/communities');
                }}
              >
                Inspect Target Community on Map
              </Button>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
