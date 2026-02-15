import { use, useMemo, useState, useCallback, useEffect } from 'react';
import { useRoute } from '../../navigation';
import { useAppUI } from '../providers/AppUIProvider';
import {
  useAppStateStore,
  AppStateContext,
  type AppState,
  type AppStateContextState,
} from '../providers/AppStateProvider';
import { useClient } from './useClient';
import { getQueryKey } from '../utils';
import { type QueryParams } from '../types';

const getNextPageParam = <T>(lastPage: T | undefined): string | null => {
  return Array.isArray(lastPage)
    ? lastPage?.[lastPage.length - 1]?.created_at ?? null
    : null;
};

interface UseInfiniteQueryOptions {
  params: QueryParams & {
    limit: number;
  };
  refetchOnMount?: boolean;
  enabled?: boolean;
  type?: 'cursor' | 'offset';
  showLoading?: boolean;
}

export function useInfiniteQuery<T = unknown>(
  path: string,
  options: UseInfiniteQueryOptions
): {
  data: T | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
} {
  const firstQueryParams = useMemo(() => {
    const params: QueryParams = options?.params ?? {};

    if (options?.type === 'offset') {
      params.offset = 0;
    }

    return {
      path,
      params,
    };
  }, [path, JSON.stringify(options?.params ?? {})]);
  const { showLoadingUI } = useAppUI();
  const route = useRoute();
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
  const state = useAppStateStore((store) => store.state);
  const { update, queryKeysMap } = use(AppStateContext) as AppStateContextState;
  const firstQueryKey = useMemo(() => {
    return getQueryKey(firstQueryParams.path, firstQueryParams.params);
  }, [firstQueryParams]);
  const [pageKeys, setPageKeys] = useState<string[]>(queryKeysMap.get(firstQueryKey) ?? []);
  const data = useMemo(() => {
    return pageKeys.map((key) => state[key]).filter(Boolean) as T[];
  }, [pageKeys, state]);
  const { query, loadingRef } = useClient();

 

  const hasNextPage = useMemo(() => {
    const page = data[data.length - 1];

    if (Array.isArray(page)) {
      const limit = options.params?.limit;

      if (typeof limit === 'number') {
        return page.length === limit;
      }

      if (page.length === 0) {
        return false;
      }
    }

    return true;
  }, [data]);

  const fetchNextPage = useCallback(() => {
    if (!hasNextPage) {
      return;
    }

    if (!enabled) {
      return;
    }

    const params: QueryParams = options?.params ?? {};
    
    if (options?.type === 'offset') {
      params.offset = pageKeys.length * options.params.limit;
    } else {
      const cursor = getNextPageParam<T>(
        data ? data[data.length - 1] : undefined
      );
  
      if (cursor) {
        params.cursor = cursor;
      }
    }

    const queryKey = getQueryKey(path, params);

    if (loadingRef.current.some((key) => [...pageKeys, queryKey].includes(key))) {
      return;
    }

    if (!options?.refetchOnMount) {
      
    }

    const newPageKeys = [...pageKeys, queryKey];

    setPageKeys(newPageKeys);
    if (!options?.refetchOnMount) {
      queryKeysMap.set(firstQueryKey, newPageKeys);
    }

    query(path, params);
  }, [path, JSON.stringify(options), hasNextPage, enabled, data, pageKeys, firstQueryKey]);

  const isLoading = useMemo(() => {
    if (!enabled) {
      return false;
    }

    return pageKeys.length > 0
      ? state[pageKeys[pageKeys.length - 1]] === undefined
      : false;
  }, [pageKeys, state, enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!options?.refetchOnMount && queryKeysMap.get(firstQueryKey)?.length > 0) {
      return;
    }

    if (loadingRef.current.includes(firstQueryKey)) {
      return;
    }

    if (state[firstQueryKey] !== undefined && refetchOnMount === false) {
      return;
    }

    if (options?.showLoading) {
      showLoadingUI(true);
    }

    setPageKeys([firstQueryKey]);
    if (!options?.refetchOnMount) {
      queryKeysMap.set(firstQueryKey, [firstQueryKey]);
    }
    query(firstQueryParams.path, firstQueryParams.params).finally(() => {
      if (options?.showLoading) {
        showLoadingUI(false);
      }
    });

    return () => {
      if (refetchOnMount) {
        update([
          {
            type: 'update',
            payload: (draft: AppState) => {
              pageKeys.forEach((page) => {
                delete draft.state[page];
              });
            },
          },
        ]);

        setPageKeys([]);
      }
    };
  }, [firstQueryParams, firstQueryKey, enabled, route.name]);

  return {
    data: data.length > 0 ? (data.flat() as T) : undefined,
    isLoading,
    hasNextPage,
    fetchNextPage,
  };
}
