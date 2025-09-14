import { Drawer } from 'vaul';

export interface DrawerScreenProps extends React.PropsWithChildren {
  title: string;
  description: string;
  style?: React.CSSProperties;
}

export function DrawerScreen({
  title,
  description,
  style,
  children,
}: DrawerScreenProps) {
  return (
    <Drawer.Root handleOnly direction="right" open={!!children}>
      <Drawer.Portal>
        <Drawer.Content
          style={{
            height: '100vh',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            outline: 'none',
            ...style,
          }}
        >
          <Drawer.Title style={{ display: 'none' }}>{title}</Drawer.Title>
          <Drawer.Description style={{ display: 'none' }}>
            {description}
          </Drawer.Description>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
