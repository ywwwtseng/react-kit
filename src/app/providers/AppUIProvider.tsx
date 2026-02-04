import {
  createContext,
  useCallback,
  use,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { Spinner } from '../../icons';

export interface AppUIContextState {
  loadingUI: number;
  showLoadingUI: (show: boolean) => void;
}

export const AppUIContext = createContext<AppUIContextState | undefined>(
  undefined
);

export function AppUIProvider({ children }: PropsWithChildren) {
  const [loadingUI, setLoadingUI] = useState(0);

  const showLoadingUI = useCallback((show: boolean) => {
    if (show) {
      setLoadingUI((prev) => prev + 1);
    } else {
      setLoadingUI((prev) => prev - 1);
    }
  }, []);

  const value = useMemo(
    () => ({
      loadingUI,
      showLoadingUI,
    }),
    [loadingUI, showLoadingUI]
  );

  return (
    <AppUIContext.Provider value={value}>
      {children}
      {loadingUI > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2147483647,
        }}>
          <Spinner width={24} height={24} />
        </div>
      )}
    </AppUIContext.Provider>
  );
}

export function useAppUI() {
  const context = use(AppUIContext);
  if (!context) {
    throw new Error('useAppUI must be used within an AppUIProvider');
  }
  return context;
}
