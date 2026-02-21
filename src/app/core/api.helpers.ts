import { ApiEnvelope, PageResponse } from './models';

export function extractData<T>(payload: ApiEnvelope<T> | T): T {
  if (isApiEnvelope<T>(payload) && payload.data !== undefined) {
    return payload.data;
  }
  return payload as T;
}

export function extractList<T>(payload: ApiEnvelope<PageResponse<T> | T[]> | PageResponse<T> | T[]): T[] {
  const data = extractData<PageResponse<T> | T[]>(payload);
  return Array.isArray(data) ? data : data.content;
}

function isApiEnvelope<T>(value: ApiEnvelope<T> | T): value is ApiEnvelope<T> {
  return typeof value === 'object' && value !== null && 'data' in value;
}
