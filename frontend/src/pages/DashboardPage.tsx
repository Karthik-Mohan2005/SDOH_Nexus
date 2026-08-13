import React from 'react';
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
import { exportToCSV, membersToCSVData } from '../utils/csv';
import { mockMembers } from '../data/members';
import { KPI_DATA } from '../utils/constants';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleExport = () => {
    const csvData = membersToCSVData(mockMembers as unknown as Record<string, unknown>[]);
    exportToCSV(csvData, 'SDOH_Nexus_Population_Report');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Health Equity Overview"
        subtitle="Population-level SDOH risk, health outcomes, and intervention opportunities."
        badge={
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" /> Enriched Data Active
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} onClick={handleExport}>
              Export Report
            </Button>
          </div>
        }
      />

      {/* Hero Summary Snapshot */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Population Health Equity Snapshot</span>
          <h2 className="text-lg sm:text-xl font-bold mt-0.5">
            10,250 Members Enriched Across 15 Communities
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Member clinical health records combined with CDC Social Vulnerability Index (SVI), Census socioeconomic data, USDA food access metrics, and EPA environmental burden.
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Members"
          value={KPI_DATA.totalMembers.value}
          trend={KPI_DATA.totalMembers.trend}
          trendLabel="vs previous period"
          trendDirection="up"
          iconName="Users"
          onClick={() => navigate('/members')}
        />
        <KpiCard
          title="High-Risk Members"
          value={KPI_DATA.highRiskMembers.value}
          trend={KPI_DATA.highRiskMembers.trend}
          trendLabel="vs previous period"
          trendDirection="down"
          iconName="AlertTriangle"
          onClick={() => navigate('/members')}
        />
        <KpiCard
          title="High-Risk Communities"
          value={KPI_DATA.highRiskCommunities.value}
          trend={KPI_DATA.highRiskCommunities.trend}
          trendLabel="this quarter"
          trendDirection="up"
          iconName="MapPin"
          onClick={() => navigate('/communities')}
        />
        <KpiCard
          title="Members with Actionable SDOH Risk"
          value={KPI_DATA.actionableSDOH.value}
          trend={KPI_DATA.actionableSDOH.trend}
          trendLabel="vs previous period"
          trendDirection="up"
          iconName="HeartPulse"
          onClick={() => navigate('/interventions')}
        />
      </div>

      {/* Chart Section 1: Donut & Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskDistributionChart onFilterRisk={() => {}} />
        </div>
        <div className="lg:col-span-2">
          <RiskTrendChart />
        </div>
      </div>

      {/* Chart Section 2: SDOH Domain Breakdown & Intervention Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SDOHFactorChart />
        </div>
        <div className="lg:col-span-1">
          <InterventionSummaryWidget />
        </div>
      </div>

      {/* Table Section: Priority Communities & Recent Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityCommunityTable />
        <RecentMembersTable />
      </div>
    </PageContainer>
  );
};
