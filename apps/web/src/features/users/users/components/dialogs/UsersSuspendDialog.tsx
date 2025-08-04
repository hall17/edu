import { IconAlertTriangle } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useUsersContext } from '../../UsersContext';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { User, trpc } from '@/lib/trpc';

export function UsersSuspendDialog() {
  const { t } = useTranslation();
  const { updateUser, currentRow, setOpenedDialog } = useUsersContext();

  const isActive = currentRow.status === 'ACTIVE';

  const [statusUpdateReason, setSuspendedReason] = useState('');
  const [statusUpdateReasonError, setSuspendedReasonError] = useState('');

  const updateUserMutation = useMutation(
    trpc.user.updateSuspended.mutationOptions({
      onSuccess: (updatedUser) => {
        updateUser(updatedUser as User);
        toast.success(t('dialogs.suspend.successMessageUser'));
        setSuspendedReason('');
        setSuspendedReasonError('');
        setOpenedDialog(null);
      },
      onError: (error) => {
        console.error('Failed to update user status:', error);
        toast.error(t('dialogs.suspend.errorMessageUser'));
      },
    })
  );

  function handleConfirm() {
    setSuspendedReasonError('');

    // Validate suspended reason if user is being suspended (set to SUSPENDED)
    if (isActive && !statusUpdateReason.trim()) {
      setSuspendedReasonError(t('dialogs.suspend.statusUpdateReasonRequired'));
      return;
    }

    updateUserMutation.mutate({
      id: currentRow.id,
      status: isActive ? 'SUSPENDED' : 'ACTIVE',
      statusUpdateReason: isActive ? statusUpdateReason.trim() : '',
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
              ? t('dialogs.suspend.suspendTitleUser')
              : t('dialogs.suspend.activateTitleUser')}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? t('dialogs.suspend.suspendDescriptionUser')
              : t('dialogs.suspend.activateDescriptionUser')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted flex items-center space-x-3 rounded-lg p-3">
            <div className="flex-shrink-0">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-primary text-sm font-medium">
                  {currentRow.firstName.charAt(0)}
                  {currentRow.lastName.charAt(0)}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-medium">
                {currentRow.firstName} {currentRow.lastName}
              </p>
              <p className="text-muted-foreground truncate text-sm">
                {currentRow.email}
              </p>
            </div>
          </div>

          <Alert>
            <IconAlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('dialogs.suspend.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('dialogs.suspend.warningDescriptionUser')}
            </AlertDescription>
          </Alert>

          {isActive && (
            <div className="space-y-2">
              <Label htmlFor="statusUpdateReason">
                {t('dialogs.suspend.statusUpdateReasonLabel')} *
              </Label>
              <Textarea
                id="statusUpdateReason"
                placeholder={t(
                  'dialogs.suspend.statusUpdateReasonPlaceholderUser'
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
            <strong>
              {currentRow.firstName} {currentRow.lastName}
            </strong>{' '}
            {isActive
              ? t('dialogs.suspend.confirmMessageUser')
              : t('dialogs.suspend.suspendedMessageUser')}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateUserMutation.isPending}
          >
            {t('dialogs.suspend.cancel')}
          </Button>
          <Button
            variant={isActive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>
                  {isActive
                    ? t('dialogs.suspend.suspendButtonText')
                    : t('dialogs.suspend.activateButtonText')}
                </span>
              </div>
            ) : isActive ? (
              t('dialogs.suspend.suspendButtonText')
            ) : (
              t('dialogs.suspend.activateButtonText')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
