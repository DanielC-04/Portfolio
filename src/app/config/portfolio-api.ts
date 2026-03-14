import { environment } from '../../environments/environment';

export const PORTFOLIO_API_BASE_URL = environment.portfolioApiBaseUrl;

type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
  message?: string;
  error?: string;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function fetchPortfolioRoute<T>(route: 'projects' | 'skills' | 'experience' | 'testimonials'): Promise<T[]> {
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

export async function postPortfolioRoute<T>(route: 'testimonials', body: unknown): Promise<T> {
  const url = `${PORTFOLIO_API_BASE_URL}?route=${route}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApiEnvelope<T> | T;
  if (Array.isArray(payload)) {
    return payload as T;
  }

  if (typeof payload === 'object' && payload !== null && 'ok' in payload) {
    const envelope = payload as ApiEnvelope<T>;
    if (envelope.ok === false) {
      throw new Error(envelope.error || 'API rejected request');
    }

    if (envelope.data !== undefined) {
      return envelope.data;
    }

    return payload as T;
  }

  return payload as T;
}
