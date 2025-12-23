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
    <Drawer.Root
      handleOnly
      direction="right"
      open={!!children}
      repositionInputs={false}
    >
      <Drawer.Portal>
        <Drawer.Content
          style={{
            height: '100vh',
            minHeight: '100vh',
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            outline: 'none',
          }}
        >
          <Drawer.Title style={{ display: 'none' }}>{title}</Drawer.Title>
          <Drawer.Description style={{ display: 'none' }}>
            {description}
          </Drawer.Description>
          <div
            style={{
              width: '100%',
              height: '100%',
              overflowY: 'auto',
              ...style,
            }}>
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
