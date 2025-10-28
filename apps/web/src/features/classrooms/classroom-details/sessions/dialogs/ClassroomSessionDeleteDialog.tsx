import { useMutation } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useClassroomSessionsContext } from '../ClassroomSessionsContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';

export function ClassroomSessionDeleteDialog() {
  const { t } = useTranslation();
  const { currentRow, setShowDeleteDialog, deleteClassroomIntegrationSession } =
    useClassroomSessionsContext();

  const deleteMutation = useMutation(
    trpc.classroom.deleteIntegrationSession.mutationOptions()
  );

  async function handleDelete() {
    if (!currentRow) return;

    try {
      await deleteMutation.mutateAsync({ id: currentRow.id });
      deleteClassroomIntegrationSession(currentRow.id);
      toast.success(t('dialogs.delete.successMessageClassroomSession'));
      handleClose();
    } catch {
      toast.error(t('dialogs.delete.errorMessageClassroomSession'));
    }
  }

  function handleClose() {
    setShowDeleteDialog(false);
  }

  if (!currentRow) return null;

  return (
    <ConfirmDialog
      open
      onOpenChange={handleClose}
      title={t('sessions.deleteDialog.title')}
      desc={t('sessions.deleteDialog.description')}
      confirmText={t('sessions.deleteDialog.confirmButtonText')}
      handleConfirm={handleDelete}
      isLoading={deleteMutation.isPending}
      destructive
    >
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('sessions.deleteDialog.warningTitle')}</AlertTitle>
        <AlertDescription>
          {t('sessions.deleteDialog.warningDescription')}
        </AlertDescription>
      </Alert>
    </ConfirmDialog>
  );
}
