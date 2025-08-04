import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useClassroomStudentsContext } from '../ClassroomStudentsContext';

import { LoadingButton } from '@/components';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

export function ClassroomStudentsDeleteDialog() {
  const { t } = useTranslation();
  const { openedDialog, setOpenedDialog, currentRow, unenrollStudent } =
    useClassroomStudentsContext();

  const unenrollMutation = useMutation(
    trpc.classroom.unenrollStudent.mutationOptions({
      onSuccess: () => {
        if (currentRow) {
          unenrollStudent(currentRow.id);
        }
        toast.success(t('students.deleteDialog.success'));
        setOpenedDialog(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  function handleDelete() {
    unenrollMutation.mutate({
      classroomId: currentRow.classroomId,
      studentId: currentRow.student.id,
    });
  }

  if (!currentRow) return null;

  return (
    <AlertDialog open onOpenChange={() => setOpenedDialog(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('students.deleteDialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('students.deleteDialog.description', {
              name: `${currentRow.student.firstName} ${currentRow.student.lastName}`,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpenedDialog(null)}>
            {t('common.cancel')}
          </Button>
          <LoadingButton
            variant="destructive"
            isLoading={unenrollMutation.isPending}
            onClick={handleDelete}
          >
            {t('common.delete')}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
