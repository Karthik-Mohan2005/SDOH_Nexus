import type { RiskLevel } from './common';

export interface Member {
  memberId: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  communityId: string;
  communityName: string;
  zipCode: string;
  censusTract: string;
  primaryCondition: string;
  conditions: string[];
  enrollmentStatus: 'Active' | 'Inactive' | 'Pending';
  sdohScore: number;
  riskLevel: RiskLevel;
  hospitalizationRisk: number;
  edRisk: number;
  diseaseControlRisk: number;
  careGapRisk: number;
  lastUpdated: string;
}

export interface MemberHealthProfile {
  memberId: string;
  primaryConditions: string[];
  comorbidities: string[];
  hospitalAdmissions12m: number;
  erVisits12m: number;
  outpatientVisits12m: number;
  medicationAdherence: 'Good' | 'Moderate' | 'Poor';
  utilizationTrend: 'Increasing' | 'Stable' | 'Decreasing';
  estimatedAnnualCost: number;
}

export interface RiskAssessment {
  memberId: string;
  overallSdohScore: number;
  riskLevel: RiskLevel;
  hospitalizationRisk: number;
  edRisk: number;
  diseaseControlRisk: number;
  careGapRisk: number;
  confidence: number;
  primaryRiskFactors: RiskFactor[];
  assessedAt: string;
}

export interface RiskFactor {
  factor: string;
  severity: RiskLevel;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  source: string;
}

export interface MemberFilters {
  search: string;
  riskLevel: RiskLevel | 'all';
  condition: string;
  minAge: number | null;
  maxAge: number | null;
  sdohFactor: string;
  community: string;
  sortBy: 'sdohScore' | 'age' | 'hospitalizationRisk' | 'lastUpdated';
  sortOrder: 'asc' | 'desc';
}
