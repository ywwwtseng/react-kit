import { use, useMemo } from 'react';
import { DrawerScreen, DrawerScreenProps } from '../components/DrawerScreen';
import { StackNavigatorContext } from './StackNavigatorContext';
import { ScreenType } from './StackNavigatorContext';

export interface NavigatorProps {
  drawer: {
    style: DrawerScreenProps['style'];
  };
}

export function Navigator({ drawer }: NavigatorProps) {
  const { route, stacks, screens } = use(StackNavigatorContext);

  const Screen = useMemo(() => {
    if (route.type !== ScreenType.PAGE) {
      const stack = stacks[stacks.length - 2];
      return stack ? screens[stack.screen].screen : undefined;
    }

    return route.screen;
  }, [route, stacks, screens]);

  const drawerScreen = useMemo(() => {
    if (route.type !== ScreenType.PAGE) {
      const Screen = route.screen;
      return (
        <DrawerScreen
          title={route.title}
          description={route.title}
          style={drawer.style}
        >
          <Screen params={route.params} />
        </DrawerScreen>
      );
    }
  }, [route]);

  return (
    <>
      {Screen && (
        <div
          style={{
            height: '100%',
            overflowY: 'auto',
            display: !!drawerScreen ? 'none' : 'block',
          }}
        >
          <Screen params={route.params} />
        </div>
      )}
      {drawerScreen}
    </>
  );
}
