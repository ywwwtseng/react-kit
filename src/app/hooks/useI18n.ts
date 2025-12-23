import { use } from 'react';
import { I18nContext, type I18nContextState } from '../I18nContext';

export function useI18n(): I18nContextState {
  const context = use(I18nContext);

  if (!context) {
    console.trace('useI18n must be used within a I18nProvider');
    throw new Error('useI18n must be used within a I18nProvider');
  }

  return context;
}
