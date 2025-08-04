import { IconAlertCircle, IconMail } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
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

export function StudentsChangePasswordDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useStudentsContext();

  const sendResetPasswordEmailMutation = useMutation(
    trpc.auth.sendResetPasswordEmail.mutationOptions({
      onSuccess: () => {
        toast.success(t('dialogs.changePassword.successMessage'));
        setOpenedDialog(null);
      },
      onError: (error) => {
        console.error('Failed to send password reset email:', error);
        toast.error(t('dialogs.changePassword.errorMessage'));
      },
    })
  );

  const handleConfirm = () => {
    sendResetPasswordEmailMutation.mutate({
      id: currentRow.id,
      userType: 'student',
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
            <IconMail className="h-5 w-5" />
            {t('dialogs.changePassword.titleStudent')}
          </DialogTitle>
          <DialogDescription>
            {t('dialogs.changePassword.descriptionStudent')}
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
            <IconAlertCircle className="h-4 w-4" />
            <AlertTitle>{t('dialogs.changePassword.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('dialogs.changePassword.warningDescriptionStudent')}
            </AlertDescription>
          </Alert>

          <div className="text-muted-foreground text-sm">
            {t('dialogs.changePassword.confirmMessageStudent', {
              email: currentRow.email,
            })}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={sendResetPasswordEmailMutation.isPending}
          >
            {t('dialogs.changePassword.cancel')}
          </Button>
          <LoadingButton
            onClick={handleConfirm}
            isLoading={sendResetPasswordEmailMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <IconMail className="mr-2 h-4 w-4" />
            {t('dialogs.changePassword.confirmButtonText')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
