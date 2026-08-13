import type { Member } from '../types/member';
import type { SDOHProfile } from '../types/sdoh';
import type { RiskAssessment } from '../types/member';

// 50 deterministic synthetic members
const CONDITIONS = ['Diabetes', 'Hypertension', 'COPD', 'Asthma', 'Heart Disease', 'Obesity', 'Chronic Kidney Disease'];
const COMMUNITIES = [
  { id: 'C001', name: 'Riverside Heights' },
  { id: 'C002', name: 'Eastview District' },
  { id: 'C003', name: 'Southgate Commons' },
  { id: 'C004', name: 'Northpark Landing' },
  { id: 'C005', name: 'Westfield Terrace' },
  { id: 'C006', name: 'Millbrook Village' },
  { id: 'C007', name: 'Harborview East' },
  { id: 'C008', name: 'Oakdale Crossing' },
  { id: 'C009', name: 'Pinecrest Gardens' },
  { id: 'C010', name: 'Clearwater Bend' },
  { id: 'C011', name: 'Maplewood Heights' },
  { id: 'C012', name: 'Valley Ridge' },
  { id: 'C013', name: 'Lakeside Commons' },
  { id: 'C014', name: 'Sunrise Park' },
  { id: 'C015', name: 'Greenfield Estates' },
];
const ZIPS = ['11201','48201','90001','75201','60601','43201','98101','30301','33101','55401','07601','85001','53201','89101','02101'];
const SEX: ('Male'|'Female')[] = ['Male','Female','Female','Male','Female','Male','Male','Female','Male','Female','Female','Male','Female','Male','Female'];

