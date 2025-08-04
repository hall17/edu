import { IconAlertTriangle } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useRolesContext } from '../../RolesContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trpc, Role } from '@/lib/trpc';

export function RolesDeleteDialog() {
  const { t } = useTranslation();
  const { openedDialog, currentRow, setOpenedDialog, deleteRole } =
    useRolesContext();

  const deleteMutation = useMutation(trpc.role.delete.mutationOptions());

  const handleDelete = async () => {
    if (!currentRow) return;

    try {
      await deleteMutation.mutateAsync({ id: currentRow.id });
      deleteRole(currentRow.id);
      toast.success(t('roles.messages.deleteSuccess'));
      setOpenedDialog(null);
    } catch (error) {
      toast.error(t('roles.messages.deleteError'));
    }
  };

  const handleClose = () => {
    setOpenedDialog(null);
  };

  if (!currentRow) return null;

  return (
    <ConfirmDialog
      open
      onOpenChange={handleClose}
      title={t('roles.deleteDialog.title')}
      desc={t('roles.deleteDialog.description')}
      confirmText={t('common.delete')}
      handleConfirm={handleDelete}
      isLoading={deleteMutation.isPending}
      destructive
    >
      <Alert>
        <IconAlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('roles.deleteDialog.warningTitle')}</AlertTitle>
        <AlertDescription>
          {t('roles.deleteDialog.warningDescription', {
            name: currentRow.name,
          })}
        </AlertDescription>
      </Alert>
    </ConfirmDialog>
  );
}
