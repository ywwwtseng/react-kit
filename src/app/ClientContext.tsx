import {
  useMemo,
  useCallback,
  createContext,
  use,
  type PropsWithChildren,
} from 'react';
import { Request } from '@ywwwtseng/request';
import { type QueryParams } from './types';

export interface ClientContextState {
  query: (
    path: string,
    params?: QueryParams
  ) => Promise<unknown>;
  mutate: <TPayload>(action: string, payload: TPayload) => Promise<unknown>;
}

export const ClientContext = createContext<
  ClientContextState | undefined
>(undefined);

export interface ClientProviderProps extends PropsWithChildren {
  url: string;
  transformRequest?: (headers: Headers) => Headers;
}

export function ClientProvider({
  url,
  transformRequest,
  children,
}: ClientProviderProps) {
  const request = useMemo(
    () =>
      new Request({
        transformRequest,
      }),
    [transformRequest]
  );

  const query = useCallback(
    (path: string, params?: QueryParams) => {
      return request.post(url, { type: 'query', path, params: params ?? {} });
    },
    [request]
  );

  const mutate = useCallback(
    (action: string, payload: unknown) => {
      if (payload instanceof FormData) {
        payload.append('mutation:type', 'mutate');
        payload.append('mutation:action', action);
        return request.post(url, payload);
      }

      return request.post(url, { type: 'mutate', action, payload });
    },
    [request]
  );

  const value = useMemo(
    () => ({
      query,
      mutate,
    }),
    [query, mutate]
  );

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient(): ClientContextState {
  const context = use(ClientContext);

  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }

  return context;
}
