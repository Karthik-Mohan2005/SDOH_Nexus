export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type InterventionPriority = 'critical' | 'high' | 'moderate' | 'low';

export type InterventionStatus = 'not_started' | 'planned' | 'in_progress' | 'completed';

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'syncing';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarInitials: string;
}

export interface Notification {
  id: string;
  type: 'risk' | 'integration' | 'intervention' | 'system';
  title: string;
  description?: string;
  time: string;
  read: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}
