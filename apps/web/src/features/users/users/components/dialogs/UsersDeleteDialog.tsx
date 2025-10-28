import { useMutation } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useUsersContext } from '../../UsersContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';
import { getFullName } from '@/utils';

export function UsersDeleteDialog() {
  const { t } = useTranslation();
  const { usersQuery, deleteUser, currentRow, setOpenedDialog } =
    useUsersContext();
  const deleteUserMutation = useMutation(trpc.user.delete.mutationOptions());

  async function handleDelete() {
    try {
      await deleteUserMutation.mutateAsync({
        id: currentRow.id,
      });

      deleteUser(currentRow.id);
      usersQuery.refetch();
      toast.success(t('dialogs.delete.successMessageUser', {}));

      setOpenedDialog(null);
    } catch {}
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={() => setOpenedDialog(null)}
      handleConfirm={handleDelete}
      isLoading={deleteUserMutation.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          {t('dialogs.delete.titleUser', {})}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            <span className="font-bold">{getFullName(currentRow)}</span>{' '}
            {t('dialogs.delete.confirmMessageUser')}
          </p>

          <Alert variant="destructive">
            <AlertTitle>{t('dialogs.delete.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('dialogs.delete.permanentRemovalWarningUser')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialogs.delete.confirmButtonText')}
      destructive
    />
  );
}
