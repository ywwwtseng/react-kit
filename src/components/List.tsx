import { type ReactNode, HTMLAttributes } from 'react';

export interface ListProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: T[];
  children: (item: T) => ReactNode;
}

export function List<T>({ items, children, ...props }: ListProps<T>) {
  return (
    <div {...props}>
      {items.map((item) => children(item))}
    </div>
  );
}
