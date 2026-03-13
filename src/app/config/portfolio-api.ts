import { environment } from '../../environments/environment';

export const PORTFOLIO_API_BASE_URL = environment.portfolioApiBaseUrl;

type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function fetchPortfolioRoute<T>(route: 'projects' | 'skills'): Promise<T[]> {
  const url = `${PORTFOLIO_API_BASE_URL}?route=${route}`;
  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApiEnvelope<T[]> | T[];
  if (Array.isArray(payload)) {
    return asArray<T>(payload);
  }

  if (payload.ok && payload.data) {
    return asArray<T>(payload.data);
  }

  return [];
}
