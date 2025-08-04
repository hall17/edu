import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useQuestionBankContext } from '../../QuestionBankContext';

import { LoadingButton } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';

export function QuestionBankDeleteDialog() {
  const { t } = useTranslation();
  const { currentRow, openedDialog, setOpenedDialog, deleteQuestion } =
    useQuestionBankContext();

  const deleteQuestionMutation = useMutation(
    trpc.question.delete.mutationOptions()
  );

  if (openedDialog !== 'delete' || !currentRow) {
    return null;
  }

  async function handleDelete() {
    try {
      await deleteQuestionMutation.mutateAsync({ id: currentRow.id } as any);
      toast.success(t('questionBank.dialogs.success.delete'));
      deleteQuestion(currentRow.id);
      setOpenedDialog(null);
    } catch {}
  }

  return (
    <Dialog open={openedDialog === 'delete'}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('questionBank.dialogs.deleteTitle')}</DialogTitle>
          <DialogDescription>
            {t('questionBank.dialogs.deleteDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted rounded-md p-4">
            <div className="font-medium">{currentRow.questionText}</div>
            <div className="text-muted-foreground mt-1 text-sm">
              {t('questionBank.form.type')}:{' '}
              {t(`questionTypes.${currentRow.type}`)}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpenedDialog(null)}
            disabled={deleteQuestionMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            isLoading={deleteQuestionMutation.isPending}
          >
            {t('common.delete')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
