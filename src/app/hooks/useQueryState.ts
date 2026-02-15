import { get } from '@ywwwtseng/ywjs';
import { useAppStateStore } from '../providers/AppStateProvider';

export function useQueryState<T = unknown>(
  path?: string | string[]
): T | undefined {
  return useAppStateStore((store) => {
    if (!path) {
      return store.state;
    }

    return get(store.state, path);
  }) as T | undefined;
}
