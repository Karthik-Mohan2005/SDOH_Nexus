import { useState, useEffect, useCallback } from 'react';
import type { IntegrationSource, PipelineStep, IntegrationHealth, GeographicMatchStats } from '../types/integration';
import { getIntegrationSources, getPipelineStatus, getIntegrationHealth, getGeographicMatchStats } from '../services/integrationService';

export function useIntegrations() {
  const [sources, setSources] = useState<IntegrationSource[]>([]);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [health, setHealth] = useState<IntegrationHealth | null>(null);
  const [matchStats, setMatchStats] = useState<GeographicMatchStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [srcRes, pipeRes, healthRes, matchRes] = await Promise.all([
        getIntegrationSources(),
        getPipelineStatus(),
        getIntegrationHealth(),
        getGeographicMatchStats(),
      ]);
      setSources(srcRes.data);
      setPipelineSteps(pipeRes.data);
      setHealth(healthRes.data);
      setMatchStats(matchRes.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch integrations data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  return {
    sources,
    pipelineSteps,
    health,
    matchStats,
    isLoading,
    error,
    refetch: fetchIntegrations,
  };
}
