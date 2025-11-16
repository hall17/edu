import { BranchCreateDto } from '@edusama/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { BranchFormDialog } from '../../../shared/components/BranchFormDialog';
import { useCompaniesContext } from '../../CompaniesContext';

import { trpc } from '@/lib/trpc';

export function AddBranchDialog() {
  const { t } = useTranslation();
  const {
    companiesQuery,
    branchDialogOpen,
    setBranchDialogOpen,
    selectedCompanyId,
  } = useCompaniesContext();

  const isOpen = branchDialogOpen === 'add';

  const createMutation = useMutation(trpc.branch.create.mutationOptions());

  async function handleSubmit(
    data: BranchCreateDto,
    logoFile: File | null | undefined
  ) {
    try {
      const response = await createMutation.mutateAsync(data);
      if (response && 'signedAwsS3Url' in response && logoFile) {
        await fetch(response.signedAwsS3Url, {
          method: 'PUT',
          body: logoFile,
        });
      }
      await companiesQuery.refetch();
      toast.success(
        t('companiesAndBranches.branches.actionDialog.createSuccess')
      );
      handleClose();
    } catch (error) {
      toast.error(t('companiesAndBranches.branches.actionDialog.createError'));
    }
  }

  function handleClose() {
    setBranchDialogOpen(null);
  }

  return (
    <BranchFormDialog
      mode="add"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      selectedCompanyId={selectedCompanyId}
      showExtraFields={false}
    />
  );
}
