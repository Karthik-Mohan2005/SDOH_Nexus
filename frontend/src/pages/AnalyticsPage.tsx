import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { AnalyticsFilterBar } from '../components/analytics/AnalyticsFilterBar';
import { InsightCard } from '../components/analytics/InsightCard';
import { useAnalytics } from '../hooks/useAnalytics';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { SkeletonCard } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useAnalytics();

  const [timePeriod, setTimePeriod] = useState('12m');
  const [community, setCommunity] = useState('all');
  const [condition, setCondition] = useState('all');

  const handleReset = () => {
    setTimePeriod('12m');
    setCommunity('all');
    setCondition('all');
  };

  if (error) {
    return (
      <PageContainer>
        <ErrorState onRetry={refetch} description={error} />
      </PageContainer>
    );
  }

  if (isLoading || !data) {
    return (
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="SDOH Analytics & Correlation Intelligence"
        subtitle="Analyze relationships between social determinants, healthcare utilization, and health outcomes."
      />

      {/* Filter Control Bar */}
      <AnalyticsFilterBar
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        community={community}
        onCommunityChange={setCommunity}
        condition={condition}
        onConditionChange={setCondition}
        onReset={handleReset}
      />

      {/* Automated Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.insights.map(item => (
          <InsightCard key={item.id} insight={item} />
        ))}
      </div>

      {/* Correlation Scatter Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scatter 1: SDOH Risk vs Hospitalization Rate */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div>
              <CardTitle>SDOH Risk Score vs Hospitalization Rate</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Strong positive correlation (r = 0.84)</p>
            </div>
          </CardHeader>
          <div className="flex-1 min-h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="x" name="SDOH Score" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="number" dataKey="y" name="Hospitalization Rate %" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-md text-xs">
                          <p className="font-bold text-slate-900">{d.communityName}</p>
                          <p className="text-slate-600">SDOH Score: <strong>{d.x}</strong></p>
                          <p className="text-slate-600">Hosp. Rate: <strong>{d.y}%</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Communities" data={data.sdohVsHospitalization} fill="#2563eb" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Scatter 2: Food Access vs Diabetes Outcome Risk */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div>
              <CardTitle>Food Access Risk vs Diabetes Outcome Risk</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Food insecurity drives poor HbA1c control</p>
            </div>
          </CardHeader>
          <div className="flex-1 min-h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="x" name="Food Risk" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="number" dataKey="y" name="Diabetes Risk" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-md text-xs">
                          <p className="font-bold text-slate-900">{d.communityName}</p>
                          <p className="text-slate-600">Food Risk: <strong>{d.x}</strong></p>
                          <p className="text-slate-600">Diabetes Risk: <strong>{d.y}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Communities" data={data.foodAccessVsDiabetes} fill="#d97706" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Radar Chart & Community Bar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>SDOH Domain Composition Radar</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Portfolio-wide domain vulnerability</p>
          </CardHeader>
          <div className="flex-1 min-h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#334155' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="SDOH Index" dataKey="score" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Community Vulnerability Ranking</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Comparative SDOH scores across top communities</p>
          </CardHeader>
          <div className="flex-1 min-h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.communityRiskBars} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="communityName" tick={{ fontSize: 10, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="sdohScore" name="SDOH Score" barSize={22}>
                  {data.communityRiskBars.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.riskLevel === 'critical' ? '#dc2626' : entry.riskLevel === 'high' ? '#ea580c' : '#d97706'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
