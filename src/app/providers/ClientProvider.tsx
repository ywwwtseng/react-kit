import { AppError } from '@ywwwtseng/ywjs';
import {
  RefObject,
  useRef,
  useMemo,
  useCallback,
  createContext,
  type PropsWithChildren,
} from 'react';
import { Request } from '@ywwwtseng/request';
import { useNavigate } from '../../navigation';
import { useAppStateStore, type AppState } from './AppStateProvider';
import type { QueryParams, ResponseData, Notify } from '../types';
import { getQueryKey } from '../utils';

export interface ClientContextState {
  loadingRef: RefObject<string[]>;
  query: (
    path: string,
    params?: QueryParams,
  ) => Promise<{ key: string; data: ResponseData }>;
  mutate: (action: string, payload?: unknown) => Promise<{ data: ResponseData }>;
}

export const ClientContext = createContext<
  ClientContextState | undefined
>(undefined);

export interface ClientProviderProps extends PropsWithChildren {
  url: string;
  transformRequest?: (headers: Headers) => Headers;
  onError?: (error: AppError) => void;
}

export function ClientProvider({
  url,
  transformRequest,
  onError,
  children,
}: ClientProviderProps) {
  const loadingRef = useRef<string[]>([]);
  const navigate = useNavigate();
  const { update } = useAppStateStore();
  const request = useMemo(
    () =>
      new Request({
        transformRequest,
      }),
    [transformRequest]
  );

  const query = useCallback(
    async (
      path: string,
      params?: QueryParams,
      options?: {
        onNotify?: (notify: Notify) => void;
      }
    ) => {
      const key = getQueryKey(path, params);

      loadingRef.current.push(key);
      update([
        {
          type: 'update',
          target: 'loading',
          payload: (draft: AppState) => {
            draft.loading.push(key);
          },
        },
      ]);

      try {
        const data = await request.post<ResponseData>(url, { type: 'query', path, params: params ?? {} });

        if (data.commands) {
          update(data.commands);
        }

        if (data.error) {
          throw new AppError(data.error, data.message ?? 'Unknown error');
        }

        

        if (data.navigate) {
          navigate(data.navigate.screen, {
            type: 'replace',
            params: data.navigate.params,
          });
        }

        if (data.notify) {
          options?.onNotify?.(data.notify);
        }

        return { key, data };
      } catch (error) {
        onError?.(error);
        throw error;
      } finally {
        loadingRef.current = loadingRef.current.filter((k) => k !== key);

        update([
          {
            type: 'update',
            target: 'loading',
            payload: (draft: AppState) => {
              draft.loading = draft.loading.filter((k) => k !== key);
            },
          },
        ]);
      }
    },
    [request]
  );

  const mutate = useCallback(
    async (action: string, payload?: unknown) => {
      try {
        let data: ResponseData;
        if (payload instanceof FormData) {
          payload.append('mutation:type', 'mutate');
          payload.append('mutation:action', action);
          data = await request.post(url, payload);
        } else {
          data = await request.post(url, { type: 'mutate', action, payload });
        }

        if (data.error) {
          throw new AppError(data.error, data.message ?? 'Unknown error');
        }

        if (data.commands) {
          update(data.commands);
        }

        if (data.navigate) {
          navigate(data.navigate.screen, {
            type: 'replace',
            params: data.navigate.params,
          });
        }

        return { data };
      } catch (error) {
        onError?.(error);
        throw error;
      }
    },
    [request]
  );

  const value = useMemo(
    () => ({
      query,
      mutate,
      loadingRef
    }),
    [query, mutate, loadingRef]
  );

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
}
