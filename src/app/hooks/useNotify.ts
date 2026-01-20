import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useI18n } from './useI18n';
import type { NotifyType } from '../types';

export function useNotify() {
  const { t } = useI18n();

  return useCallback((type: NotifyType, message: string, params?: Record<string, string | number>) => {
    (toast[type] || toast)?.(t?.(message, params) ?? message);
  }, [t]);
}