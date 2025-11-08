import { StudentsActionDialog } from './StudentsActionDialog';
import { StudentsChangePasswordDialog } from './StudentsChangePasswordDialog';
import { StudentsDeleteDialog } from './StudentsDeleteDialog';
import { StudentsInviteDialog } from './StudentsInviteDialog';
import { StudentsResendInvitationDialog } from './StudentsResendInvitationDialog';
import { StudentsSuspendDialog } from './StudentsSuspendDialog';
import { StudentsViewDialog } from './StudentsViewDialog';

import { useStudentsContext } from '@/features/students/StudentsContext';

export function StudentsDialogs() {
  const { openedDialog } = useStudentsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
      case 'edit':
        return <StudentsActionDialog />;
      case 'invite':
        return <StudentsInviteDialog />;
      case 'view':
        return <StudentsViewDialog />;
      case 'suspend':
        return <StudentsSuspendDialog />;
      case 'resetPassword':
        return <StudentsChangePasswordDialog />;
      case 'delete':
        return <StudentsDeleteDialog />;
      case 'resendInvitation':
        return <StudentsResendInvitationDialog />;
      default:
        return null;
    }
  }

  return <>{getActiveDialog()}</>;
}
