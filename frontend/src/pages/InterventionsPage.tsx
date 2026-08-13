import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { InterventionTable } from '../components/interventions/InterventionTable';
import { InterventionDetailDrawer } from '../components/interventions/InterventionDetailDrawer';
import { useInterventions } from '../hooks/useInterventions';
import type { Intervention } from '../types/intervention';
import { Card } from '../components/common/Card';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { ShieldAlert, HeartPulse, CheckCircle2, Clock } from 'lucide-react';

export const InterventionsPage: React.FC = () => {
  const {
    interventions,
    selectedIntervention,
    setSelectedIntervention,
    isLoading: _isLoading,
    error,
    updateStatus,
    assignOwner,
    updateFilters,
    filters,
    refetch,
  } = useInterventions();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelect = (item: Intervention) => {
    setSelectedIntervention(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedIntervention(null);
  };

  // KPI calculations
  const totalHighCritical = interventions.filter(i => i.priority === 'critical' || i.priority === 'high').length;
  const totalInProgress = interventions.filter(i => i.status === 'in_progress').length;
  const totalPlanned = interventions.filter(i => i.status === 'planned').length;
  const totalCompleted = interventions.filter(i => i.status === 'completed').length;

  return (
    <PageContainer>
      <PageHeader
        title="Intervention Center"
        subtitle="Prioritize, assign, and track targeted health equity interventions for members and communities."
      />

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Critical & High Priority</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalHighCritical}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">In Progress</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalInProgress}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Planned</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalPlanned}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Completed</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalCompleted}</h3>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Filter */}
          <select
            value={filters.priority || 'all'}
            onChange={e => updateFilters({ priority: e.target.value })}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical Priority</option>
            <option value="high">High Priority</option>
            <option value="moderate">Moderate Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status || 'all'}
            onChange={e => updateFilters({ status: e.target.value })}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category || 'all'}
            onChange={e => updateFilters({ category: e.target.value })}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Food Assistance">Food Assistance</option>
            <option value="Transportation">Transportation</option>
            <option value="Housing Support">Housing Support</option>
            <option value="Disease Management">Disease Management</option>
            <option value="Environmental Support">Environmental Support</option>
            <option value="Healthcare Access">Healthcare Access</option>
          </select>
        </div>

        <Button variant="ghost" size="sm" onClick={() => updateFilters({ priority: 'all', status: 'all', category: 'all' })}>
          Reset Filters
        </Button>
      </div>

      {error && <ErrorState onRetry={refetch} description={error} />}

      {/* Main Intervention Table */}
      {!error && (
        <InterventionTable
          interventions={interventions}
          onSelectIntervention={handleSelect}
          onUpdateStatus={updateStatus}
        />
      )}

      {/* Detail Drawer */}
      <InterventionDetailDrawer
        intervention={selectedIntervention}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        onUpdateStatus={updateStatus}
        onAssignOwner={assignOwner}
      />
    </PageContainer>
  );
};
