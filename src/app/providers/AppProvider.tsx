import type { PropsWithChildren, ReactNode } from 'react';
import { Toaster, ToasterProps } from 'react-hot-toast';
import { AppUIProvider } from './AppUIProvider';
import { AppStateProvider } from './AppStateProvider';
import { ClientProvider, ClientProviderProps } from './ClientProvider';
import { I18nProvider, I18nProviderProps } from './I18nProvider';

export type Plugin = {
  provider: (props: PropsWithChildren<any>) => ReactNode;
  options?: any;
};

export interface AppProviderProps
  extends React.PropsWithChildren,
    Omit<ClientProviderProps, 'children'> {
      toasterProps?: Omit<ToasterProps, 'children'>;
      i18nProps?: Omit<I18nProviderProps, 'children'>;
      plugins?: Plugin[];
    }

function PluginsWrapper({ plugins, children }: { plugins: Plugin[]; children: ReactNode }) {
  return plugins.reduce((acc, plugin) => plugin.provider({ children: acc, ...plugin.options }), children);
}

export function AppProvider({
  url,
  transformRequest,
  onError,
  plugins = [],
  i18nProps = {},
  toasterProps = {},
  children,
}: AppProviderProps) {
  return (
    <AppUIProvider>
      <AppStateProvider>
        <ClientProvider url={url} transformRequest={transformRequest} onError={onError}>
          <I18nProvider {...i18nProps}>
            <PluginsWrapper plugins={plugins}>{children}</PluginsWrapper>
          </I18nProvider>
        </ClientProvider>
        <Toaster {...toasterProps} />
      </AppStateProvider>
    </AppUIProvider>
  );
}
