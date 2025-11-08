import { useMutation } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useClassroomCalendarContext } from '../ClassroomCalendarContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';

export function ClassroomCalendarDeleteDialog() {
  const { t } = useTranslation();
  const { currentRow, setShowDeleteDialog, deleteClassroomIntegrationSession } =
    useClassroomCalendarContext();

  const deleteMutation = useMutation(
    trpc.classroom.deleteIntegrationSession.mutationOptions()
  );

  async function handleDelete() {
    if (!currentRow) return;

    try {
      await deleteMutation.mutateAsync({ id: currentRow.id });
      deleteClassroomIntegrationSession(currentRow.id);
      toast.success(t('classrooms.calendar.deleteDialog.successMessage'));
      handleClose();
    } catch {
      toast.error(t('classrooms.calendar.deleteDialog.errorMessage'));
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
      title={t('classrooms.calendar.deleteDialog.title')}
      desc={t('classrooms.calendar.deleteDialog.description')}
      confirmText={t('classrooms.calendar.deleteDialog.confirmButtonText')}
      handleConfirm={handleDelete}
      isLoading={deleteMutation.isPending}
      destructive
    >
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>
          {t('classrooms.calendar.deleteDialog.warningTitle')}
        </AlertTitle>
        <AlertDescription>
          {t('classrooms.calendar.deleteDialog.warningDescription')}
        </AlertDescription>
      </Alert>
    </ConfirmDialog>
  );
}
