import {
  useCallback,
  useMemo,
  createContext,
  use,
  type PropsWithChildren,
} from 'react';
import { get, getLocale, translate, type Locales } from '@ywwwtseng/ywjs';
import { useAppState } from '../hooks/useAppState';

export interface I18nContextState {
  t: (key: string, params?: Record<string, string | number>) => string;
  language_code: string;
}

export const I18nContext = createContext<I18nContextState | undefined>(
  undefined
);

export interface I18nProviderProps extends PropsWithChildren {
  locales?: Locales;
  path?: [string, ...string[]];
  callback?: string;
}

export function I18nProvider({
  locales,
  path = ['me', 'language_code'],
  callback = 'en',
  children,
}: I18nProviderProps) {
  const state = useAppState(path[0]);
  const language_code = useMemo(() => {
    if (!state) return callback;
    return get(state, path.slice(1)) || callback;
  }, [state, path, callback]);

  const locale = useMemo(() => {
    if (!locales) return null;
    return getLocale(locales, language_code, locales[callback]);
  }, [language_code, callback, locales]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      if (!locale) return key;

      return translate(locale, key, params);
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      language_code,
      t,
    }),
    [locale, t]
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextState {
  const context = use(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within a I18nProvider');
  }

  return context;
}
