import React from 'react';
import { Toaster, ToasterProps } from 'react-hot-toast';
import { ClientProvider, ClientProviderProps } from './ClientContext';
import { StoreProvider } from './StoreContext';

export interface AppProviderProps
  extends React.PropsWithChildren,
    Omit<ClientProviderProps, 'children'> {
      toasterProps?: ToasterProps;
    }

export function AppProvider({
  url,
  transformRequest,
  toasterProps,
  children,
}: AppProviderProps) {
  return (
    <ClientProvider url={url} transformRequest={transformRequest}>
      <StoreProvider>{children}</StoreProvider>
      <Toaster {...toasterProps} />
    </ClientProvider>
  );
}
