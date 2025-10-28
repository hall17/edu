import { useClassroomSessionsContext } from '../ClassroomSessionsContext';

import { ClassroomSessionCreateDialog } from './ClassroomSessionCreateDialog';
import { ClassroomSessionDeleteDialog } from './ClassroomSessionDeleteDialog';
import { ClassroomSessionViewDialog } from './ClassroomSessionViewDialog';

export function ClassroomSessionDialogs() {
  const { openedDialog, showDeleteDialog } = useClassroomSessionsContext();

  return (
    <>
      {(openedDialog === 'create' || openedDialog === 'edit') && (
        <ClassroomSessionCreateDialog />
      )}
      {openedDialog === 'view' && <ClassroomSessionViewDialog />}
      {showDeleteDialog && <ClassroomSessionDeleteDialog />}
    </>
  );
}
