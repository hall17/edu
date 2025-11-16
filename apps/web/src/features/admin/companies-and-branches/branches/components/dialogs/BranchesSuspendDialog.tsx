import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useBranchesContext } from '../../BranchesContext';

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
import { Branch, trpc } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function BranchesSuspendDialog() {
  const { t } = useTranslation();
  const { openedDialog, setOpenedDialog, currentRow, updateBranch } =
    useBranchesContext();

  const [statusUpdateReason, setStatusUpdateReason] = useState('');
  const [statusUpdateReasonError, setStatusUpdateReasonError] = useState('');

  const isOpen = openedDialog === 'suspend';
  const isActive = currentRow?.status === 'ACTIVE';

  const updateBranchMutation = useMutation(
    trpc.branch.updateStatus.mutationOptions({
      onSuccess: () => {
        toast.success(
          t('companiesAndBranches.branches.suspendDialog.successMessage')
        );
        const updatedBranch = {
          ...currentRow,
          status: isActive ? 'SUSPENDED' : 'ACTIVE',
          statusUpdateReason,
        };
        updateBranch(updatedBranch as Branch);
        setStatusUpdateReason('');
        setStatusUpdateReasonError('');
        setOpenedDialog(null);
      },
      onError: (error: any) => {
        toast.error(
          error.message ||
            t('companiesAndBranches.branches.suspendDialog.errorMessage')
        );
      },
    })
  );

  function handleConfirm() {
    setStatusUpdateReasonError('');

    // Validate status update reason if branch is being suspended
    if (isActive && !statusUpdateReason.trim()) {
      setStatusUpdateReasonError(
        t(
          'companiesAndBranches.branches.suspendDialog.statusUpdateReasonRequired'
        )
      );
      return;
    }

    if (currentRow) {
      updateBranchMutation.mutate({
        id: currentRow.id,
        status: isActive ? 'SUSPENDED' : 'ACTIVE',
        statusUpdateReason: isActive ? statusUpdateReason : null,
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
    <Dialog open={isOpen} onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isActive
              ? t('companiesAndBranches.branches.suspendDialog.suspendTitle')
              : t('companiesAndBranches.branches.suspendDialog.activateTitle')}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? t(
                  'companiesAndBranches.branches.suspendDialog.suspendDescription'
                )
              : t(
                  'companiesAndBranches.branches.suspendDialog.activateDescription'
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
                  {t(`branchStatuses.${currentRow.status}`)}
                </Badge>
              </div>
            </div>
          </div>

          <Alert>
            <AlertTitle>
              {t('companiesAndBranches.branches.suspendDialog.warningTitle')}
            </AlertTitle>
            <AlertDescription>
              {t(
                'companiesAndBranches.branches.suspendDialog.warningDescription'
              )}
            </AlertDescription>
          </Alert>

          {isActive && (
            <div className="space-y-2">
              <Label htmlFor="statusUpdateReason">
                {t(
                  'companiesAndBranches.branches.suspendDialog.statusUpdateReasonLabel'
                )}{' '}
                *
              </Label>
              <Textarea
                id="statusUpdateReason"
                placeholder={t(
                  'companiesAndBranches.branches.suspendDialog.statusUpdateReasonPlaceholder'
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
              ? t('companiesAndBranches.branches.suspendDialog.confirmMessage')
              : t(
                  'companiesAndBranches.branches.suspendDialog.suspendedMessage'
                )}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateBranchMutation.isPending}
          >
            {t('companiesAndBranches.branches.suspendDialog.cancel')}
          </Button>
          <Button
            variant={isActive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={updateBranchMutation.isPending}
          >
            {updateBranchMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>
                  {isActive
                    ? t(
                        'companiesAndBranches.branches.suspendDialog.suspendButtonText'
                      )
                    : t(
                        'companiesAndBranches.branches.suspendDialog.activateButtonText'
                      )}
                </span>
              </div>
            ) : isActive ? (
              t('companiesAndBranches.branches.suspendDialog.suspendButtonText')
            ) : (
              t(
                'companiesAndBranches.branches.suspendDialog.activateButtonText'
              )
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
