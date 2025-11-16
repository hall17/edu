import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useCompaniesContext } from '../../CompaniesContext';

import { LoadingButton } from '@/components/LoadingButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function CompaniesSuspendDialog() {
  const { t } = useTranslation();
  const { setOpenedDialog, currentRow } = useCompaniesContext();

  const [statusUpdateReason, setStatusUpdateReason] = useState('');
  const [statusUpdateReasonError, setStatusUpdateReasonError] = useState('');

  const isActive = currentRow?.status === 'ACTIVE';

  const suspendCompanyMutation = useMutation(
    trpc.company.updateStatus.mutationOptions({
      onSuccess: () => {
        toast.success(
          t('companiesAndBranches.companies.suspendDialog.successMessage')
        );
        setStatusUpdateReason('');
        setStatusUpdateReasonError('');
        setOpenedDialog(null);
      },
      onError: () => {
        toast.error(
          t('companiesAndBranches.companies.suspendDialog.errorMessage')
        );
      },
    })
  );

  function handleConfirm() {
    setStatusUpdateReasonError('');

    // Validate status update reason if company is being suspended
    if (isActive && !statusUpdateReason.trim()) {
      setStatusUpdateReasonError(
        t(
          'companiesAndBranches.companies.suspendDialog.statusUpdateReasonRequired'
        )
      );
      return;
    }

    if (currentRow) {
      suspendCompanyMutation.mutate({
        id: currentRow.id,
        status: isActive ? 'SUSPENDED' : 'ACTIVE',
        statusUpdateReason: isActive ? statusUpdateReason : undefined,
      });
    }
  }

  function handleCancel() {
    setStatusUpdateReason('');
    setStatusUpdateReasonError('');
    setOpenedDialog(null);
  }

  if (!currentRow) return null;

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {isActive
              ? t('companiesAndBranches.companies.suspendDialog.suspendTitle')
              : t('companiesAndBranches.companies.suspendDialog.activateTitle')}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? t(
                  'companiesAndBranches.companies.suspendDialog.suspendDescription'
                )
              : t(
                  'companiesAndBranches.companies.suspendDialog.activateDescription'
                )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted flex items-center space-x-3 rounded-lg p-3">
            <div className="flex-shrink-0">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-primary text-sm font-medium">
                  {currentRow.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-medium">
                {currentRow.name}
              </p>
              <div className="mt-1">
                <Badge
                  variant={getStatusBadgeVariant(currentRow.status)}
                  className="text-xs"
                >
                  {t(`companyStatuses.${currentRow.status}`)}
                </Badge>
              </div>
            </div>
          </div>

          <Alert>
            <AlertTitle>
              {t('companiesAndBranches.companies.suspendDialog.warningTitle')}
            </AlertTitle>
            <AlertDescription>
              {currentRow.branches && currentRow.branches.length > 0
                ? t(
                    'companiesAndBranches.companies.suspendDialog.warningDescriptionWithBranches',
                    {
                      count: currentRow.branches.length,
                    }
                  )
                : t(
                    'companiesAndBranches.companies.suspendDialog.warningDescription'
                  )}
            </AlertDescription>
          </Alert>

          {isActive && (
            <div className="space-y-2">
              <Label htmlFor="statusUpdateReason">
                {t(
                  'companiesAndBranches.companies.suspendDialog.statusUpdateReasonLabel'
                )}{' '}
                *
              </Label>
              <Textarea
                id="statusUpdateReason"
                placeholder={t(
                  'companiesAndBranches.companies.suspendDialog.statusUpdateReasonPlaceholder'
                )}
                value={statusUpdateReason}
                onChange={(e) => setStatusUpdateReason(e.target.value)}
                className={statusUpdateReasonError ? 'border-destructive' : ''}
                rows={3}
              />
              {statusUpdateReasonError && (
                <p className="text-destructive text-sm">
                  {statusUpdateReasonError}
                </p>
              )}
            </div>
          )}

          <div className="text-muted-foreground text-sm">
            <strong>{currentRow.name}</strong>{' '}
            {isActive
              ? t('companiesAndBranches.companies.suspendDialog.confirmMessage')
              : t(
                  'companiesAndBranches.companies.suspendDialog.suspendedMessage'
                )}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={suspendCompanyMutation.isPending}
          >
            {t('companiesAndBranches.companies.suspendDialog.cancel')}
          </Button>
          <LoadingButton
            variant={isActive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            isLoading={suspendCompanyMutation.isPending}
          >
            {isActive
              ? t(
                  'companiesAndBranches.companies.suspendDialog.suspendButtonText'
                )
              : t(
                  'companiesAndBranches.companies.suspendDialog.activateButtonText'
                )}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
