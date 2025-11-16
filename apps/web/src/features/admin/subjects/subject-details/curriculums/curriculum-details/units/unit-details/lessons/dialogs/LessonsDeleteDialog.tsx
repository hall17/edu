import { useMutation } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useUnitLessonsContext } from '../UnitLessonsContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';

export function LessonsDeleteDialog() {
  const { t } = useTranslation();
  const { deleteLesson, currentRow, setOpenedDialog } = useUnitLessonsContext();

  const deleteLessonMutation = useMutation(
    trpc.lesson.delete.mutationOptions()
  );

  async function handleDelete() {
    try {
      await deleteLessonMutation.mutateAsync({
        id: currentRow.id,
      });

      deleteLesson(currentRow.id);
      toast.success(t('subjects.curriculums.lessons.deleteSuccess'));

      setOpenedDialog(null);
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={() => setOpenedDialog(null)}
      handleConfirm={handleDelete}
      isLoading={deleteLessonMutation.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          Delete Lesson
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{' '}
            <span className="font-bold">{currentRow?.name}</span>?
          </p>

          <Alert variant="destructive">
            <AlertTitle>{t('dialogs.delete.warningTitle')}</AlertTitle>
            <AlertDescription>
              This action cannot be undone. All associated data will be
              permanently removed.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialogs.delete.confirmButtonText')}
      destructive
    />
  );
}
