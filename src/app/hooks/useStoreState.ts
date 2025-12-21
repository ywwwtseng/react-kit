import { get } from '@ywwwtseng/ywjs';
import { useStore } from '../StoreContext';

export function useStoreState<T = unknown>(
  path: string | string[]
): T | undefined {
  return useStore((store) => get(store.state, path)) as T | undefined;
}
