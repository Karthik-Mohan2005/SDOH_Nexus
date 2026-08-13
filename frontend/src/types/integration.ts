import type { IntegrationStatus } from './common';

export interface IntegrationSource {
  id: string;
  source: string;
  displayName: string;
  description: string;
  status: IntegrationStatus;
  records: number;
  lastSync: string;
  type: string;
  endpoint?: string;
  format: string;
  matchRate: number;
  failedRecords: number;
}

export interface PipelineStep {
  name: string;
  description: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  duration?: string;
  records?: number;
}

export interface IntegrationHealth {
  sourcesConnected: number;
  totalSources: number;
  lastSuccessfulSync: string;
  recordsProcessed: number;
  recordsEnriched: number;
  geographicMatchRate: number;
  failedRecords: number;
}

export interface GeographicMatchStats {
  zipMatches: number;
  zipTotal: number;
  countyMatches: number;
  countyTotal: number;
  censusTractMatches: number;
  censusTractTotal: number;
  unmatchedRecords: number;
}
