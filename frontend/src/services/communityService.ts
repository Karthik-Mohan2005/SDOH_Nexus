import api from './api';
import type { Community, CommunityResource } from '../types/community';
import type { ApiResponse } from '../types/common';

interface BackendCommunity {
  communityId: string;
  name: string;
  fips: string;
  state: string;
  county: string;
  latitude: number;
  longitude: number;
  population: number;
  svi: number;
  sdohScore: number;
  povertyRate: number;
  unemploymentRate: number;
  medianHouseholdIncome: number;
  foodAccess: 'Good' | 'Moderate' | 'Poor' | 'Very Poor';
  foodAccessScore: number;
  environmentalRisk: 'Low' | 'Moderate' | 'High' | 'Very High';
  environmentalBurden: number;
  healthcareAccess: 'Good' | 'Limited' | 'Poor';
  healthcareAccessScore: number;
  highRiskMembers: number;
  totalMembers: number;
  hospitalizationRisk: number;
  priority: 'Critical' | 'High' | 'Moderate' | 'Low';
  riskLevel: 'low' | 'moderate' | 'high';
  primaryRisk: string;
}

interface CommunitiesResponse {
  success: boolean;
  count: number;
  data: BackendCommunity[];
}

function mapCommunity(
  community: BackendCommunity,
): Community {
  return {
    communityId: String(community.communityId),
    name: community.name,
    fips: String(community.fips),
    state: community.state,
    county: community.county,
    latitude: community.latitude,
    longitude: community.longitude,
    population: community.population,
    svi: community.svi,
    sdohScore: community.sdohScore,
    povertyRate: community.povertyRate,
    unemploymentRate: community.unemploymentRate,
    medianHouseholdIncome:
      community.medianHouseholdIncome,

    foodAccess: community.foodAccess,
    foodAccessScore: community.foodAccessScore,

    environmentalRisk:
      community.environmentalRisk,

    environmentalBurden:
      community.environmentalBurden,

    healthcareAccess:
      community.healthcareAccess,

    healthcareAccessScore:
      community.healthcareAccessScore,

    highRiskMembers:
      community.highRiskMembers,

    totalMembers:
      community.totalMembers,

    hospitalizationRisk:
      community.hospitalizationRisk,

    priority:
      community.priority,

    riskLevel:
      community.riskLevel,

    primaryRisk:
      community.primaryRisk,
  };
}

export interface GetCommunitiesOptions {
  riskLevel?: string;
  minPopulation?: number;
  maxPopulation?: number;
  sdohFactor?: string;
}

export async function getCommunities(
  options: GetCommunitiesOptions = {},
): Promise<ApiResponse<Community[]>> {

  const response =
    await api.get<CommunitiesResponse>(
      '/api/communities',
    );

  let communities =
    response.data.data.map(mapCommunity);

  if (
    options.riskLevel &&
    options.riskLevel !== 'all'
  ) {
    communities =
      communities.filter(
        community =>
          community.riskLevel ===
          options.riskLevel,
      );
  }

  if (options.minPopulation != null) {
    communities =
      communities.filter(
        community =>
          community.population >=
          options.minPopulation!,
      );
  }

  if (options.maxPopulation != null) {
    communities =
      communities.filter(
        community =>
          community.population <=
          options.maxPopulation!,
      );
  }

  return {
    data: communities,
  };
}

export async function getCommunityById(
  communityId: string,
): Promise<ApiResponse<Community>> {

  const response =
    await api.get<CommunitiesResponse>(
      '/api/communities',
    );

  const community =
    response.data.data
      .map(mapCommunity)
      .find(
        item =>
          item.communityId ===
          String(communityId),
      );

  if (!community) {
    throw new Error(
      `Community ${communityId} not found`,
    );
  }

  return {
    data: community,
  };
}

export async function getCommunityResources(
  communityId?: string,
): Promise<ApiResponse<CommunityResource[]>> {

  /*
   * Resources are not currently provided by the
   * backend community endpoints.
   *
   * Return an empty collection instead of using
   * mock community resources.
   */
  void communityId;

  return {
    data: [],
  };
}