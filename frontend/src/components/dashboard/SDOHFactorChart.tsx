import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle } from '../common/Card';
import { mockAnalyticsData } from '../../data/analytics';

const COLORS = ['#2563eb', '#0d9488', '#d97706', '#ea580c', '#6366f1', '#dc2626'];

export const SDOHFactorChart: React.FC = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Population SDOH Factor Overview</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Average score by social domain across all members</p>
        </div>
      </CardHeader>
      <div className="flex-1 min-h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={mockAnalyticsData.sdohFactorSummary}
            margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="factor" type="category" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} width={120} />
            <RechartsTooltip
              formatter={(val: any) => [`Score: ${val ?? 0}/100`, 'Avg Score']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
            <Bar dataKey="avgScore" radius={[0, 4, 4, 0]} barSize={18}>
              {mockAnalyticsData.sdohFactorSummary.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
