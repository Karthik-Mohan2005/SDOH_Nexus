import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { CommunityMap } from '../components/map/CommunityMap';
import { CommunityDetailsPanel } from '../components/map/CommunityDetailsPanel';
import { MapFilters } from '../components/map/MapFilters';
import { useCommunities } from '../hooks/useCommunities';
import { ErrorState } from '../components/common/ErrorState';

export const CommunityMapPage: React.FC = () => {
  const {
    communities,
    resources,
    selectedCommunity,
    setSelectedCommunity,
    isLoading,
    error,
    updateFilters,
    refetch,
  } = useCommunities();

  const [mapFilterOptions, setMapFilterOptions] = useState({ riskLevel: 'all' });
  const [showResources, setShowResources] = useState(true);

  const handleFilterChange = (opts: { riskLevel?: string }) => {
    setMapFilterOptions(prev => ({ ...prev, ...opts }));
    updateFilters(opts);
  };

  const handleReset = () => {
    setMapFilterOptions({ riskLevel: 'all' });
    setShowResources(true);
    updateFilters({ riskLevel: 'all' });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Community Risk Map"
        subtitle="Explore geographic patterns in SDOH vulnerability, food access, and environmental burden."
      />

      {/* Map Control Bar */}
      <MapFilters
        filters={mapFilterOptions}
        onFilterChange={handleFilterChange}
        showResources={showResources}
        onToggleResources={setShowResources}
        onReset={handleReset}
      />

      {error && <ErrorState onRetry={refetch} description={error} />}

      {/* Map & Detail Panel Grid */}
      {!error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
          {/* Map Column */}
          <div className="lg:col-span-2 h-[550px]">
            {isLoading ? (
              <div className="w-full h-full bg-slate-100 rounded-xl border border-slate-200 animate-pulse flex items-center justify-center">
                <span className="text-xs font-semibold text-slate-500">Loading Map Layer...</span>
              </div>
            ) : (
              <CommunityMap
                communities={communities}
                resources={resources}
                selectedCommunity={selectedCommunity}
                onSelectCommunity={setSelectedCommunity}
                showResources={showResources}
              />
            )}
          </div>

          {/* Details Drawer Column */}
          <div className="lg:col-span-1 h-[550px]">
            <CommunityDetailsPanel community={selectedCommunity} />
          </div>
        </div>
      )}
    </PageContainer>
  );
};
