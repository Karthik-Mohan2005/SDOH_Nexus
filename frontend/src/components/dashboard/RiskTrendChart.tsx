import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../common/Card';
import { getRiskByState } from '../../services/analyticsService';

interface ChartData {
  state: string;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}

export const RiskTrendChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRiskByState = async () => {
      try {
        const response = await getRiskByState();

        const chartData = response.map(item => ({
          state: item.state,
          highRisk: Number(item.highRisk ?? 0),
          mediumRisk: Number(item.mediumRisk ?? 0),
          lowRisk: Number(item.lowRisk ?? 0),
        }));

        setData(chartData);
      } catch (error) {
        console.error('Failed to load risk by state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRiskByState();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Risk Distribution by State</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Live member risk distribution across all 50 states
          </p>
        </div>
      </CardHeader>

      <div className="flex-1 min-h-[240px] w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Loading state risk data...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            No state risk data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="state"
                tick={{
                  fontSize: 9,
                  fill: '#64748b',
                }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: '#64748b',
                }}
                axisLine={false}
                tickLine={false}
              />

              <RechartsTooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />

              <Area
                type="monotone"
                dataKey="highRisk"
                name="High Risk"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.15}
                strokeWidth={2}
              />

              <Area
                type="monotone"
                dataKey="mediumRisk"
                name="Medium Risk"
                stroke="#d97706"
                fill="#d97706"
                fillOpacity={0.12}
                strokeWidth={2}
              />

              <Area
                type="monotone"
                dataKey="lowRisk"
                name="Low Risk"
                stroke="#16a34a"
                fill="#16a34a"
                fillOpacity={0.08}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};