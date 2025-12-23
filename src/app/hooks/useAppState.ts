import { get } from '@ywwwtseng/ywjs';
import { useAppStateStore } from '../AppStateContext';

export function useAppState<T = unknown>(
  path: string | string[]
): T | undefined {
  return useAppStateStore((store) => get(store.state, path)) as T | undefined;
}
