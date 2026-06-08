export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  disableBackdropClick?: boolean;
  translationParams?: Record<string, unknown>;
}
