import { ComponentProps } from 'react';
import clsx from 'clsx';
import { cva, type VariantProps } from 'class-variance-authority';
import { Spinner } from '../icons';

export const buttonVariants = cva(
  'flex items-center justify-center cursor-pointer focus:outline-none outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        text: 'text',
        contained: 'contained',
        icon: 'rounded-full',
      },
      width: {
        full: 'w-full',
      },
      size: {
        xs: 'text-xs min-h-8',
        sm: 'text-sm min-h-10',
        md: 'text-lg min-h-12',
      },
      color: {
        primary: '',
        secondary: '',
        active: '',
        destructive: '',
      },
      rounded: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'text',
    },
    compoundVariants: [
      {
        variant: 'text',
        color: 'primary',
        className: 'text-primary [&:not(:disabled)]:hover:text-primary/90',
      },
      {
        variant: 'text',
        color: 'secondary',
        className: 'text-secondary [&:not(:disabled)]:hover:text-secondary/90',
      },
      {
        variant: 'text',
        color: 'active',
        className: 'text-active [&:not(:disabled)]:hover:text-active/90',
      },
      {
        variant: 'text',
        color: 'destructive',
        className:
          'text-destructive [&:not(:disabled)]:hover:text-destructive/90',
      },
      {
        variant: 'contained',
        color: 'primary',
        className: 'bg-primary [&:not(:disabled)]:hover:bg-primary/90',
      },
      {
        variant: 'contained',
        color: 'secondary',
        className: 'bg-secondary [&:not(:disabled)]:hover:bg-secondary/90',
      },
      {
        variant: 'contained',
        color: 'destructive',
        className: 'bg-destructive [&:not(:disabled)]:hover:bg-destructive/90',
      },
      {
        variant: 'contained',
        color: 'active',
        className: 'bg-active [&:not(:disabled)]:hover:bg-active/90',
      },
      {
        variant: 'icon',
        color: 'primary',
        className: 'bg-primary [&:not(:disabled)]:hover:bg-primary/90',
      },
      {
        variant: 'icon',
        color: 'secondary',
        className: 'bg-secondary [&:not(:disabled)]:hover:bg-secondary/90',
      },
      {
        variant: 'icon',
        color: 'destructive',
        className: 'bg-destructive [&:not(:disabled)]:hover:bg-destructive/90',
      },
      {
        variant: 'icon',
        color: 'active',
        className: 'bg-active [&:not(:disabled)]:hover:bg-active/90',
      },
      {
        variant: 'icon',
        size: 'xs',
        className: 'h-8 w-8',
      },
      {
        variant: 'icon',
        size: 'sm',
        className: 'h-10 w-10',
      },
      {
        variant: 'icon',
        size: 'md',
        className: 'h-12 w-12',
      },
    ],
  }
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };

export function Button({
  className,
  variant,
  width,
  size,
  color,
  rounded,
  isLoading = false,
  children,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        buttonVariants({ variant, width, size, color, rounded, className })
      )}
      onClick={(event) => {
        if (isLoading) return;
        onClick?.(event);
      }}
      {...props}
    >
      {isLoading ? <Spinner width={24} height={24} /> : children}
    </button>
  );
}
