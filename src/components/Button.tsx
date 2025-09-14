import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

export const buttonVariants = cva(
  'flex items-center justify-center cursor-pointer focus:outline-none outline-none',
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
        className: 'text-primary hover:text-primary/90',
      },
      {
        variant: 'text',
        color: 'secondary',
        className: 'text-secondary hover:text-secondary/90',
      },
      {
        variant: 'contained',
        color: 'primary',
        className: 'bg-primary hover:bg-primary/90',
      },
      {
        variant: 'contained',
        color: 'secondary',
        className: 'bg-secondary hover:bg-secondary/90',
      },
      {
        variant: 'icon',
        color: 'primary',
        className: 'bg-primary hover:bg-primary/90',
      },
      {
        variant: 'icon',
        color: 'secondary',
        className: 'bg-secondary hover:bg-secondary/90',
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

export function Button({
  className,
  variant,
  width,
  size,
  color,
  rounded,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={clsx(
        buttonVariants({ variant, width, size, color, rounded, className })
      )}
      {...props}
    />
  );
}
