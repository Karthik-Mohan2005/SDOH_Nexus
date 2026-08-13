import { mockApiCall } from './api';
import { mockAnalyticsData } from '../data/analytics';
import type { AnalyticsData } from '../types/analytics';
import type { ApiResponse } from '../types/common';

export async function getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
  return mockApiCall({ data: mockAnalyticsData });
}
