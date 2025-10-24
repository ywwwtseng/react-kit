import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

export const inputVariants = cva(
  'focus:outline-none outline-none placeholder:text-placeholder',
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>) {
  return <input className={clsx(inputVariants({ className }))} {...props} />;
}
