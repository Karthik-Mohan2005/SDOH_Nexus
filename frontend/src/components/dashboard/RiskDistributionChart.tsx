import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle } from '../common/Card';

export interface RiskDistributionData {
  name: string;
  value: number;
  color: string;
}

const DATA: RiskDistributionData[] = [
  { name: 'Low Risk (0-39)', value: 57, color: '#16a34a' },
  { name: 'Moderate Risk (40-59)', value: 31, color: '#d97706' },
  { name: 'High Risk (60-79)', value: 9, color: '#ea580c' },
  { name: 'Critical Risk (80-100)', value: 3, color: '#dc2626' },
];

export const RiskDistributionChart: React.FC<{ onFilterRisk?: (level: string) => void }> = ({
  onFilterRisk,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>SDOH Risk Distribution</CardTitle>
        <span className="text-xs text-slate-500 font-normal">Population breakdown</span>
      </CardHeader>
      <div className="flex-1 min-h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              onClick={entry => {
                if (onFilterRisk && entry?.name) {
                  onFilterRisk(entry.name.split(' ')[0].toLowerCase());
                }
              }}
              className="cursor-pointer"
            >
              {DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value: any) => [`${value ?? 0}%`, 'Population']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
