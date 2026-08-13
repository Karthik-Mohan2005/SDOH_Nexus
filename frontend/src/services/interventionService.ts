import { mockApiCall } from './api';
import { mockInterventions } from '../data/interventions';
import type { Intervention } from '../types/intervention';
import type { ApiResponse, InterventionStatus } from '../types/common';

// In-memory state for intervention updates
let interventionsState = [...mockInterventions];

export interface GetInterventionsOptions {
  priority?: string;
  status?: string;
  category?: string;
  targetType?: string;
  communityId?: string;
}

export async function getInterventions(options: GetInterventionsOptions = {}): Promise<ApiResponse<Intervention[]>> {
  let filtered = [...interventionsState];
  if (options.priority && options.priority !== 'all') {
    filtered = filtered.filter(i => i.priority === options.priority);
  }
  if (options.status && options.status !== 'all') {
    filtered = filtered.filter(i => i.status === options.status);
  }
  if (options.category && options.category !== 'all') {
    filtered = filtered.filter(i => i.category === options.category);
  }
  if (options.targetType && options.targetType !== 'all') {
    filtered = filtered.filter(i => i.targetType === options.targetType);
  }
  if (options.communityId) {
    filtered = filtered.filter(i => i.targetId === options.communityId);
  }
  return mockApiCall({ data: filtered });
}

export async function getInterventionById(id: string): Promise<ApiResponse<Intervention>> {
  const intervention = interventionsState.find(i => i.id === id);
  if (!intervention) throw new Error(`Intervention ${id} not found`);
  return mockApiCall({ data: intervention });
}

export async function updateInterventionStatus(id: string, status: InterventionStatus): Promise<ApiResponse<Intervention>> {
  const idx = interventionsState.findIndex(i => i.id === id);
  if (idx === -1) throw new Error(`Intervention ${id} not found`);
  interventionsState[idx] = {
    ...interventionsState[idx],
    status,
    lastUpdated: new Date().toISOString(),
  };
  return mockApiCall({ data: interventionsState[idx] });
}

export async function assignIntervention(id: string, owner: string): Promise<ApiResponse<Intervention>> {
  const idx = interventionsState.findIndex(i => i.id === id);
  if (idx === -1) throw new Error(`Intervention ${id} not found`);
  interventionsState[idx] = {
    ...interventionsState[idx],
    owner,
    lastUpdated: new Date().toISOString(),
  };
  return mockApiCall({ data: interventionsState[idx] });
}
