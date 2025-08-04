import { TeachersActionDialog } from './TeachersActionDialog';
import { TeachersChangePasswordDialog } from './TeachersChangePasswordDialog';
import { TeachersDeleteDialog } from './TeachersDeleteDialog';
import { TeachersInviteDialog } from './TeachersInviteDialog';
import { TeachersSuspendDialog } from './TeachersSuspendDialog';
import { TeachersViewDialog } from './TeachersViewDialog';

import { useTeachersContext } from '@/features/teachers/TeachersContext';

export function TeachersDialogs() {
  const { openedDialog } = useTeachersContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
      case 'edit':
        return <TeachersActionDialog />;
      case 'invite':
        return <TeachersInviteDialog />;
      case 'view':
        return <TeachersViewDialog />;
      case 'changePassword':
        return <TeachersChangePasswordDialog />;
      case 'suspend':
        return <TeachersSuspendDialog />;
      case 'delete':
        return <TeachersDeleteDialog />;
    }
  }

  return <>{getActiveDialog()}</>;
}
