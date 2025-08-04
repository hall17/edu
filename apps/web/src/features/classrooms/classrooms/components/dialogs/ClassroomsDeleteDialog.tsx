import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { LoadingButton } from '@/components/LoadingButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useClassroomsContext } from '@/features/classrooms/classrooms/ClassroomsContext';
import { Classroom, trpc } from '@/lib/trpc';

interface Props {
  currentRow: Classroom;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassroomsDeleteDialog() {
  const { t } = useTranslation();
  const { deleteClassroom, setOpenedDialog, currentRow } =
    useClassroomsContext();

  const deleteMutation = useMutation(
    trpc.classroom.delete.mutationOptions({
      onSuccess: () => {
        deleteClassroom(currentRow.id);
        toast.success(t('classrooms.deleteDialog.deleteSuccess'));
        setOpenedDialog(null);
      },
      onError: (error) => {
        toast.error(t('classrooms.deleteDialog.deleteError'));
        console.error('Delete classroom error:', error);
      },
    })
  );

  const handleDelete = () => {
    deleteMutation.mutate({ id: currentRow.id });
  };

  return (
    <AlertDialog open onOpenChange={() => setOpenedDialog(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('classrooms.deleteDialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('classrooms.deleteDialog.description', {
              name: currentRow.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoadingButton
              variant="destructive"
              isLoading={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {t('common.delete')}
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
