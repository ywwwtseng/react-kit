import { use, useEffect, useCallback, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { useRoute } from '../../navigation';
import {
  useStore,
  StoreContext,
  getQueryKey,
} from '../StoreContext';
import { type QueryParams } from '../types';

interface UseQueryOptions {
  params?: QueryParams;
  refetchOnMount?: boolean;
  autoClearCache?: boolean;
  enabled?: boolean;
  t?: (key: string) => string;
}

export function useQuery<T = unknown>(path: string, options?: UseQueryOptions) {
  const context = use(StoreContext);

  if (!context) {
    throw new Error('useQuery must be used within a StoreProvider');
  }
  const { query, clearData, loadingRef } = context;
  const route = useRoute();
  const key = useMemo(() => getQueryKey(path, options?.params ?? {}), [path, JSON.stringify(options?.params ?? {})]);
  const currentKeyRef = useRef<string | null>(key);
  const params = options?.params ?? {};
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
  const isLoading = useStore((store) => store.loading).includes(key);
  const data = useStore((store) => store.state[key]);

  useEffect(() => {
    currentKeyRef.current = key;

    return () => {
      if (options?.autoClearCache) {
        clearData(key);
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
        (toast[notify.type] || toast)?.(options?.t?.(notify.message) ?? notify.message);
      },
    }).then(({ key }) => {
      if (options?.autoClearCache && key !== currentKeyRef.current) {
        clearData(key);
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
        clearData(key);
      }
    });
  }, [key, enabled, route.name]);

  return {
    refetch,
    isLoading,
    data: data as T | undefined,
  };
}
