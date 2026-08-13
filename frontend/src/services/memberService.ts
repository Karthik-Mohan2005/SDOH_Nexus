import api from './api';
import type {
  Member,
  MemberHealthProfile,
  RiskAssessment,
  MemberFilters,
} from '../types/member';
import type { SDOHProfile } from '../types/sdoh';
import type { ApiResponse, PaginationMeta } from '../types/common';

export interface BackendMember {
  Patient_ID: string;
  Age: number;
  Age_Group: string;
  Gender: string;
  Race: string;
  Ethnicity: string;
  Marital_Status: string;
  State: string;
  ZIP: number;
  FIPS: number;
  Latitude: number;
  Longitude: number;

  Income: number;
  Healthcare_Coverage: number;
  Healthcare_Expenses: number;

  Diabetes: number;
  Prediabetes: number;
  Hypertension: number;
  Heart_Disease: number;
  COPD: number;
  Asthma: number;
  Kidney_Disease: number;
  Cancer: number;
  Obesity: number;
  Depression: number;
  Anxiety: number;
  Chronic_Pain: number;
  Comorbidity_Count: number;

  Total_Encounters: number;
  Total_Healthcare_Cost: number;
  Total_Payer_Coverage: number;
  Inpatient_Visits: number;
  Emergency_Visits: number;
  Outpatient_Visits: number;
  Ambulatory_Visits: number;
  UrgentCare_Visits: number;
  Wellness_Visits: number;
  SNF_Visits: number;
  Hospice_Visits: number;
  Virtual_Visits: number;

  Medication_Count: number;
  Medication_Record_Count: number;
  Total_Dispenses: number;
  Medication_Total_Cost: number;
  Medication_Payer_Coverage: number;

  BMI: number;
  BMI_Category: string;
  Systolic_BP: number;
  Diastolic_BP: number;
  Heart_Rate: number;
  Respiratory_Rate: number;
  Glucose: number;
  HbA1c: number;
  Creatinine: number;
  eGFR: number;

  Procedure_Count: number;
  Distinct_Procedure_Count: number;
  Claim_Count: number;
  Distinct_Diagnosis_Count: number;

  STANDARD_FIPS: number;

  RPL_THEME1: number;
  RPL_THEME2: number;
  RPL_THEME3: number;
  RPL_THEME4: number;
  RPL_THEMES: number;

  EP_POV150: number;
  EP_UNEMP: number;
  EP_UNINSUR: number;
  EP_NOHSDP: number;
  EP_DISABL: number;
  EP_MINRTY: number;
  EP_NOVEH: number;

  EPA_PM25: number;
  EPA_OZONE: number;
  EPA_DIESEL_PM: number;
  EPA_CANCER_RISK: number;
  EPA_RESP_HAZARD: number;
  EPA_TRAFFIC_PROXIMITY: number;
  EPA_MINORITY_PCT: number;
  EPA_LOWINCOME_PCT: number;
  EPA_UNEMPLOYMENT_PCT: number;
  EPA_LINGUISTIC_ISOLATION_PCT: number;
  EPA_LESS_HS_PCT: number;
  EPA_OVER64_PCT: number;
  EPA_PM25_PERCENTILE: number;
  EPA_OZONE_PERCENTILE: number;
  EPA_CANCER_PERCENTILE: number;

  FOOD_STATE: string;
  FOOD_COUNTY: string;
  FOOD_CHILD_POVERTY_RATE21: number;
  FOOD_CHILD_FOOD_INSECURITY_20_23: number;
  FOOD_CONVENIENCE_PER_1000: number;
  FOOD_DEEP_POVERTY_RATE21: number;
  FOOD_FASTFOOD_PER_1000: number;
  FOOD_FOOD_INSECURITY_21_23: number;
  FOOD_FULLSERVICE_PER_1000: number;
  FOOD_GROCERY_PER_1000: number;
  FOOD_LACCESS_CHILD19: number;
  FOOD_LACCESS_LOWINCOME19: number;
  FOOD_LACCESS_POP19: number;
  FOOD_LACCESS_SENIORS19: number;
  FOOD_LACCESS_SNAP19: number;
  FOOD_MEDIAN_HH_INCOME21: number;
  FOOD_PCT_DIABETES_ADULTS19: number;
  FOOD_PCT_PHYSICALLY_ACTIVE21: number;
  FOOD_PCT_LACCESS_CHILD19: number;
  FOOD_PCT_LACCESS_LOWINCOME19: number;
  FOOD_PCT_LACCESS_POP19: number;
  FOOD_PCT_LACCESS_SENIORS19: number;
  FOOD_PCT_SNAP22: number;
  FOOD_SNAP_STORES_PER_1000: number;
  FOOD_SUPERMARKET_PER_1000: number;

