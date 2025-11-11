import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useAssessmentAssignmentsContext } from '../../AssessmentAssignmentsContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { trpc } from '@/lib/trpc';

export function AssessmentAssignmentDeleteDialog() {
  const { t } = useTranslation();
  const { deleteAssignment, currentRow, setOpenedDialog } =
    useAssessmentAssignmentsContext();

  const deleteMutation = useMutation(
    trpc.assessment.deleteClassroomIntegrationAssessment.mutationOptions({
      onSuccess: () => {
        toast.success(t('assessments.assigned.deleteDialog.success'));
        if (currentRow) {
          deleteAssignment(currentRow.id);
        }
        setOpenedDialog(null);
      },
      onError: () => {
        toast.error(t('assessments.assigned.deleteDialog.error'));
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
      title={t('assessments.assigned.deleteDialog.title')}
      desc={t('assessments.assigned.deleteDialog.description', {
        assessment: currentRow?.assessment?.title,
        classroom: currentRow?.classroomIntegration?.classroom?.name,
      })}
      handleConfirm={handleDelete}
      confirmText={t('common.delete')}
      destructive={true}
      isLoading={deleteMutation.isPending}
    />
  );
}

