import { useRolesContext } from '../../RolesContext';

import { RolesActionDialog } from './RolesActionDialog';
import { RolesDeleteDialog } from './RolesDeleteDialog';
import { RolesSuspendDialog } from './RolesSuspendDialog';
import { RolesViewDialog } from './RolesViewDialog';

export function RolesDialogs() {
  const { openedDialog } = useRolesContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'create':
      case 'edit':
        return <RolesActionDialog />;
      case 'view':
        return <RolesViewDialog />;
      case 'delete':
        return <RolesDeleteDialog />;
      case 'suspend':
        return <RolesSuspendDialog />;
    }
  }

  return <>{getActiveDialog()}</>;
}
