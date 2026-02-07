'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'cooldown:';

/**
 * 持久化冷卻倒數：成功後 N 秒內不能操作，重新整理後仍會繼續倒數
 * @param storageKey 儲存鍵（會加上前綴，避免衝突）
 * @param durationSeconds 冷卻秒數
 */
export function usePersistedCooldown(
  storageKey: string,
  durationSeconds: number
): {
  isCoolingDown: boolean;
  remainingSeconds: number;
  startCooldown: () => void;
} {
  const key = `${STORAGE_PREFIX}${storageKey}`;

  const getEndTime = useCallback((): number | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const end = parseInt(raw, 10);
      return Number.isFinite(end) ? end : null;
    } catch {
      return null;
    }
  }, [key]);

  const [endTime, setEndTime] = useState<number | null>(() => getEndTime());
  const [now, setNow] = useState(() => Date.now());

  // 水合後從 storage 同步
  useEffect(() => {
    setEndTime(getEndTime());
  }, [getEndTime]);

  // 每秒更新 now，驅動剩餘秒數
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const effectiveEnd = endTime != null && endTime > now ? endTime : null;
  const remainingSeconds = effectiveEnd != null ? Math.max(0, Math.ceil((effectiveEnd - now) / 1000)) : 0;
  const isCoolingDown = remainingSeconds > 0;

  // 倒數結束時清除 storage
  useEffect(() => {
    if (endTime != null && now >= endTime) {
      try {
        localStorage.removeItem(key);
      } catch {}
      setEndTime(null);
    }
  }, [endTime, now, key]);

  const startCooldown = useCallback(() => {
    const end = Date.now() + durationSeconds * 1000;
    try {
      localStorage.setItem(key, String(end));
    } catch {}
    setEndTime(end);
    setNow(Date.now());
  }, [durationSeconds, key]);

  return {
    isCoolingDown,
    remainingSeconds,
    startCooldown,
  };
}
