import { useState, useEffect, useCallback } from 'react';
import type { Intervention } from '../types/intervention';
import type { InterventionStatus } from '../types/common';
import { getInterventions, updateInterventionStatus, assignIntervention } from '../services/interventionService';
import type { GetInterventionsOptions } from '../services/interventionService';

export function useInterventions(initialOptions?: GetInterventionsOptions) {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<GetInterventionsOptions>(initialOptions || {});
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

  const fetchInterventions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getInterventions(options);
      setInterventions(response.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch interventions');
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchInterventions();
  }, [fetchInterventions]);

  const updateStatus = useCallback(async (id: string, status: InterventionStatus) => {
    try {
      const res = await updateInterventionStatus(id, status);
      setInterventions(prev => prev.map(item => item.id === id ? res.data : item));
      if (selectedIntervention?.id === id) {
        setSelectedIntervention(res.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update intervention status');
    }
  }, [selectedIntervention]);

  const assignOwner = useCallback(async (id: string, owner: string) => {
    try {
      const res = await assignIntervention(id, owner);
      setInterventions(prev => prev.map(item => item.id === id ? res.data : item));
      if (selectedIntervention?.id === id) {
        setSelectedIntervention(res.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to assign owner');
    }
  }, [selectedIntervention]);

  const updateFilters = useCallback((newOptions: Partial<GetInterventionsOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  return {
    interventions,
    selectedIntervention,
    setSelectedIntervention,
    isLoading,
    error,
    updateStatus,
    assignOwner,
    updateFilters,
    filters: options,
    refetch: fetchInterventions,
  };
}
