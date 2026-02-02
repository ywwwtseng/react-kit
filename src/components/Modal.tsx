import { Drawer, type DialogProps } from 'vaul';

export type ModalProps = DialogProps & {
  type?: 'default' | 'nested';
  handle?: boolean;
  trigger?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  classes?: {
    content?: string;
  };
  styles?: {
    content?: React.CSSProperties;
  }
};

export function Modal({
  type = 'default',
  handle = true,
  trigger,
  title,
  children,
  classes,
  styles,
  ...props
}: ModalProps) {
  const Root = type === 'default' ? Drawer.Root : Drawer.NestedRoot;
  return (
    <Root {...props}>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            position: 'fixed',
            inset: '0',
            zIndex: 9999,
          }}
        />
        <Drawer.Content
          style={{
            position: 'fixed',
            zIndex: 9999,
            bottom: 0,
            left: 0,
            right: 0,
            margin: '0 4px 28px',
          }}
        >
          <div
            className={classes?.content}
            style={{
              paddingTop: 16,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              gap: 16,
              backgroundColor: 'var(--modal)',
              ...styles?.content,
            }}
          >
            <Drawer.Title className="hidden">{title}</Drawer.Title>
            <Drawer.Description className="hidden">{title}</Drawer.Description>
            {handle && <Drawer.Handle />}
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Root>
  );
}
