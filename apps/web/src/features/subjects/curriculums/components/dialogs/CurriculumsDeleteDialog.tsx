import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useCurriculumsContext } from '../../CurriculumsContext';

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
import { trpc } from '@/lib/trpc';

export function CurriculumsDeleteDialog() {
  const { t } = useTranslation();
  const { deleteCurriculum, setOpenedDialog, currentRow } =
    useCurriculumsContext();

  const deleteMutation = useMutation(
    trpc.curriculum.delete.mutationOptions({
      onSuccess: () => {
        deleteCurriculum(currentRow.id);
        toast.success(t('curriculums.deleteDialog.deleteSuccess'));
        setOpenedDialog(null);
      },
      onError: (error) => {
        toast.error(t('curriculums.deleteDialog.deleteError'));
        console.error('Delete curriculum error:', error);
      },
    })
  );

  const handleDelete = () => {
    deleteMutation.mutate({ id: currentRow.id });
  };

  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        setOpenedDialog(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('curriculums.deleteDialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('curriculums.deleteDialog.description', {
              name: currentRow.name,
            })}
            {currentRow.lessons && currentRow.lessons.length > 0 && (
              <div className="mt-2 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-800">
                  {t('curriculums.deleteDialog.warning', {
                    count: currentRow.lessons.length,
                  })}
                </p>
              </div>
            )}
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
