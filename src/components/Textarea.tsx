import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

export const textareaVariants = cva(
  'focus:outline-none outline-none resize-none',
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>) {
  return (
    <textarea className={clsx(textareaVariants({ className }))} {...props} />
  );
}
