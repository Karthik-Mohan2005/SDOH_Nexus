import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { IntegrationFlow } from '../components/integrations/IntegrationFlow';
import { DataSourceCard } from '../components/integrations/DataSourceCard';
import { IntegrationHealthCard } from '../components/integrations/IntegrationHealthCard';
import { GeographicMatchCard } from '../components/integrations/GeographicMatchCard';
import { PipelineStatus } from '../components/integrations/PipelineStatus';
import { useIntegrations } from '../hooks/useIntegrations';
import { SkeletonCard } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';

export const IntegrationsPage: React.FC = () => {
  const { sources, pipelineSteps, health, matchStats, isLoading, error, refetch } = useIntegrations();

  if (error) {
    return (
      <PageContainer>
        <ErrorState onRetry={refetch} description={error} />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard className="md:col-span-2" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Data Integration Hub"
        subtitle="Monitor the SDOH Nexus enrichment pipeline connecting healthcare records with community social determinants data."
      />

      {/* Architecture Overview */}
      <IntegrationFlow />

      {/* Health & Match Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {health && <IntegrationHealthCard health={health} />}
        {matchStats && <GeographicMatchCard stats={matchStats} />}
      </div>

      {/* Data Source Cards */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          Connected Data Sources
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
            {sources.length} Active
          </span>
        </h2>
        <div className="space-y-4">
          {sources.map(source => (
            <DataSourceCard key={source.id} source={source} />
          ))}
        </div>
      </div>

      {/* Pipeline Status */}
      <PipelineStatus steps={pipelineSteps} />
    </PageContainer>
  );
};
