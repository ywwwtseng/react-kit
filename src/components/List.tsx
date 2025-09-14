export interface ListProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  items: T[];
  children: (item: T) => React.ReactNode;
}

export function List<T>({ items, children, ...props }: ListProps<T>) {
  return <div {...props}>{items.map((item) => children(item))}</div>;
}
