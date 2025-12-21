import {
  RefObject,
  createContext,
  useRef,
  useCallback,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { create } from 'zustand';
import { produce } from 'immer';
import { merge } from '@ywwwtseng/ywjs';
import { useNavigate } from '../navigation';
import { useClient } from './ClientContext';
import { type QueryParams } from './types';


export interface StoreContextState {
  query: (
    path: string,
    params: QueryParams,
    options?: { onNotify?: (notify: Notify) => void }
  ) => Promise<{ key: string; data: ResponseData }>;
  mutate: (
    action: string,
    payload: unknown,
    options?: MutateOptions
  ) => Promise<{ data: ResponseData }>;
  update: (commands: Command[]) => void;
  loadingRef: RefObject<string[]>;
  clearData: (key: string) => void;
}

export const StoreContext = createContext<StoreContextState | undefined>(
  undefined
);

export interface StoreProviderProps extends PropsWithChildren {}

export interface Command {
  type: 'update' | 'merge' | 'replace' | 'unshift' | 'push' | 'delete';
  target?: string;
  payload: unknown;
}

export interface MutateOptions {}

export interface Notify {
  type?: 'info' | 'success' | 'warning' | 'error' | 'default';
  message: string;
}

export interface ResponseData {
  commands?: Command[];
  data?: unknown;
  notify?: Notify;
  navigate?: {
    screen: string;
    params: Record<string, string | number | boolean>;
  };
  ok: boolean;
}

export type Store = {
  state: Record<string, unknown>;
  loading: string[];
  update: (commands: Command[]) => void;
};

export const getQueryKey = (path: string, params?: QueryParams) => {
  return params && Object.keys(params).length > 0
    ? JSON.stringify({ path, params })
    : path;
};

export const useStore = create<Store>((set) => ({
  state: {},
  loading: [],
  update: (commands: Command[]) => {
    set((store) => {
      return produce(store, (draft) => {
        for (const command of commands) {
          if (
            command.type === 'update' &&
            typeof command.payload === 'function'
          ) {
            return command.payload(draft);
          } else {
            if (command.type === 'update' && command.target) {
              draft.state[command.target] = command.payload;
            } else if (command.type === 'merge' && command.target) {
              draft.state[command.target] = merge(
                draft.state[command.target],
                command.payload
              );
            } else if (command.type === 'replace') {
              const payload = command.payload;
              const target = command.target || 'id';

              if (typeof payload === 'object' && payload && target in payload) {
                for (const key of Object.keys(draft.state)) {
                  const state = draft.state[key];

                  if (!Array.isArray(state)) continue;

                  const index = state.findIndex((item) => {
                    // 先比對 target 鍵值是否相同
                    if (item[target] !== payload[target]) return false;

                    // 取出兩邊的 key
                    const itemKeys = Object.keys(item);
                    const payloadKeys = Object.keys(payload);

                    // 檢查 key 數量與內容是否完全一致
                    if (itemKeys.length !== payloadKeys.length) return false;

                    return itemKeys.every((key) => payloadKeys.includes(key));
                  });

                  if (index !== -1) {
                    state[index] = payload;
                  }
                }
              }
            } else if (command.type === 'unshift' && command.target) {
              const state = draft.state[command.target];

              if (Array.isArray(state)) {
                state.unshift(command.payload);
              }
            } else if (command.type === 'push' && command.target) {
              const state = draft.state[command.target];

              if (Array.isArray(state)) {
                state.push(command.payload);
              }
            } else if (command.type === 'delete' && command.target) {
              const payload = command.payload;
              const target = command.target || 'id';

              for (const key of Object.keys(draft.state)) {
                const state = draft.state[key];

                if (!Array.isArray(state)) continue;

                const index = state.findIndex(
                  (item) => item[target] === payload
                );

                if (index !== -1) {
                  state.splice(index, 1);
                }
              }
            }
          }
        }
      });
    });
  },
}));

export function StoreProvider({ children }: StoreProviderProps) {
  const navigate = useNavigate();
  const client = useClient();
  const { update } = useStore();
  const loadingRef = useRef<string[]>([]);

  const query = useCallback(
    (
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
          payload: (draft: Store) => {
            draft.loading.push(key);
          },
        },
      ]);

      return client
        .query(path, params)
        .then((data: ResponseData) => {
          loadingRef.current = loadingRef.current.filter((k) => k !== key);

          update([
            ...(data.commands ?? []),
            {
              type: 'update',
              target: 'loading',
              payload: (draft: Store) => {
                draft.loading = draft.loading.filter((k) => k !== key);
              },
            },
          ]);

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
        })
        .catch((error) => {
          loadingRef.current = loadingRef.current.filter((k) => k !== key);

          update([
            {
              type: 'update',
              target: 'loading',
              payload: (draft: Store) => {
                draft.loading = draft.loading.filter((k) => k !== key);
              },
            },
          ]);

          throw error;
        });
    },
    [client.query]
  );

  const mutate = useCallback(
    (action: string, payload?: unknown, options?: MutateOptions) => {
      return client.mutate(action, payload).then((data: ResponseData) => {
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
      });
    },
    [client.mutate]
  );

  const clearData = useCallback((key: string) => {
    update([
      {
        type: 'update',
        target: 'state',
        payload: (draft: Store) => {
          delete draft.state[key];
        },
      },
    ]);
  }, [update]);

  const value = useMemo(
    () => ({
      query,
      mutate,
      update,
      clearData,
      loadingRef,
    }),
    [query, mutate, update, loadingRef, clearData]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}
