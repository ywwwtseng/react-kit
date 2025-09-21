import { Modal, ModalProps } from './Modal';
import { Typography } from './Typography';
import { Button, ButtonProps } from './Button';

export type ConfirmProps = ModalProps & {
  description: string;
  cancel: ButtonProps;
  confirm: ButtonProps;
};

export function Confirm({
  title,
  description,
  onOpenChange,
  cancel,
  confirm,
  ...props
}: ConfirmProps) {
  return (
    <Modal title={title} onOpenChange={onOpenChange} {...props}>
      <Typography size="4">{title}</Typography>
      <Typography size="2">{description}</Typography>
      <div className="flex w-full gap-6 py-4 px-6">
        <Button
          width="full"
          rounded="full"
          variant="contained"
          color="secondary"
          size="sm"
          onClick={() => {
            onOpenChange(false);
          }}
          children="Cancel"
          {...cancel}
        />
        <Button
          width="full"
          rounded="full"
          variant="contained"
          size="sm"
          color="destructive"
          {...confirm}
          onClick={(event) => {
            onOpenChange(false);
            confirm.onClick?.(event);
          }}
        />
      </div>
    </Modal>
  );
}
