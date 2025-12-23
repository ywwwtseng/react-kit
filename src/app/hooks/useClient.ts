import { use } from 'react';
import { ClientContext, type ClientContextState } from '../ClientContext';

export function useClient(): ClientContextState {
  const context = use(ClientContext);

  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }

  return context;
}