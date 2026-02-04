import React from 'react';
import { Toaster, ToasterProps } from 'react-hot-toast';
import { ClientProvider, ClientProviderProps } from './ClientProvider';
import { AppStateProvider } from './AppStateProvider';
import { I18nProvider, I18nProviderProps } from './I18nProvider';

export interface AppProviderProps
  extends React.PropsWithChildren,
    Omit<ClientProviderProps, 'children'> {
      toasterProps?: Omit<ToasterProps, 'children'>;
      i18nProps?: Omit<I18nProviderProps, 'children'>;
    }

export function AppProvider({
  url,
  transformRequest,
  onError,
  i18nProps = {},
  toasterProps = {},
  children,
}: AppProviderProps) {
  return (
    <AppStateProvider>
      <ClientProvider url={url} transformRequest={transformRequest} onError={onError}>
        <I18nProvider {...i18nProps}>
          {children}
        </I18nProvider>
      </ClientProvider>
      <Toaster {...toasterProps} />
    </AppStateProvider>
  );
}