  Risk_Probability: number;
  Risk_Category: 'Low' | 'Medium' | 'High';
}

interface MembersApiResponse {
  count: number;
  data: BackendMember[];
}

export interface GetMembersOptions {
  page?: number;
  pageSize?: number;
  filters?: Partial<MemberFilters>;
}

export interface GetMembersResponse {
  data: Member[];
  pagination: PaginationMeta;
}


function mapRiskLevel(
  category: BackendMember['Risk_Category'],
): Member['riskLevel'] {
  switch (category) {
    case 'High':
      return 'high';
    case 'Medium':
      return 'moderate';
    default:
      return 'low';
  }
}

function getConditions(member: BackendMember): string[] {
  const conditions: string[] = [];

  if (member.Diabetes) conditions.push('Diabetes');
  if (member.Hypertension) conditions.push('Hypertension');
  if (member.COPD) conditions.push('COPD');
  if (member.Asthma) conditions.push('Asthma');
  if (member.Heart_Disease) conditions.push('Heart Disease');
  if (member.Obesity) conditions.push('Obesity');
  if (member.Kidney_Disease) conditions.push('Chronic Kidney Disease');
  if (member.Cancer) conditions.push('Cancer');
  if (member.Depression) conditions.push('Depression');
  if (member.Anxiety) conditions.push('Anxiety');
  if (member.Chronic_Pain) conditions.push('Chronic Pain');

  return conditions;
}

function getPrimaryCondition(member: BackendMember): string {
  const conditions = getConditions(member);
  return conditions[0] ?? 'No recorded condition';
}

function mapBackendMember(member: BackendMember): Member {
  const conditions = getConditions(member);

  return {
    memberId: member.Patient_ID,
    age: member.Age,
    sex:
      member.Gender === 'M'
        ? 'Male'
        : member.Gender === 'F'
          ? 'Female'
          : 'Other',

    communityId: String(member.STANDARD_FIPS || member.FIPS),
    communityName: member.FOOD_COUNTY
      ? `${member.FOOD_COUNTY}, ${member.State}`
      : member.State,

    zipCode: String(member.ZIP),
    censusTract: String(member.STANDARD_FIPS || member.FIPS),

    primaryCondition: getPrimaryCondition(member),
    conditions,

    enrollmentStatus: 'Active',

    // CDC SVI overall percentile/rank represented as a 0–100 score.
    sdohScore: Number((member.RPL_THEMES * 100).toFixed(1)),

    riskLevel: mapRiskLevel(member.Risk_Category),

    hospitalizationRisk: Number(
      (member.Risk_Probability * 100).toFixed(1),
    ),

    edRisk: 0,
    diseaseControlRisk: 0,
    careGapRisk: 0,

    lastUpdated: new Date().toISOString(),
  };
}

function applyClientFilters(
  members: Member[],
  filters: Partial<MemberFilters> | undefined,
): Member[] {
  if (!filters) return members;

  let filtered = [...members];

  if (filters.search) {
    const search = filters.search.toLowerCase().trim();

    filtered = filtered.filter(member =>
      member.memberId.toLowerCase().includes(search) ||
      member.communityName.toLowerCase().includes(search) ||
      member.zipCode.toLowerCase().includes(search) ||
      member.primaryCondition.toLowerCase().includes(search),
    );
  }

  if (filters.riskLevel && filters.riskLevel !== 'all') {
    filtered = filtered.filter(
      member => member.riskLevel === filters.riskLevel,
    );
  }

  if (filters.condition && filters.condition !== 'all') {
    filtered = filtered.filter(member =>
      member.conditions.includes(filters.condition!),
    );
  }

  if (filters.community && filters.community !== 'all') {
    filtered = filtered.filter(
      member => member.communityId === filters.community,
    );
  }

  if (filters.minAge != null) {
    filtered = filtered.filter(member => member.age >= filters.minAge!);
  }

  if (filters.maxAge != null) {
    filtered = filtered.filter(member => member.age <= filters.maxAge!);
  }

  if (filters.sdohFactor && filters.sdohFactor !== 'all') {
    // SDOH factor filtering will be connected to the real SDOH fields
    // when the member profile/data adapter is completed.
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy!];
      const bValue = b[filters.sortBy!];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return filters.sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }

  return filtered;
}

