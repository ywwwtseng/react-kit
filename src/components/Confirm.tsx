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
      <Typography size="2">{title}</Typography>
      <div className="px-4 pb-4">
        <Typography size="1">{description}</Typography>
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          gap: 24,
          padding: '16px 24px',
        }}
      >
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
