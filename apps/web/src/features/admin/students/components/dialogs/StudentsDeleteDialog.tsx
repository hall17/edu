import { useMutation } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useStudentsContext } from '@/features/admin/students/StudentsContext';
import { Student, trpc } from '@/lib/trpc';
import { getFullName } from '@/utils';

export function StudentsDeleteDialog() {
  const { t } = useTranslation();
  const { studentsQuery, deleteStudent, currentRow, setOpenedDialog } =
    useStudentsContext();

  const deleteStudentMutation = useMutation(
    trpc.student.delete.mutationOptions()
  );

  async function handleDelete() {
    try {
      await deleteStudentMutation.mutateAsync({
        id: currentRow.id,
      });

      deleteStudent(currentRow.id);
      studentsQuery.refetch();
      toast.success(t('dialogs.delete.successMessageStudent'));

      setOpenedDialog(null);
    } catch {}
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={() => setOpenedDialog(null)}
      handleConfirm={handleDelete}
      isLoading={deleteStudentMutation.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          {t('dialogs.delete.titleStudent')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            <span className="font-bold">{getFullName(currentRow)}</span>{' '}
            {t('dialogs.delete.confirmMessageStudent')}
          </p>

          <Alert variant="destructive">
            <AlertTitle>{t('dialogs.delete.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('dialogs.delete.permanentRemovalWarningStudent')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialogs.delete.confirmButtonText')}
      destructive
    />
  );
}
