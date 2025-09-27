import { useMemo } from 'react';
import clsx from 'clsx';
import {
  Dropdown as HerouiDropdown,
  DropdownProps as HerouiDropdownProps,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown';
import { Typography } from './Typography';
import { ChevronDown } from '../icons';

export interface DropdownItem {
  key: string;
  name: string;
  icon?: React.ReactNode;
}

export interface DropdownProps
  extends Omit<HerouiDropdownProps, 'onChange' | 'children'> {
  value?: string;
  items: DropdownItem[];
  showIcon?: boolean;
  size?: 'sm' | 'md';
  placeholder?: string;
  onChange: (key: string) => void;
}

export function Dropdown({
  value,
  items,
  size = 'md',
  showIcon = true,
  onChange,
  placeholder,
  ...props
}: DropdownProps) {
  const typographySize = size === 'sm' ? '1' : '2';
  const selected = useMemo(() => {
    return items.find((item) => item.key === value);
  }, [items, value]);

  return (
    <HerouiDropdown
      classNames={{
        base: 'bg-modal rounded-lg',
        trigger: clsx('bg-form-element', {
          'rounded-full py-2 pl-4 pr-3': size === 'sm',
          'rounded-lg py-2.5 px-3': size === 'md',
        }),
      }}
      {...props}
    >
      <DropdownTrigger>
        <div className="flex items-center justify-between gap-2 !scale-[100%] !opacity-100 cursor-pointer">
          {selected ? (
            <div className="flex items-center gap-2">
              {selected.icon && showIcon && selected.icon}
              <Typography size={typographySize}>{selected.name}</Typography>
            </div>
          ) : (
            <Typography className="text-placeholder" size={typographySize}>
              {placeholder}
            </Typography>
          )}
          <ChevronDown
            width={size === 'sm' ? 16 : 20}
            height={size === 'sm' ? 16 : 20}
            strokeWidth={1.5}
            className="text-icon-foreground max-w-4"
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        {items.map((item) => (
          <DropdownItem
            className="rounded-lg"
            key={item.key}
            onPress={() => {
              onChange(item.key);
            }}
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
