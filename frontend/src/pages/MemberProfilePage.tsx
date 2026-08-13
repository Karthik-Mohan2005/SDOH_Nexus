import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { MemberHeader } from '../components/member-profile/MemberHeader';
import { OverallRiskCard } from '../components/member-profile/OverallRiskCard';
import { HealthProfileCard } from '../components/member-profile/HealthProfileCard';
import { SDOHFactorCard } from '../components/member-profile/SDOHFactorCard';
import { RiskFactorExplanation } from '../components/member-profile/RiskFactorExplanation';
import { OutcomePredictionCard } from '../components/member-profile/OutcomePredictionCard';
import { InterventionRecommendationCard } from '../components/member-profile/InterventionRecommendationCard';
import { CommunityContextCard } from '../components/member-profile/CommunityContextCard';
import { useMember } from '../hooks/useMember';
import { SkeletonCard } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';

export const MemberProfilePage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { member, sdohProfile, riskAssessment, healthProfile, isLoading, error, refetch } = useMember(memberId);

  if (error) {
    return (
      <PageContainer>
        <ErrorState onRetry={refetch} description={error} />
      </PageContainer>
    );
  }

  if (isLoading || !member || !sdohProfile || !riskAssessment || !healthProfile) {
    return (
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard className="md:col-span-1" />
          <SkeletonCard className="md:col-span-2" />
          <SkeletonCard className="md:col-span-3" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Top Profile Header */}
      <MemberHeader member={member} />

      {/* Row 1: Overall Composite Score & Health Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <OverallRiskCard risk={riskAssessment} />
        </div>
        <div className="lg:col-span-2">
          <HealthProfileCard health={healthProfile} />
        </div>
      </div>

      {/* Row 2: SDOH Domain Breakdown & Explainable Risk Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SDOHFactorCard sdoh={sdohProfile} />
        <RiskFactorExplanation risk={riskAssessment} />
      </div>

      {/* Row 3: Health Outcome Predictions & Targeted Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <OutcomePredictionCard risk={riskAssessment} />
        </div>
        <div className="lg:col-span-1">
          <InterventionRecommendationCard memberId={member.memberId} />
        </div>
        <div className="lg:col-span-1">
          <CommunityContextCard member={member} />
        </div>
      </div>
    </PageContainer>
  );
};
