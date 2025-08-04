import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useMaterialsContext } from '../MaterialsContext';

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
import { Curriculum, trpc } from '@/lib/trpc';

interface Props {
  currentRow: Curriculum;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaterialsCurriculumDeleteDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const { t } = useTranslation();
  const { deleteCurriculum, setOpen } = useMaterialsContext();

  const deleteMutation = useMutation(
    trpc.curriculum.delete.mutationOptions({
      onSuccess: () => {
        deleteCurriculum(currentRow.id);
        toast.success(t('materials.deleteDialog.deleteSuccess'));
        onOpenChange(false);
        setOpen(null);
      },
      onError: (error) => {
        toast.error(t('materials.deleteDialog.deleteError'));
        console.error('Delete curriculum error:', error);
      },
    })
  );

  const handleDelete = () => {
    deleteMutation.mutate({ id: currentRow.id });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('materials.deleteDialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('materials.deleteDialog.description', {
              name: currentRow.name,
            })}
            {currentRow.lessons && currentRow.lessons.length > 0 && (
              <div className="mt-2 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-800">
                  {t('materials.deleteDialog.warning', {
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
