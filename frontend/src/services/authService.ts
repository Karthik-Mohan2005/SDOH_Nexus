import { mockApiCall } from './api';
import type { User } from '../types/common';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const DEMO_USER: User = {
  id: 'U001',
  name: 'Dr. Sarah Mitchell',
  email: 'admin@sdohnexus.demo',
  role: 'Population Health Analyst',
  organization: 'SDOH Nexus Health System',
  avatarInitials: 'SM',
};

const DEMO_CREDENTIALS = {
  email: 'admin@sdohnexus.demo',
  password: 'demo123',
};

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  await mockApiCall(null);
  if (
    credentials.email.toLowerCase() === DEMO_CREDENTIALS.email &&
    credentials.password === DEMO_CREDENTIALS.password
  ) {
    const token = 'mock-jwt-token-sdoh-nexus-demo';
    localStorage.setItem('sdoh_token', token);
    localStorage.setItem('sdoh_user', JSON.stringify(DEMO_USER));
    return { user: DEMO_USER, token };
  }
  throw new Error('Invalid credentials. Use admin@sdohnexus.demo / demo123');
}

export function logout(): void {
  localStorage.removeItem('sdoh_token');
  localStorage.removeItem('sdoh_user');
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem('sdoh_user');
  return stored ? JSON.parse(stored) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('sdoh_token');
}
