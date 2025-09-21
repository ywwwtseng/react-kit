import clsx from 'clsx';
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
};

export function Modal({
  type = 'default',
  handle = true,
  trigger,
  title,
  children,
  classes,
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
            zIndex: '30',
          }}
        />
        <Drawer.Content
          className={clsx(classes?.content, 'bg-modal')}
          style={{
            position: 'fixed',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            zIndex: 30,
            paddingTop: 16,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {handle && <Drawer.Handle />}
          <Drawer.Title className="hidden">{title}</Drawer.Title>
          <Drawer.Description className="hidden">{title}</Drawer.Description>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Root>
  );
}
