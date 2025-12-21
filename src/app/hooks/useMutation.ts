import { use, useState, useCallback } from 'react';
import type { ErrorResponse } from '@ywwwtseng/ywjs';
import toast from 'react-hot-toast';
import { useRefValue } from '../../hooks/useRefValue';
import {
  type ResponseData,
  MutateOptions,
  StoreContext,
} from '../StoreContext';

export interface UseMutationOptions {
  t?: (key: string) => string;
  onError?: (error: { data: ErrorResponse }) => void;
  onSuccess?: (data: ResponseData) => void;
}

export function useMutation(
  action: string,
  { t, onError, onSuccess }: UseMutationOptions = {}
) {
  const context = use(StoreContext);

  if (!context) {
    throw new Error('useMutation must be used within a StoreProvider');
  }

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRefValue(isLoading);

  const mutate = useCallback(
    <T = unknown>(
      payload?: T,
      options?: MutateOptions
    ): Promise<ResponseData> => {
      if (isLoadingRef.current) {
        return Promise.reject({
          message: 'Already loading',
        });
      }

      isLoadingRef.current = true;
      setIsLoading(true);

      return context
        .mutate(action, payload, options)
        .then(({ data }: { data: ResponseData }) => {

          if (data.notify) {
            (toast[data.notify.type] || toast)?.(t?.(data.notify.message) ?? data.notify.message);
          }

          onSuccess?.(data);

          return data;
        })
        .catch((res: { data: ErrorResponse }) => {
          onError?.(res);
          return {
            ok: false,
          };
        })
        .finally(() => {
          isLoadingRef.current = false;
          setIsLoading(false);
        });
    },
    [context.mutate, action]
  );

  return {
    mutate,
    isLoading,
  };
}
