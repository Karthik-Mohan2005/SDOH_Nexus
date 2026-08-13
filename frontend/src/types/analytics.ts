import type { RiskLevel } from './common';

export interface RiskTrendDataPoint {
  month: string;
  highRisk: number;
  moderate: number;
  low: number;
  critical: number;
}

export interface ScatterDataPoint {
  communityId: string;
  communityName: string;
  x: number;
  y: number;
  population: number;
  riskLevel: RiskLevel;
}

export interface SDOHFactorSummary {
  factor: string;
  affectedMembers: number;
  avgScore: number;
  percentAffected: number;
}

export interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark: number;
}

export interface CommunityRiskBar {
  communityName: string;
  sdohScore: number;
  hospitalizationRisk: number;
  riskLevel: RiskLevel;
}

export interface InsightData {
  id: string;
  title: string;
  value: string;
  description: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface AnalyticsData {
  riskTrend: RiskTrendDataPoint[];
  sdohVsHospitalization: ScatterDataPoint[];
  foodAccessVsDiabetes: ScatterDataPoint[];
  environmentalVsRespiratory?: ScatterDataPoint[];
  sdohFactorSummary: SDOHFactorSummary[];
  radarData: RadarDataPoint[];
  communityRiskBars: CommunityRiskBar[];
  insights: InsightData[];
}
