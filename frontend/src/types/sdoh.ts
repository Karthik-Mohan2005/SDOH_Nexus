export interface SDOHProfile {
  memberId: string;
  // Social Vulnerability
  svi: number; // 0-1
  socioeconomicStatus: number; // 0-100
  householdCharacteristics: number; // 0-100
  racialEthnicMinorityStatus: number; // 0-100
  housingTransportation: number; // 0-100
  // Economic
  povertyRate: number; // percent
  unemploymentRate: number; // percent
  medianHouseholdIncome: number;
  educationRisk: number; // 0-100
  // Food Access
  foodAccess: 'Good' | 'Moderate' | 'Poor' | 'Very Poor';
  foodAccessScore: number; // 0-100
  distanceToFoodSource: number; // miles
  lowIncomeLowAccess: boolean;
  // Healthcare Access
  healthcareAccessScore: number; // 0-100
  distanceToHealthcare: number; // miles
  primaryCareAccess: 'Good' | 'Limited' | 'Poor';
  transportationAccess: 'Good' | 'Limited' | 'Poor';
  // Environmental
  environmentalBurden: number; // 0-100
  airPollutionIndicator: number; // 0-100
  trafficExposure: number; // 0-100
  environmentalJusticeIndicator: 'Low' | 'Moderate' | 'High' | 'Very High';
  housingRisk: 'Low' | 'Moderate' | 'High';
  environmentalRisk: 'Low' | 'Moderate' | 'High';
}
