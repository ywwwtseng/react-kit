import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

export const inputVariants = cva('focus:outline-none outline-none', {
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
});

export function Input({
  className,
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return <input className={clsx(inputVariants({ className }))} {...props} />;
}
