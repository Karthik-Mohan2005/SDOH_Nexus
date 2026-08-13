import { mockApiCall } from './api';
import { mockCommunities, mockCommunityResources } from '../data/communities';
import type { Community, CommunityResource } from '../types/community';
import type { ApiResponse } from '../types/common';

export interface GetCommunitiesOptions {
  riskLevel?: string;
  minPopulation?: number;
  maxPopulation?: number;
  sdohFactor?: string;
}

export async function getCommunities(options: GetCommunitiesOptions = {}): Promise<ApiResponse<Community[]>> {
  let filtered = [...mockCommunities];
  if (options.riskLevel && options.riskLevel !== 'all') {
    filtered = filtered.filter(c => c.riskLevel === options.riskLevel);
  }
  if (options.minPopulation != null) {
    filtered = filtered.filter(c => c.population >= options.minPopulation!);
  }
  if (options.maxPopulation != null) {
    filtered = filtered.filter(c => c.population <= options.maxPopulation!);
  }
  return mockApiCall({ data: filtered });
}

export async function getCommunityById(communityId: string): Promise<ApiResponse<Community>> {
  const community = mockCommunities.find(c => c.communityId === communityId);
  if (!community) throw new Error(`Community ${communityId} not found`);
  return mockApiCall({ data: community });
}

export async function getCommunityResources(communityId?: string): Promise<ApiResponse<CommunityResource[]>> {
  const resources = communityId
    ? mockCommunityResources.filter(r => r.communityId === communityId)
    : mockCommunityResources;
  return mockApiCall({ data: resources });
}
