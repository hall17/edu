import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useClassroomTemplatesContext } from '../ClassroomTemplatesContext';

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
import { ClassroomTemplate, trpc } from '@/lib/trpc';

export function ClassroomTemplatesDeleteDialog() {
  const { t } = useTranslation();
  const { deleteTemplate, setOpenedDialog, currentRow } =
    useClassroomTemplatesContext();

  const deleteMutation = useMutation(
    trpc.classroomTemplate.delete.mutationOptions({
      onSuccess: () => {
        deleteTemplate(currentRow.id);
        toast.success(t('classrooms.templates.deleteDialog.deleteSuccess'));
        setOpenedDialog(null);
      },
      onError: (error) => {
        toast.error(t('classrooms.templates.deleteDialog.deleteError'));
        console.error('Delete template error:', error);
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
            {t('classrooms.templates.deleteDialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('classrooms.templates.deleteDialog.description', {
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
