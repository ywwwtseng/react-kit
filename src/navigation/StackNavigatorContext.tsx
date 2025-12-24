import {
  createContext,
  use,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ElementType,
} from 'react';
import { parseJSON } from '@ywwwtseng/ywjs';

export type Stack = {
  screen: string;
  params: Record<string, string | number | boolean | null | undefined>;
};

export enum ScreenType {
  PAGE = 'page',
  DRAWER = 'drawer',
  SINGLE = 'single',
}

export type Screen = {
  screen: ElementType;
  title: string;
  type: ScreenType;
  back?: {
    title?: string;
    push?: string;
    replace?: string;
  };
};

export type Route = {
  name: Stack['screen'];
  params: Stack['params'];
  back?: Screen['back'];
  title: Screen['title'];
  type: Screen['type'];
  screen: Screen['screen'];
};

export interface StackNavigatorContextState {
  route: Route;
  screens: Record<string, Screen>;
  stacks: Stack[];
  navigate: (
    screen: string | number,
    options?: { params?: Stack['params']; type?: 'push' | 'replace' }
  ) => void;
}

export const StackNavigatorContext = createContext<StackNavigatorContextState>({
  route: undefined,
  screens: {},
  stacks: [],
  navigate: (
    screen: string | number,
    options?: { params?: Stack['params']; type?: 'push' | 'replace' }
  ) => {},
});

export interface StackNavigatorProviderProps {
  screens: Record<string, Screen> & { Home: Screen };
  children: React.ReactNode | ((state: StackNavigatorContextState) => React.ReactNode);
}

export function StackNavigatorProvider({
  screens,
  children,
}: StackNavigatorProviderProps) {
  const [stacks, setStacks] = useState<Stack[]>([
    (parseJSON(sessionStorage.getItem('navigator/screen')) as Stack) || {
      screen: 'Home',
      params: {},
    },
  ]);

  const route = useMemo(() => {
    const stack = stacks[stacks.length - 1];
    const screen = screens[stack.screen];

    return {
      name: stack.screen,
      params: stack.params,
      type: screen.type,
      title: screen.title,
      screen: screen.screen,
      back: screen.back,
    };
  }, [stacks, screens]);

  const navigate = useCallback(
    (
      screen: string | number,
      options?: { params?: Route['params']; type?: 'push' | 'replace' }
    ) => {
      if (typeof screen === 'string') {
        if (!Object.keys(screens).includes(screen)) {
          console.warn(`Screen ${screen} not found`);
          return;
        }
      }

      const type = options?.type || 'push';

      setStacks((prev) => {
        if (screen === -1 && prev.length > 1) {
          return prev.slice(0, -1);
        } else if (typeof screen === 'string') {
          if (prev[prev.length - 1]?.screen === screen) {
            return prev;
          }

          const route = { screen, params: options?.params || {} };

          if (type === 'replace') {
            return [...prev.slice(0, -1), route];
          } else {
            return [...prev, route].slice(-10);
          }
        }

        return prev;
      });
    },
    [screens]
  );

  const value = useMemo(
    () => ({
      route,
      navigate,
      screens,
      stacks,
    }),
    [route, navigate, screens, stacks]
  );

  useEffect(() => {
    if (route.type === 'drawer') {
      return;
    }

    sessionStorage.setItem(
      'navigator/screen',
      JSON.stringify({
        screen: route.name,
        params: route.params,
      })
    );
  }, [route]);

  return (
    <StackNavigatorContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </StackNavigatorContext.Provider>
  );
}

export const useNavigate = () => {
  const context = use(StackNavigatorContext);

  if (!context) {
    throw new Error('useNavigate must be used within a StackNavigator');
  }

  return context.navigate;
};

export const useRoute = () => {
  const context = use(StackNavigatorContext);

  if (!context) {
    throw new Error('useRoute must be used within a StackNavigator');
  }

  return context.route;
};
