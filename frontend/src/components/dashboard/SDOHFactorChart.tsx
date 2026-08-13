import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../common/Card';
import { getSDOHFactors } from '../../services/analyticsService';

interface ChartData {
  factor: string;
  avgScore: number;
}

const COLORS = [
  '#2563eb',
  '#0d9488',
  '#d97706',
  '#ea580c',
  '#6366f1',
  '#dc2626',
];

export const SDOHFactorChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFactors = async () => {
      try {
        const response = await getSDOHFactors();

        setData(
          response.map(item => ({
            factor: item.factor,
            avgScore: Number(item.average ?? 0),
          })),
        );
      } catch (error) {
        console.error('Failed to load SDOH factors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFactors();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Population SDOH Factor Overview</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Average score by social domain across all members
          </p>
        </div>
      </CardHeader>

      <div className="flex-1 min-h-[240px] w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Loading SDOH data...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            No SDOH data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 40,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                horizontal={false}
              />

              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                dataKey="factor"
                type="category"
                tick={{
                  fontSize: 11,
                  fill: '#334155',
                }}
                axisLine={false}
                tickLine={false}
                width={140}
              />

              <RechartsTooltip
                formatter={(val: any) => [
                  Number(val ?? 0).toFixed(2),
                  'Average',
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />

              <Bar
                dataKey="avgScore"
                radius={[0, 4, 4, 0]}
                barSize={18}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};