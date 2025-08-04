import { IconAlertTriangle } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useSubjectsContext } from '../SubjectsContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Subject, trpc } from '@/lib/trpc';

export function SubjectsDeleteDialog() {
  const { t } = useTranslation();
  const { subjectsQuery, deleteSubject, setOpenedDialog, currentRow } =
    useSubjectsContext();
  const deleteSubjectMutation = useMutation(
    trpc.subject.delete.mutationOptions()
  );

  async function handleDelete() {
    try {
      await deleteSubjectMutation.mutateAsync({
        id: currentRow!.id,
      });

      deleteSubject(currentRow!.id);
      subjectsQuery.refetch();
      toast.success(t('subjects.deleteDialog.deleteSuccess'));

      setOpenedDialog(null);
    } catch {}
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={() => setOpenedDialog(null)}
      handleConfirm={handleDelete}
      isLoading={deleteSubjectMutation.isPending}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          {t('subjects.deleteDialog.title')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            <span className="font-bold">{currentRow!.name}</span>{' '}
            {t('subjects.deleteDialog.description')}
          </p>

          <Alert variant="destructive">
            <AlertTitle>{t('dialogs.delete.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('subjects.deleteDialog.warning')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialogs.delete.confirmButtonText')}
      destructive
    />
  );
}
