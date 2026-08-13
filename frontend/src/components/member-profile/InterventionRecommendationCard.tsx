import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Check, UserPlus, ArrowRight } from 'lucide-react';

export const InterventionRecommendationCard: React.FC<{ memberId: string }> = ({ memberId }) => {
  const navigate = useNavigate();
  const [assigned, setAssigned] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>Recommended Actionable Interventions</CardTitle>
          <Badge variant="primary">Targeted Action</Badge>
        </CardHeader>

        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs text-blue-900">Food Assistance & Nutrition Counseling</span>
            <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              High Priority
            </span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            Connect member {memberId} with SNAP assistance and medically-tailored meal delivery to address food access barrier score (76).
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs text-slate-900">Non-Emergency Transportation Support</span>
            <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              Moderate Priority
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Schedule transit voucher for upcoming primary care visit to overcome distance barrier.
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant={reviewed ? 'secondary' : 'outline'}
            size="sm"
            icon={reviewed ? <Check className="h-3.5 w-3.5" /> : undefined}
            onClick={() => setReviewed(true)}
          >
            {reviewed ? 'Reviewed' : 'Mark Reviewed'}
          </Button>
          <Button
            variant={assigned ? 'secondary' : 'primary'}
            size="sm"
            icon={<UserPlus className="h-3.5 w-3.5" />}
            onClick={() => setAssigned(true)}
          >
            {assigned ? 'Assigned: Care Mgr' : 'Assign Manager'}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowRight className="h-3.5 w-3.5" />}
          iconPosition="right"
          onClick={() => navigate('/interventions')}
        >
          View Interventions Center
        </Button>
      </div>
    </Card>
  );
};
