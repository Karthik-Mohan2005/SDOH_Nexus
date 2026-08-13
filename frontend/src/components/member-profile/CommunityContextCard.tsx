import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Member } from '../../types/member';

export const CommunityContextCard: React.FC<{ member: Member }> = ({ member }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            Community Environment Context
          </CardTitle>
          <span className="text-xs text-slate-400">Geographic Layer</span>
        </CardHeader>

        <div className="bg-slate-100 rounded-lg h-32 flex items-center justify-center border border-slate-200 relative overflow-hidden my-2">
          {/* Simulated Mini-map aesthetic */}
          <div className="absolute inset-0 bg-blue-50/50 flex flex-col items-center justify-center p-3 text-center">
            <MapPin className="h-6 w-6 text-red-600 animate-bounce mb-1" />
            <span className="font-bold text-xs text-slate-800">{member.communityName}</span>
            <span className="text-[11px] text-slate-500">Census Tract {member.censusTract} • ZIP {member.zipCode}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs my-2">
          <div className="p-2 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 text-[11px]">Community SDOH</span>
            <p className="font-bold text-slate-900">{member.sdohScore} / 100</p>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 text-[11px]">Hosp. Rate</span>
            <p className="font-bold text-slate-900">{member.hospitalizationRisk}%</p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          icon={<ArrowRight className="h-3.5 w-3.5" />}
          iconPosition="right"
          onClick={() => navigate('/communities')}
        >
          Explore Community Map
        </Button>
      </div>
    </Card>
  );
};
