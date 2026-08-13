import { mockApiCall } from './api';
import { mockIntegrationSources, mockPipelineSteps, mockIntegrationHealth, mockGeographicMatchStats } from '../data/integrations';
import type { IntegrationSource, PipelineStep, IntegrationHealth, GeographicMatchStats } from '../types/integration';
import type { ApiResponse } from '../types/common';

export async function getIntegrationSources(): Promise<ApiResponse<IntegrationSource[]>> {
  return mockApiCall({ data: mockIntegrationSources });
}

export async function getPipelineStatus(): Promise<ApiResponse<PipelineStep[]>> {
  return mockApiCall({ data: mockPipelineSteps });
}

export async function getIntegrationHealth(): Promise<ApiResponse<IntegrationHealth>> {
  return mockApiCall({ data: mockIntegrationHealth });
}

export async function getGeographicMatchStats(): Promise<ApiResponse<GeographicMatchStats>> {
  return mockApiCall({ data: mockGeographicMatchStats });
}
