import React from 'react';
import { Card, CardHeader, CardTitle } from '../common/Card';
import type { SDOHProfile } from '../../types/sdoh';
import { ProgressBar } from '../common/ProgressBar';

export const SDOHFactorCard: React.FC<{ sdoh: SDOHProfile }> = ({ sdoh }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>SDOH Domain Breakdown</CardTitle>
        <span className="text-xs text-slate-400">External Data Enrichment</span>
      </CardHeader>

      <div className="space-y-4 my-2">
        {/* Social Vulnerability (CDC SVI) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-slate-800">CDC Social Vulnerability (SVI)</span>
            <span className="font-bold text-slate-900">{(sdoh.svi * 100).toFixed(0)} / 100 (SVI {sdoh.svi.toFixed(2)})</span>
          </div>
          <ProgressBar value={sdoh.svi * 100} showValue={false} variant={sdoh.svi > 0.75 ? 'red' : sdoh.svi > 0.5 ? 'amber' : 'green'} size="sm" />
          <p className="text-[11px] text-slate-500 mt-1">
            Socioeconomic: {sdoh.socioeconomicStatus} | Housing/Trans: {sdoh.housingTransportation}
          </p>
        </div>

        {/* Food Access (USDA) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-slate-800">Food Access Risk (USDA Atlas)</span>
            <span className="font-bold text-slate-900">{sdoh.foodAccessScore} / 100 ({sdoh.foodAccess})</span>
          </div>
          <ProgressBar value={sdoh.foodAccessScore} showValue={false} variant={sdoh.foodAccessScore > 70 ? 'red' : sdoh.foodAccessScore > 50 ? 'amber' : 'green'} size="sm" />
          <p className="text-[11px] text-slate-500 mt-1">
            Distance to supermarket: {sdoh.distanceToFoodSource} mi {sdoh.lowIncomeLowAccess && '• Low-income/Low-access zone'}
          </p>
        </div>

        {/* Economic Factors (Census ACS) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-slate-800">Socioeconomic Factors (Census ACS)</span>
            <span className="font-bold text-slate-900">{sdoh.povertyRate}% Poverty</span>
          </div>
          <ProgressBar value={sdoh.povertyRate * 2.5} showValue={false} variant={sdoh.povertyRate > 20 ? 'red' : sdoh.povertyRate > 12 ? 'amber' : 'green'} size="sm" />
          <p className="text-[11px] text-slate-500 mt-1">
            Unemployment: {sdoh.unemploymentRate}% | Median Income: ${sdoh.medianHouseholdIncome.toLocaleString()}
          </p>
        </div>

        {/* Environmental Burden (EPA) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-slate-800">Environmental Burden (EPA EJScreen)</span>
            <span className="font-bold text-slate-900">{sdoh.environmentalBurden} / 100</span>
          </div>
          <ProgressBar value={sdoh.environmentalBurden} showValue={false} variant={sdoh.environmentalBurden > 70 ? 'red' : sdoh.environmentalBurden > 50 ? 'amber' : 'green'} size="sm" />
          <p className="text-[11px] text-slate-500 mt-1">
            Air Pollution Score: {sdoh.airPollutionIndicator} | Traffic Exposure: {sdoh.trafficExposure}
          </p>
        </div>
      </div>
    </Card>
  );
};
