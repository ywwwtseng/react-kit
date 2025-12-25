import { useState, useCallback } from 'react';
import type { ErrorResponse } from '@ywwwtseng/ywjs';
import toast from 'react-hot-toast';
import { useClient } from './useClient';
import { useI18n } from './useI18n';
import { useRefValue } from '../../hooks/useRefValue';
import type { ResponseData } from '../types';

export interface UseMutationOptions {
  onError?: (error: ErrorResponse) => void;
  onSuccess?: (data: ResponseData) => void;
}

export function useMutation(
  action: string,
  { onError, onSuccess }: UseMutationOptions = {}
) {
  const client = useClient();
  const { t } = useI18n();
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
            (toast[data.notify.type] || toast)?.(t?.(data.notify.message) ?? data.notify.message);
          }

          onSuccess?.(data);

          return data;
        })
        .catch((res: { data: ErrorResponse }) => {
          onError?.(res.data);
          return {
            ok: false,
          };
        })
        .finally(() => {
          isLoadingRef.current = false;
          setIsLoading(false);
        });
    },
    [client.mutate, action]
  );

  return {
    mutate,
    isLoading,
  };
}
