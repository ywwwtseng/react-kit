import type { QueryParams } from './types';

export function getQueryKey(path: string, params?: QueryParams) {
  return params && Object.keys(params).length > 0
    ? JSON.stringify({ path, params })
    : path;
};