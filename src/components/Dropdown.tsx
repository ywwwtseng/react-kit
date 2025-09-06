import type { ReactElement } from 'react';
import {
  Dropdown as HerouiDropdown,
  DropdownProps as HerouiDropdownProps,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown';
import { Typography } from './Typography';

export interface DropdownItem {
  key: string;
  name: string;
  icon?: ReactElement;
}

export interface DropdownProps
  extends Omit<HerouiDropdownProps, 'onChange' | 'children'> {
  items: DropdownItem[];
  children: ReactElement;
  onChange: (key: string) => void;
}

export function Dropdown({
  items,
  children,
  onChange,
  ...props
}: DropdownProps) {
  return (
    <HerouiDropdown {...props}>
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownMenu>
        {items.map((item) => (
          <DropdownItem
            key={item.key}
            onClick={() => onChange(item.key)}
            startContent={
              item.icon ? (
                <div style={{ marginRight: '10px' }}>{item.icon}</div>
              ) : null
            }
            textValue={item.key}
          >
            <Typography size="2">{item.name}</Typography>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </HerouiDropdown>
  );
}
