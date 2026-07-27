import { getAuthHeaders } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthHeaders() as Record<string, string>),
      ...(init?.headers as Record<string, string> || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getOverview() {
  return request<{ totalAnimals: number; sehat: number; stokKritis: number; totalProduksi: number }>('/overview');
}

export async function getAnimals() {
  return request<Array<Record<string, unknown>>>('/animals');
}

export async function getHealthChecks() {
  return request<Array<Record<string, unknown>>>('/health-checks');
}

export async function getFeedStock() {
  return request<Array<Record<string, unknown>>>('/feed-stock');
}

export async function getProduction() {
  return request<Array<Record<string, unknown>>>('/production');
}

export async function createAnimal(payload: Record<string, unknown>) {
  return request<Record<string, unknown>>('/animals', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAnimal(id: string, payload: Record<string, unknown>) {
  return request<Record<string, unknown>>(`/animals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteAnimal(id: string) {
  return request<{ ok: boolean }>(`/animals/${id}`, {
    method: 'DELETE',
  });
}

export async function createFeedStock(payload: Record<string, unknown>) {
  return request<Record<string, unknown>>('/feed-stock', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createProduction(payload: Record<string, unknown>) {
  return request<Record<string, unknown>>('/production', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createHealthCheck(payload: Record<string, unknown>) {
  return request<Record<string, unknown>>('/health-checks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
