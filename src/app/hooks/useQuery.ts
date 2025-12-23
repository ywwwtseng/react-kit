import { use, useEffect, useCallback, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { useRoute } from '../../navigation';
import { useI18n } from './useI18n';
import { useClient } from './useClient';
import {
  useAppStateStore,
  AppStateContext,
  type AppStateContextState,
} from '../AppStateContext';
import { type QueryParams } from '../types';
import { getQueryKey } from '../utils';

export interface UseQueryOptions {
  params?: QueryParams;
  refetchOnMount?: boolean;
  autoClearCache?: boolean;
  enabled?: boolean;
}

export function useQuery<T = unknown>(path: string, options?: UseQueryOptions) {
  const { t } = useI18n();
  const { query, loadingRef } = useClient();
  const { clear } = use(AppStateContext) as AppStateContextState;

  const route = useRoute();
  const key = useMemo(() => getQueryKey(path, options?.params ?? {}), [path, JSON.stringify(options?.params ?? {})]);
  const currentKeyRef = useRef<string | null>(key);
  const params = options?.params ?? {};
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
  const isLoading = useAppStateStore((store) => store.loading).includes(key);
  const data = useAppStateStore((store) => store.state[key]);

  useEffect(() => {
    currentKeyRef.current = key;

    return () => {
      if (options?.autoClearCache) {
        clear(key);
      }
    };
  }, [key]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (loadingRef.current.includes(key)) {
      return;
    }

    if (data !== undefined && refetchOnMount === false) {
      return;
    }
   
    query(path, params, {
      onNotify: (notify) => {
        (toast[notify.type] || toast)?.(t?.(notify.message) ?? notify.message);
      },
    }).then(({ key }) => {
      if (options?.autoClearCache && key !== currentKeyRef.current) {
        clear(key);
      }
    });
  }, [key, enabled, route.name]);

  const refetch = useCallback(() => {
    if (!enabled) {
      return;
    }

    if (loadingRef.current.includes(key)) {
      return;
    }
   
    query(path, params).then(({ key }) => {
      if (options?.autoClearCache && key !== currentKeyRef.current) {
        clear(key);
      }
    });
  }, [key, enabled, route.name]);

  return {
    refetch,
    isLoading,
    data: data as T | undefined,
  };
}
