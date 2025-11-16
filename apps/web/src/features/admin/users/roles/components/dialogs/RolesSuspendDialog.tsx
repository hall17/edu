import { useMutation } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useRolesContext } from '../../RolesContext';

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
import { Role, trpc } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function RolesSuspendDialog() {
  const { t } = useTranslation();
  const { updateRole, currentRow, setOpenedDialog } = useRolesContext();

  const isActive = currentRow.status === 'ACTIVE';

  const [statusUpdateReason, setSuspendedReason] = useState('');
  const [statusUpdateReasonError, setSuspendedReasonError] = useState('');

  const updateRoleMutation = useMutation(
    trpc.role.update.mutationOptions({
      onSuccess: (updatedRole) => {
        updateRole(updatedRole as Role);
        toast.success(t('roles.suspendDialog.successMessage' as any));
        setSuspendedReason('');
        setSuspendedReasonError('');
        setOpenedDialog(null);
      },
      onError: (error) => {
        console.error('Failed to update role status:', error);
        toast.error(t('roles.suspendDialog.errorMessage' as any));
      },
    })
  );

  function handleConfirm() {
    setSuspendedReasonError('');

    // Validate suspended reason if role is being suspended (set to SUSPENDED)
    if (isActive && !statusUpdateReason.trim()) {
      setSuspendedReasonError(
        t('roles.suspendDialog.statusUpdateReasonRequired' as any)
      );
      return;
    }

    updateRoleMutation.mutate({
      id: currentRow.id,
      status: isActive ? 'SUSPENDED' : 'ACTIVE',
    });
  }

  function handleCancel() {
    setSuspendedReason('');
    setSuspendedReasonError('');
    setOpenedDialog(null);
  }

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isActive
              ? t('roles.suspendDialog.suspendTitle' as any)
              : t('roles.suspendDialog.activateTitle' as any)}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? t('roles.suspendDialog.suspendDescription' as any)
              : t('roles.suspendDialog.activateDescription' as any)}
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
                  {t(`roleStatuses.${currentRow.status}`)}
                </Badge>
              </div>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {t('roles.suspendDialog.warningTitle' as any)}
            </AlertTitle>
            <AlertDescription>
              {t('roles.suspendDialog.warningDescription' as any)}
            </AlertDescription>
          </Alert>

          {isActive && (
            <div className="space-y-2">
              <Label htmlFor="statusUpdateReason">
                {t('roles.suspendDialog.statusUpdateReasonLabel' as any)} *
              </Label>
              <Textarea
                id="statusUpdateReason"
                placeholder={t(
                  'roles.suspendDialog.statusUpdateReasonPlaceholder' as any
                )}
                value={statusUpdateReason}
                onChange={(e) => setSuspendedReason(e.target.value)}
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
              ? t('roles.suspendDialog.confirmMessage' as any)
              : t('roles.suspendDialog.suspendedMessage' as any)}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateRoleMutation.isPending}
          >
            {t('roles.suspendDialog.cancel' as any)}
          </Button>
          <Button
            variant={isActive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={updateRoleMutation.isPending}
          >
            {updateRoleMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>
                  {isActive
                    ? t('roles.suspendDialog.suspendButtonText' as any)
                    : t('roles.suspendDialog.activateButtonText' as any)}
                </span>
              </div>
            ) : isActive ? (
              t('roles.suspendDialog.suspendButtonText' as any)
            ) : (
              t('roles.suspendDialog.activateButtonText' as any)
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
