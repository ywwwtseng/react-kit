import { useMemo } from 'react';
import clsx from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check } from '../icons';
import { Typography } from './Typography';

export interface DropdownProps {
  value?: string;
  items: { key: string; name: string; icon?: React.ReactNode }[];
  showIcon?: boolean;
  size?: 'sm' | 'md';
  placeholder?: string;
  disabled?: boolean;
  classes?: {
    trigger?: string;
  };
  onChange: (key: string) => void;
}

export function Dropdown({
  value,
  items,
  size = 'md',
  showIcon = true,
  classes,
  disabled,
  placeholder,
  onChange,
}: DropdownProps) {
  const typographySize = size === 'sm' ? '1' : '2';
  const selected = useMemo(() => {
    return items.find((item) => item.key === value) ?? null;
  }, [items, value]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <button
          className={clsx(
            'flex items-center justify-between gap-2 !scale-[100%] !opacity-100 cursor-pointer outline-none',
            classes?.trigger
          )}
        >
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
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded-md bg-modal p-2 mx-2 mb-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
        >
          {items.map((item) => (
            <DropdownMenu.Item
              className={clsx(
                'relative flex p-2 select-none items-center rounded-lg leading-none outline-none',
                selected?.key === item.key && 'bg-default'
              )}
              key={item.key}
              onClick={() => {
                onChange(item.key);
              }}
            >
              {item.icon ? (
                <div style={{ marginRight: '10px' }}>{item.icon}</div>
              ) : null}
              <Typography size="2">{item.name}</Typography>
              {selected?.key === item.key && (
                <Check className="w-4 h-4 ml-auto" />
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
