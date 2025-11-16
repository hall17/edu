import { useClassroomsContext } from '../../ClassroomsContext';

import { ClassroomsActionDialog } from './action-dialog/ClassroomsActionDialog';
import { ClassroomsDeleteDialog } from './ClassroomsDeleteDialog';
import { ClassroomsViewDialog } from './ClassroomsViewDialog';

export function ClassroomsDialogs() {
  const { openedDialog } = useClassroomsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
      case 'edit':
        return <ClassroomsActionDialog />;
      case 'view':
        return <ClassroomsViewDialog />;
      case 'delete':
        return <ClassroomsDeleteDialog />;
      default:
        return null;
    }
  }

  return <>{getActiveDialog()}</>;
}