export async function getMembers(
  options: GetMembersOptions = {},
): Promise<GetMembersResponse> {
  const {
    page = 1,
    pageSize = 10,
    filters,
  } = options;

  const response = await api.get<MembersApiResponse>('/api/members', {
    params: {
      ...(filters?.search ? { search: filters.search } : {}),
      ...(filters?.riskLevel && filters.riskLevel !== 'all'
        ? {
            risk:
              filters.riskLevel === 'moderate'
                ? 'Medium'
                : filters.riskLevel === 'high'
                  ? 'High'
                  : 'Low',
          }
        : {}),
    },
  });

  const mappedMembers = response.data.data.map(mapBackendMember);

  const filtered = applyClientFilters(mappedMembers, filters);

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);

  const safePage =
    totalPages === 0 ? 1 : Math.min(page, totalPages);

  const start = (safePage - 1) * pageSize;

  return {
    data: filtered.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
    },
  };
}

export async function getMemberById(
  memberId: string,
): Promise<ApiResponse<Member>> {
  const response = await api.get<{ data: BackendMember }>(
    `/api/members/${encodeURIComponent(memberId)}`,
  );

  return {
    data: mapBackendMember(response.data.data),
  };
}

export async function getMemberSDOH(
  memberId: string,
): Promise<ApiResponse<SDOHProfile>> {
  const response = await api.get(
    `/api/members/${encodeURIComponent(memberId)}/profile`,
  );

  const data = response.data.data;

  return {
    data: {
      memberId,
      overallScore: Number((data.sdoh?.svi?.overall * 100).toFixed(1)),
      factors: {
        poverty: data.sdoh?.poverty ?? 0,
        unemployment: data.sdoh?.unemployment ?? 0,
        uninsured: data.sdoh?.uninsured ?? 0,
        disability: data.sdoh?.disability ?? 0,
        minority: data.sdoh?.minority ?? 0,
        noHighSchoolDiploma: data.sdoh?.noHighSchoolDiploma ?? 0,
        noVehicle: data.sdoh?.noVehicle ?? 0,
      },
    } as unknown as SDOHProfile,
  };
}

export async function getMemberRisk(
  memberId: string,
): Promise<ApiResponse<RiskAssessment>> {
  const response = await api.get(
    `/api/members/${encodeURIComponent(memberId)}/profile`,
  );

  const risk = response.data.data.risk;

  return {
    data: {
      memberId,
      overallSdohScore: Number(
        (response.data.data.sdoh?.svi?.overall * 100).toFixed(1),
      ),
      riskLevel:
        risk.category === 'High'
          ? 'high'
          : risk.category === 'Medium'
            ? 'moderate'
            : 'low',
      hospitalizationRisk: Number(
        (risk.probability * 100).toFixed(1),
      ),
      edRisk: 0,
      diseaseControlRisk: 0,
      careGapRisk: 0,
      confidence: 0,
      primaryRiskFactors: [],
      assessedAt: new Date().toISOString(),
    },
  };
}

export async function getMemberHealthProfile(
  memberId: string,
): Promise<ApiResponse<MemberHealthProfile>> {
  const response = await api.get<{ data: BackendMember }>(
    `/api/members/${encodeURIComponent(memberId)}`,
  );

  const member = response.data.data;
  const conditions = getConditions(member);

  return {
    data: {
      memberId: member.Patient_ID,
      primaryConditions: conditions,
      comorbidities: conditions.slice(1),
      hospitalAdmissions12m: member.Inpatient_Visits,
      erVisits12m: member.Emergency_Visits,
      outpatientVisits12m: member.Outpatient_Visits,
      medicationAdherence: 'Moderate',
      utilizationTrend: 'Stable',
      estimatedAnnualCost: member.Total_Healthcare_Cost,
    },
  };
}