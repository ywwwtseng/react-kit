import { useState, useCallback } from 'react';
import type { ErrorResponse } from '@ywwwtseng/ywjs';
import { useClient } from './useClient';
import { useNotify } from './useNotify';
import { useAppUI } from '../providers/AppUIProvider';
import { useRefValue } from '../../hooks/useRefValue';
import type { ResponseData } from '../types';

export interface UseMutationOptions {
  ignoreNotify?: boolean | ((error: ErrorResponse) => boolean);
  showLoading?: boolean;
  onError?: (error: ErrorResponse) => void;
  onSuccess?: (data: ResponseData) => void;
}

export function useMutation(
  action: string,
  { ignoreNotify, showLoading = false, onError, onSuccess }: UseMutationOptions = {}
) {
  const { showLoadingUI } = useAppUI();
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

      if (showLoading) {
        showLoadingUI(true);
      }

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

          if (showLoading) {
            showLoadingUI(false);
          }
        });
    },
    [client.mutate, action, notify, showLoading]
  );

  return {
    mutate,
    isLoading,
  };
}
