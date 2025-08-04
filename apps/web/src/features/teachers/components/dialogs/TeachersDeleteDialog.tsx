import { IconAlertTriangle } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useTeachersContext } from '../../TeachersContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trpc, User } from '@/lib/trpc';
import { getFullName } from '@/utils';

export function TeachersDeleteDialog() {
  const { t } = useTranslation();
  const { teachersQuery, deleteTeacher, currentRow, setOpenedDialog } =
    useTeachersContext();
  const deleteTeacherMutation = useMutation(trpc.user.delete.mutationOptions());

  async function handleDelete() {
    try {
      await deleteTeacherMutation.mutateAsync({
        id: currentRow.id,
      });

      deleteTeacher(currentRow.id);
      teachersQuery.refetch();
      toast.success(t('dialogs.delete.successMessageTeacher'));

      setOpenedDialog(null);
    } catch {}
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={() => setOpenedDialog(null)}
      handleConfirm={handleDelete}
      isLoading={deleteTeacherMutation.isPending}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          {t('dialogs.delete.titleTeacher')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            <span className="font-bold">{getFullName(currentRow)}</span>{' '}
            {t('dialogs.delete.confirmMessageTeacher')}
          </p>

          <Alert variant="destructive">
            <AlertTitle>{t('dialogs.delete.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('dialogs.delete.permanentRemovalWarningTeacher')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialogs.delete.confirmButtonText')}
      destructive
    />
  );
}
