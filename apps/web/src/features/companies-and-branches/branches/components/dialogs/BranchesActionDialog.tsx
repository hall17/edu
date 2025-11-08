import { BranchCreateDto } from '@edusama/common';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { BranchFormDialog } from '../../../shared/components/BranchFormDialog';
import { useBranchesContext } from '../../BranchesContext';

import { trpc } from '@/lib/trpc';

export function BranchesActionDialog() {
  const { t } = useTranslation();
  const {
    branchesQuery,
    openedDialog,
    setOpenedDialog,
    currentRow,
    companies,
  } = useBranchesContext();

  const isOpen = openedDialog === 'add' || openedDialog === 'edit';
  const isEdit = openedDialog === 'edit';

  const createMutation = useMutation(trpc.branch.create.mutationOptions());
  const updateMutation = useMutation(trpc.branch.update.mutationOptions());

  async function handleSubmit(
    data: BranchCreateDto,
    logoFile: File | null | undefined
  ) {
    try {
      if (isEdit && currentRow) {
        const response = await updateMutation.mutateAsync({
          ...data,
          id: currentRow.id,
        });
        if (response && 'signedAwsS3Url' in response && logoFile) {
          await fetch(response.signedAwsS3Url, {
            method: 'PUT',
            body: logoFile,
          });
        }

        await branchesQuery.refetch();

        toast.success(
          t('companiesAndBranches.branches.actionDialog.updateSuccess')
        );
        handleClose();
      } else {
        const response = await createMutation.mutateAsync(data);
        if (response && 'signedAwsS3Url' in response && logoFile) {
          await fetch(response.signedAwsS3Url, {
            method: 'PUT',
            body: logoFile,
          });
        }

        await branchesQuery.refetch();

        toast.success(
          t('companiesAndBranches.branches.actionDialog.createSuccess')
        );
        handleClose();
      }
    } catch (error) {
      if (isEdit) {
        toast.error(
          t('companiesAndBranches.branches.actionDialog.updateError')
        );
      } else {
        toast.error(
          t('companiesAndBranches.branches.actionDialog.createError')
        );
      }
    }
  }

  function handleClose() {
    setOpenedDialog(null);
  }

  return (
    <BranchFormDialog
      mode={isEdit ? 'edit' : 'add'}
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      currentRow={isEdit ? currentRow : undefined}
      showExtraFields={true}
    />
  );
}
