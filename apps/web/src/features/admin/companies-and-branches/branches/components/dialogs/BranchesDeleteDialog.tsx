import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useBranchesContext } from '../../BranchesContext';

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

export function BranchesDeleteDialog() {
  const { t } = useTranslation();
  const { setOpenedDialog, currentRow } = useBranchesContext();

  const deleteMutation = useMutation(
    trpc.branch.delete.mutationOptions({
      onSuccess: () => {
        toast.success(
          t('companiesAndBranches.branches.deleteDialog.successMessage')
        );
        setOpenedDialog(null);
      },
      onError: () => {
        toast.error(
          t('companiesAndBranches.branches.deleteDialog.errorMessage')
        );
      },
    })
  );

  function handleDelete() {
    deleteMutation.mutate({ id: currentRow.id });
  }

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t('companiesAndBranches.branches.deleteDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('companiesAndBranches.branches.deleteDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            {t('companiesAndBranches.branches.deleteDialog.confirmMessage', {
              name: currentRow.name,
            })}
          </p>
          <p className="text-destructive text-sm">
            {t('companiesAndBranches.branches.deleteDialog.warning')}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpenedDialog(null)}
            disabled={deleteMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
          <LoadingButton
            variant="destructive"
            isLoading={deleteMutation.isPending}
            onClick={handleDelete}
          >
            {t('companiesAndBranches.branches.deleteDialog.deleteButtonText')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
