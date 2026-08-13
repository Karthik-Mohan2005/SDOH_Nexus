import { useState, useEffect, useCallback } from 'react';
import type { Member, MemberHealthProfile, RiskAssessment } from '../types/member';
import type { SDOHProfile } from '../types/sdoh';
import { getMemberById, getMemberSDOH, getMemberRisk, getMemberHealthProfile } from '../services/memberService';

export function useMember(memberId: string | undefined) {
  const [member, setMember] = useState<Member | null>(null);
  const [sdohProfile, setSdohProfile] = useState<SDOHProfile | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [healthProfile, setHealthProfile] = useState<MemberHealthProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemberData = useCallback(async () => {
    if (!memberId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [mRes, sdohRes, riskRes, healthRes] = await Promise.all([
        getMemberById(memberId),
        getMemberSDOH(memberId),
        getMemberRisk(memberId),
        getMemberHealthProfile(memberId),
      ]);
      setMember(mRes.data);
      setSdohProfile(sdohRes.data);
      setRiskAssessment(riskRes.data);
      setHealthProfile(healthRes.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch member detail');
    } finally {
      setIsLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchMemberData();
  }, [fetchMemberData]);

  return {
    member,
    sdohProfile,
    riskAssessment,
    healthProfile,
    isLoading,
    error,
    refetch: fetchMemberData,
  };
}
