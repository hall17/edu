import { useMutation } from '@tanstack/react-query';
import { AlertCircle, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { LoadingButton } from '@/components/LoadingButton';
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
import { useStudentsContext } from '@/features/students/StudentsContext';
import { trpc } from '@/lib/trpc';

export function StudentsResendInvitationDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useStudentsContext();

  const resendInvitationMutation = useMutation(
    trpc.auth.sendInvitationEmail.mutationOptions({
      onSuccess: () => {
        toast.success(t('dialogs.resendInvitation.successMessage'));
        setOpenedDialog(null);
      },
      onError: (error) => {
        console.error('Failed to resend invitation:', error);
        toast.error(t('dialogs.resendInvitation.errorMessage'));
      },
    })
  );

  const handleConfirm = () => {
    resendInvitationMutation.mutate({
      email: currentRow.email,
      userType: 'student',
      isResend: true,
    });
  };

  const handleCancel = () => {
    setOpenedDialog(null);
  };

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t('dialogs.resendInvitation.title')}
          </DialogTitle>
          <DialogDescription>
            {t('dialogs.resendInvitation.description')}
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
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {t('dialogs.resendInvitation.warningTitle')}
            </AlertTitle>
            <AlertDescription>
              {t('dialogs.resendInvitation.warningDescription')}
            </AlertDescription>
          </Alert>

          <div className="text-muted-foreground text-sm">
            {t('dialogs.resendInvitation.confirmMessage', {
              email: currentRow.email,
            })}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={resendInvitationMutation.isPending}
          >
            {t('dialogs.resendInvitation.cancel')}
          </Button>
          <LoadingButton
            onClick={handleConfirm}
            isLoading={resendInvitationMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Mail className="mr-2 h-4 w-4" />
            {t('dialogs.resendInvitation.confirmButtonText')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
