function Root({
  className,
  style,
  children,
}: React.PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
}>) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        opacity: 0,
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Header({
  style,
  children,
}: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  return (
    <div
      style={{
        width: '100vw',
        left: 0,
        top: 0,
        padding: '8px 16px',
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        zIndex: 1000,
        pointerEvents: 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function HeaderLeft({
  style,
  children,
}: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function HeaderRight({
  style,
  children,
}: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Main({
  style,
  children,
}: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const Layout = {
  Root,
  Header,
  HeaderLeft,
  HeaderRight,
  Main,
};
