export const CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'COPD',
  'Asthma',
  'Heart Disease',
  'Obesity',
  'Chronic Kidney Disease',
] as const;

export const RISK_LEVELS = ['low', 'moderate', 'high', 'critical'] as const;

export const RISK_THRESHOLDS = {
  low: { min: 0, max: 39 },
  moderate: { min: 40, max: 59 },
  high: { min: 60, max: 79 },
  critical: { min: 80, max: 100 },
};

export const INTERVENTION_CATEGORIES = [
  'Food Assistance',
  'Transportation',
  'Housing Support',
  'Healthcare Access',
  'Disease Management',
  'Environmental Support',
  'Social Support',
] as const;

export const INTERVENTION_STATUSES = [
  'not_started',
  'planned',
  'in_progress',
  'completed',
] as const;

export const SDOH_FACTORS = [
  'Social Vulnerability',
  'Food Access',
  'Housing Instability',
  'Transportation',
  'Healthcare Access',
  'Environmental Exposure',
] as const;

export const KPI_DATA = {
  totalMembers: { value: '10,250', trend: '+4.2%', trendDir: 'up' as const },
  highRiskMembers: { value: '1,240', trend: '-3.1%', trendDir: 'down' as const },
  highRiskCommunities: { value: '42', trend: '+2', trendDir: 'up' as const },
  actionableSDOH: { value: '3,864', trend: '+7.8%', trendDir: 'up' as const },
};

export const RISK_DISTRIBUTION = {
  low: 57,
  moderate: 31,
  high: 9,
  critical: 3,
};

export const APP_NAME = 'SDOH Nexus';
export const APP_TAGLINE = 'Connect health data with the conditions that shape health.';
export const PROTOTYPE_DISCLAIMER = 'Prototype environment using synthetic member data. Risk predictions are analytical demonstrations and are not clinical diagnoses.';
