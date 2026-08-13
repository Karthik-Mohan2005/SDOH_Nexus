import type { InterventionPriority, InterventionStatus } from './common';

export interface Intervention {
  id: string;
  priority: InterventionPriority;
  targetType: 'Community' | 'Member';
  targetId: string;
  targetName: string;
  riskFactor: string;
  category: InterventionCategory;
  recommendation: string;
  rationale: string;
  affectedMembers: number;
  status: InterventionStatus;
  owner: string;
  expectedObjective: string;
  primaryBarriers: string[];
  lastUpdated: string;
  createdAt: string;
}

export type InterventionCategory =
  | 'Food Assistance'
  | 'Transportation'
  | 'Housing Support'
  | 'Healthcare Access'
  | 'Disease Management'
  | 'Environmental Support'
  | 'Social Support';
