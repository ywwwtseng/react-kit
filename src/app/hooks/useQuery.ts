import { use, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRoute } from '../../navigation';
import { useRefValue } from '../../hooks/useRefValue';
import { useClient } from './useClient';
import { useNotify } from './useNotify';
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
  const isUnMountedRef = useRef(false);
  const notify = useNotify();
  const notifyRef = useRefValue(notify);
  const { query, loadingRef } = useClient();
  const { clear } = use(AppStateContext) as AppStateContextState;
  const route = useRoute();
  const currentRouteRef = useRef<string>(route.name);
  const key = useMemo(() => getQueryKey(path, options?.params ?? {}), [path, JSON.stringify(options?.params ?? {})]);
  const currentKeyRef = useRef<string | null>(key);
  const params = options?.params ?? {};
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
  const isLoading = useAppStateStore((store) => store.loading).includes(key);
  const data = useAppStateStore((store) => store.state[key]);

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

  useEffect(() => {
    currentKeyRef.current = key;

    return () => {
      if (options?.autoClearCache) {
        clear(key);
      }
    };
  }, [key]);

  useEffect(() => {
    return () => {
      isUnMountedRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (isUnMountedRef.current) {
      return;
    }

    if (!enabled) {
      return;
    }

    if (loadingRef.current.includes(key)) {
      return;
    }

    if (data !== undefined && refetchOnMount === false) {
      return;
    }

    if (refetchOnMount && currentRouteRef.current !== route.name) {
      return;
    }
   
    query(path, params).then(({ key, data }) => {
      if (data.notify) {
        notifyRef.current(data.notify.type, data.notify.message, data.notify.params);
      }
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
