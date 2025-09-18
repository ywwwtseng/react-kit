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
import { DrawerScreen, DrawerScreenProps } from '../components/DrawerScreen';

export type Stack = {
  screen: string;
  params: Record<string, string | number>;
};

export enum ScreenType {
  PAGE = 'page',
  DRAWER = 'drawer',
}

export type Screen = {
  screen: ElementType;
  title: string;
  type: ScreenType;
};

export type Route = {
  name: Stack['screen'];
  title: Screen['title'];
  params: Stack['params'];
  type: Screen['type'];
  screen: Screen['screen'];
};

export interface StackNavigatorContextState {
  route: Route;
  navigate: (
    screen: string | number,
    options?: { params: Stack['params'] }
  ) => void;
}

export const DEFAULT_STACK: Stack = (parseJSON(
  sessionStorage.getItem('navigator/screen')
) as Stack) || { screen: 'Home', params: {} };

export const StackNavigatorContext = createContext<StackNavigatorContextState>({
  route: undefined,
  navigate: (
    screen: string | number,
    options?: { params: Stack['params'] }
  ) => {},
});

export interface StackNavigatorProviderProps {
  screens: Record<string, Screen> & { Home: Screen };
  drawer: {
    style: DrawerScreenProps['style'];
  };
  layout: ElementType;
}

export function StackNavigatorProvider({
  screens,
  drawer,
  layout: Layout,
}: StackNavigatorProviderProps) {
  const [stacks, setStacks] = useState<Stack[]>([DEFAULT_STACK]);

  const route = useMemo(() => {
    const stack = stacks[stacks.length - 1];
    const screen = screens[stack.screen];

    return {
      name: stack.screen,
      title: screen.title,
      params: stack.params,
      type: screen.type,
      screen: screen.screen,
    };
  }, [stacks, screens]);

  const Screen = useMemo(() => {
    if (route.type === 'drawer') {
      const stack = stacks[stacks.length - 2];
      return stack ? screens[stack.screen].screen : undefined;
    }

    return route.screen;
  }, [route, stacks, screens]);

  const DrawerContent = useMemo(() => {
    if (route.type === 'drawer') {
      return route.screen;
    }
  }, [route, stacks, screens]);

  const navigate = useCallback(
    (screen: string | number, options?: { params: Route['params'] }) => {
      if (typeof screen === 'string') {
        if (!Object.keys(screens).includes(screen)) {
          console.warn(`Screen ${screen} not found`);
          return;
        }
      }

      setStacks((prev) => {
        if (screen === -1 && prev.length > 1) {
          return prev.slice(0, -1);
        } else if (typeof screen === 'string') {
          if (prev[prev.length - 1]?.screen === screen) {
            return prev;
          }

          const route = { screen, params: options?.params || {} };
          return [...prev, route];
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
    }),
    [route, navigate]
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
      <Layout
        styles={{
          tabBar: !!DrawerContent ? { display: 'none' } : {},
        }}
      >
        {Screen && (
          <div
            style={{
              height: '100%',
              overflowY: 'auto',
              display: !!DrawerContent ? 'none' : 'block',
            }}
          >
            <Screen params={route.params} />
          </div>
        )}
        <DrawerScreen
          title={route.title}
          description={route.title}
          style={drawer.style}
        >
          {!!DrawerContent && <DrawerContent params={route.params} />}
        </DrawerScreen>
      </Layout>
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
