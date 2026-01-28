import { useState, useCallback } from 'react';
import type { ErrorResponse } from '@ywwwtseng/ywjs';
import { useClient } from './useClient';
import { useNotify } from './useNotify';
import { useRefValue } from '../../hooks/useRefValue';
import type { ResponseData } from '../types';

export interface UseMutationOptions {
  ignoreNotify?: boolean | ((error: ErrorResponse) => boolean);
  onError?: (error: ErrorResponse) => void;
  onSuccess?: (data: ResponseData) => void;
}

export function useMutation(
  action: string,
  { ignoreNotify, onError, onSuccess }: UseMutationOptions = {}
) {
  const client = useClient();
  const notify = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRefValue(isLoading);

  const mutate = useCallback(
    <T = unknown>(
      payload?: T,
    ): Promise<ResponseData> => {
      if (isLoadingRef.current) {
        return Promise.reject({
          message: 'Already loading',
        });
      }

      isLoadingRef.current = true;
      setIsLoading(true);

      return client
        .mutate(action, payload)
        .then(({ data }: { data: ResponseData }) => {
          if (data.notify) {
            notify(data.notify.type, data.notify.message, data.notify.params);
          }

          onSuccess?.(data);

          return data;
        })
        .catch((res: { data: ErrorResponse }) => {
          onError?.(res.data);

          const params = res.data.info ?? {};

          if (typeof ignoreNotify === 'function' ? !ignoreNotify(res.data) : !ignoreNotify) {
            notify('error', res.data.message ?? 'Unknown error', params as Record<string, string | number>);
          }

          return {
            ok: false,
          };
        })
        .finally(() => {
          isLoadingRef.current = false;
          setIsLoading(false);
        });
    },
    [client.mutate, action, notify]
  );

  return {
    mutate,
    isLoading,
  };
}
