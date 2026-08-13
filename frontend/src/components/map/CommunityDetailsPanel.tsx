import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Community } from '../../types/community';
import { Card } from '../common/Card';
import { RiskBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { MapPin, Users, AlertTriangle, ArrowRight } from 'lucide-react';

export const CommunityDetailsPanel: React.FC<{ community: Community | null }> = ({ community }) => {
  const navigate = useNavigate();

  if (!community) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <MapPin className="h-10 w-10 text-slate-300 mb-2" />
        <p className="font-semibold text-sm text-slate-600">No Community Selected</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Click a community marker on the map to inspect SDOH factors, population, and intervention priorities.
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col justify-between overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="pb-3 border-b border-slate-100 flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900">{community.name}</h3>
              <RiskBadge level={community.riskLevel} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              FIPS: {community.fips} • {community.county} County, {community.state}
            </p>
          </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-400" /> Population
            </span>
            <p className="text-base font-bold text-slate-900 mt-0.5">{community.population.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> SDOH Score
            </span>
            <p className="text-base font-bold text-slate-900 mt-0.5">{community.sdohScore} / 100</p>
          </div>
        </div>

        {/* Priority Banner */}
        <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg text-xs">
          <span className="font-bold text-red-900">Priority Level: {community.priority}</span>
          <p className="text-red-700 mt-0.5 font-medium">{community.primaryRisk}</p>
        </div>

        {/* Domain Metrics */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vulnerability Profile</h4>
          <div>
            <ProgressBar label="CDC Social Vulnerability (SVI)" value={community.svi * 100} variant={community.svi > 0.7 ? 'red' : 'amber'} size="sm" />
          </div>
          <div>
            <ProgressBar label="Poverty Rate" value={community.povertyRate * 2.5} showValue={false} variant={community.povertyRate > 20 ? 'red' : 'amber'} size="sm" />
            <span className="text-[11px] text-slate-500">{community.povertyRate}% poverty rate • Median Income: ${community.medianHouseholdIncome.toLocaleString()}</span>
          </div>
          <div>
            <ProgressBar label="Food Access Score (USDA)" value={community.foodAccessScore} variant={community.foodAccessScore > 70 ? 'red' : 'amber'} size="sm" />
            <span className="text-[11px] text-slate-500">Food Access Level: {community.foodAccess}</span>
          </div>
          <div>
            <ProgressBar label="Environmental Burden (EPA)" value={community.environmentalBurden} variant={community.environmentalBurden > 70 ? 'red' : 'amber'} size="sm" />
            <span className="text-[11px] text-slate-500">Environmental Risk: {community.environmentalRisk}</span>
          </div>
        </div>

        {/* High Risk Members Counter */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
          <span className="text-slate-600 font-medium">High-Risk Members in Area</span>
          <span className="font-bold text-red-600 text-sm">{community.highRiskMembers} / {community.totalMembers}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 space-y-2 mt-4">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          icon={<ArrowRight className="h-3.5 w-3.5" />}
          iconPosition="right"
          onClick={() => navigate('/members')}
        >
          View Members in {community.name}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate('/interventions')}
        >
          View Community Interventions
        </Button>
      </div>
    </Card>
  );
};