function getRiskLevelFromScore(score: number): 'low'|'moderate'|'high'|'critical' {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

// Seed-based deterministic generation
function seededScore(seed: number, base: number, range: number): number {
  return Math.min(100, Math.max(0, Math.floor(base + ((seed * 7919) % range) - range / 2)));
}

export const mockMembers: Member[] = Array.from({ length: 50 }, (_, i) => {
  const idx = i % 15;
  const condIdx = i % CONDITIONS.length;
  const cond2Idx = (i + 2) % CONDITIONS.length;
  const com = COMMUNITIES[idx];
  // Score distribution: 3% critical, 9% high, 31% moderate, 57% low
  const scoreBase = i < 2 ? 85 : i < 6 ? 70 : i < 21 ? 52 : 28;
  const score = seededScore(i + 1, scoreBase, 18);
  const riskLevel = getRiskLevelFromScore(score);

  return {
    memberId: `M${String(1001 + i).padStart(4, '0')}`,
    age: 28 + ((i * 13) % 52),
    sex: SEX[i % SEX.length],
    communityId: com.id,
    communityName: com.name,
    zipCode: ZIPS[idx],
    censusTract: `${String(idx + 1).padStart(4, '0')}.0${(i % 3) + 1}`,
    primaryCondition: CONDITIONS[condIdx],
    conditions: condIdx !== cond2Idx ? [CONDITIONS[condIdx], CONDITIONS[cond2Idx]] : [CONDITIONS[condIdx]],
    enrollmentStatus: i % 20 === 0 ? 'Pending' : 'Active',
    sdohScore: score,
    riskLevel,
    hospitalizationRisk: seededScore(i + 2, score - 4, 14),
    edRisk: seededScore(i + 3, score - 8, 16),
    diseaseControlRisk: seededScore(i + 4, score - 6, 14),
    careGapRisk: seededScore(i + 5, score - 10, 16),
    lastUpdated: `2026-08-${String(1 + (i % 12)).padStart(2,'0')}T${String(6 + (i % 12)).padStart(2,'0')}:${String((i * 7) % 60).padStart(2,'0')}:00Z`,
  };
});

export const mockSDOHProfiles: Record<string, SDOHProfile> = {};
export const mockRiskAssessments: Record<string, RiskAssessment> = {};

mockMembers.forEach((m, i) => {
  const s = m.sdohScore;
  mockSDOHProfiles[m.memberId] = {
    memberId: m.memberId,
    svi: Math.min(1, Math.max(0, (s / 100) + ((i % 5) * 0.02 - 0.04))),
    socioeconomicStatus: seededScore(i + 10, s, 20),
    householdCharacteristics: seededScore(i + 11, s - 5, 20),
    racialEthnicMinorityStatus: seededScore(i + 12, s - 3, 24),
    housingTransportation: seededScore(i + 13, s + 2, 18),
    povertyRate: Math.min(45, Math.max(4, Math.floor(s * 0.35 + (i % 8)))),
    unemploymentRate: Math.min(18, Math.max(2, Math.floor(s * 0.14 + (i % 4)))),
    medianHouseholdIncome: Math.floor(95000 - s * 600 + ((i % 7) * 1200)),
    educationRisk: seededScore(i + 14, s - 4, 18),
    foodAccess: s >= 75 ? 'Poor' : s >= 55 ? 'Moderate' : s >= 35 ? 'Moderate' : 'Good',
    foodAccessScore: seededScore(i + 15, s + 4, 18),
    distanceToFoodSource: Math.min(8, Math.max(0.2, parseFloat(((s * 0.06) + (i % 5) * 0.3).toFixed(1)))),
    lowIncomeLowAccess: s > 65,
    healthcareAccessScore: seededScore(i + 16, 100 - s + 5, 20),
    distanceToHealthcare: Math.min(12, Math.max(0.5, parseFloat(((s * 0.05) + (i % 6) * 0.4).toFixed(1)))),
    primaryCareAccess: s >= 70 ? 'Poor' : s >= 50 ? 'Limited' : 'Good',
    transportationAccess: s >= 70 ? 'Poor' : s >= 45 ? 'Limited' : 'Good',
    environmentalBurden: seededScore(i + 17, s + 3, 22),
    airPollutionIndicator: seededScore(i + 18, s - 2, 24),
    trafficExposure: seededScore(i + 19, s - 5, 22),
    environmentalJusticeIndicator: s >= 75 ? 'Very High' : s >= 55 ? 'High' : s >= 35 ? 'Moderate' : 'Low',
    housingRisk: s >= 70 ? 'High' : s >= 45 ? 'Moderate' : 'Low',
    environmentalRisk: s >= 70 ? 'High' : s >= 45 ? 'Moderate' : 'Low',
  };

  const riskFactors = [];
  if (s >= 60) riskFactors.push({ factor: 'High social vulnerability', severity: 'high' as const, impact: 'High' as const, description: 'Community SVI places member in high-vulnerability tier.', source: 'CDC SVI' });
  if (m.sdohScore >= 65) riskFactors.push({ factor: 'Limited food access', severity: 'high' as const, impact: 'High' as const, description: 'Low-income, low-access food environment.', source: 'USDA Food Access Atlas' });
  if (i % 3 < 2) riskFactors.push({ factor: 'Previous emergency utilization', severity: 'moderate' as const, impact: 'Medium' as const, description: 'Multiple ED visits in prior 12 months increase re-admission risk.', source: 'Health Data' });
  if (mockSDOHProfiles[m.memberId].environmentalBurden > 60) riskFactors.push({ factor: 'High environmental burden', severity: 'high' as const, impact: 'Medium' as const, description: 'Above-average environmental pollutant exposure.', source: 'EPA EJScreen' });
  if (mockSDOHProfiles[m.memberId].unemploymentRate > 10) riskFactors.push({ factor: 'High area unemployment', severity: 'moderate' as const, impact: 'Medium' as const, description: 'Community unemployment rate exceeds 10%.', source: 'Census ACS' });

  mockRiskAssessments[m.memberId] = {
    memberId: m.memberId,
    overallSdohScore: m.sdohScore,
    riskLevel: m.riskLevel,
    hospitalizationRisk: m.hospitalizationRisk,
    edRisk: m.edRisk,
    diseaseControlRisk: m.diseaseControlRisk,
    careGapRisk: m.careGapRisk,
    confidence: 72 + (i % 15),
    primaryRiskFactors: riskFactors.length > 0 ? riskFactors : [{ factor: 'Routine monitoring', severity: 'low' as const, impact: 'Low' as const, description: 'No significant risk factors currently identified.', source: 'Risk Engine' }],
    assessedAt: m.lastUpdated,
  };
});
