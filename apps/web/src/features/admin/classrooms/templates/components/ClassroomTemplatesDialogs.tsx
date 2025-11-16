import { useClassroomTemplatesContext } from '../ClassroomTemplatesContext';

import { ClassroomTemplatesActionDialog } from './ClassroomTemplatesActionDialog';
import { ClassroomTemplatesDeleteDialog } from './ClassroomTemplatesDeleteDialog';
import { ClassroomTemplatesViewDialog } from './ClassroomTemplatesViewDialog';

export function ClassroomTemplatesDialogs() {
  const { openedDialog } = useClassroomTemplatesContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
      case 'edit':
        return <ClassroomTemplatesActionDialog />;
      case 'view':
        return <ClassroomTemplatesViewDialog />;
      case 'delete':
        return <ClassroomTemplatesDeleteDialog />;
      default:
        return null;
    }
  }

  return <>{getActiveDialog()}</>;
}
