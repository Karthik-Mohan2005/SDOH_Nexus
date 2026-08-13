import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../common/Card';
import { getRiskDistribution } from '../../services/analyticsService';

export interface RiskDistributionData {
  name: string;
  value: number;
  color: string;
}

const COLORS: Record<string, string> = {
  Low: '#16a34a',
  Medium: '#d97706',
  High: '#dc2626',
};

export const RiskDistributionChart: React.FC<{
  onFilterRisk?: (level: string) => void;
}> = ({ onFilterRisk }) => {
  const [data, setData] = useState<RiskDistributionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRiskDistribution = async () => {
      try {
        const response = await getRiskDistribution();

        setData(
          response.map(item => ({
            name: item.category,
            value: item.count,
            color: COLORS[item.category] ?? '#64748b',
          })),
        );
      } catch (error) {
        console.error('Failed to load risk distribution:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRiskDistribution();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
        <span className="text-xs text-slate-500 font-normal">
          Population breakdown
        </span>
      </CardHeader>

      <div className="flex-1 min-h-[240px] w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Loading risk data...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            No risk data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                onClick={entry => {
                  if (onFilterRisk && entry?.name) {
                    const level =
                      entry.name === 'Medium'
                        ? 'moderate'
                        : entry.name.toLowerCase();

                    onFilterRisk(level);
                  }
                }}
                className="cursor-pointer"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <RechartsTooltip
                formatter={(value: any) => [
                  `${Number(value ?? 0).toLocaleString()} members`,
                  'Population',
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />

              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '10px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};