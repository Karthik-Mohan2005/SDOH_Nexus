import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Member, MemberFilters } from '../types/member';
import type { PaginationMeta } from '../types/common';
import { getMembers } from '../services/memberService';
import type { GetMembersOptions } from '../services/memberService';

export function useMembers(
  initialFilters?: Partial<MemberFilters>,
  initialPage = 1,
  initialPageSize = 10,
) {
  const [searchParams] = useSearchParams();

  const urlRisk = searchParams.get('risk');
  const normalizedRisk = urlRisk?.toLowerCase();

  /*
   * URL values:
   *   low
   *   medium
   *   high
   *
   * Internal frontend values:
   *   low
   *   moderate
   *   high
   */
  const urlRiskLevel: MemberFilters['riskLevel'] =
    normalizedRisk === 'low'
      ? 'low'
      : normalizedRisk === 'medium' ||
          normalizedRisk === 'moderate'
        ? 'moderate'
        : normalizedRisk === 'high'
          ? 'high'
          : 'all';

  const initialUrlFilters: Partial<MemberFilters> = {
    ...(initialFilters || {}),
    ...(normalizedRisk
      ? {
          riskLevel: urlRiskLevel,
        }
      : {}),
  };

  const [members, setMembers] = useState<Member[]>([]);

  const [pagination, setPagination] = useState<PaginationMeta>({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] =
    useState<Partial<MemberFilters>>(initialUrlFilters);

  const fetchMembers = useCallback(
    async (opts?: GetMembersOptions) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getMembers({
          page: opts?.page ?? pagination.page,
          pageSize: opts?.pageSize ?? pagination.pageSize,
          filters: opts?.filters ?? filters,
        });

        setMembers(response.data);
        setPagination(response.pagination);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch members',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.page, pagination.pageSize, filters],
  );

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const updateFilters = useCallback(
    (newFilters: Partial<MemberFilters>) => {
      setFilters(prev => ({
        ...prev,
        ...newFilters,
      }));

      setPagination(prev => ({
        ...prev,
        page: 1,
      }));
    },
    [],
  );

  const changePage = useCallback((newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      page: 1,
    }));
  }, []);

  return {
    members,
    pagination,
    isLoading,
    error,
    filters,
    updateFilters,
    changePage,
    changePageSize,
    refetch: fetchMembers,
  };
}