import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { MemberFilters } from '../components/members/MemberFilters';
import { MemberTable } from '../components/members/MemberTable';
import { AddNewMemberModal, type NewMemberFormData } from '../components/members/AddNewMemberModal';
import { useMembers } from '../hooks/useMembers';
import { createMember } from '../services/memberService';
import { SkeletonTableRow } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { Download, UserPlus } from 'lucide-react';
import { exportToCSV, membersToCSVData } from '../utils/csv';
import {
  getCommunities,
} from '../services/communityService';

import type { Community } from '../types/community';

export const MembersPage: React.FC = () => {

const {
  members,
  pagination,
  isLoading,
  error,
  filters,
  updateFilters,
  changePage,
  changePageSize,
  refetch,
} = useMembers();

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
useEffect(() => {
  const loadCommunities = async () => {
    setIsLoadingCommunities(true);

    try {
      const response = await getCommunities();
      setCommunities(response.data);
    } catch (error) {
      console.error('Failed to load communities:', error);
    } finally {
      setIsLoadingCommunities(false);
    }
  };

  loadCommunities();
}, []);
  const handleResetFilters = () => {
    updateFilters({
      search: '',
      riskLevel: 'all',
      condition: 'all',
      sdohFactor: 'all',
      community: 'all',
    });
  };

  const handleExportCSV = () => {
    const csvData = membersToCSVData(members as unknown as Record<string, unknown>[]);
    exportToCSV(csvData, 'SDOH_Nexus_Members_Directory');
  };

  const handleAddMember = async (formData: NewMemberFormData) => {
  setIsAddingMember(true);

  try {
    await createMember(formData);

    // Reload members from the real backend.
    await refetch();

    setIsAddMemberModalOpen(false);
  } catch (error) {
    console.error('Error adding member:', error);

    throw error;
  } finally {
    setIsAddingMember(false);
  }
};
  return (
    <PageContainer>
      <PageHeader
        title="Members Directory"
        subtitle="Member-level health profiles enriched with community SDOH risk factors."
        actions={
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAddMemberModalOpen(true)}
              size="sm" 
              icon={<UserPlus className="h-4 w-4" />}
            >
              Add New Member
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              icon={<Download className="h-4 w-4" />} 
              onClick={handleExportCSV}
            >
              Export Members CSV
            </Button>
          </div>
        }
      />

      {/* Add New Member Modal */}
      <AddNewMemberModal
  isOpen={isAddMemberModalOpen}
  onClose={() => setIsAddMemberModalOpen(false)}
  onSubmit={handleAddMember}
  communities={communities}
  isLoading={isAddingMember || isLoadingCommunities}
/>

      {/* Filter Controls */}
      <MemberFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={handleResetFilters}
      />

      {/* Error State */}
      {error && <ErrorState onRetry={refetch} description={error} />}

      {/* Loading Skeleton */}
      {isLoading && !error && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-4">
          <table className="w-full">
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonTableRow key={i} cols={8} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && members.length === 0 && (
        <EmptyState
          title="No members match your criteria"
          description="Try adjusting your risk level, condition, or search term filters."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* Main Table */}
      {!isLoading && !error && members.length > 0 && (
        <MemberTable
          members={members}
          pagination={pagination}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
        />
      )}
    </PageContainer>
  );
};
