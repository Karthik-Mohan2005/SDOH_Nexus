import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/dashboard/KpiCard';
import { RiskDistributionChart } from '../components/dashboard/RiskDistributionChart';
import { RiskTrendChart } from '../components/dashboard/RiskTrendChart';
import { SDOHFactorChart } from '../components/dashboard/SDOHFactorChart';
import { PriorityCommunityTable } from '../components/dashboard/PriorityCommunityTable';
import { RecentMembersTable } from '../components/dashboard/RecentMembersTable';
import { InterventionSummaryWidget } from '../components/dashboard/InterventionSummaryWidget';
import { Button } from '../components/common/Button';
import { Download, ShieldCheck } from 'lucide-react';
import { getDashboardAnalytics } from '../services/analyticsService';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<{
    totalMembers: number;
    highRiskMembers: number;
    mediumRiskMembers: number;
    lowRiskMembers: number;
    highRiskPercentage: number;
    mediumRiskPercentage: number;
    lowRiskPercentage: number;
    averageRiskProbability: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load dashboard analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleExport = () => {
    navigate('/members');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Health Equity Overview"
        subtitle="Population-level SDOH risk, health outcomes, and intervention opportunities."
        badge={
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Enriched Data Active
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="h-4 w-4" />}
              onClick={handleExport}
            >
              View Members
            </Button>
          </div>
        }
      />

      {/* Hero Summary Snapshot */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Population Health Equity Snapshot
          </span>

          <h2 className="text-lg sm:text-xl font-bold mt-0.5">
            {isLoading
              ? 'Loading population data...'
              : `${analytics?.totalMembers.toLocaleString() ?? 0} Members Enriched Across 50 States`}
          </h2>

          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Live member clinical records enriched with socioeconomic,
            environmental, food-access, and social vulnerability indicators.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/interventions')}
          className="shrink-0 bg-blue-500 hover:bg-blue-400 text-white"
        >
          View Actionable Interventions
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <KpiCard
          title="Total Members"
          value={
            isLoading
              ? '...'
              : analytics?.totalMembers.toLocaleString() ?? '0'
          }
          trend={
            isLoading
              ? '...'
              : `${((analytics?.averageRiskProbability ?? 0) * 100).toFixed(1)}%`
          }
          trendLabel="average risk probability"
          trendDirection="up"
          iconName="Users"
          onClick={() => navigate('/members')}
        />

        <KpiCard
          title="High-Risk Members"
          value={
            isLoading
              ? '...'
              : analytics?.highRiskMembers.toLocaleString() ?? '0'
          }
          trend={
            isLoading
              ? '...'
              : `${(analytics?.highRiskPercentage ?? 0).toFixed(1)}%`
          }
          trendLabel="of total population"
          trendDirection="down"
          iconName="AlertTriangle"
          onClick={() => navigate('/members')}
        />

        <KpiCard
          title="Medium-Risk Members"
          value={
            isLoading
              ? '...'
              : analytics?.mediumRiskMembers.toLocaleString() ?? '0'
          }
          trend={
            isLoading
              ? '...'
              : `${(analytics?.mediumRiskPercentage ?? 0).toFixed(1)}%`
          }
          trendLabel="of total population"
          trendDirection="up"
          iconName="MapPin"
          onClick={() => navigate('/members')}
        />

        <KpiCard
          title="Low-Risk Members"
          value={
            isLoading
              ? '...'
              : analytics?.lowRiskMembers.toLocaleString() ?? '0'
          }
          trend={
            isLoading
              ? '...'
              : `${(analytics?.lowRiskPercentage ?? 0).toFixed(1)}%`
          }
          trendLabel="of total population"
          trendDirection="down"
          iconName="HeartPulse"
          onClick={() => navigate('/members')}
        />

      </div>

      {/* Risk Distribution + Risk Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskDistributionChart
            onFilterRisk={(level) => {
              navigate(`/members?risk=${level}`);
            }}
          />
        </div>

        <div className="lg:col-span-2">
          <RiskTrendChart />
        </div>
      </div>

      {/* SDOH Factors + Intervention Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SDOHFactorChart />
        </div>

        <div className="lg:col-span-1">
          <InterventionSummaryWidget />
        </div>
      </div>

      {/* Priority Communities + Recent Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityCommunityTable />
        <RecentMembersTable />
      </div>
    </PageContainer>
  );
};