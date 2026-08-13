import { mockApiCall } from './api';
import { mockMembers, mockSDOHProfiles, mockRiskAssessments } from '../data/members';
import type { Member, MemberHealthProfile, RiskAssessment, MemberFilters } from '../types/member';
import type { SDOHProfile } from '../types/sdoh';
import type { ApiResponse, PaginationMeta } from '../types/common';

export interface GetMembersOptions {
  page?: number;
  pageSize?: number;
  filters?: Partial<MemberFilters>;
}

export interface GetMembersResponse {
  data: Member[];
  pagination: PaginationMeta;
}

export async function getMembers(options: GetMembersOptions = {}): Promise<GetMembersResponse> {
  const { page = 1, pageSize = 10, filters } = options;

  let filtered = [...mockMembers];

  if (filters) {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(m =>
        m.memberId.toLowerCase().includes(search) ||
        m.communityName.toLowerCase().includes(search) ||
        m.zipCode.includes(search) ||
        m.primaryCondition.toLowerCase().includes(search)
      );
    }
    if (filters.riskLevel && filters.riskLevel !== 'all') {
      filtered = filtered.filter(m => m.riskLevel === filters.riskLevel);
    }
    if (filters.condition && filters.condition !== 'all') {
      filtered = filtered.filter(m => m.conditions.includes(filters.condition!));
    }
    if (filters.community && filters.community !== 'all') {
      filtered = filtered.filter(m => m.communityId === filters.community);
    }
    if (filters.minAge != null) {
      filtered = filtered.filter(m => m.age >= filters.minAge!);
    }
    if (filters.maxAge != null) {
      filtered = filtered.filter(m => m.age <= filters.maxAge!);
    }
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[filters.sortBy as keyof Member] as number;
        const bVal = b[filters.sortBy as keyof Member] as number;
        return filters.sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
      });
    }
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return mockApiCall({ data, pagination: { page, pageSize, total, totalPages } });
}

export async function getMemberById(memberId: string): Promise<ApiResponse<Member>> {
  const member = mockMembers.find(m => m.memberId === memberId);
  if (!member) throw new Error(`Member ${memberId} not found`);
  return mockApiCall({ data: member });
}

export async function getMemberSDOH(memberId: string): Promise<ApiResponse<SDOHProfile>> {
  const profile = mockSDOHProfiles[memberId];
  if (!profile) throw new Error(`SDOH profile for ${memberId} not found`);
  return mockApiCall({ data: profile });
}

export async function getMemberRisk(memberId: string): Promise<ApiResponse<RiskAssessment>> {
  const risk = mockRiskAssessments[memberId];
  if (!risk) throw new Error(`Risk assessment for ${memberId} not found`);
  return mockApiCall({ data: risk });
}

export async function getMemberHealthProfile(memberId: string): Promise<ApiResponse<MemberHealthProfile>> {
  const member = mockMembers.find(m => m.memberId === memberId);
  if (!member) throw new Error(`Member ${memberId} not found`);
  const profile: MemberHealthProfile = {
    memberId: member.memberId,
    primaryConditions: member.conditions,
    comorbidities: member.conditions.length > 1 ? member.conditions.slice(1) : [],
    hospitalAdmissions12m: Math.floor(member.sdohScore / 25),
    erVisits12m: Math.floor(member.sdohScore / 32),
    outpatientVisits12m: 4 + Math.floor(member.sdohScore / 15),
    medicationAdherence: member.sdohScore > 70 ? 'Poor' : member.sdohScore > 50 ? 'Moderate' : 'Good',
    utilizationTrend: member.sdohScore > 65 ? 'Increasing' : member.sdohScore > 45 ? 'Stable' : 'Decreasing',
    estimatedAnnualCost: Math.floor(8000 + member.sdohScore * 180),
  };
  return mockApiCall({ data: profile });
}
