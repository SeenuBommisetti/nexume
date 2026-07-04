const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export async function checkBackendHealth(): Promise<HealthResponse> {
  // We can fetch from either the root /health or /api/v1/health.
  // The user explicitly requested api/v1/health, so we will use that.
  const response = await fetch(`${API_BASE_URL}/api/v1/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return response.json();
}
