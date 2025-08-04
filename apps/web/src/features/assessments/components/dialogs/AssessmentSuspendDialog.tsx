import { IconAlertTriangle } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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
import { useAssessmentsContext } from '@/features/assessments/AssessmentsContext';
import { trpc } from '@/lib/trpc';

export function AssessmentSuspendDialog() {
  const { t } = useTranslation();
  const { updateAssessment, setOpenedDialog, currentRow } =
    useAssessmentsContext();

  const isActive = currentRow.status === 'ACTIVE';

  const [statusUpdateReason, setSuspendedReason] = useState('');
  const [statusUpdateReasonError, setSuspendedReasonError] = useState('');

  const updateAssessmentMutation = useMutation(
    trpc.assessment.updateStatus.mutationOptions({
      onSuccess: (updatedAssessment) => {
        updateAssessment(updatedAssessment as any);
        toast.success(t('dialogs.suspend.successMessageAssessment'));
        setSuspendedReason('');
        setSuspendedReasonError('');
        setOpenedDialog(null);
      },
      onError: (error) => {
        console.error('Failed to update assessment status:', error);
        toast.error(t('dialogs.suspend.errorMessageAssessment'));
      },
    })
  );

  function handleConfirm() {
    setSuspendedReasonError('');

    // Validate suspended reason if assessment is being suspended (set to SUSPENDED)
    if (isActive && !statusUpdateReason.trim()) {
      setSuspendedReasonError(t('dialogs.suspend.statusUpdateReasonRequired'));
      return;
    }

    updateAssessmentMutation.mutate({
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
              ? t('dialogs.suspend.suspendTitleAssessment')
              : t('dialogs.suspend.activateTitleAssessment')}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? t('dialogs.suspend.suspendDescriptionAssessment')
              : t('dialogs.suspend.activateDescriptionAssessment')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted flex items-center space-x-3 rounded-lg p-3">
            <div className="flex-shrink-0">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-primary text-sm font-medium">
                  {currentRow.title.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-medium">
                {currentRow.title}
              </p>
              <p className="text-muted-foreground truncate text-sm">
                {currentRow.description ||
                  t('assessments.fields.noDescription')}
              </p>
            </div>
          </div>

          <Alert>
            <IconAlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('dialogs.suspend.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('dialogs.suspend.warningDescriptionAssessment')}
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
                  'dialogs.suspend.statusUpdateReasonPlaceholderAssessment'
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
            <strong>{currentRow.title}</strong>{' '}
            {isActive
              ? t('dialogs.suspend.confirmMessageAssessment')
              : t('dialogs.suspend.suspendedMessageAssessment')}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateAssessmentMutation.isPending}
          >
            {t('dialogs.suspend.cancel')}
          </Button>
          <Button
            variant={isActive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={updateAssessmentMutation.isPending}
          >
            {updateAssessmentMutation.isPending ? (
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
