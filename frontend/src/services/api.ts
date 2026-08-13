// Base API configuration
// Future: Replace with real REST/FHIR endpoints
export const API_BASE_URL = '/api';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  // Future: 'Authorization': `Bearer ${token}`
};

// Simulate network delay for realistic UX
export function simulateDelay(min = 300, max = 700): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Generic API response wrapper
export async function mockApiCall<T>(data: T): Promise<T> {
  await simulateDelay();
  return data;
}

// Error simulation (for development)
export function shouldSimulateError(): boolean {
  return false; // Set to true to test error states
}
