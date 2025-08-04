import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useCompaniesContext } from '../../CompaniesContext';

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

export function CompaniesDeleteDialog() {
  const { t } = useTranslation();
  const { setOpenedDialog, currentRow } = useCompaniesContext();

  const deleteMutation = useMutation(
    trpc.company.delete.mutationOptions({
      onSuccess: () => {
        toast.success(
          t('companiesAndBranches.companies.deleteDialog.successMessage')
        );
        setOpenedDialog(null);
      },
      onError: () => {
        toast.error(
          t('companiesAndBranches.companies.deleteDialog.errorMessage')
        );
      },
    })
  );

  const handleDelete = () => {
    if (currentRow) {
      deleteMutation.mutate({
        id: currentRow.id,
      });
    }
  };

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t('companiesAndBranches.companies.deleteDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('companiesAndBranches.companies.deleteDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            {t('companiesAndBranches.companies.deleteDialog.confirmMessage', {
              name: currentRow.name,
            })}
          </p>
          <p className="text-destructive text-sm">
            {currentRow.branches && currentRow.branches.length > 0
              ? t(
                  'companiesAndBranches.companies.deleteDialog.warningWithBranches',
                  {
                    count: currentRow.branches.length,
                  }
                )
              : t('companiesAndBranches.companies.deleteDialog.warning')}
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
            {t('companiesAndBranches.companies.deleteDialog.deleteButtonText')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
