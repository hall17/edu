import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useAssessmentsContext } from '../../AssessmentsContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { trpc } from '@/lib/trpc';

export function AssessmentDeleteDialog() {
  const { t } = useTranslation();
  const { deleteAssessment, currentRow, setOpenedDialog } =
    useAssessmentsContext();

  const deleteMutation = useMutation(
    trpc.assessment.delete.mutationOptions({
      onSuccess: () => {
        toast.success(t('assessments.deleteDialog.success'));
        if (currentRow) {
          deleteAssessment(currentRow.id);
        }
        setOpenedDialog(null);
      },
      onError: (error) => {
        console.error('Failed to delete assessment:', error);
        toast.error(t('assessments.deleteDialog.error'));
      },
    })
  );

  function handleDelete() {
    if (currentRow) {
      deleteMutation.mutate({ id: currentRow.id });
    }
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={() => setOpenedDialog(null)}
      title={t('assessments.deleteDialog.title')}
      desc={t('assessments.deleteDialog.description', {
        title: currentRow?.title,
      })}
      handleConfirm={handleDelete}
      confirmText={t('common.delete')}
      destructive={true}
      isLoading={deleteMutation.isPending}
    />
  );
}
