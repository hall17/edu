import { useUsersContext } from '../../UsersContext';

import { UsersActionDialog } from './UsersActionDialog';
import { UsersChangePasswordDialog } from './UsersChangePasswordDialog';
import { UsersDeleteDialog } from './UsersDeleteDialog';
import { UsersInviteDialog } from './UsersInviteDialog';
import { UsersSuspendDialog } from './UsersSuspendDialog';
import { UsersViewDialog } from './UsersViewDialog';

export function UsersDialogs() {
  const { openedDialog } = useUsersContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
        return <UsersActionDialog />;
      case 'invite':
        return <UsersInviteDialog />;
      case 'edit':
        return <UsersActionDialog />;
      case 'view':
        return <UsersViewDialog />;
      case 'suspend':
        return <UsersSuspendDialog />;
      case 'resetPassword':
        return <UsersChangePasswordDialog />;
      case 'delete':
        return <UsersDeleteDialog />;
      default:
        return null;
    }
  }
  return <>{getActiveDialog()}</>;
}
