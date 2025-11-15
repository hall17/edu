import { useMutation } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useCurriculumsContext } from '../CurriculumsContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';

export function CurriculumsDeleteDialog() {
  const { t } = useTranslation();
  const { deleteCurriculum, currentRow, setOpenedDialog } =
    useCurriculumsContext();

  const deleteCurriculumMutation = useMutation(
    trpc.curriculum.delete.mutationOptions()
  );

  async function handleDelete() {
    try {
      await deleteCurriculumMutation.mutateAsync({
        id: currentRow.id,
      });

      deleteCurriculum(currentRow.id);
      toast.success(t('subjects.curriculums.deleteSuccess'));

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
      isLoading={deleteCurriculumMutation.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          {t('subjects.curriculums.deleteTitle')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t('subjects.curriculums.deleteConfirmation')}{' '}
            <span className="font-bold">{currentRow?.name}</span>?
          </p>

          <Alert variant="destructive">
            <AlertTitle>{t('dialogs.delete.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('subjects.curriculums.deleteWarning')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialogs.delete.confirmButtonText')}
      destructive
    />
  );
}
