import { IconAlertTriangle } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useParentsContext } from '@/features/parents/ParentsContext';
import { trpc } from '@/lib/trpc';
import { getFullName } from '@/utils';

export function ParentsDeleteDialog() {
  const { currentRow, setOpenedDialog } = useParentsContext();
  const { t } = useTranslation();
  const { parentsQuery, deleteParent } = useParentsContext();
  const deleteParentMutation = useMutation(
    trpc.parent.delete.mutationOptions()
  );

  async function handleDelete() {
    try {
      await deleteParentMutation.mutateAsync({
        id: currentRow.id,
      });

      deleteParent(currentRow.id);
      parentsQuery.refetch();
      toast.success(t('dialogs.delete.successMessageParent'));

      setOpenedDialog(null);
    } catch {}
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={() => setOpenedDialog(null)}
      handleConfirm={handleDelete}
      isLoading={deleteParentMutation.isPending}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          {t('dialogs.delete.titleParent')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            <span className="font-bold">{getFullName(currentRow)}</span>{' '}
            {t('dialogs.delete.confirmMessageParent')}
          </p>

          <Alert variant="destructive">
            <AlertTitle>{t('dialogs.delete.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('dialogs.delete.permanentRemovalWarningParent')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialogs.delete.confirmButtonText')}
      destructive
    />
  );
}
