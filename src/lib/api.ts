import { getAuthHeaders } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getOverview() {
  return request<{ totalAnimals: number; sehat: number; stokKritis: number; totalProduksi: number }>('/api/overview');
}

export async function getAnimals() {
  return request<Array<Record<string, unknown>>>('/api/animals');
}

export async function getHealthChecks() {
  return request<Array<Record<string, unknown>>>('/api/health-checks');
}

export async function getFeedStock() {
  return request<Array<Record<string, unknown>>>('/api/feed-stock');
}

export async function getProduction() {
  return request<Array<Record<string, unknown>>>('/api/production');
}

export async function createAnimal(payload: Record<string, unknown>) {
  return request<Record<string, unknown>>('/api/animals', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAnimal(id: string, payload: Record<string, unknown>) {
  return request<Record<string, unknown>>(`/api/animals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteAnimal(id: string) {
  return request<{ ok: boolean }>(`/api/animals/${id}`, {
    method: 'DELETE',
  });
}

export async function createFeedStock(payload: Record<string, unknown>) {
  return request<Record<string, unknown>>('/api/feed-stock', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createProduction(payload: Record<string, unknown>) {
  return request<Record<string, unknown>>('/api/production', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
