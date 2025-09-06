import { type ReactNode, CSSProperties } from 'react';
import { List } from './List';

export interface Tab {
  name: string;
  title: string;
  icon: ReactNode;
}

export interface TabBarProps {
  style?: CSSProperties;
  items: Tab[];
  renderItem: (item: Tab) => ReactNode;
}

export function TabBar({ style, items, renderItem }: TabBarProps) {
  return (
    <List
      style={{
        width: '100vw',
        left: 0,
        bottom: 0,
        padding: '4px 32px 0px',
        position: 'fixed',
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'space-between',
        ...style,
      }}
      items={items}
    >
      {(item) => renderItem(item)}
    </List>
  );
}
