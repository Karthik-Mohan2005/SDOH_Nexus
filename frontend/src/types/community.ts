import type { RiskLevel } from './common';

export interface Community {
  communityId: string;
  name: string;
  fips: string;
  state: string;
  county: string;
  latitude: number;
  longitude: number;
  population: number;
  svi: number; // 0-1
  sdohScore: number; // 0-100
  povertyRate: number; // percent
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
  riskLevel: RiskLevel;
  primaryRisk: string;
}

export interface CommunityResource {
  id: string;
  communityId: string;
  name: string;
  type: 'hospital' | 'clinic' | 'food_assistance' | 'transportation' | 'housing' | 'social_services';
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  hours?: string;
  note: string;
}
