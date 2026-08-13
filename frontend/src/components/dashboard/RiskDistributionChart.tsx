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
  count: number;
  color: string;
}

const COLORS: Record<string, string> = {
  Low: '#16a34a',
  Medium: '#d97706',
  High: '#dc2626',
};

interface RiskDistributionChartProps {
  onFilterRisk?: (level: string) => void;
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  onFilterRisk,
}) => {
  const [data, setData] = useState<RiskDistributionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadRiskDistribution = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await getRiskDistribution();

        const mappedData = response.map(item => ({
          name: item.category,
          value: item.percentage,
          count: item.count,
          color: COLORS[item.category] ?? '#64748b',
        }));

        setData(mappedData);
      } catch (err) {
        console.error('Failed to load risk distribution:', err);
        setError('Unable to load risk distribution');
      } finally {
        setIsLoading(false);
      }
    };

    loadRiskDistribution();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>SDOH Risk Distribution</CardTitle>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Current population breakdown
          </p>
        </div>
      </CardHeader>

      <div className="flex-1 min-h-[240px] w-full">
        {isLoading ? (
          <div className="h-full min-h-[240px] flex items-center justify-center">
            <div className="text-sm text-slate-500">
              Loading risk distribution...
            </div>
          </div>
        ) : error ? (
          <div className="h-full min-h-[240px] flex items-center justify-center">
            <div className="text-sm text-red-500">
              {error}
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-full min-h-[240px] flex items-center justify-center">
            <div className="text-sm text-slate-500">
              No risk distribution data available.
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                onClick={entry => {
                  if (onFilterRisk && entry?.name) {
                    onFilterRisk(String(entry.name).toLowerCase());
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
  formatter={(value, _name, props) => {
    const numericValue = Number(value ?? 0);
    const count = Number(props?.payload?.count ?? 0);

    return [
      `${numericValue.toFixed(1)}% (${count.toLocaleString()} members)`,
      'Population',
    ];
  }}
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