import api from './api';
import type { AnalyticsData } from '../types/analytics';
export interface DashboardAnalytics {
  averageRiskProbability: number;
  highRiskMembers: number;
  highRiskPercentage: number;
  mediumRiskMembers: number;
  mediumRiskPercentage: number;
  lowRiskMembers: number;
  lowRiskPercentage: number;
  totalMembers: number;
  totalCommunities: number;
}

export interface RiskDistributionItem {
  category: 'Low' | 'Medium' | 'High';
  count: number;
  percentage: number;
}

export interface SDOHFactor {
  factor: string;
  sourceColumn: string;
  average: number;
}

export interface RiskByState {
  state: string;
  totalMembers: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  averageRisk: number;
}

export interface DemographicsData {
  ageGroup: unknown;
  ethnicity: unknown;
  gender: unknown;
  race: unknown;
}
export async function getAnalytics(): Promise<{
  data: AnalyticsData;
}> {
  const response = await api.get('/api/analytics/dashboard');
  return response.data;
}
export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const response = await api.get('/api/analytics/dashboard');

  return response.data.data;
}

export async function getRiskDistribution(): Promise<RiskDistributionItem[]> {
  const response = await api.get('/api/analytics/risk-distribution');

  return response.data.data;
}

export async function getSDOHFactors(): Promise<SDOHFactor[]> {
  const response = await api.get('/api/analytics/sdoh-factors');

  return response.data.data;
}

export async function getRiskByState(): Promise<RiskByState[]> {
  const response = await api.get('/api/analytics/risk-by-state');

  return response.data.data;
}

export async function getDemographics(): Promise<DemographicsData> {
  const response = await api.get('/api/analytics/demographics');

  return response.data.data;
}