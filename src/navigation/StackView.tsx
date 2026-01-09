import { use, useMemo, useRef, useEffect } from 'react';
import { DrawerView, DrawerViewProps } from './DrawerView';
import { StackNavigatorContext } from './StackNavigatorContext';
import { ScreenType } from './StackNavigatorContext';

export interface StackViewProps {
  drawer?: {
    style: DrawerViewProps['style'];
  };
}

export function StackView({ drawer = { style: {} } }: StackViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { route, stacks, screens } = use(StackNavigatorContext);
  const drawerView = useMemo(() => {
    if (route.type !== ScreenType.PAGE) {
      const Screen = route.screen;
      return (
        <DrawerView
          title={route.title}
          description={route.title}
          style={drawer.style}
        >
          <Screen params={route.params} />
        </DrawerView>
      );
    }
  }, [route]);

  const MainView = useMemo(() => {
    if (route.type !== ScreenType.PAGE) {
      const stack = stacks[stacks.length - 2];
      return stack ? screens[stack.screen].screen : undefined;
    }

    return route.screen;
  }, [route, stacks, screens]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [route]);

  if (!MainView && !drawerView) {
    return undefined;
  }

  return (
    <>
       {MainView && (
         <div
          ref={ref}
          style={{
            height: '100%',
            overflowY: 'auto',
            display: !!drawerView ? 'none' : 'block',
          }}
        >
          <MainView params={route.params} />
        </div>
      )}
      {drawerView}
    </>
  );
}
