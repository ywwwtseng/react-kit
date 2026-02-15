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
  const { showLoadingUI } = useAppUI();
  const route = useRoute();
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
  const state = useAppStateStore((store) => store.state);
  const [pageKeys, setPageKeys] = useState<string[]>([]);
  const data = useMemo(() => {
    return pageKeys.map((key) => state[key]).filter(Boolean) as T[];
  }, [pageKeys, state]);

  const { update } = use(AppStateContext) as AppStateContextState;
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

    const params: QueryParams = options?.params ?? {};

    if (!enabled) {
      return;
    }

    
    if (options?.type === 'offset') {
      params.offset = pageKeys.length * options.params.limit;
    } else {
      if (options?.type === 'cursor') {
        const cursor = getNextPageParam<T>(
          data ? data[data.length - 1] : undefined
        );
    
        if (cursor) {
          params.cursor = cursor;
        }
      }
    }

   


    const queryKey = getQueryKey(path, params);

    if (loadingRef.current.some((key) => [...pageKeys, queryKey].includes(key))) {
      return;
    }

    setPageKeys([...pageKeys, queryKey]);

    query(path, params);
  }, [path, JSON.stringify(options), hasNextPage, enabled, data, pageKeys]);

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

    const params: QueryParams = options?.params ?? {};

    if (options?.type === 'offset') {
      params.offset = 0;
    }

    const queryKey = getQueryKey(path, params);

    if (loadingRef.current.includes(queryKey)) {
      return;
    }

    if (state[queryKey] !== undefined && refetchOnMount === false) {
      return;
    }

    if (options?.showLoading) {
      showLoadingUI(true);
    }

    setPageKeys((pageKeys) => [...pageKeys, queryKey]);
    query(path, params).finally(() => {
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
  }, [path, JSON.stringify(options), enabled, route.name]);

  return {
    data: data.length > 0 ? (data.flat() as T) : undefined,
    isLoading,
    hasNextPage,
    fetchNextPage,
  };
}
