import { useMutation } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useSubjectsContext } from '../SubjectsContext';

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
import { trpc } from '@/lib/trpc';

export function SubjectsSuspendDialog() {
  const { t } = useTranslation();
  const { suspendSubject, setOpenedDialog, currentRow } = useSubjectsContext();

  const isActive = currentRow!.status === 'ACTIVE';

  const [statusUpdateReason, setSuspendedReason] = useState('');
  const [statusUpdateReasonError, setSuspendedReasonError] = useState('');

  const updateSubjectMutation = useMutation(
    trpc.subject.update.mutationOptions({
      onSuccess: (updatedSubject) => {
        suspendSubject(updatedSubject.id, updatedSubject.status);
        toast.success(t('subjects.suspendDialog.successMessage'));
        setSuspendedReason('');
        setSuspendedReasonError('');
        setOpenedDialog(null);
      },
      onError: (error) => {
        console.error('Failed to update subject status:', error);
        toast.error(t('subjects.suspendDialog.errorMessage'));
      },
    })
  );

  function handleConfirm() {
    setSuspendedReasonError('');

    if (isActive && !statusUpdateReason.trim()) {
      setSuspendedReasonError(
        t('subjects.suspendDialog.statusUpdateReasonRequired')
      );
      return;
    }

    updateSubjectMutation.mutate({
      id: currentRow!.id,
      name: currentRow!.name,
      description: currentRow!.description || undefined,
      status: isActive ? 'SUSPENDED' : 'ACTIVE',
    });
  }

  function handleCancel() {
    setSuspendedReason('');
    setSuspendedReasonError('');
    setOpenedDialog(null);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && setOpenedDialog(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isActive
              ? t('subjects.suspendDialog.suspendTitle')
              : t('subjects.suspendDialog.activateTitle')}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? t('subjects.suspendDialog.suspendDescription')
              : t('subjects.suspendDialog.activateDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted flex items-center space-x-3 rounded-lg p-3">
            <div className="flex-shrink-0">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-primary text-sm font-medium">
                  {currentRow!.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-medium">
                {currentRow!.name}
              </p>
              <p className="text-muted-foreground truncate text-sm">
                {currentRow!.description || t('common.description')}
              </p>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('subjects.suspendDialog.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('subjects.suspendDialog.warningDescription')}
            </AlertDescription>
          </Alert>

          {isActive && (
            <div className="space-y-2">
              <Label htmlFor="statusUpdateReason">
                {t('subjects.suspendDialog.statusUpdateReasonLabel')} *
              </Label>
              <Textarea
                id="statusUpdateReason"
                placeholder={t(
                  'subjects.suspendDialog.statusUpdateReasonPlaceholder'
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
            <strong>{currentRow!.name}</strong>{' '}
            {isActive
              ? t('subjects.suspendDialog.confirmMessage')
              : t('subjects.suspendDialog.suspendedMessage')}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateSubjectMutation.isPending}
          >
            {t('subjects.suspendDialog.cancel')}
          </Button>
          <Button
            variant={isActive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={updateSubjectMutation.isPending}
          >
            {updateSubjectMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>
                  {isActive
                    ? t('subjects.suspendDialog.suspendButtonText')
                    : t('subjects.suspendDialog.activateButtonText')}
                </span>
              </div>
            ) : isActive ? (
              t('subjects.suspendDialog.suspendButtonText')
            ) : (
              t('subjects.suspendDialog.activateButtonText')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
