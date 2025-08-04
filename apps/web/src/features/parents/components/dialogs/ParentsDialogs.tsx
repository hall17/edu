import { useParentsContext } from '../../ParentsContext';

import { ParentsActionDialog } from './ParentsActionDialog';
import { ParentsChangePasswordDialog } from './ParentsChangePasswordDialog';
import { ParentsDeleteDialog } from './ParentsDeleteDialog';
import { ParentsInviteDialog } from './ParentsInviteDialog';
import { ParentsSuspendDialog } from './ParentsSuspendDialog';
import { ParentsViewDialog } from './ParentsViewDialog';

export function ParentsDialogs() {
  const { openedDialog } = useParentsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
      case 'edit':
        return <ParentsActionDialog />;
      case 'invite':
        return <ParentsInviteDialog />;
      case 'view':
        return <ParentsViewDialog />;
      case 'suspend':
        return <ParentsSuspendDialog />;
      case 'changePassword':
        return <ParentsChangePasswordDialog />;
      case 'delete':
        return <ParentsDeleteDialog />;
    }
  }

  return <>{getActiveDialog()}</>;
}
