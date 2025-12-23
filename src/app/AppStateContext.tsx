import {
  createContext,
  useCallback,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { create } from 'zustand';
import { produce } from 'immer';
import { merge } from '@ywwwtseng/ywjs';
import type { Command } from './types';

export interface AppStateContextState {
  update: (commands: Command[]) => void;
  clear: (key: string) => void;
}

export const AppStateContext = createContext<AppStateContextState | undefined>(
  undefined
);

export type AppState = {
  state: Record<string, unknown>;
  loading: string[];
  update: (commands: Command[]) => void;
};

export const useAppStateStore = create<AppState>((set) => ({
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

export function AppStateProvider({ children }: PropsWithChildren) {
  const { update } = useAppStateStore();

  const clear = useCallback((key: string) => {
    update([
      {
        type: 'update',
        target: 'state',
        payload: (draft: AppState) => {
          delete draft.state[key];
        },
      },
    ]);
  }, [update]);

  const value = useMemo(
    () => ({
      update,
      clear,
    }),
    [update, clear]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
