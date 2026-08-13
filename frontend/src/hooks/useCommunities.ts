import { useState, useEffect, useCallback } from 'react';
import type { Community, CommunityResource } from '../types/community';
import { getCommunities, getCommunityResources } from '../services/communityService';
import type { GetCommunitiesOptions } from '../services/communityService';

export function useCommunities(initialOptions?: GetCommunitiesOptions) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [resources, setResources] = useState<CommunityResource[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<GetCommunitiesOptions>(initialOptions || {});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [commRes, resRes] = await Promise.all([
        getCommunities(options),
        getCommunityResources(),
      ]);
      setCommunities(commRes.data);
      setResources(resRes.data);
      if (commRes.data.length > 0 && !selectedCommunity) {
        setSelectedCommunity(commRes.data[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch communities');
    } finally {
      setIsLoading(false);
    }
  }, [options, selectedCommunity]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectCommunity = useCallback((communityId: string) => {
    const found = communities.find(c => c.communityId === communityId);
    if (found) setSelectedCommunity(found);
  }, [communities]);

  const updateFilters = useCallback((newOptions: Partial<GetCommunitiesOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  return {
    communities,
    resources,
    selectedCommunity,
    setSelectedCommunity,
    selectCommunity,
    isLoading,
    error,
    updateFilters,
    refetch: fetchData,
  };
}
