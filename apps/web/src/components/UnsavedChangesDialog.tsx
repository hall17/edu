import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  cancelText,
  confirmText,
}: UnsavedChangesDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title || t('common.confirmClose')}</DialogTitle>
          <DialogDescription>
            {description || t('common.unsavedChangesWarning')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {cancelText || t('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmText || t('common.discardChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
